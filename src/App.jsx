import { useEffect, useRef, useState } from 'react';
import './App.css';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Donations from './pages/Donations';

import loaderImage from './assets/temple-loader.jpeg';
import templeBell from './assets/temple-bell.mp3';

function App() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');

  const audioRef = useRef(null);
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    audioRef.current = new Audio(templeBell);
    audioRef.current.volume = 0.5;

    const playBell = () => {
      if (hasPlayedRef.current) return;

      hasPlayedRef.current = true;

      audioRef.current.play().catch((err) => {
        console.log("Audio blocked:", err);
      });

      if (navigator.vibrate) {
        navigator.vibrate(200);
      }
    };

    // Attach ONLY once on document body capture phase
    document.body.addEventListener('pointerdown', playBell, { once: true });

    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
      document.body.removeEventListener('pointerdown', playBell);
    };
  }, []);

  if (loading) {
    return (
      <div className="splash-screen">
        <div className="overlay"></div>

        <img src={loaderImage} alt="Temple" className="splash-image" />

        <h1 className="telugu-title">
          🙏 శ్రీ కుంటి గంగమ్మ జాతర 🙏
        </h1>

        <h2 className="english-title">
          Sri Kunti Gangamma Jathara
        </h2>

        <p className="splash-subtitle">
          Welcome Devotees
        </p>

        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="app-container">

      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="main-content">
        {activeTab === 'home' && <Home />}
        {activeTab === 'gallery' && <Gallery />}
        {activeTab === 'donations' && <Donations />}
      </main>

      <footer className="global-footer">
        <p>© 2026 Sri Kunti Gangamma Temple Committee, Nallamgadu</p>
        <span>Designed & Developed by Ravi Thalla</span>
      </footer>

    </div>
  );
}

export default App;