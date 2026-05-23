import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Login from './pages/Login';
import Register from './pages/Register';
import PinDetail from './pages/PinDetail';
import CreatePin from './pages/CreatePin';
import UserProfile from './pages/UserProfile';
import './App.css';

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <Router>
      <div className="App">
        <Navbar user={user} onLogout={handleLogout} />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/login" element={user ? <Navigate to="/" /> : <Login setUser={setUser} />} />
            <Route path="/register" element={user ? <Navigate to="/" /> : <Register setUser={setUser} />} />
            <Route path="/pin/:id" element={<PinDetail user={user} />} />
            <Route path="/create" element={user ? <CreatePin /> : <Navigate to="/login" />} />
            <Route path="/profile/:id" element={<UserProfile currentUser={user} />} />
          </Routes>
        </main>
        <Toaster position="bottom-center" />
      </div>
    </Router>
  );
}

export default App;
