// Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ pages }) => {
  return (
    <div className="sidebar">
      {pages.map((page, index) => (
        <Link key={index} to={page.link}>
          {page.title}
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;
