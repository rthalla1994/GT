import { FaQrcode, FaUniversity, FaMobileAlt } from 'react-icons/fa';
import './Donations.css';

const Donations = () => {
  return (
    <div className="donations-container fade-in">
      <div className="donations-header">
        <h2>Support the Temple</h2>
        <p>Your generous contributions help us maintain the temple and organize events.</p>
      </div>

      <div className="donation-methods">
        <div className="method-card">
          <div className="method-icon-wrapper">
            <FaQrcode className="method-icon" />
          </div>
          <h3>Scan to Pay</h3>
          <p>Scan using any UPI App (GPay, PhonePe, Paytm)</p>
          <div className="qr-placeholder">
            {/* Real app would have a generated QR code image here */}
            <div className="qr-mock">QR Code</div>
          </div>
          <p className="upi-id">UPI ID: sritemple@upi</p>
        </div>

        <div className="method-card secondary">
          <div className="method-icon-wrapper">
            <FaUniversity className="method-icon" />
          </div>
          <h3>Bank Transfer</h3>
          <div className="bank-details">
            <div className="detail-row">
              <span>Account Name:</span>
              <strong>Sri Venkateswara Trust</strong>
            </div>
            <div className="detail-row">
              <span>Account No:</span>
              <strong>1234567890123</strong>
            </div>
            <div className="detail-row">
              <span>IFSC Code:</span>
              <strong>SBIN0001234</strong>
            </div>
          </div>
        </div>

        <div className="method-card secondary">
          <div className="method-icon-wrapper">
            <FaMobileAlt className="method-icon" />
          </div>
          <h3>Mobile Wallets</h3>
          <p>Send contributions to <strong>+91 98765 43210</strong></p>
        </div>
      </div>
    </div>
  );
};

export default Donations;
