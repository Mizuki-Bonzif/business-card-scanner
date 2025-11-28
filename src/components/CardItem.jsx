import React, { useState } from 'react';
import { deleteCard, updateCard, getGroups, getEvents } from '../utils/storage';
import './CardItem.css';

const CardItem = ({ card, onDelete, onUpdate }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [copiedField, setCopiedField] = useState(null);

    const handleDelete = () => {
        if (window.confirm('Delete this card?')) {
            deleteCard(card.id);
            if (onDelete) onDelete(card.id);
        }
    };

    const handleCopyToClipboard = (text, field) => {
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        });
    };

    return (
        <div className="card-item">
            <div className="card-header" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="card-title-section">
                    <h3 className="card-name">{card.name || 'Unknown'}</h3>
                    {card.company && <span className="card-company">{card.company}</span>}
                </div>
                <button className="expand-btn" title={isExpanded ? "Collapse" : "Expand"}>
                    {isExpanded ? '▼' : '▶'}
                </button>
            </div>

            {isExpanded && (
                <div className="card-details">
                    {card.jobTitle && (
                        <div className="detail-row">
                            <span className="detail-label">Job Title:</span>
                            <span className="detail-value">{card.jobTitle}</span>
                        </div>
                    )}
                    {card.phone && (
                        <div className="detail-row">
                            <span className="detail-label">Phone:</span>
                            <span className="detail-value">
                                <a href={`tel:${card.phone}`}>{card.phone}</a>
                                <button 
                                    className="copy-btn" 
                                    onClick={() => handleCopyToClipboard(card.phone, 'phone')}
                                    title="Copy to clipboard"
                                >
                                    {copiedField === 'phone' ? '✓' : '📋'}
                                </button>
                            </span>
                        </div>
                    )}
                    {card.email && (
                        <div className="detail-row">
                            <span className="detail-label">Email:</span>
                            <span className="detail-value">
                                <a href={`mailto:${card.email}`}>{card.email}</a>
                                <button 
                                    className="copy-btn" 
                                    onClick={() => handleCopyToClipboard(card.email, 'email')}
                                    title="Copy to clipboard"
                                >
                                    {copiedField === 'email' ? '✓' : '📋'}
                                </button>
                            </span>
                        </div>
                    )}
                    {card.linkedinId && (
                        <div className="detail-row">
                            <span className="detail-label">LinkedIn:</span>
                            <span className="detail-value">{card.linkedinId}</span>
                        </div>
                    )}
                    {card.address && (
                        <div className="detail-row">
                            <span className="detail-label">Address:</span>
                            <span className="detail-value">{card.address}</span>
                        </div>
                    )}

                    {card.timestamp && (
                        <div className="detail-row">
                            <span className="detail-label">Scanned:</span>
                            <span className="detail-value">{new Date(card.timestamp).toLocaleString()}</span>
                        </div>
                    )}

                    {card.location && (
                        <div className="detail-row">
                            <span className="detail-label">Location:</span>
                            <span className="detail-value">
                                <a href={`https://maps.google.com/?q=${card.location.lat},${card.location.lon}`} target="_blank" rel="noopener noreferrer">
                                    {card.location.lat.toFixed(4)}, {card.location.lon.toFixed(4)}
                                </a>
                            </span>
                        </div>
                    )}

                    {card.groupIds && card.groupIds.length > 0 && (
                        <div className="detail-row">
                            <span className="detail-label">Groups:</span>
                            <div className="tags">
                                {card.groupIds.map(groupId => {
                                    const groups = getGroups();
                                    const group = groups.find(g => g.id === groupId);
                                    return group ? (
                                        <span key={groupId} className="tag group-tag">{group.name}</span>
                                    ) : null;
                                })}
                            </div>
                        </div>
                    )}

                    {card.eventIds && card.eventIds.length > 0 && (
                        <div className="detail-row">
                            <span className="detail-label">Events:</span>
                            <div className="tags">
                                {card.eventIds.map(eventId => {
                                    const events = getEvents();
                                    const event = events.find(e => e.id === eventId);
                                    return event ? (
                                        <span key={eventId} className="tag event-tag">{event.name}</span>
                                    ) : null;
                                })}
                            </div>
                        </div>
                    )}

                    <div className="card-actions">
                        <button className="btn-delete" onClick={handleDelete}>
                            Delete Card
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CardItem;
