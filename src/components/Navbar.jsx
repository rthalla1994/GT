import {
    FaHome,
    FaImages,
    FaDonate
} from 'react-icons/fa';
import {
  FaHandHoldingHeart,
  FaWallet,
  FaBroadcastTower
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
            <button
  className={activeTab === 'expenses' ? 'active' : ''}
  onClick={() => setActiveTab('expenses')}
>
  <FaWallet />
  <span>Expenses</span>
</button>
<button
  className={activeTab === 'live' ? 'active' : ''}
  onClick={() => setActiveTab('live')}
>
  <FaBroadcastTower />
  <span>Live</span>
</button>
        </nav>
    );
};

export default Navbar;