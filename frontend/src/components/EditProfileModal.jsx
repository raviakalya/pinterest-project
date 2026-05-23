import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { X, Camera } from 'lucide-react';
import './EditProfileModal.css';

const EditProfileModal = ({ user, onClose, onUpdate }) => {
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio || '');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(user.profileImage);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('username', username);
    formData.append('bio', bio);
    if (image) formData.append('profileImage', image);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.put('http://localhost:5000/api/users/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const updatedUser = {
        ...JSON.parse(localStorage.getItem('user')),
        username: res.data.username,
        profileImage: res.data.profileImage
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      onUpdate(res.data);
      toast.success('Profile updated!');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="edit-profile-modal fade-in">
        <div className="modal-header">
          <h2>Edit your profile</h2>
          <button className="close-btn" onClick={onClose}><X size={24} /></button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="edit-pfp-section">
            <div className="pfp-preview">
              <img src={preview} alt="Profile" />
              <label className="pfp-upload-label">
                <Camera size={20} />
                <input type="file" hidden onChange={handleImageChange} accept="image/*" />
              </label>
            </div>
            <span>Change photo</span>
          </div>

          <div className="edit-form-group">
            <label>Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>

          <div className="edit-form-group">
            <label>Bio</label>
            <textarea 
              value={bio} 
              onChange={(e) => setBio(e.target.value)} 
              placeholder="Tell your story"
              rows="4"
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-signup" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-login" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
