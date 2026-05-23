import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell, MessageCircle, User, Plus, LogOut } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      const path = location.pathname === '/explore' ? '/explore' : '/';
      navigate(`${path}?search=${searchTerm}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="logo">
          <svg viewBox="0 0 24 24" width="32" height="32" fill="var(--primary-color)">
            <path d="M0 12c0 5.123 3.211 9.497 7.73 11.218-.11-.937-.227-2.482.025-3.566.217-.932 1.401-5.938 1.401-5.938s-.357-.715-.357-1.774c0-1.66 1.007-2.9 2.178-2.9 1.026 0 1.521.771 1.521 1.692 0 1.031-.667 2.571-.992 4.002-.283 1.196.599 2.169 1.777 2.169 2.134 0 3.771-2.249 3.771-5.494 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.261 7.929-7.261 4.162 0 7.397 2.966 7.397 6.93 0 4.135-2.607 7.462-6.223 7.462-1.215 0-2.358-.631-2.75-1.37l-.749 2.847c-.269 1.045-1.002 2.352-1.492 3.146C9.537 23.815 10.741 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12z" />
          </svg>
        </Link>
        <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Home</NavLink>
        <NavLink to="/explore" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Explore</NavLink>
        <NavLink to="/create" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Create</NavLink>
      </div>

      <div className="nav-center">
        <form onSubmit={handleSearch} className="search-bar">
          <Search size={18} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Search for designs, food, style..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      </div>

      <div className="nav-right">
        {user ? (
          <>
            <button className="nav-icon-btn"><Bell size={24} /></button>
            <button className="nav-icon-btn"><MessageCircle size={24} /></button>
            <Link to={`/profile/${user.id}`} className="nav-profile-btn">
              <img src={user.profileImage} alt="Profile" />
            </Link>
            <button onClick={onLogout} className="nav-icon-btn"><LogOut size={24} /></button>
          </>
        ) : (
          <div className="nav-auth">
            <Link to="/login" className="btn btn-login">Log in</Link>
            <Link to="/register" className="btn btn-signup">Sign up</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
