import { useState, useEffect, useRef } from 'react';
import {
  FaUpload,
  FaLock,
  FaTimes,
  FaDownload,
  FaHeart,
  FaCheckSquare,
  FaRegSquare
} from 'react-icons/fa';

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  increment,
  query,
  orderBy
} from 'firebase/firestore';

import { db } from '../firebase';
import './Gallery.css';

const CLOUD_NAME = 'dkc7lk6qs';
const UPLOAD_PRESET = 'temple_gallery';
const ADMIN_PASSCODE = import.meta.env.VITE_ADMIN_PASSCODE || '7082';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    const imgs = snapshot.docs.map((d) => ({
      firestoreId: d.id,
      ...d.data()
    }));

    setImages(imgs);
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();

    if (passcode === ADMIN_PASSCODE) {
      setIsAdmin(true);
      setShowAdminModal(false);
      setPasscode('');
    } else {
      alert('Incorrect passcode');
    }
  };

  // =========================
  // UPLOAD IMAGE + VIDEO
  // =========================
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setLoading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);

        const isVideo = file.type.startsWith("video/");

        const uploadUrl = isVideo
          ? `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`
          : `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

        const res = await fetch(uploadUrl, {
          method: 'POST',
          body: formData
        });

        const data = await res.json();

        if (!data.secure_url) return null;

        return {
          url: data.secure_url,
          type: isVideo ? "video" : "image",
          likes: 0,
          createdAt: new Date().toISOString()
        };
      });

      const results = await Promise.all(uploadPromises);
      const validMedia = results.filter(Boolean);

      await Promise.all(
        validMedia.map((item) =>
          addDoc(collection(db, 'gallery'), item)
        )
      );

      await fetchImages();
      alert('Media uploaded successfully');
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;

    await deleteDoc(doc(db, 'gallery', id));
    setImages((prev) => prev.filter((i) => i.firestoreId !== id));
  };

  const handleLike = async (id) => {
    await updateDoc(doc(db, 'gallery', id), {
      likes: increment(1)
    });

    setImages((prev) =>
      prev.map((img) =>
        img.firestoreId === id
          ? { ...img, likes: (img.likes || 0) + 1 }
          : img
      )
    );
  };

  const handleDownload = async (url) => {
    const res = await fetch(url);
    const blob = await res.blob();

    const blobUrl = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = `temple-${Date.now()}`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(blobUrl);
  };

  return (
    <div className="gallery-container fade-in">

      {/* HEADER */}
      <div className="gallery-header">
        <h2>Temple Gallery</h2>

        {!isAdmin && (
          <button
            className="icon-btn"
            onClick={() => setShowAdminModal(true)}
          >
            <FaLock />
          </button>
        )}
      </div>

      {/* ADMIN UPLOAD */}
      {isAdmin && (
        <div className="admin-controls">
          <p className="admin-badge">Admin Mode Active</p>

          <input
            type="file"
            multiple
            accept="image/*,video/*"
            ref={fileInputRef}
            hidden
            onChange={handleFileUpload}
          />

          <button
            className="btn"
            onClick={() => fileInputRef.current.click()}
            disabled={loading}
          >
            <FaUpload style={{ marginRight: 8 }} />
            {loading ? 'Uploading...' : 'Upload Media'}
          </button>
        </div>
      )}

      {/* GRID */}
      <div className="image-grid">
        {images.map((img, index) => (
          <div key={img.firestoreId} className="image-card">

            {img.type === "video" ? (
              <video
                src={img.url}
                controls
                className="gallery-video"
              />
            ) : (
              <img
                src={img.url}
                alt="Temple"
                loading="lazy"
                onClick={() => setSelectedIndex(index)}
              />
            )}

            <div className="image-actions">
              <button onClick={() => handleLike(img.firestoreId)}>
                <FaHeart /> {img.likes || 0}
              </button>

              <button onClick={() => handleDownload(img.url)}>
                <FaDownload />
              </button>

              {isAdmin && (
                <button onClick={() => handleDelete(img.firestoreId)}>
                  <FaTimes />
                </button>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* =========================
          MODERN SWIPE FULLSCREEN
      ========================= */}
      {selectedIndex !== null && (
        <div className="fullscreen-view-modern">

          <button
            className="close-btn"
            onClick={() => setSelectedIndex(null)}
          >
            <FaTimes />
          </button>

          <div className="swipe-container">
            <div
              className="swipe-track"
              style={{
                transform: `translateX(-${selectedIndex * 100}%)`
              }}
            >
              {images.map((img) => (
                <div key={img.firestoreId} className="swipe-item">

                  {img.type === "video" ? (
                    <video
                      src={img.url}
                      className="swipe-media"
                      controls
                      autoPlay
                      playsInline
                    />
                  ) : (
                    <img
                      src={img.url}
                      alt="preview"
                      className="swipe-media"
                    />
                  )}

                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ADMIN LOGIN */}
      {showAdminModal && (
        <div className="modal-overlay">
          <div className="modal-content">

            <button onClick={() => setShowAdminModal(false)}>
              <FaTimes />
            </button>

            <h3>Admin Access</h3>

            <form onSubmit={handleAdminLogin}>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter Passcode"
              />

              <button type="submit">Login</button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default Gallery;