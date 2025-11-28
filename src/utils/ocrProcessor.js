import Tesseract from 'tesseract.js';

// Process an image File and return parsed card data + debug image
export const processImage = async (imageFile, options = {}) => {
  try {
    const processedImage = await preprocessImage(imageFile, options);

    const tesseractOptions = {
      logger: m => options.debug && console.log('TESS:', m),
      tessedit_char_whitelist: options.whitelist || 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@.-,+()&/ ',
      // pass psm and oem if provided
      ...(options.psm ? { psm: options.psm } : {}),
      ...(options.oem ? { oem: options.oem } : {})
    };

    const result = await Tesseract.recognize(processedImage, 'eng', tesseractOptions);
    const parsed = parseText(result?.data?.text || '');
    if (options.debug) {
      console.debug('OCR raw text:\n', result?.data?.text);
      console.debug('Parsed fields:', parsed);
    }

    return {
      ...parsed,
      debugImage: processedImage,
      raw: result?.data?.text || ''
    };
  } catch (error) {
    console.error('OCR Error:', error);
    throw error;
  }
};

// Preprocess: resize, grayscale, contrast stretch, optional sharpening
const preprocessImage = (imageFile, options = {}) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const MAX_WIDTH = options.maxWidth || 1600;
      let width = img.width;
      let height = img.height;

      if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width);
        width = MAX_WIDTH;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Convert to grayscale
      let min = 255, max = 0;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        if (lum < min) min = lum;
        if (lum > max) max = lum;
        data[i] = data[i + 1] = data[i + 2] = lum;
      }

      // Contrast stretching
      if (max === min) { max = 255; min = 0; }
      const range = max - min;
      for (let i = 0; i < data.length; i += 4) {
        const v = data[i];
        const stretched = Math.min(255, Math.max(0, ((v - min) * 255) / range));
        data[i] = data[i + 1] = data[i + 2] = stretched;
      }

      // Optional sharpening
      if (options.sharpen !== false) {
        const copy = new Uint8ClampedArray(data);
        const w = canvas.width, h = canvas.height;
        for (let y = 1; y < h - 1; y++) {
          for (let x = 1; x < w - 1; x++) {
            const i = (y * w + x) * 4;
            const center = copy[i];
            const sumNeighbors = copy[i - 4] + copy[i + 4] + copy[i - w * 4] + copy[i + w * 4];
            const sharpened = Math.min(255, Math.max(0, center * 1.5 - sumNeighbors * 0.125));
            data[i] = data[i + 1] = data[i + 2] = sharpened;
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL('image/jpeg', 0.92));
    };
    img.onerror = (e) => reject(e);
    img.src = URL.createObjectURL(imageFile);
  });
};

const parseText = (text) => {
  const lines = (text || '').split('\n').map(l => l.trim()).filter(Boolean);
  const cardData = {
    name: '',
    company: '',
    title: '',
    phone: '',
    email: '',
    linkedin: '',
    address: '',
    rawText: text || ''
  };

  const emailRegex = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/i;
  const phoneRegex = /((?:\+\d{1,3}[\s.-]?)?(?:\(\d{2,4}\)[\s.-]?|\d{2,4}[\s.-]?)?\d{3,4}[\s.-]?\d{3,4})/i;
  const linkedinRegex = /(linkedin\.com\/in\/[A-Za-z0-9-_.]+|linkedin\.com\/pub\/[A-Za-z0-9-_.]+|@([A-Za-z0-9_.]{3,}))/i;

  const titleKeywords = ['manager', 'director', 'engineer', 'developer', 'designer', 'ceo', 'cto', 'founder', 'specialist', 'consultant', 'president', 'vp', 'head', 'lead', 'officer', 'analyst'];
  const companyKeywords = ['inc', 'llc', 'ltd', 'corp', 'group', 'solutions', 'technologies', 'systems', 'global', 'services', 'agency', 'studio', 'co'];

  // Extract contact info using regex
  lines.forEach(line => {
    if (!line || line.length < 2) return;
    if (!cardData.email) {
      const m = line.match(emailRegex);
      if (m) cardData.email = m[0];
    }
    if (!cardData.linkedin) {
      const m = line.match(linkedinRegex);
      if (m) cardData.linkedin = m[0];
    }
    if (!cardData.phone) {
      const m = line.match(phoneRegex);
      if (m) cardData.phone = m[0];
    }
    if (!cardData.title && titleKeywords.some(k => line.toLowerCase().includes(k))) {
      cardData.title = line;
    }
    if (!cardData.company && companyKeywords.some(k => line.toLowerCase().includes(k))) {
      cardData.company = line;
    }
  });

  // Assign remaining lines to name and company
  const taken = new Set([cardData.email, cardData.phone, cardData.linkedin, cardData.title, cardData.company].filter(Boolean));
  const candidateLines = lines.filter(l => !taken.has(l));

  if (!cardData.name && candidateLines.length > 0) {
    cardData.name = candidateLines[0];
  }
  if (!cardData.company && candidateLines.length > 1) {
    cardData.company = candidateLines[1];
  }

  return cardData;
};
