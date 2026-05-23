import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Share2, MoreHorizontal } from 'lucide-react';
import './Pin.css';

const Pin = ({ pin }) => {
  const navigate = useNavigate();

  return (
    <div className="pin-container fade-in" onClick={() => navigate(`/pin/${pin._id}`)}>
      <div className="pin-image-wrapper">
        <img src={pin.imageUrl} alt={pin.title} className="pin-image" />
        <div className="pin-overlay">
          <div className="pin-overlay-top">
            <button className="btn-save" onClick={(e) => { e.stopPropagation(); /* handle save */ }}>Save</button>
          </div>
          <div className="pin-overlay-bottom">
            <div className="pin-overlay-icons">
              <button className="overlay-icon-btn"><Download size={18} /></button>
              <button className="overlay-icon-btn"><Share2 size={18} /></button>
              <button className="overlay-icon-btn"><MoreHorizontal size={18} /></button>
            </div>
          </div>
        </div>
      </div>
      <div className="pin-info" onClick={(e) => { e.stopPropagation(); navigate(`/profile/${pin.user?._id}`) }}>
        <img src={pin.user?.profileImage} alt={pin.user?.username} className="pin-user-img" />
        <span className="pin-user-name">{pin.user?.username}</span>
      </div>
    </div>
  );
};

export default Pin;
