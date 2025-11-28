import React, { useState } from 'react';
import { getCards, getGroups, getEvents } from '../utils/storage';
import './Settings.css';

const Settings = ({ deferredPrompt, onInstall }) => {
    const [stats, setStats] = useState(() => {
        const cards = getCards();
        const groups = getGroups();
        const events = getEvents();
        return {
            totalCards: cards.length,
            totalGroups: groups.length,
            totalEvents: events.length
        };
    });

    const handleExportData = () => {
        const data = {
            cards: getCards(),
            groups: getGroups(),
            events: getEvents(),
            exportedAt: new Date().toISOString()
        };
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `business_cards_backup_${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleClearAllData = () => {
        if (window.confirm('Are you sure you want to delete all data? This cannot be undone.')) {
            localStorage.removeItem('business_cards');
            localStorage.removeItem('card_groups');
            localStorage.removeItem('card_events');
            window.location.reload();
        }
    };

    return (
        <div className="settings-page">
            <header className="settings-header">
                <h1>Settings</h1>
            </header>

            <main className="settings-content">
                <section className="settings-section">
                    <h2>Statistics</h2>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-number">{stats.totalCards}</div>
                            <div className="stat-label">Cards Scanned</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">{stats.totalGroups}</div>
                            <div className="stat-label">Groups</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">{stats.totalEvents}</div>
                            <div className="stat-label">Events</div>
                        </div>
                    </div>
                </section>

                <section className="settings-section">
                    <h2>Install App</h2>
                    {deferredPrompt && (
                        <div className="settings-option install-section">
                            <button className="btn-install-app" onClick={onInstall}>
                                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                                </svg>
                                Download App for Offline Use
                            </button>
                            <p className="option-description">Install CardScanner on your device to use it anytime, anywhere — even without internet</p>
                        </div>
                    )}
                    {!deferredPrompt && (
                        <div className="settings-option">
                            <p className="option-description">ℹ️ App is already installed, or your browser doesn't support PWA installation. You can still use the app offline!</p>
                        </div>
                    )}
                </section>

                <section className="settings-section">
                    <h2>Data Management</h2>
                    <div className="settings-option">
                        <button className="btn-primary-action" onClick={handleExportData}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            Export Data as JSON
                        </button>
                        <p className="option-description">Download a backup of all your cards, groups, and events</p>
                    </div>

                    <div className="settings-option">
                        <button className="btn-danger-action" onClick={handleClearAllData}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                            Clear All Data
                        </button>
                        <p className="option-description">Delete all cards, groups, and events (cannot be undone)</p>
                    </div>
                </section>

                <section className="settings-section">
                    <h2>About CardScanner</h2>
                    <div className="about-info">
                        <p><strong>Version:</strong> 1.0.0</p>
                        <p><strong>Description:</strong> Scan business cards and extract vital information automatically using OCR technology.</p>
                        <p><strong>Features:</strong></p>
                        <ul>
                            <li>Scan business cards using camera or gallery</li>
                            <li>Extract names, companies, job titles, phone numbers, emails, LinkedIn IDs, and addresses</li>
                            <li>Search through your scanned cards</li>
                            <li>Create and manage groups and events</li>
                            <li>Organize cards by groups or events</li>
                            <li>Export data for backup</li>
                        </ul>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Settings;
