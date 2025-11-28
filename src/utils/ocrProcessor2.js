import Tesseract from 'tesseract.js';

// Process an image File and return parsed card data + debug image
export const processImage = async (imageFile, options = {}) => {
  try {
    const processedImage = await preprocessImage(imageFile, options);

    const tesseractOptions = {
      logger: m => options.debug && console.log('TESS:', m),
      tessedit_char_whitelist: options.whitelist || 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@.-,+()&/ ',
      // PSM 6: Assume a single uniform block of text (ideal for business cards)
      psm: 6,
      // OEM 3: Use both legacy and LSTM OCR engine models for better accuracy
      oem: 3
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

// Advanced preprocessing: resize, grayscale, bilateral filtering, contrast enhancement, dilation
const preprocessImage = (imageFile, options = {}) => {
  // Defaultable preprocessing parameters exposed via `options`.
  const {
    maxWidth = 2000,
    clipLimit = 2.0,
    denoise = true,
    denoiseRadius = 1,
    denoiseSigmaSpatial = 1.5,
    denoiseSigmaRange = 50,
    dilate = true,
    dilateRadius = 1,
    sharpen = true,
    sharpenStrength = 0.8,
    outputQuality = 0.95
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Resize to an appropriate width while preserving aspect ratio
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Convert to grayscale and gather min/max luminance
      let min = 255, max = 0;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        if (lum < min) min = lum;
        if (lum > max) max = lum;
        data[i] = data[i + 1] = data[i + 2] = lum;
      }

      // Contrast stretching with a configurable clip limit
      const range = max - min;
      if (range > 0) {
        for (let i = 0; i < data.length; i += 4) {
          const v = data[i];
          let stretched = ((v - min) * 255) / range;
          stretched = Math.min(255, stretched * clipLimit);
          data[i] = data[i + 1] = data[i + 2] = Math.min(255, Math.max(0, stretched));
        }
      }

      // Bilateral-like denoising (configurable)
      if (denoise && canvas.width > 100) {
        const copy = new Uint8ClampedArray(data);
        const w = canvas.width, h = canvas.height;
        const radius = Math.max(1, Math.floor(denoiseRadius));
        const sigmaSpatial = denoiseSigmaSpatial;
        const sigmaRange = denoiseSigmaRange;

        for (let y = radius; y < h - radius; y++) {
          for (let x = radius; x < w - radius; x++) {
            let sum = 0, weightSum = 0;
            const centerIdx = (y * w + x) * 4;
            const centerVal = copy[centerIdx];

            for (let dy = -radius; dy <= radius; dy++) {
              for (let dx = -radius; dx <= radius; dx++) {
                const idx = ((y + dy) * w + (x + dx)) * 4;
                const val = copy[idx];
                const spatialDist = Math.sqrt(dx * dx + dy * dy);
                const rangeDist = Math.abs(val - centerVal);
                const spatialWeight = Math.exp(-(spatialDist * spatialDist) / (2 * sigmaSpatial * sigmaSpatial));
                const rangeWeight = Math.exp(-(rangeDist * rangeDist) / (2 * sigmaRange * sigmaRange));
                const weight = spatialWeight * rangeWeight;
                sum += val * weight;
                weightSum += weight;
              }
            }
            data[centerIdx] = data[centerIdx + 1] = data[centerIdx + 2] = sum / weightSum;
          }
        }
      }

      // Morphological operation (dilate) - configurable
      if (dilate && canvas.width > 100) {
        const copy = new Uint8ClampedArray(data);
        const w = canvas.width, h = canvas.height;
        const radius = Math.max(1, Math.floor(dilateRadius));

        for (let y = radius; y < h - radius; y++) {
          for (let x = radius; x < w - radius; x++) {
            // For dark text on lighter background, choose the minimum value in neighborhood
            let bestVal = copy[(y * w + x) * 4];
            for (let dy = -radius; dy <= radius; dy++) {
              for (let dx = -radius; dx <= radius; dx++) {
                const val = copy[((y + dy) * w + (x + dx)) * 4];
                if (val < bestVal) bestVal = val;
              }
            }
            const idx = (y * w + x) * 4;
            data[idx] = data[idx + 1] = data[idx + 2] = bestVal;
          }
        }
      }

      // Optional unsharp masking for edge enhancement (configurable)
      if (sharpen && canvas.width > 100) {
        const copy = new Uint8ClampedArray(data);
        const w = canvas.width, h = canvas.height;
        const radius = 1;
        const strength = sharpenStrength;

        for (let y = radius; y < h - radius; y++) {
          for (let x = radius; x < w - radius; x++) {
            const i = (y * w + x) * 4;
            const center = copy[i];
            let sum = 0;
            let count = 0;
            for (let dy = -radius; dy <= radius; dy++) {
              for (let dx = -radius; dx <= radius; dx++) {
                if (dx === 0 && dy === 0) continue;
                sum += copy[((y + dy) * w + (x + dx)) * 4];
                count++;
              }
            }
            const blur = sum / Math.max(1, count);
            const sharpened = Math.min(255, Math.max(0, center + strength * (center - blur)));
            data[i] = data[i + 1] = data[i + 2] = sharpened;
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL('image/jpeg', outputQuality));
    };
    img.onerror = (e) => reject(e);
    img.src = URL.createObjectURL(imageFile);
  });
};

// Enhanced text parsing with better context awareness
const parseText = (text) => {
  const lines = (text || '').split('\n').map(l => l.trim()).filter(l => l.length > 0);
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

  // Enhanced regex patterns
  const emailRegex = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/i;
  const phoneRegex = /(?:\+\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?)?[\d\s.-]{7,15}/;
  const linkedinRegex = /(linkedin\.com\/in\/[A-Za-z0-9-_.]+|linkedin\.com\/pub\/[A-Za-z0-9-_.]+)/i;
  const websiteRegex = /(https?:\/\/)?(?:www\.)?[A-Za-z0-9.-]+\.[A-Za-z]{2,}/i;

  // Enhanced keyword lists
  const titleKeywords = [
    'manager', 'director', 'engineer', 'developer', 'designer', 'architect',
    'ceo', 'cto', 'cfo', 'coo', 'founder', 'co-founder', 'specialist', 
    'consultant', 'president', 'vp', 'vice president', 'head', 'lead',
    'officer', 'analyst', 'executive', 'associate', 'senior', 'junior',
    'principal', 'lead', 'manager'
  ];
  
  const companyKeywords = [
    'inc', 'llc', 'ltd', 'corp', 'corporation', 'group', 'solutions',
    'technologies', 'tech', 'systems', 'global', 'services', 'agency',
    'studio', 'co', 'company', 'labs', 'works', 'ventures'
  ];

  // Address keywords
  const addressKeywords = ['st', 'street', 'ave', 'avenue', 'blvd', 'boulevard', 'rd', 'road', 'lane', 'ln', 'way', 'court', 'suite', 'ste', 'floor', 'fl', 'apt', 'apartment'];

  // Extract structured data
  lines.forEach(line => {
    if (!line || line.length < 2) return;

    // Email
    if (!cardData.email) {
      const m = line.match(emailRegex);
      if (m) cardData.email = m[0];
    }

    // LinkedIn
    if (!cardData.linkedin) {
      const m = line.match(linkedinRegex);
      if (m) cardData.linkedin = m[0];
    }

    // Phone - improved detection
    if (!cardData.phone) {
      const m = line.match(phoneRegex);
      if (m && m[0].replace(/\D/g, '').length >= 7) {
        cardData.phone = m[0];
      }
    }

    // Website
    if (!cardData.address) {
      const m = line.match(websiteRegex);
      if (m && !line.includes('@')) cardData.address = m[0];
    }

    // Title - case insensitive, flexible matching
    if (!cardData.title) {
      const lowerLine = line.toLowerCase();
      for (const keyword of titleKeywords) {
        if (lowerLine.includes(keyword) && line.length < 50) {
          cardData.title = line;
          break;
        }
      }
    }

    // Company - case insensitive, flexible matching
    if (!cardData.company) {
      const lowerLine = line.toLowerCase();
      for (const keyword of companyKeywords) {
        if (lowerLine.includes(keyword) && line.length < 60) {
          cardData.company = line;
          break;
        }
      }
    }

    // Address - detect address-like patterns
    if (!cardData.address || cardData.address.includes('.')) {
      const lowerLine = line.toLowerCase();
      if (addressKeywords.some(k => lowerLine.includes(k)) && line.length > 10) {
        cardData.address = line;
      }
    }
  });

  // Assign remaining lines to name and company if not already found
  const taken = new Set([cardData.email, cardData.phone, cardData.linkedin, cardData.title, cardData.company, cardData.address].filter(Boolean));
  const candidateLines = lines.filter(l => !taken.has(l) && l.length > 2);

  if (!cardData.name && candidateLines.length > 0) {
    // Prefer shorter lines for name (typically 2-4 words)
    const shortLines = candidateLines.filter(l => l.split(/\s+/).length <= 4);
    cardData.name = shortLines.length > 0 ? shortLines[0] : candidateLines[0];
  }

  if (!cardData.company && candidateLines.length > 1) {
    const remainingLines = candidateLines.filter(l => l !== cardData.name);
    if (remainingLines.length > 0) {
      cardData.company = remainingLines[0];
    }
  }

  return cardData;
};
