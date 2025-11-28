const STORAGE_KEY = 'business_cards';
const GROUPS_KEY = 'card_groups';
const EVENTS_KEY = 'card_events';

// ===== CARDS MANAGEMENT =====
export const getCards = () => {
    const cards = localStorage.getItem(STORAGE_KEY);
    return cards ? JSON.parse(cards) : [];
};

export const saveCard = (card) => {
    const cards = getCards();
    const newCard = { ...card, id: Date.now(), timestamp: Date.now(), location: card.location || null, groupIds: [], eventIds: [] };  
    cards.push(newCard);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    return newCard;
};export const deleteCard = (id) => {
    const cards = getCards();
    const newCards = cards.filter(card => card.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newCards));
};

export const updateCard = (id, updates) => {
    const cards = getCards();
    const cardIndex = cards.findIndex(card => card.id === id);
    if (cardIndex !== -1) {
        cards[cardIndex] = { ...cards[cardIndex], ...updates };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
        return cards[cardIndex];
    }
    return null;
};

// ===== GROUPS MANAGEMENT =====
export const getGroups = () => {
    const groups = localStorage.getItem(GROUPS_KEY);
    return groups ? JSON.parse(groups) : [];
};

export const createGroup = (name) => {
    const groups = getGroups();
    const newGroup = { id: Date.now(), name, createdAt: Date.now() };
    groups.push(newGroup);
    localStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
    return newGroup;
};

export const deleteGroup = (groupId) => {
    const groups = getGroups();
    const newGroups = groups.filter(g => g.id !== groupId);
    localStorage.setItem(GROUPS_KEY, JSON.stringify(newGroups));
    
    // Remove group from all cards
    const cards = getCards();
    cards.forEach(card => {
        card.groupIds = card.groupIds.filter(id => id !== groupId);
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
};

export const renameGroup = (groupId, newName) => {
    const groups = getGroups();
    const group = groups.find(g => g.id === groupId);
    if (group) {
        group.name = newName;
        localStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
        return group;
    }
    return null;
};

export const addCardToGroup = (cardId, groupId) => {
    const card = updateCard(cardId, {
        groupIds: [...new Set([...(getCards().find(c => c.id === cardId)?.groupIds || []), groupId])]
    });
    return card;
};

export const removeCardFromGroup = (cardId, groupId) => {
    const card = getCards().find(c => c.id === cardId);
    if (card) {
        return updateCard(cardId, {
            groupIds: card.groupIds.filter(id => id !== groupId)
        });
    }
    return null;
};

// ===== EVENTS MANAGEMENT =====
export const getEvents = () => {
    const events = localStorage.getItem(EVENTS_KEY);
    return events ? JSON.parse(events) : [];
};

export const createEvent = (name) => {
    const events = getEvents();
    const newEvent = { id: Date.now(), name, createdAt: Date.now() };
    events.push(newEvent);
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
    return newEvent;
};

export const deleteEvent = (eventId) => {
    const events = getEvents();
    const newEvents = events.filter(e => e.id !== eventId);
    localStorage.setItem(EVENTS_KEY, JSON.stringify(newEvents));
    
    // Remove event from all cards
    const cards = getCards();
    cards.forEach(card => {
        card.eventIds = card.eventIds.filter(id => id !== eventId);
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
};

export const renameEvent = (eventId, newName) => {
    const events = getEvents();
    const event = events.find(e => e.id === eventId);
    if (event) {
        event.name = newName;
        localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
        return event;
    }
    return null;
};

export const addCardToEvent = (cardId, eventId) => {
    const card = updateCard(cardId, {
        eventIds: [...new Set([...(getCards().find(c => c.id === cardId)?.eventIds || []), eventId])]
    });
    return card;
};

export const removeCardFromEvent = (cardId, eventId) => {
    const card = getCards().find(c => c.id === cardId);
    if (card) {
        return updateCard(cardId, {
            eventIds: card.eventIds.filter(id => id !== eventId)
        });
    }
    return null;
};

// ===== FILTERING AND SORTING =====
export const filterCardsByGroup = (groupId) => {
    return getCards().filter(card => card.groupIds && card.groupIds.includes(groupId));
};

export const filterCardsByEvent = (eventId) => {
    return getCards().filter(card => card.eventIds && card.eventIds.includes(eventId));
};

export const searchCards = (searchTerm) => {
    const term = searchTerm.toLowerCase();
    return getCards().filter(card => {
        return (
            (card.name && card.name.toLowerCase().includes(term)) ||
            (card.company && card.company.toLowerCase().includes(term)) ||
            (card.email && card.email.toLowerCase().includes(term)) ||
            (card.phone && card.phone.toLowerCase().includes(term)) ||
            (card.jobTitle && card.jobTitle.toLowerCase().includes(term)) ||
            (card.linkedinId && card.linkedinId.toLowerCase().includes(term))
        );
    });
};

export const sortCards = (cards, sortBy) => {
    const sorted = [...cards];
    switch (sortBy) {
        case 'time-newest':
            return sorted.sort((a, b) => b.timestamp - a.timestamp);
        case 'time-oldest':
            return sorted.sort((a, b) => a.timestamp - b.timestamp);
        case 'name-asc':
            return sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        case 'name-desc':
            return sorted.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
        default:
            return sorted;
    }
};
