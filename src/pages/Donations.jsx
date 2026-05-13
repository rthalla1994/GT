import { useEffect, useState } from 'react';
import {
  FaHandHoldingHeart,
  FaLock,
  FaTimes,
  FaEdit,
  FaTrash,
  FaFilePdf
} from 'react-icons/fa';

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";

import { db } from "../firebase";
import './Donations.css';

const Donations = () => {

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

  // =========================
  // FIRESTORE REALTIME
  // =========================
  useEffect(() => {
    const q = query(collection(db, "donors"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setDonors(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => unsubscribe();
  }, []);

  // =========================
  // ADMIN LOGIN
  // =========================
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

  // =========================
  // FORM CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // =========================
  // ADD / UPDATE
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.amount) return;

    if (editingId) {
      await updateDoc(doc(db, "donors", editingId), {
        name: formData.name,
        amount: Number(formData.amount),
        status: formData.status
      });
      setEditingId(null);
    } else {
      await addDoc(collection(db, "donors"), {
        name: formData.name,
        amount: Number(formData.amount),
        status: formData.status,
        createdAt: serverTimestamp()
      });
    }

    setFormData({ name: '', amount: '', status: 'paid' });
  };

  // =========================
  // EDIT
  // =========================
  const handleEdit = (donor) => {
    setEditingId(donor.id);
    setFormData({
      name: donor.name,
      amount: donor.amount,
      status: donor.status
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    await deleteDoc(doc(db, "donors", id));
  };

  // =========================
  // TOTAL
  // =========================
  const totalAmount = donors.reduce((sum, d) => sum + Number(d.amount), 0);

  // =========================
  // EXCEL EXPORT
  // =========================
  const exportToExcel = () => {
    const data = donors.map(d => ({
      Name: d.name,
      Amount: d.amount,
      Status: d.status
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Donors");

    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    const blob = new Blob([buffer], {
      type: "application/octet-stream"
    });

    saveAs(blob, `donors_${Date.now()}.xlsx`);
  };

  // =========================
  // PDF RECEIPT (WITH SIGNATURE)
  // =========================
  const generateReceipt = async (donor) => {
    const pdf = new jsPDF("p", "mm", "a4");

    const loadImage = (src) =>
      new Promise(resolve => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = src;
        img.onload = () => resolve(img);
      });

    const logo = await loadImage("/temple-logo.png");
    const signature = await loadImage("/signature.jpg");

    const amount = Number(donor.amount);
    const receiptNo = `RCPT-${Date.now()}`;

    let muttonMessage = "No mutton benefit";
    if (amount > 3000) muttonMessage = "Eligible for 1 KG Mutton";
    else if (amount >= 1116) muttonMessage = "Eligible for 1/2 KG Mutton";

    // HEADER
    pdf.setFillColor(255, 245, 235);
    pdf.rect(0, 0, 210, 40, "F");

    pdf.addImage(logo, "PNG", 15, 8, 22, 22);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text("Sri Kunti Gangamma Temple Committee", 105, 18, { align: "center" });

    pdf.setFontSize(10);
    pdf.text("Donation Receipt", 105, 26, { align: "center" });

    pdf.setFontSize(9);
    pdf.text(`Receipt No: ${receiptNo}`, 190, 10, { align: "right" });

    // DETAILS
    pdf.roundedRect(15, 50, 180, 110, 3, 3);

    pdf.setFontSize(11);
    pdf.text(`Name: ${donor.name}`, 20, 75);
    pdf.text(`Amount: ₹ ${amount.toLocaleString()}`, 20, 85);
    pdf.text(`Status: ${donor.status}`, 20, 95);
    pdf.text(`Date: ${new Date().toLocaleString()}`, 20, 105);

    pdf.text(`Mutton Benefit: ${muttonMessage}`, 20, 120);

    // THANK YOU
    pdf.setFillColor(255, 250, 240);
    pdf.roundedRect(15, 165, 180, 25, 3, 3, "F");

    pdf.text("Thank you for your contribution", 105, 180, { align: "center" });

    // SIGNATURE
    pdf.text("Authorized Signature", 150, 225);
    pdf.line(140, 228, 190, 228);
    pdf.addImage(signature, "PNG", 145, 232, 40, 18);

    pdf.save(`receipt_${donor.name}.pdf`);
  };

  // =========================
  // UI (FULL RESTORED)
  // =========================
  return (
    <div className="donations-container fade-in">

      <div className="donations-header">
        <h2>Temple Donations</h2>
        <p>Sri Kunti Gangamma Jathara Contributions</p>
      </div>

      <div className="total-card">
        <FaHandHoldingHeart className="total-icon" />
        <div>
          <p>Total Donations</p>
          <h1>₹ {totalAmount.toLocaleString()}</h1>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        {!isAdmin && (
          <button className="admin-btn" onClick={() => setShowAdminModal(true)}>
            <FaLock /> Admin Login
          </button>
        )}

        {isAdmin && (
          <>
            <button className="admin-btn" onClick={exportToExcel}>
              Export Excel
            </button>
          </>
        )}
      </div>

      {isAdmin && (
        <div className="donor-form-card">
          <h3>{editingId ? "Edit Donor" : "Add Donor"}</h3>

          <form onSubmit={handleSubmit} className="donor-form">
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
            <input name="amount" value={formData.amount} onChange={handleChange} placeholder="Amount" />

            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
            </select>

            <button type="submit">{editingId ? "Update" : "Add"}</button>
          </form>
        </div>
      )}

      <div className="donor-table-card">
        <h3>Donor List ({donors.length})</h3>

        <table className="donor-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Amount</th>
              <th>Status</th>
              {isAdmin && <th>Actions</th>}
              <th>Receipt</th>
            </tr>
          </thead>

          <tbody>
            {donors.map(d => (
              <tr key={d.id}>
                <td>{d.name}</td>
                <td>₹ {Number(d.amount).toLocaleString()}</td>
                <td>{d.status}</td>

                {isAdmin && (
                  <td>
                    <button onClick={() => handleEdit(d)}><FaEdit /></button>
                    <button onClick={() => handleDelete(d.id)}><FaTrash /></button>
                  </td>
                )}

                <td>
                  {d.status === "paid" ? (
                    <button onClick={() => generateReceipt(d)}>
                      <FaFilePdf />
                    </button>) : (<span className="status-badge pending">Pending</span>)}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {showAdminModal && (
        <div className="modal-overlay">
          <div className="modal-content">

            <button onClick={() => setShowAdminModal(false)}>
              <FaTimes />
            </button>

            <h3>Admin Access</h3>

            <form onSubmit={handleAdminLogin}>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter Passcode"
              />
              <button type="submit">Login</button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default Donations;