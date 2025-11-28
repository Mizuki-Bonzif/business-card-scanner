import React, { useRef, useState, useEffect } from 'react';
import './Home.css';
import PermissionsModal from '../components/PermissionsModal';
import InstallPrompt from '../components/InstallPrompt';

const Home = ({ onImageUpload, onOpenDebug }) => {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPermModal, setShowPermModal] = useState(false);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [cameraPermission, setCameraPermission] = useState('unknown');
  const [debugEnabled, setDebugEnabled] = useState(false);
  const [saveProcessedImage, setSaveProcessedImage] = useState(false);

  useEffect(() => {
    let mounted = true;
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show the install banner only once per session
      const dismissed = sessionStorage.getItem('installBannerDismissed');
      if (!dismissed && mounted) {
        setShowInstallBanner(true);
      }
    };
    window.addEventListener('beforeinstallprompt', handler);

    (async () => {
      try {
        if (navigator.permissions && navigator.permissions.query) {
          const status = await navigator.permissions.query({ name: 'camera' });
          if (!mounted) return;
          setCameraPermission(status.state);
          status.onchange = () => setCameraPermission(status.state);
        }
      } catch (e) {}
    })();

    return () => {
      mounted = false;
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstallBanner(false);
      sessionStorage.setItem('installBannerDismissed', 'true');
    }
  };

  const handleDismissInstall = () => {
    setShowInstallBanner(false);
    sessionStorage.setItem('installBannerDismissed', 'true');
  };

  const handleUploadClick = () => fileInputRef.current && fileInputRef.current.click();
  const handleCameraClick = () => cameraInputRef.current && cameraInputRef.current.click();

  const handleFileChange = (event) => {
    const file = event.target.files && event.target.files[0];
    if (file) onImageUpload(file, { debug: debugEnabled, saveDebug: saveProcessedImage });
  };

  const requestCameraPermission = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Camera API is not supported in this browser.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((t) => t.stop());
      setCameraPermission('granted');
      alert('Camera permission granted. You can now take photos.');
    } catch (err) {
      console.error('Camera permission error:', err);
      setCameraPermission('denied');
      alert('Camera access was denied. Please allow camera permission in your browser settings.');
    }
  };

  return (
    <div className="home-page">
      <header className="home-header">
        <h1 className="app-title">CardScanner</h1>
      </header>

      <main className="home-content">
        <div className="upload-section">
          <button className="btn-primary upload-btn camera-btn" onClick={handleCameraClick}>
            📷 Take Photo
          </button>

          <button className="btn-secondary upload-btn gallery-btn" onClick={handleUploadClick}>      
            📁 Upload from Gallery
          </button>          <button className="btn-tertiary perm-btn" onClick={() => setShowPermModal(true)}>
            Permissions
          </button>
            <div className="debug-controls">
              <label className="debug-label">
                <input type="checkbox" checked={debugEnabled} onChange={(e) => setDebugEnabled(e.target.checked)} /> Enable OCR Debug
              </label>
              <label className="debug-label">
                <input type="checkbox" checked={saveProcessedImage} onChange={(e) => setSaveProcessedImage(e.target.checked)} /> Save Processed Image
              </label>
            </div>
            {debugEnabled && (
              <button className="btn-tertiary" onClick={() => onOpenDebug && onOpenDebug()}>
                View OCR Debug
              </button>
            )}

          {deferredPrompt && (
            <button className="btn-secondary upload-btn install-btn" onClick={handleInstallClick}>
              Install App
            </button>
          )}

          <input type="file" ref={cameraInputRef} onChange={handleFileChange} accept="image/*" capture="environment" style={{ display: 'none' }} />
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
        </div>
      </main>

      <PermissionsModal visible={showPermModal} onClose={() => setShowPermModal(false)} onRequestCamera={requestCameraPermission} />
      <InstallPrompt visible={showInstallBanner && !!deferredPrompt} onInstall={handleInstallClick} onDismiss={handleDismissInstall} />
    </div>
  );
};

export default Home;
