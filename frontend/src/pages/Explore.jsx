import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Masonry from 'react-masonry-css';
import axios from 'axios';
import Pin from '../components/Pin';
import './Explore.css';

const categories = [
  { name: 'All', image: 'https://images.unsplash.com/photo-1540553016722-983e48a2cd10?auto=format&fit=crop&w=800&q=80' },
  { name: 'Art', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=400&q=80' },
  { name: 'Food', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80' },
  { name: 'Travel', image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=400&q=80' },
  { name: 'Fashion', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=400&q=80' },
  { name: 'Home Decor', image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=800&q=80' },
  { name: 'Technology', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80' }
];

const Explore = () => {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const user = JSON.parse(localStorage.getItem('user'));
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const searchTerm = queryParams.get('search');

  useEffect(() => {
    const fetchPins = async () => {
      setLoading(true);
      try {
        const params = { 
          userType: 'explore', 
          currentUserId: user?.id,
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          search: searchTerm || undefined
        };
        const res = await api.get('/api/pins', { params });
        setPins(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPins();
  }, [selectedCategory, user?.id, searchTerm]);

  const breakpointColumnsObj = {
    default: 6,
    1100: 4,
    700: 3,
    500: 2
  };

  return (
    <div className="explore-container">
      <div className="explore-header">
        <h1>Explore the best of Pinterest</h1>
        <div className="category-tiles">
          {categories.map((cat) => (
            <div 
              key={cat.name} 
              className={`category-tile ${selectedCategory === cat.name ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.name)}
            >
              <img src={cat.image} alt={cat.name} />
              <div className="category-tile-overlay">
                <span>{cat.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="explore-content">
        {loading ? (
          <div className="loader">Loading inspiration...</div>
        ) : pins.length > 0 ? (
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {pins.map(pin => (
              <div key={pin._id} className="pin-with-category">
                <Pin pin={pin} />
                <div className="pin-category-tag">{pin.category}</div>
              </div>
            ))}
          </Masonry>
        ) : (
          <div className="empty-state">No pins found in this category.</div>
        )}
      </div>
    </div>
  );
};

export default Explore;
