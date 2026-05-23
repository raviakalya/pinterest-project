import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Upload, X } from 'lucide-react';
import './CreatePin.css';

const CreatePin = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Other');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return toast.error('Please select an image');

    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('image', image);

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/pins', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      toast.success('Pin created successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create pin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-pin-container fade-in">
      <div className="create-pin-card">
        <form onSubmit={handleSubmit}>
          <div className="create-pin-layout">
            <div className="image-upload-section">
              {!preview ? (
                <label className="upload-label">
                  <div className="upload-placeholder">
                    <Upload size={48} color="var(--text-muted)" />
                    <p>Click to upload</p>
                    <span className="upload-hint">Use high-quality JPG, PNG, WEBP less than 20MB</span>
                  </div>
                  <input type="file" hidden onChange={handleImageChange} accept="image/*" />
                </label>
              ) : (
                <div className="preview-container">
                  <img src={preview} alt="Preview" />
                  <button type="button" className="remove-img" onClick={() => { setImage(null); setPreview(null); }}>
                    <X size={20} />
                  </button>
                </div>
              )}
            </div>

            <div className="pin-details-section">
              <input 
                type="text" 
                placeholder="Add your title" 
                className="title-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <textarea 
                placeholder="Tell everyone what your Pin is about" 
                className="desc-input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="category-select">
                <label>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option>Art</option>
                  <option>Food</option>
                  <option>Travel</option>
                  <option>Fashion</option>
                  <option>Home Decor</option>
                  <option>Technology</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="create-pin-footer">
                <button type="submit" className="btn-save" disabled={loading}>
                  {loading ? 'Creating...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePin;
