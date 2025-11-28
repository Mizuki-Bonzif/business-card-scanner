import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
    return (
        <nav className="navbar">
            <NavLink to="/contacts" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                {/* Person silhouette for Card Index */}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="nav-icon">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span className="nav-label">Card Index</span>
            </NavLink>

            <NavLink to="/" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                {/* Camera icon for Home */}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="nav-icon camera-icon">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                    <circle cx="12" cy="13" r="4"></circle>
                </svg>
            </NavLink>

            <NavLink to="/settings" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                {/* Gear icon for Settings */}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="nav-icon">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m2.98 2.98l4.24 4.24M1 12h6m6 0h6m-16.78 7.78l4.24-4.24m2.98-2.98l4.24-4.24"></path>
                </svg>
                <span className="nav-label">Settings</span>
            </NavLink>
        </nav>
    );
};

export default NavBar;
