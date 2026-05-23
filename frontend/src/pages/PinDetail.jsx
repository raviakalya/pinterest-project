import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, Download, Heart, MessageCircle, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';
import './PinDetail.css';

const PinDetail = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pin, setPin] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPin = async () => {
      try {
        const res = await api.get(`/api/pins/${id}`);
        setPin(res.data);
      } catch (err) {
        toast.error('Failed to load pin');
      } finally {
        setLoading(false);
      }
    };
    fetchPin();
  }, [id]);

  const handleLike = async () => {
    if (!user) return navigate('/login');
    try {
      const res = await axios.post(`http://localhost:5000/api/pins/${id}/like`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPin({ ...pin, likes: res.data });
    } catch (err) {
      toast.error('Failed to like pin');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    if (!comment.trim()) return;

    try {
      const res = await axios.post(`http://localhost:5000/api/pins/${id}/comment`, { text: comment }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPin({ ...pin, comments: res.data });
      setComment('');
      toast.success('Comment added');
    } catch (err) {
      toast.error('Failed to add comment');
    }
  };

  if (loading) return <div className="loader">Loading...</div>;
  if (!pin) return <div className="loader">Pin not found</div>;

  return (
    <div className="pin-detail-container fade-in">
      <button className="back-btn" onClick={() => navigate(-1)}><ChevronLeft size={24} /></button>
      <div className="pin-detail-card">
        <div className="pin-detail-image">
          <img src={pin.imageUrl} alt={pin.title} />
        </div>
        <div className="pin-detail-content">
          <div className="pin-detail-header">
            <div className="header-actions">
              <button className="icon-btn"><Download size={24} /></button>
              <button className="icon-btn" onClick={handleLike}>
                <Heart size={24} fill={pin.likes.includes(user?.id) ? 'var(--primary-color)' : 'none'} color={pin.likes.includes(user?.id) ? 'var(--primary-color)' : 'currentColor'} />
              </button>
            </div>
            <button className="btn-save">Save</button>
          </div>

          <h1 className="pin-title">{pin.title}</h1>
          <p className="pin-desc">{pin.description}</p>

          <Link to={`/profile/${pin.user?._id}`} className="pin-creator">
            <img src={pin.user?.profileImage} alt={pin.user?.username} />
            <div>
              <h3>{pin.user?.username}</h3>
              <span>{pin.user?.bio || 'Creator'}</span>
            </div>
          </Link>

          <div className="comments-section">
            <h2>Comments ({pin.comments.length})</h2>
            <div className="comments-list">
              {pin.comments.map((c, i) => (
                <div key={i} className="comment-item">
                  <img src={c.user?.profileImage} alt={c.user?.username} />
                  <div className="comment-info">
                    <span className="comment-user">{c.user?.username}</span>
                    <p className="comment-text">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
            {user && (
              <form className="comment-form" onSubmit={handleComment}>
                <img src={user.profileImage} alt={user.username} />
                <input 
                  type="text" 
                  placeholder="Add a comment" 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button type="submit"><Send size={20} /></button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinDetail;
