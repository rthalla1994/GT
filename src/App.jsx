import { useEffect, useState } from 'react';
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

  useEffect(() => {
    const audio = new Audio(templeBell);

    audio.volume = 0.5;

    audio.play().catch(() => {
      console.log('Autoplay blocked');
    });

    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Splash Screen
  if (loading) {
    return (
      <div className="splash-screen">
        <div className="overlay"></div>

        <img
          src={loaderImage}
          alt="Temple"
          className="splash-image"
        />

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
      {/* Navbar / Tabs */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Page Content */}
      <main className="main-content">
        {activeTab === 'home' && <Home />}

        {activeTab === 'gallery' && <Gallery />}

        {activeTab === 'donations' && <Donations />}
      </main>
    </div>
  );
}

export default App;