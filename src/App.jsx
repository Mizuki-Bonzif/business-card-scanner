import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import ContactIndex from './pages/ContactIndex';
import Settings from './pages/Settings';
import Toast from './components/Toast';
import { processImage } from './utils/ocrProcessor2';
import DebugPanel from './components/DebugPanel';
import { saveCard } from './utils/storage';
import './App.css';

function AppContent() {
  const [isScanning, setIsScanning] = useState(false);
  const [debugImage, setDebugImage] = useState(null);
  const [debugPanelVisible, setDebugPanelVisible] = useState(false);
  const [lastOCRRaw, setLastOCRRaw] = useState('');
  const [lastParsed, setLastParsed] = useState(null);
  const [toast, setToast] = useState(null);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const navigate = useNavigate();

  // Capture PWA install prompt
  React.useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const handleImageUpload = async (file, options = {}) => {
    setIsScanning(true);
    setDebugImage(null);
    
    // Capture geolocation if available
    let location = null;
    if (navigator.geolocation) {
      try {
        location = await new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
            () => resolve(null),
            { timeout: 5000 }
          );
        });
      } catch (e) {
        console.warn('Geolocation error:', e);
      }
    }
    
    try {
      const debugMode = import.meta.env.MODE === 'development' || window.location.search.includes('debug=1') || options.debug;
      const result = await processImage(file, { debug: debugMode });
      const { debugImage, raw, ...cardData } = result;
      saveCard({ ...cardData, location });
      setDebugImage(debugImage);
      setLastOCRRaw(raw || '');
      setLastParsed(cardData || null);

      // If requested, save the processed debug image to a file automatically
      if (options.saveDebug && debugImage) {
        try {
          const a = document.createElement('a');
          a.href = debugImage;
          a.download = `processed-card-${Date.now()}.jpg`;
          document.body.appendChild(a);
          a.click();
          a.remove();
        } catch (err) {
          console.warn('Failed to auto-download processed image', err);
        }
      }

      setToast({ message: 'Card saved successfully!', type: 'success' });
    } catch (error) {
      console.error(error);
      setToast({ message: 'Failed to scan card. Please try again.', type: 'error' });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="app-container">
      {isScanning && (
        <div className="scanning-overlay">
          <div className="spinner"></div>
          <p>Scanning Business Card...</p>
        </div>
      )}

      {debugImage && (
        <div className="scanning-overlay" style={{ flexDirection: 'column', zIndex: 2000 }}>
          <h3>Debug View</h3>
          <img src={debugImage} alt="Processed" style={{ maxWidth: '90%', maxHeight: '60vh', border: '2px solid red' }} />
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <button onClick={() => setDebugImage(null)} style={{ padding: '10px 20px' }}>Close</button>
            <button onClick={() => { setDebugImage(null); navigate('/contacts'); }} style={{ padding: '10px 20px', background: '#4CAF50', color: 'white' }}>Continue</button>
          </div>
        </div>
      )}

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      <Routes>
        <Route path="/" element={<Home onImageUpload={handleImageUpload} onOpenDebug={() => setDebugPanelVisible(true)} />} />
        <Route path="/contacts" element={<ContactIndex />} />
        <Route path="/settings" element={<Settings deferredPrompt={deferredPrompt} onInstall={handleInstall} />} />
      </Routes>
      {debugPanelVisible && (
        <DebugPanel
          visible={debugPanelVisible}
          onClose={() => setDebugPanelVisible(false)}
          rawText={lastOCRRaw}
          parsed={lastParsed}
        />
      )}
      <NavBar />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
