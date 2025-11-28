import React from 'react';
import './PermissionsModal.css';

const PermissionsModal = ({ visible, onClose, onRequestCamera }) => {
  if (!visible) return null;

  return (
    <div className="perm-overlay" role="dialog" aria-modal="true">
      <div className="perm-modal">
        <h3>Permissions & Camera Access</h3>
        <p>
          To scan business cards with the camera, CardScanner needs permission
          to access your device camera. You can also upload images from your
          gallery without granting camera permission.
        </p>

        <div className="perm-steps">
          <h4>How to grant camera access</h4>
          <ol>
            <li>Tap "Request Camera Permission" below to prompt the browser permission dialog.</li>
            <li>If you previously denied access, open your device settings and allow Camera permission for the browser.</li>
            <li>On iOS (Safari): Settings → Safari → Camera → Allow.</li>
            <li>On Android (Chrome): App settings → Permissions → Camera → Allow.</li>
            <li>After granting, reload the app if necessary and try taking a photo again.</li>
          </ol>
        </div>

        <div className="perm-actions">
          <button className="btn-primary" onClick={onRequestCamera}>Request Camera Permission</button>
          <button className="btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default PermissionsModal;
