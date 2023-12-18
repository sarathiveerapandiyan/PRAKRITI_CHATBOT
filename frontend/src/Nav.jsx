// Navbar.js
import React from 'react';
// import './Navbar.css'; // Import your CSS file for styling

const Navbar = ({ brand, onLogout }) => {
  return (
    <div className="navbar">
      <div className="brand">{brand}</div>
      <div className="nav-buttons">
        <button className="logout-button" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
