import { useState, useEffect, useRef } from 'react';
import { FaUpload, FaLock, FaTimes } from 'react-icons/fa';
import './Gallery.css';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [passcode, setPasscode] = useState('');
  const fileInputRef = useRef(null);

  // Load images from local storage
  useEffect(() => {
    const savedImages = localStorage.getItem('temple_gallery');
    if (savedImages) {
      setImages(JSON.parse(savedImages));
    }
  }, []);

  // Save to local storage whenever images change
  useEffect(() => {
    localStorage.setItem('temple_gallery', JSON.stringify(images));
  }, [images]);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (passcode === '1234') {
      setIsAdmin(true);
      setShowAdminModal(false);
      setPasscode('');
    } else {
      alert('Incorrect passcode');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setImages([{ id: Date.now(), url: base64String }, ...images]);
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this image?")) {
      setImages(images.filter(img => img.id !== id));
    }
  };

  return (
    <div className="gallery-container fade-in">
      <div className="gallery-header">
        <h2>Temple Gallery</h2>
        {!isAdmin && (
          <button className="icon-btn" onClick={() => setShowAdminModal(true)} title="Admin Login">
            <FaLock />
          </button>
        )}
      </div>

      {isAdmin && (
        <div className="admin-controls">
          <p className="admin-badge">Admin Mode Active</p>
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            onChange={handleFileUpload} 
          />
          <button className="btn" onClick={() => fileInputRef.current.click()}>
            <FaUpload style={{ marginRight: '8px' }} /> Upload New Image
          </button>
        </div>
      )}

      {images.length === 0 ? (
        <div className="empty-state">
          <p>No images in the gallery yet.</p>
        </div>
      ) : (
        <div className="image-grid">
          {images.map(img => (
            <div key={img.id} className="image-card">
              <img src={img.url} alt="Temple" loading="lazy" />
              {isAdmin && (
                <button className="delete-btn" onClick={() => handleDelete(img.id)}>
                  <FaTimes />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Admin Login Modal */}
      {showAdminModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={() => setShowAdminModal(false)}><FaTimes /></button>
            <h3>Admin Access</h3>
            <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Passcode is 1234</p>
            <form onSubmit={handleAdminLogin}>
              <input 
                type="password" 
                className="input-field" 
                placeholder="Enter Passcode" 
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                autoFocus
              />
              <button type="submit" className="btn">Login</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
