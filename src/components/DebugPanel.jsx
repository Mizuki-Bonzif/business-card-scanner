import React from 'react';
import './DebugPanel.css';

const DebugPanel = ({ visible, onClose, rawText, parsed }) => {
  if (!visible) return null;

  return (
    <div className="debug-panel-backdrop">
      <div className="debug-panel">
        <div className="debug-panel-header">
          <h3>OCR Debug Panel</h3>
          <button className="close-btn" onClick={onClose}>Close</button>
        </div>

        <div className="debug-grid">
          <div className="debug-column">
            <h4>Raw OCR Text</h4>
            <textarea readOnly value={rawText || ''} className="debug-textarea" />
          </div>

          <div className="debug-column">
            <h4>Parsed Fields</h4>
            <div className="parsed-list">
              {parsed ? (
                Object.entries(parsed).map(([k, v]) => (
                  <div key={k} className="parsed-row">
                    <strong className="parsed-key">{k}:</strong>
                    <span className="parsed-val">{String(v || '')}</span>
                  </div>
                ))
              ) : (
                <p>No parsed data yet.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DebugPanel;
