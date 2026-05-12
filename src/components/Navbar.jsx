import {
    FaHome,
    FaImages,
    FaDonate
} from 'react-icons/fa';

import './Navbar.css';

const Navbar = ({ activeTab, setActiveTab }) => {
    return (
        <nav className="bottom-nav">
            <button
                className={activeTab === 'home' ? 'active' : ''}
                onClick={() => setActiveTab('home')}
            >
                <FaHome />
                <span>Home</span>
            </button>

            <button
                className={activeTab === 'gallery' ? 'active' : ''}
                onClick={() => setActiveTab('gallery')}
            >
                <FaImages />
                <span>Gallery</span>
            </button>

            <button
                className={activeTab === 'donations' ? 'active' : ''}
                onClick={() => setActiveTab('donations')}
            >
                <FaDonate />
                <span>Donations</span>
            </button>
        </nav>
    );
};

export default Navbar;