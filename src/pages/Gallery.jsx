import { useState, useEffect, useRef } from 'react';
import {
  FaUpload,
  FaLock,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
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
    try {
      const q = query(
        collection(db, 'gallery'),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);

      const imgs = snapshot.docs.map((d) => ({
        firestoreId: d.id,
        ...d.data()
      }));

      setImages(imgs);
    } catch (err) {
      console.error(err);
    }
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

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setLoading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          { method: 'POST', body: formData }
        );

        const data = await res.json();
        if (!data.secure_url) return null;

        return {
          url: data.secure_url,
          likes: 0,
          createdAt: new Date().toISOString()
        };
      });

      const results = await Promise.all(uploadPromises);

      const validImages = results.filter(Boolean);

      await Promise.all(
        validImages.map((img) =>
          addDoc(collection(db, 'gallery'), img)
        )
      );

      await fetchImages();
      alert('Images uploaded successfully');
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this image?')) return;

    await deleteDoc(doc(db, 'gallery', id));
    setImages((prev) => prev.filter((i) => i.firestoreId !== id));
  };

  const handleLike = async (id) => {
    try {
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
    } catch (err) {
      console.error(err);
    }
  };

  const nextImage = () => {
    setSelectedIndex((prev) =>
      prev === null || prev >= images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setSelectedIndex((prev) =>
      prev === null || prev <= 0 ? images.length - 1 : prev - 1
    );
  };

  const toggleSelectImage = (id) => {
    setSelectedImages((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedImages((prev) =>
      prev.length === images.length
        ? []
        : images.map((i) => i.firestoreId)
    );
  };

  const handleDownload = async (url) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();

      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `temple-${Date.now()}.jpg`;

      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadAll = async () => {
    const files = images.filter((img) =>
      selectedImages.includes(img.firestoreId)
    );

    if (!files.length) return alert('Select images first');

    for (const img of files) {
      await handleDownload(img.url);
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
            multiple
            accept="image/*"
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
            {loading ? 'Uploading...' : 'Upload Images'}
          </button>
        </div>
      )}

      {images.length > 0 && (
        <div className="gallery-top-actions">
          <button onClick={handleSelectAll}>
            {selectedImages.length === images.length ? (
              <FaCheckSquare />
            ) : (
              <FaRegSquare />
            )}
            Select All
          </button>

          <button onClick={handleDownloadAll}>
            <FaDownload /> Download Selected
          </button>
        </div>
      )}

      <div className="image-grid">
        {images.map((img, index) => (
          <div key={img.firestoreId} className="image-card">

            <button
              className="select-image-btn"
              onClick={() => toggleSelectImage(img.firestoreId)}
            >
              {selectedImages.includes(img.firestoreId)
                ? <FaCheckSquare />
                : <FaRegSquare />}
            </button>

            <img
              src={img.url}
              alt="Temple"
              loading="lazy"
              onClick={() => setSelectedIndex(index)}
            />

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

      {selectedIndex !== null && (
        <div className="fullscreen-view">

          <button onClick={() => setSelectedIndex(null)}>
            <FaTimes />
          </button>

          <button onClick={prevImage}>
            <FaChevronLeft />
          </button>

          <img
            src={images[selectedIndex]?.url}
            alt="preview"
            className="fullscreen-image"
          />

          <button onClick={nextImage}>
            <FaChevronRight />
          </button>

        </div>
      )}

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