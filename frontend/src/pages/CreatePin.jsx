import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { ImagePlus, Upload, X } from 'lucide-react';
import './CreatePin.css';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const CreatePin = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Other');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const titleLength = useMemo(() => title.trim().length, [title]);
  const descLength = description.length;
  const isReadyToSubmit = title.trim().length > 0 && Boolean(image) && !loading;

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const revokePreview = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
  };

  const resetImage = () => {
    revokePreview();
    setImage(null);
    setPreview('');
    setErrorMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const processSelectedFile = (file) => {
    setErrorMessage('');

    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrorMessage('Please choose a JPG, PNG, WEBP, or GIF image.');
      toast.error('Unsupported file type');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage('Image must be 10MB or smaller.');
      toast.error('Image is too large');
      return;
    }

    revokePreview();
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);

    const file = event.dataTransfer.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage('Please add a title for your pin.');
      toast.error('Add a title before publishing');
      return;
    }

    if (!image) {
      setErrorMessage('Please choose an image to upload.');
      toast.error('Please select an image');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('description', description.trim());
    formData.append('category', category);
    formData.append('image', image);

    try {
      await api.post('/api/pins', formData);
      toast.success('Pin created successfully!');
      navigate('/');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create pin. Please try again.';
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-pin-container fade-in">
      <div className="create-pin-card">
        <div className="create-pin-header">
          <div>
            <p className="eyebrow">Create a new pin</p>
            <h1>Share your next inspiration</h1>
          </div>
          <p className="header-copy">
            Add a photo, a title, and a little context so your idea is easy to discover.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="create-pin-layout">
          <div className="image-upload-section">
            <div
              className={`upload-dropzone ${dragActive ? 'drag-active' : ''} ${preview ? 'has-preview' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {preview ? (
                <>
                  <img src={preview} alt="Selected preview" className="preview-image" />
                  <div className="preview-overlay">
                    <div>
                      <p className="preview-label">Preview ready</p>
                      <p className="preview-file-name">{image?.name}</p>
                    </div>
                    <button type="button" className="remove-img" onClick={resetImage} aria-label="Remove image">
                      <X size={18} />
                    </button>
                  </div>
                </>
              ) : (
                <label className="upload-label" htmlFor="pin-image-input">
                  <div className="upload-placeholder">
                    <div className="upload-icon-wrap">
                      <ImagePlus size={32} />
                    </div>
                    <p>Drag and drop an image</p>
                    <span className="upload-hint">or click to browse (JPG, PNG, WEBP, GIF · up to 10MB)</span>
                  </div>
                  <input
                    id="pin-image-input"
                    ref={fileInputRef}
                    type="file"
                    hidden
                    onChange={handleImageChange}
                    accept="image/jpeg,image/png,image/webp,image/gif"
                  />
                </label>
              )}
            </div>
          </div>

          <div className="pin-details-section">
            <div className="field-block">
              <label htmlFor="pin-title">Title</label>
              <input
                id="pin-title"
                type="text"
                placeholder="Add a catchy title"
                className="title-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={80}
              />
              <div className="field-meta">
                <span>{titleLength}/80 characters</span>
              </div>
            </div>

            <div className="field-block">
              <label htmlFor="pin-description">Description</label>
              <textarea
                id="pin-description"
                placeholder="Tell everyone what your pin is about"
                className="desc-input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={300}
              />
              <div className="field-meta">
                <span>{descLength}/300 characters</span>
              </div>
            </div>

            <div className="field-block">
              <label htmlFor="pin-category">Category</label>
              <select id="pin-category" value={category} onChange={(e) => setCategory(e.target.value)} className="category-select">
                <option>Art</option>
                <option>Food</option>
                <option>Travel</option>
                <option>Fashion</option>
                <option>Home Decor</option>
                <option>Technology</option>
                <option>Other</option>
              </select>
            </div>

            <div className="form-status-row">
              <div>
                <p className="status-label">Upload status</p>
                <p className="status-copy">
                  {image ? `Selected: ${image.name}` : 'No image selected yet'}
                </p>
              </div>
              <div className="save-hint">
                <Upload size={16} />
                <span>{loading ? 'Publishing…' : 'Ready to publish'}</span>
              </div>
            </div>

            {errorMessage && <p className="form-error">{errorMessage}</p>}

            <div className="create-pin-footer">
              <button type="button" className="btn btn-signup" onClick={() => navigate('/')}>
                Cancel
              </button>
              <button type="submit" className="btn-save" disabled={!isReadyToSubmit}>
                {loading ? 'Creating...' : 'Publish pin'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePin;
