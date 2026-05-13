import { useEffect, useState } from 'react';

import {
  FaMobileAlt,
  FaHandHoldingHeart,
  FaLock,
  FaTimes,
  FaEdit,
  FaTrash
} from 'react-icons/fa';

import './Donations.css';

const Donations = () => {

  const initialDonors = [
    { id: 1, name: "Yugandar Naidu", amount: 20001, status: "paid" },
    { id: 2, name: "T Govind", amount: 10116, status: "paid" },
    { id: 3, name: "T Reddeppa", amount: 11011, status: "paid" },
    { id: 4, name: "Mohan devendra", amount: 1116, status: "pending" },
    { id: 5, name: "Nobul Kumar", amount: 2116, status: "pending" },
    { id: 6, name: "Gnanendra", amount: 5116, status: "pending" },
    { id: 7, name: "Hema Naidu", amount: 5116, status: "pending" },
    { id: 8, name: "Ravi Thalla", amount: 7777, status: "pending" },
    { id: 9, name: "Venkatesulu", amount: 2222, status: "paid" },
    { id: 10, name: "Chakravarthy", amount: 2116, status: "paid" },
    { id: 11, name: "Bhanu", amount: 1116, status: "paid" },
    { id: 12, name: "K Vedavathi", amount: 1116, status: "paid" },
    { id: 13, name: "Sreenu", amount: 1116, status: "pending" },
    { id: 14, name: "Haribabu", amount: 1116, status: "pending" },
    { id: 15, name: "Surendra", amount: 1116, status: "pending" },
    { id: 16, name: "Devandra", amount: 1116, status: "pending" },
    { id: 17, name: "Hemadri", amount: 1116, status: "pending" },
    { id: 18, name: "Uday", amount: 1116, status: "pending" },
    { id: 19, name: "Prakash", amount: 2116, status: "paid" },
    { id: 20, name: "Mahesh", amount: 1116, status: "pending" },
    { id: 21, name: "Kumaraswamy", amount: 1116, status: "pending" },
    { id: 22, name: "Krishnaiah", amount: 2116, status: "pending" },
    { id: 23, name: "Chandu", amount: 1116, status: "pending" },
    { id: 24, name: "MudduSwamy", amount: 2116, status: "pending" },
    { id: 25, name: "Rajamanikyam", amount: 5116, status: "pending" },
    { id: 26, name: "Gowramma", amount: 1116, status: "paid" },
    { id: 27, name: "J Venkatesh", amount: 1116, status: "pending" },
    { id: 28, name: "J Ramadevi", amount: 1116, status: "paid" },
    { id: 29, name: "J Vijaya", amount: 1116, status: "pending" },
    { id: 30, name: "J Sunil", amount: 1116, status: "pending" },
    { id: 31, name: "J Subramanyam", amount: 1116, status: "pending" },
    { id: 32, name: "J SadhaSiva", amount: 1116, status: "pending" },
    { id: 33, name: "Indrani", amount: 1116, status: "pending" },
    { id: 34, name: "T Anand", amount: 1116, status: "pending" },
    { id: 35, name: "Mohan Reddy", amount: 1116, status: "paid" },
    { id: 36, name: "V Ashok Kumar", amount: 1116, status: "paid" },
    { id: 37, name: "Krishnaveni", amount: 1116, status: "pending" },
    { id: 38, name: "Kalyani", amount: 1116, status: "pending" },
    { id: 39, name: "Om Prakash", amount: 1116, status: "paid" },
    { id: 40, name: "T Subramanyam", amount: 1116, status: "pending" },
    { id: 41, name: "B Damodharam", amount: 1116, status: "pending" },
    { id: 42, name: "M Subramanyam", amount: 1116, status: "pending" },
    { id: 43, name: "M Munirajulu", amount: 1116, status: "pending" },
    { id: 44, name: "V Devarajulu", amount: 1116, status: "pending" },
  ];

  const [donors, setDonors] = useState([]);

  const [isAdmin, setIsAdmin] = useState(false);

  const [showAdminModal, setShowAdminModal] = useState(false);

  const [passcode, setPasscode] = useState('');

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    status: 'paid',
  });

  // Load donors
  useEffect(() => {

    const savedDonors =
      localStorage.getItem('templeDonors');

    if (
      savedDonors &&
      JSON.parse(savedDonors).length > 0
    ) {

      setDonors(JSON.parse(savedDonors));

    } else {

      setDonors(initialDonors);

      localStorage.setItem(
        'templeDonors',
        JSON.stringify(initialDonors)
      );
    }

  }, []);


  // Admin Login
  const handleAdminLogin = (e) => {
    e.preventDefault();

    if (passcode === '7082') {
      setIsAdmin(true);
      setShowAdminModal(false);
      setPasscode('');
    } else {
      alert('Incorrect passcode');
    }
  };

  // Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Add / Update Donor
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.amount) {
      return;
    }

    let updatedDonors = [];

    // UPDATE
    if (editingId !== null) {

      updatedDonors = donors.map((donor) =>
        donor.id === editingId
          ? {
            ...donor,
            name: formData.name,
            amount: Number(formData.amount),
            status: formData.status,
          }
          : donor
      );

      setDonors(updatedDonors);

      localStorage.setItem(
        'templeDonors',
        JSON.stringify(updatedDonors)
      );

      setEditingId(null);

    } else {

      // ADD
      const newDonor = {
        id: Date.now(),
        name: formData.name,
        amount: Number(formData.amount),
        status: formData.status,
      };

      updatedDonors = [newDonor, ...donors];

      setDonors(updatedDonors);

      localStorage.setItem(
        'templeDonors',
        JSON.stringify(updatedDonors)
      );
    }

    setFormData({
      name: '',
      amount: '',
      status: 'paid',
    });
  };

  // Edit Donor
  const handleEdit = (donor) => {

    setEditingId(donor.id);

    setFormData({
      name: donor.name || '',
      amount: donor.amount || '',
      status: donor.status || 'pending',
    });

    // Scroll to top form
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Delete Donor
  const handleDelete = (id) => {

    const confirmDelete = window.confirm(
      'Delete this donor?'
    );

    if (confirmDelete) {

      const updatedDonors = donors.filter(
        (donor) => donor.id !== id
      );

      setDonors(updatedDonors);

      localStorage.setItem(
        'templeDonors',
        JSON.stringify(updatedDonors)
      );
    }
  };

  // Total
  const totalAmount = donors.reduce(
    (sum, donor) => sum + donor.amount,
    0
  );

  return (
    <div className="donations-container fade-in">

      {/* Header */}
      <div className="donations-header">
        <h2>Temple Donations</h2>

        <p>
          Your generous support helps us organize
          Sri Kunti Gangamma Jathara celebrations.
        </p>
      </div>

      {/* Total Card */}
      <div className="total-card">
        <FaHandHoldingHeart className="total-icon" />

        <div>
          <p>Total Donations</p>

          <h1>₹ {totalAmount.toLocaleString()}</h1>
        </div>
      </div>

      {/* Wallet Details */}
      <div className="wallet-card">

        <div className="wallet-header">
          <FaMobileAlt className="wallet-icon" />

          <h3>Mobile Wallet / UPI</h3>
        </div>

        <div className="wallet-details">

          <p>
            <strong>Name:</strong> Govind
          </p>

          <p>
            <strong>Phone:</strong> 9908747361
          </p>

          <p className="upi-box">
            dikshithhethvik@okhdfcbank
          </p>

          <p className="wallet-note">
            Use Google Pay, PhonePe, Paytm
            or any UPI app to contribute.
          </p>

        </div>
      </div>

      {/* Admin Login */}
      {!isAdmin && (
        <button
          className="admin-btn"
          onClick={() => setShowAdminModal(true)}
        >
          <FaLock />
          Admin Login
        </button>
      )}

      {/* Admin Form */}
      {isAdmin && (
        <div className="donor-form-card">

          <h3>
            {editingId
              ? 'Edit Donor'
              : 'Add Donor'}
          </h3>

          <form
            onSubmit={handleSubmit}
            className="donor-form"
          >

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
              <option value="paid">
                Paid
              </option>

              <option value="pending">
                Pending
              </option>
            </select>

            <button type="submit">
              {editingId
                ? 'Update Donor'
                : 'Add Donation'}
            </button>

          </form>
        </div>
      )}

      {/* Donor Table */}
      <div className="donor-table-card">

        <h3>Donor List</h3>

        {donors.length === 0 ? (

          <p className="empty-text">
            No donations added yet.
          </p>

        ) : (

          <div className="table-wrapper">

            <table className="donor-table">

              <thead>
                <tr>
                  <th>Name</th>
                  <th>Amount</th>
                  <th>Status</th>

                  {isAdmin && (
                    <th>Actions</th>
                  )}
                </tr>
              </thead>

              <tbody>

                {donors.map((donor) => (

                  <tr key={donor.id}>

                    <td>{donor.name}</td>

                    <td>
                      ₹ {donor.amount.toLocaleString()}
                    </td>

                    <td>
                      <span
                        className={`status-badge ${donor.status}`}
                      >
                        {donor.status}
                      </span>
                    </td>

                    {isAdmin && (

                      <td className="action-buttons">

                        <button
                          type="button"
                          className="edit-btn"
                          onClick={() => handleEdit(donor)}
                        >
                          <FaEdit />
                        </button>

                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() => handleDelete(donor.id)}
                        >
                          <FaTrash />
                        </button>

                      </td>
                    )}

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}
      </div>

      {/* Admin Modal */}
      {showAdminModal && (

        <div className="modal-overlay">

          <div className="modal-content">

            <button
              className="close-modal"
              onClick={() =>
                setShowAdminModal(false)
              }
            >
              <FaTimes />
            </button>

            <h3>Admin Access</h3>

            <form onSubmit={handleAdminLogin}>

              <input
                type="password"
                className="input-field"
                placeholder="Enter Passcode"
                value={passcode}
                onChange={(e) =>
                  setPasscode(e.target.value)
                }
              />

              <button
                type="submit"
                className="btn"
              >
                Login
              </button>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

export default Donations;