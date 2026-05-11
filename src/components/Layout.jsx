import { Outlet, NavLink } from 'react-router-dom';
import { FaHome, FaImage, FaDonate } from 'react-icons/fa';
import './Layout.css';

const Layout = () => {
  return (
    <>
      <header className="app-header">
        <h1>SRI NALLAMAGADU KUNTI GANGAMMA TEMPLE</h1>
        <p className="subtitle">DIVINE BLESSINGS</p>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="app-footer">
        <nav className="bottom-nav">
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <FaHome className="nav-icon" />
            <span>Home</span>
          </NavLink>
          <NavLink to="/gallery" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <FaImage className="nav-icon" />
            <span>Gallery</span>
          </NavLink>
          <NavLink to="/donations" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <FaDonate className="nav-icon" />
            <span>Donations</span>
          </NavLink>
        </nav>
        <div className="watermark">
          Design and developed by Ravi Thalla
        </div>
      </footer>
    </>
  );
};

export default Layout;
