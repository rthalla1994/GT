import { useEffect, useState } from 'react';

import {
  FaBell,
  FaCalendarAlt,
  FaClock,
  FaTimes
} from 'react-icons/fa';

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment
} from 'firebase/firestore';

import { db } from '../firebase';

import './Home.css';

const Home = () => {

  const [visitorCount, setVisitorCount] = useState({
    totalVisits: 0,
    uniqueVisitors: 0
  });

  const [showFestivalPopup, setShowFestivalPopup] = useState(true);

  // =========================
  // COUNTDOWN
  // =========================
  const calculateTimeLeft = () => {

    const festivalDate =
      new Date("2026-05-19T00:00:00");

    const difference =
      festivalDate - new Date();

    if (difference <= 0) {

      return {
        days: 0,
        hours: 0,
        minutes: 0
      };
    }

    return {
      days:
        Math.floor(
          difference / (1000 * 60 * 60 * 24)
        ),

      hours:
        Math.floor(
          (difference / (1000 * 60 * 60)) % 24
        ),

      minutes:
        Math.floor(
          (difference / 1000 / 60) % 60
        )
    };
  };

  const [timeLeft, setTimeLeft] =
    useState(calculateTimeLeft());

  useEffect(() => {

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000);

    return () => clearInterval(timer);

  }, []);

  // =========================
  // BELL SOUND
  // =========================
  useEffect(() => {

    const playBell = async () => {

      try {

        const alreadyPlayed =
          sessionStorage.getItem(
            'temple_bell_played'
          );

        if (alreadyPlayed) return;

        const audio =
          new Audio('/temple-bell.mp3');

        audio.volume = 0.7;

        await audio.play();

        sessionStorage.setItem(
          'temple_bell_played',
          'true'
        );

      } catch (err) {

        console.log(
          'Audio autoplay blocked'
        );
      }
    };

    setTimeout(playBell, 1200);

  }, []);

  // =========================
  // ANALYTICS
  // =========================
  useEffect(() => {

    const updateAnalytics = async () => {

      try {

        const analyticsRef = doc(
          db,
          'analytics',
          'visitors'
        );

        const analyticsSnap =
          await getDoc(analyticsRef);

        const alreadyVisited =
          localStorage.getItem(
            'temple_unique_visitor'
          );

        // FIRST TIME
        if (!analyticsSnap.exists()) {

          await setDoc(analyticsRef, {
            totalVisits: 1,
            uniqueVisitors: 1
          });

          setVisitorCount({
            totalVisits: 1,
            uniqueVisitors: 1
          });

          localStorage.setItem(
            'temple_unique_visitor',
            'true'
          );

        } else {

          // TOTAL VISITS
          await updateDoc(analyticsRef, {
            totalVisits: increment(1)
          });

          // UNIQUE VISITOR
          if (!alreadyVisited) {

            await updateDoc(analyticsRef, {
              uniqueVisitors: increment(1)
            });

            localStorage.setItem(
              'temple_unique_visitor',
              'true'
            );
          }

          // UPDATED DATA
          const updatedSnap =
            await getDoc(analyticsRef);

          setVisitorCount(
            updatedSnap.data()
          );
        }

      } catch (error) {

        console.error(
          'Analytics Error:',
          error
        );
      }
    };

    updateAnalytics();

  }, []);

  // =========================
  // NOTIFICATIONS
  // =========================
  const notifications = [
    {
      id: 1,
      text: "Sri Sri Sri Kunti Gangamma Jathara will be celebrated on 19th & 20th May 2026.",
      date: "19-05-2026",
      icon: <FaBell />
    },
    {
      id: 2,
      text: "Ammavari Abhishekam and Mangala Harathi at 7:30 AM.",
      date: "19th May 2026",
      icon: <FaCalendarAlt />
    },
    {
      id: 3,
      text: "Ammavari Uregimpu (Procession) starts at 7:00 PM.",
      date: "19th May 2026",
      icon: <FaBell />
    },
    {
      id: 4,
      text: "Annadanam (Food Distribution) will be organized for all devotees at 1:00 PM.",
      date: "20th May 2026",
      icon: <FaBell />
    },
    {
      id: 5,
      text: "Special Goddess Decoration and Band Procession from 5:00 PM.",
      date: "20th May 2026",
      icon: <FaCalendarAlt />
    }
  ];

  // =========================
  // TIMINGS
  // =========================
  const timings = [
    {
      name: "19th May - Temple Ritual",
      time: "7:00 AM"
    },
    {
      name: "19th May - Abhishekam & Harathi",
      time: "7:30 AM"
    },
    {
      name: "19th May - Pongallu",
      time: "4:00 PM"
    },
    {
      name: "19th May - Ammavari Procession",
      time: "7:00 PM"
    },
    {
      name: "20th May - Goddess Decoration",
      time: "Morning"
    },
    {
      name: "20th May - Band Procession",
      time: "5:00 PM"
    }
  ];

  return (

    <>

      {/* FESTIVAL POPUP */}
      {showFestivalPopup && (

        <div className="festival-popup-overlay">

          <div className="festival-popup">

            <button
              className="festival-close-btn"
              onClick={() => setShowFestivalPopup(false)}
            >
              <FaTimes />
            </button>

            <img
              src="/festival-banner.png"
              alt="Festival Banner"
              className="festival-popup-image"
            />

          </div>

        </div>
      )}

      <div className="home-container fade-in">

        {/* WELCOME */}
        <section className="welcome-section">

          <div className="temple-logo-wrapper">

            <img
              src="/temple-logo.png"
              alt="Temple Logo"
              className="temple-logo"
            />

          </div>

          <h2>
            Welcome Devotees
          </h2>

          <p>
            Welcome to Sri Kunti Gangamma
            Jathara celebrations.
            Stay updated with festival
            schedules, rituals, and
            announcements.
          </p>

        </section>

        {/* COUNTDOWN */}
        <section className="countdown-card">

          <h3>
            కుంట్టి గంగమ్మ జాతర ప్రారంభానికి
          </h3>

          <div className="countdown-grid">

            <div className="countdown-box">
              <h1>{timeLeft.days}</h1>
              <p>Days</p>
            </div>

            <div className="countdown-box">
              <h1>{timeLeft.hours}</h1>
              <p>Hours</p>
            </div>

            <div className="countdown-box">
              <h1>{timeLeft.minutes}</h1>
              <p>Minutes</p>
            </div>

          </div>

        </section>

        {/* VISITOR COUNT */}
        <section className="visitor-card">

          <div className="visit-box">

            <h3>Total Visits</h3>

            <h1>
              {visitorCount.totalVisits}
            </h1>

          </div>

          <div className="visit-box">

            <h3>Unique Devotees</h3>

            <h1>
              {visitorCount.uniqueVisitors}
            </h1>

          </div>

        </section>

        {/* TIMINGS */}
        <section className="card timings-card">

          <h3>
            <FaClock className="icon" />
            Festival Timings
          </h3>

          <ul>

            {timings.map((t, index) => (

              <li key={index}>

                <span className="timing-name">
                  {t.name}
                </span>

                <span className="timing-time">
                  {t.time}
                </span>

              </li>
            ))}

          </ul>

        </section>

        {/* NOTIFICATIONS */}
        <section className="notifications-section">

          <h3>
            Recent Notifications
          </h3>

          <div className="notification-list">

            {notifications.map(note => (

              <div
                key={note.id}
                className="notification-card"
              >

                <div className="notification-icon">
                  {note.icon}
                </div>

                <div className="notification-content">

                  <p>
                    {note.text}
                  </p>

                  <span className="notification-date">
                    {note.date}
                  </span>

                </div>

              </div>
            ))}

          </div>

        </section>

        {/* MAP */}
        <section className="card map-section">

          <h3>
            Temple Location
          </h3>

          <p className="map-text">
            Visit Sri Kunti Gangamma Temple
            during the Jathara celebrations.
          </p>

          <div className="map-container">

            <iframe
              title="Temple Location"
              src="https://www.google.com/maps?q=Sri%20Kunti%20Gangamma%20Temple&output=embed"
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>

          </div>

          <a
            href="https://maps.app.goo.gl/MCUSmmM1zy3Weonu8"
            target="_blank"
            rel="noopener noreferrer"
            className="map-btn"
          >
            Open in Google Maps
          </a>

        </section>

      </div>

    </>
  );
};

export default Home;