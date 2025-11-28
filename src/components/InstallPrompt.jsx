import React from 'react';
import './InstallPrompt.css';

const InstallPrompt = ({ visible, onInstall, onDismiss }) => {
  if (!visible) return null;

  return (
    <div className="install-banner">
      <div className="install-content">
        <div className="install-text">
          <h4>Install CardScanner</h4>
          <p>Get quick access to scan business cards from your home screen</p>
        </div>
        <div className="install-actions">
          <button className="btn-install" onClick={onInstall}>
            Install
          </button>
          <button className="btn-dismiss" onClick={onDismiss}>
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;
