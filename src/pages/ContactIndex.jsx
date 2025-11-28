import React, { useState, useEffect } from 'react';
import { getCards, getGroups, getEvents, createGroup, createEvent, deleteGroup, deleteEvent, filterCardsByGroup, filterCardsByEvent, searchCards, sortCards, addCardToGroup, removeCardFromGroup, addCardToEvent, removeCardFromEvent } from '../utils/storage';
import CardItem from '../components/CardItem';
import './ContactIndex.css';

const ContactIndex = () => {
    const [cards, setCards] = useState([]);
    const [groups, setGroups] = useState([]);
    const [events, setEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('time-newest');
    const [filterBy, setFilterBy] = useState('all'); // 'all', 'group-<id>', 'event-<id>'
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [showEventModal, setShowEventModal] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [newEventName, setNewEventName] = useState('');
    const [selectedCards, setSelectedCards] = useState(new Set());
    const [bulkActionMode, setBulkActionMode] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        const loadedCards = getCards();
        setCards(loadedCards);
        setGroups(getGroups());
        setEvents(getEvents());
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
    };

    const handleCreateGroup = () => {
        if (newGroupName.trim()) {
            createGroup(newGroupName);
            setNewGroupName('');
            setShowGroupModal(false);
            loadData();
        }
    };

    const handleCreateEvent = () => {
        if (newEventName.trim()) {
            createEvent(newEventName);
            setNewEventName('');
            setShowEventModal(false);
            loadData();
        }
    };

    const handleDeleteGroup = (groupId) => {
        deleteGroup(groupId);
        loadData();
        if (filterBy === `group-${groupId}`) {
            setFilterBy('all');
        }
    };

    const handleDeleteEvent = (eventId) => {
        deleteEvent(eventId);
        loadData();
        if (filterBy === `event-${eventId}`) {
            setFilterBy('all');
        }
    };

    const getFilteredCards = () => {
        let filtered = cards;

        // Apply search
        if (searchTerm.trim()) {
            filtered = searchCards(searchTerm);
        }

        // Apply filter
        if (filterBy.startsWith('group-')) {
            const groupId = parseInt(filterBy.split('-')[1]);
            filtered = filtered.filter(card => card.groupIds && card.groupIds.includes(groupId));
        } else if (filterBy.startsWith('event-')) {
            const eventId = parseInt(filterBy.split('-')[1]);
            filtered = filtered.filter(card => card.eventIds && card.eventIds.includes(eventId));
        }

        // Apply sort
        return sortCards(filtered, sortBy);
    };

    const toggleCardSelection = (cardId) => {
        const newSelected = new Set(selectedCards);
        if (newSelected.has(cardId)) {
            newSelected.delete(cardId);
        } else {
            newSelected.add(cardId);
        }
        setSelectedCards(newSelected);
    };

    const handleAddSelectedToGroup = (groupId) => {
        selectedCards.forEach(cardId => {
            addCardToGroup(cardId, groupId);
        });
        setSelectedCards(new Set());
        setBulkActionMode(false);
        loadData();
    };

    const handleAddSelectedToEvent = (eventId) => {
        selectedCards.forEach(cardId => {
            addCardToEvent(cardId, eventId);
        });
        setSelectedCards(new Set());
        setBulkActionMode(false);
        loadData();
    };

    const filteredCards = getFilteredCards();

    return (
        <div className="contact-index-page">
            <header className="index-header">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search cards..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="search-bar"
                    />
                    <button className="filter-btn" onClick={() => setShowFilterMenu(!showFilterMenu)} title="Filter & Sort">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                            <path d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                </div>

                {showFilterMenu && (
                    <div className="filter-menu">
                        <div className="filter-section">
                            <h4>Sort By</h4>
                            <button className={sortBy === 'time-newest' ? 'active' : ''} onClick={() => setSortBy('time-newest')}>
                                Newest First
                            </button>
                            <button className={sortBy === 'time-oldest' ? 'active' : ''} onClick={() => setSortBy('time-oldest')}>
                                Oldest First
                            </button>
                            <button className={sortBy === 'name-asc' ? 'active' : ''} onClick={() => setSortBy('name-asc')}>
                                Name (A-Z)
                            </button>
                            <button className={sortBy === 'name-desc' ? 'active' : ''} onClick={() => setSortBy('name-desc')}>
                                Name (Z-A)
                            </button>
                        </div>

                        <div className="filter-section">
                            <div className="section-header">
                                <h4>Groups</h4>
                                <button className="add-btn" onClick={() => setShowGroupModal(true)} title="Add Group">+</button>
                            </div>
                            <button className={filterBy === 'all' ? 'active' : ''} onClick={() => setFilterBy('all')}>
                                All Cards
                            </button>
                            {groups.map(group => (
                                <div key={group.id} className="filter-item">
                                    <button className={filterBy === `group-${group.id}` ? 'active' : ''} onClick={() => setFilterBy(`group-${group.id}`)}>
                                        {group.name}
                                    </button>
                                    <button className="delete-btn" onClick={() => handleDeleteGroup(group.id)} title="Delete">✕</button>
                                </div>
                            ))}
                        </div>

                        <div className="filter-section">
                            <div className="section-header">
                                <h4>Events</h4>
                                <button className="add-btn" onClick={() => setShowEventModal(true)} title="Add Event">+</button>
                            </div>
                            {events.map(event => (
                                <div key={event.id} className="filter-item">
                                    <button className={filterBy === `event-${event.id}` ? 'active' : ''} onClick={() => setFilterBy(`event-${event.id}`)}>
                                        {event.name}
                                    </button>
                                    <button className="delete-btn" onClick={() => handleDeleteEvent(event.id)} title="Delete">✕</button>
                                </div>
                            ))}
                        </div>

                        <div className="filter-actions">
                            <button className="bulk-select-btn" onClick={() => {
                                if (!bulkActionMode) {
                                    setBulkActionMode(true);
                                } else {
                                    setBulkActionMode(false);
                                    setSelectedCards(new Set());
                                }
                            }}>
                                {bulkActionMode ? 'Cancel Selection' : 'Select Cards'}
                            </button>
                            {bulkActionMode && selectedCards.size > 0 && (
                                <>
                                    <div className="bulk-actions">
                                        <p>{selectedCards.size} card(s) selected</p>
                                        <div className="bulk-options">
                                            <select onChange={(e) => {
                                                if (e.target.value) {
                                                    handleAddSelectedToGroup(parseInt(e.target.value));
                                                }
                                            }} defaultValue="">
                                                <option value="">Add to Group...</option>
                                                {groups.map(group => (
                                                    <option key={group.id} value={group.id}>{group.name}</option>
                                                ))}
                                            </select>
                                            <select onChange={(e) => {
                                                if (e.target.value) {
                                                    handleAddSelectedToEvent(parseInt(e.target.value));
                                                }
                                            }} defaultValue="">
                                                <option value="">Add to Event...</option>
                                                {events.map(event => (
                                                    <option key={event.id} value={event.id}>{event.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </header>

            {showGroupModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Create New Group</h3>
                        <input
                            type="text"
                            placeholder="Group name"
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleCreateGroup()}
                        />
                        <div className="modal-buttons">
                            <button onClick={handleCreateGroup} className="btn-confirm">Create</button>
                            <button onClick={() => { setShowGroupModal(false); setNewGroupName(''); }} className="btn-cancel">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {showEventModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Create New Event</h3>
                        <input
                            type="text"
                            placeholder="Event name"
                            value={newEventName}
                            onChange={(e) => setNewEventName(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleCreateEvent()}
                        />
                        <div className="modal-buttons">
                            <button onClick={handleCreateEvent} className="btn-confirm">Create</button>
                            <button onClick={() => { setShowEventModal(false); setNewEventName(''); }} className="btn-cancel">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="cards-list">
                {filteredCards.length > 0 ? (
                    filteredCards.map(card => (
                        <div key={card.id} className={`card-wrapper ${selectedCards.has(card.id) ? 'selected' : ''}`}>
                            {bulkActionMode && (
                                <input
                                    type="checkbox"
                                    className="card-checkbox"
                                    checked={selectedCards.has(card.id)}
                                    onChange={() => toggleCardSelection(card.id)}
                                />
                            )}
                            <CardItem card={card} />
                        </div>
                    ))
                ) : (
                    <div className="empty-state">
                        <p>No cards found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContactIndex;
