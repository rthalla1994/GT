import { useEffect, useState } from 'react';
import {
  FaQrcode,
  FaUniversity,
  FaMobileAlt,
  FaHandHoldingHeart,
} from 'react-icons/fa';
import './Donations.css';

const Donations = () => {
  const [donors, setDonors] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    status: 'paid',
  });

  // Load saved donors from localStorage
  useEffect(() => {
    const savedDonors = localStorage.getItem('templeDonors');

    if (savedDonors) {
      setDonors(JSON.parse(savedDonors));
    }
  }, []);

  // Save donors to localStorage
  useEffect(() => {
    localStorage.setItem('templeDonors', JSON.stringify(donors));
  }, [donors]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.amount) return;

    const newDonor = {
      id: Date.now(),
      name: formData.name,
      amount: Number(formData.amount),
      status: formData.status,
    };

    setDonors([newDonor, ...donors]);

    setFormData({
      name: '',
      amount: '',
      status: 'paid',
    });
  };

  const totalAmount = donors.reduce(
    (sum, donor) => sum + donor.amount,
    0
  );

  return (
    <div className="donations-container fade-in">
      <div className="donations-header">
        <h2>Support the Temple</h2>
        <p>
          Your generous contributions help us maintain the temple and organize
          events.
        </p>
      </div>

      {/* Total Donation Card */}
      <div className="total-card">
        <FaHandHoldingHeart className="total-icon" />
        <div>
          <h3>Total Donations</h3>
          <h1>₹ {totalAmount.toLocaleString()}</h1>
        </div>
      </div>

      {/* Add Donor Form */}
      <div className="donor-form-card">
        <h3>Add Donor</h3>

        <form onSubmit={handleSubmit} className="donor-form">
          <input
            type="text"
            name="name"
            placeholder="Donor Name"
            value={formData.name}
            onChange={handleChange}
          />

          <input
            type="number"
            name="amount"
            placeholder="Donation Amount"
            value={formData.amount}
            onChange={handleChange}
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>

          <button type="submit">Add Donation</button>
        </form>
      </div>

      {/* Donor List */}
      <div className="donor-list-card">
        <h3>Donor List</h3>

        {donors.length === 0 ? (
          <p className="empty-text">No donations added yet.</p>
        ) : (
          <div className="donor-list">
            {donors.map((donor) => (
              <div
                key={donor.id}
                className={`donor-row ${donor.status === 'paid' ? 'paid' : 'pending'
                  }`}
              >
                <div>
                  <strong>{donor.name}</strong>
                </div>

                <div>₹ {donor.amount.toLocaleString()}</div>

                <div className="status">{donor.status}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Existing Donation Methods */}
      <div className="donation-methods">
        <div className="method-card secondary">
          <div className="method-icon-wrapper">
            <FaMobileAlt className="method-icon" />
          </div>

          <h3>Mobile Wallets</h3>

          <p>
            Send contributions to <strong>Govind - 9908747361</strong>
          </p>
          <p>Scan using any UPI App (GPay, PhonePe, Paytm)</p>
          <p className="upi-id">UPI ID: dikshithhethvik@okhdfcbank</p>
        </div>
      </div>
    </div>
  );
};

export default Donations;