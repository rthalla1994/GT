import { FaBell, FaCalendarAlt, FaClock } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const notifications = [
    { id: 1, text: "Special Abhishekam this Friday at 6:00 AM.", date: "Today", icon: <FaBell /> },
    { id: 2, text: "Annual Brahmotsavam starts next month. Volunteers needed.", date: "Yesterday", icon: <FaCalendarAlt /> },
  ];

  const timings = [
    { name: "Morning Darshan", time: "6:00 AM - 12:00 PM" },
    { name: "Evening Darshan", time: "4:00 PM - 8:30 PM" },
  ];

  return (
    <div className="home-container fade-in">
      <section className="welcome-section">
        <h2>Welcome Devotees</h2>
        <p>Stay updated with the latest temple activities and timings.</p>
      </section>

      <section className="card timings-card">
        <h3><FaClock className="icon" /> Daily Timings</h3>
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
                <span className="notification-date">{note.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
