import { useState, useEffect, useRef } from 'react';
import { FaUpload, FaLock, FaTimes } from 'react-icons/fa';

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from 'firebase/firestore';

import { db } from '../firebase';

import './Gallery.css';

const CLOUD_NAME = 'dkc7lk6qs';
const UPLOAD_PRESET = 'temple_gallery';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const querySnapshot = await getDocs(collection(db, 'gallery'));

    const imgs = [];

    querySnapshot.forEach((docSnap) => {
      imgs.push({
        firestoreId: docSnap.id,
        ...docSnap.data()
      });
    });

    setImages(imgs.reverse());
  };

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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      const data = await response.json();

      const newImage = {
        id: Date.now(),
        url: data.secure_url,
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'gallery'), newImage);

      fetchImages();

      alert('Image uploaded successfully');
    } catch (error) {
      console.error(error);
      alert('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (firestoreId) => {
    if (window.confirm('Delete this image?')) {
      await deleteDoc(doc(db, 'gallery', firestoreId));

      fetchImages();
    }
  };

  return (
    <div className="gallery-container fade-in">
      <div className="gallery-header">
        <h2>Temple Gallery</h2>

        {!isAdmin && (
          <button
            className="icon-btn"
            onClick={() => setShowAdminModal(true)}
            title="Admin Login"
          >
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

          <button
            className="btn"
            onClick={() => fileInputRef.current.click()}
            disabled={loading}
          >
            <FaUpload style={{ marginRight: '8px' }} />

            {loading ? 'Uploading...' : 'Upload New Image'}
          </button>
        </div>
      )}

      {images.length === 0 ? (
        <div className="empty-state">
          <p>No images in the gallery yet.</p>
        </div>
      ) : (
        <div className="image-grid">
          {images.map((img) => (
            <div key={img.firestoreId} className="image-card">
              <img
                src={img.url}
                alt="Temple"
                loading="lazy"
              />

              {isAdmin && (
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(img.firestoreId)}
                >
                  <FaTimes />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {showAdminModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="close-modal"
              onClick={() => setShowAdminModal(false)}
            >
              <FaTimes />
            </button>

            <h3>Admin Access</h3>

            <form onSubmit={handleAdminLogin}>
              <input
                type="password"
                className="input-field"
                placeholder="Enter Passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                autoFocus
              />

              <button type="submit" className="btn">
                Login
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;