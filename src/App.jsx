import { useEffect, useState } from 'react';
import './App.css';

import Home from './pages/Home';
import Gallery from './pages/Gallery';

import loaderImage from './assets/temple-loader.jpg';
import templeBell from './assets/temple-bell.mp3';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Play bell sound
    const audio = new Audio(templeBell);

    audio.volume = 0.5;

    audio.play().catch(() => {
      console.log('Autoplay blocked by browser');
    });

    // Hide splash screen after 3 seconds
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

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
    <div>
      <Home />
      <Gallery />
    </div>
  );
}

export default App;