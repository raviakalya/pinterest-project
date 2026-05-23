import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Masonry from 'react-masonry-css';
import Pin from '../components/Pin';
import EditProfileModal from '../components/EditProfileModal';
import './UserProfile.css';

const UserProfile = ({ currentUser }) => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('created');
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/api/users/${id}`);
        setProfile(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const breakpointColumnsObj = {
    default: 5,
    1100: 4,
    700: 3,
    500: 2
  };

  if (loading) return <div className="loader">Loading...</div>;
  if (!profile) return <div className="loader">User not found</div>;

  const displayPins = activeTab === 'created' ? profile.pins : profile.savedPins;

  return (
    <div className="profile-container fade-in">
      <div className="profile-header">
        <img src={profile.user.profileImage} alt={profile.user.username} className="profile-img" />
        <h1>{profile.user.username}</h1>
        <p className="profile-email">@{profile.user.email.split('@')[0]}</p>
        <p className="profile-bio">{profile.user.bio || 'No bio yet'}</p>
        
        <div className="profile-actions">
          {currentUser?.id === id && (
            <button className="btn btn-signup">Edit Profile</button>
          )}
          <button className="btn btn-signup">Share</button>
        </div>
      </div>

      <div className="profile-tabs">
        <button 
          className={activeTab === 'created' ? 'active' : ''} 
          onClick={() => setActiveTab('created')}
        >
          Created
        </button>
        <button 
          className={activeTab === 'saved' ? 'active' : ''} 
          onClick={() => setActiveTab('saved')}
        >
          Saved
        </button>
      </div>

      <div className="profile-content">
        {displayPins.length > 0 ? (
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {displayPins.map(pin => (
              <Pin key={pin._id} pin={pin} />
            ))}
          </Masonry>
        ) : (
          <div className="empty-state">
            <p>Nothing to show yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
