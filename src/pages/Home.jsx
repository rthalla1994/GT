import { FaBell, FaCalendarAlt, FaClock } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const notifications = [
    {
      id: 1,
      text: "Sri Sri Sri Kunti Gangamma Jathara will be celebrated on 19th & 20th May 2026.",
      date: "19-05-2026",
      icon: <FaBell />
    },
    {
      id: 2,
      text: "Ammavari Abhishekam and Mangala Harathi at 7:30 PM.",
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

  const timings = [
    {
      name: "19th May - Temple Ritual",
      time: "7:00 PM"
    },
    {
      name: "19th May - Abhishekam & Harathi",
      time: "7:30 PM"
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
    <div className="home-container fade-in">
      <section className="welcome-section">
        <h2>Welcome Devotees</h2>
        <p>
          Welcome to Sri Kunti Gangamma Jathara celebrations.
          Stay updated with festival schedules, rituals, and announcements.
        </p>
      </section>

      <section className="card timings-card">
        <h3>
          <FaClock className="icon" /> Festival Timings
        </h3>

        <ul>
          {timings.map((t, index) => (
            <li key={index}>
              <span className="timing-name">{t.name}</span>
              <span className="timing-time">{t.time}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="notifications-section">
        <h3>Recent Notifications</h3>

        <div className="notification-list">
          {notifications.map(note => (
            <div key={note.id} className="notification-card">
              <div className="notification-icon">
                {note.icon}
              </div>

              <div className="notification-content">
                <p>{note.text}</p>

                <span className="notification-date">
                  {note.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="card map-section">
        <h3>Temple Location</h3>

        <p className="map-text">
          Visit Sri Kunti Gangamma Temple during the Jathara celebrations.
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
  );
};

export default Home;