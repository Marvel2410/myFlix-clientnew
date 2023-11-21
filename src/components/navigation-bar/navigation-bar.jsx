import React from 'react';
import { Link } from 'react-router-dom';
import './navigation-bar.scss'

const NavigationBar = ({ user, onLoggedOut }) => {
  return (
    <div className="navbar">
      <div className="nav-left">
        {user ? (
          <>
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/profile" className="nav-link">Profile</Link>
          </>
        ) : null}
      </div>
      <div className="nav-right">
        {user ? (
          <Link to="/" className="nav-link" onClick={onLoggedOut}>Logout</Link>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="nav-link">Signup</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default NavigationBar;