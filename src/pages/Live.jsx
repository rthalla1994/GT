import { useEffect, useState } from 'react';

import {
  doc,
  getDoc,
  setDoc
} from 'firebase/firestore';

import {
  FaBroadcastTower,
  FaLock
} from 'react-icons/fa';

import { db } from '../firebase';

import './Live.css';

const Live = () => {

  const [liveUrl, setLiveUrl] = useState('');

  const [isLive, setIsLive] = useState(false);

  const [loading, setLoading] = useState(true);

  const [isAdmin, setIsAdmin] = useState(false);

  const [showLogin, setShowLogin] = useState(false);

  const [passcode, setPasscode] = useState('');

  const [inputUrl, setInputUrl] = useState('');

  // =========================
  // FETCH LIVE SETTINGS
  // =========================
  useEffect(() => {

    const fetchLiveData = async () => {

      try {

        const ref = doc(
          db,
          'settings',
          'liveStream'
        );

        const snap = await getDoc(ref);

        if (snap.exists()) {

          const data = snap.data();

          setLiveUrl(data.youtubeUrl || '');

          setInputUrl(data.youtubeUrl || '');

          setIsLive(data.isLive || false);

        }

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);

      }
    };

    fetchLiveData();

  }, []);

  // =========================
  // ADMIN LOGIN
  // =========================
  const handleLogin = (e) => {

    e.preventDefault();

    if (passcode === '7082') {

      setIsAdmin(true);

      setShowLogin(false);

    } else {

      alert('Incorrect passcode');

    }
  };

  // =========================
  // SAVE LIVE SETTINGS
  // =========================
  const handleSave = async () => {

    try {

      await setDoc(
        doc(db, 'settings', 'liveStream'),
        {
          youtubeUrl: inputUrl,
          isLive
        }
      );

      setLiveUrl(inputUrl);

      alert('Live stream updated');

    } catch (err) {

      console.log(err);

      alert('Unable to save');

    }
  };

  // =========================
  // EXTRACT VIDEO ID
  // =========================
  const getVideoId = (url) => {

    try {

      const parsed = new URL(url);

      return parsed.searchParams.get('v');

    } catch {

      return '';

    }
  };

  const videoId = getVideoId(liveUrl);

  // =========================
  // LOADING
  // =========================
  if (loading) {

    return (
      <div className="live-loading">
        Loading Live Stream...
      </div>
    );
  }

  return (
    <div className="live-container fade-in">

      {/* HEADER */}
      <div className="live-header">

        <h2>
          🔴 Live Streaming
        </h2>

        <p>
          Watch Sri Kunti Gangamma Jathara Live
        </p>

      </div>

      {/* ADMIN BUTTON */}
      {!isAdmin && (

        <button
          className="live-admin-btn"
          onClick={() => setShowLogin(true)}
        >

          <FaLock />

          Admin Login

        </button>

      )}

      {/* LOGIN */}
      {showLogin && (

        <div className="live-login-card">

          <h3>Admin Access</h3>

          <form onSubmit={handleLogin}>

            <input
              type="password"
              placeholder="Enter Passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
            />

            <button type="submit">
              Login
            </button>

          </form>

        </div>

      )}

      {/* ADMIN CONTROLS */}
      {isAdmin && (

        <div className="live-admin-panel">

          <h3>
            Live Stream Controls
          </h3>

          <input
            type="text"
            placeholder="Paste YouTube Live URL"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
          />

          <label className="live-toggle">

            <input
              type="checkbox"
              checked={isLive}
              onChange={(e) => setIsLive(e.target.checked)}
            />

            Stream Currently Live

          </label>

          <button onClick={handleSave}>

            <FaBroadcastTower />

            Save Live Stream

          </button>

        </div>

      )}

      {/* LIVE STREAM */}
      {isLive && videoId ? (

        <div className="live-video-wrapper">

          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title="Temple Live Stream"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>

        </div>

      ) : (

        <div className="live-offline-card">

          <h3>
            🔴 Live Stream Offline
          </h3>

          <p>
            Live event has not started yet.
          </p>

        </div>

      )}

    </div>
  );
};

export default Live;