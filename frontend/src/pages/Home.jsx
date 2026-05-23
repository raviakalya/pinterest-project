import React, { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import axios from 'axios';
import Pin from '../components/Pin';
import './Home.css';

const Home = () => {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchPins = async () => {
      try {
        const params = { userType: 'home', currentUserId: user?.id };
        const res = await api.get('/api/pins', { params });
        setPins(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPins();
  }, [user?.id]);

  const breakpointColumnsObj = {
    default: 6,
    1100: 4,
    700: 3,
    500: 2
  };

  if (loading) return <div className="loader">Loading...</div>;

  return (
    <div className="home-container">
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {pins.map(pin => (
          <Pin key={pin._id} pin={pin} />
        ))}
      </Masonry>
    </div>
  );
};

export default Home;
