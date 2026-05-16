import { useEffect, useState } from 'react';

import {
  FaMoneyBillWave,
  FaPlus,
  FaEdit,
  FaTrash
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

import { db } from '../firebase';

import './Expenses.css';

const Expenses = () => {

  const [expenses, setExpenses] = useState([]);

  const [isAdmin, setIsAdmin] = useState(false);

  const [passcode, setPasscode] = useState('');

  const [showLogin, setShowLogin] = useState(true);

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'General',
    notes: ''
  });

  // =========================
  // FIRESTORE
  // =========================
  useEffect(() => {

    const q = query(
      collection(db, 'expenses'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {

      setExpenses(
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      );

    });

    return () => unsubscribe();

  }, []);

  // =========================
  // LOGIN
  // =========================
  const handleLogin = (e) => {

    e.preventDefault();

    if (passcode === '7082') {

      setIsAdmin(true);

      setShowLogin(false);

    } else {

      alert('Incorrect Passcode');

    }
  };

  // =========================
  // INPUT
  // =========================
  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // =========================
  // ADD / UPDATE
  // =========================
  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!formData.title.trim()) {
      alert('Please enter expense title');
      return;
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      alert('Please enter valid amount');
      return;
    }

    try {

      if (editingId) {

        await updateDoc(doc(db, 'expenses', editingId), {
          ...formData,
          amount: Number(formData.amount)
        });

        setEditingId(null);

      } else {

        await addDoc(collection(db, 'expenses'), {
          ...formData,
          amount: Number(formData.amount),
          createdAt: serverTimestamp()
        });

      }

      setFormData({
        title: '',
        amount: '',
        category: 'General',
        notes: ''
      });

    } catch (err) {

      console.log(err);

      alert('Something went wrong');
    }
  };

  // =========================
  // EDIT
  // =========================
  const handleEdit = (expense) => {

    setEditingId(expense.id);

    setFormData({
      title: expense.title || '',
      amount: expense.amount || '',
      category: expense.category || 'General',
      notes: expense.notes || ''
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (id) => {

    if (!window.confirm('Delete expense?')) return;

    try {

      await deleteDoc(doc(db, 'expenses', id));

    } catch (err) {

      console.log(err);

      alert('Unable to delete expense');
    }
  };

  // =========================
  // TOTAL
  // =========================
  const totalExpenses = expenses.reduce(
    (sum, e) => sum + Number(e.amount || 0),
    0
  );

  // =========================
  // EXPORT EXCEL
  // =========================
  const exportToExcel = () => {

    const data = expenses.map(expense => ({
      Title: expense.title,
      Amount: expense.amount,
      Category: expense.category,
      Notes: expense.notes
    }));

    const ws = XLSX.utils.json_to_sheet(data);

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      wb,
      ws,
      "Expenses"
    );

    const buffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array"
    });

    const blob = new Blob(
      [buffer],
      {
        type: "application/octet-stream"
      }
    );

    saveAs(
      blob,
      `expenses_${Date.now()}.xlsx`
    );
  };

  // =========================
  // LOGIN SCREEN
  // =========================
  if (showLogin) {

    return (
      <div className="expense-login-card">

        <h2>Admin Access</h2>

        <form onSubmit={handleLogin}>

          <input
            type="password"
            placeholder="Enter Passcode"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
          />

          <button type="submit">
            Login
          </button>

        </form>

      </div>
    );
  }

  return (
    <div className="expenses-container fade-in">

      {/* SUMMARY */}
      <div className="expense-summary-card">

        <FaMoneyBillWave className="expense-icon" />

        <div>
          <p>Total Expenses</p>

          <h1>
            ₹ {totalExpenses.toLocaleString()}
          </h1>
        </div>

        <button
          className="expense-export-btn"
          onClick={exportToExcel}
        >
          Export Excel
        </button>

      </div>

      {/* FORM */}
      {isAdmin && (

        <div className="expense-form-card">

          <h3>
            {editingId ? 'Edit Expense' : 'Add Expense'}
          </h3>

          <form
            onSubmit={handleSubmit}
            className="expense-form"
          >

            <input
              name="title"
              placeholder="Expense Title"
              value={formData.title}
              onChange={handleChange}
            />

            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={formData.amount}
              onChange={handleChange}
            />

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >

              <option>General</option>
              <option>Food</option>
              <option>Mutton</option>
              <option>Decorations</option>
              <option>Electrical</option>
              <option>Tent</option>
              <option>Drums</option>
              <option>Alcohol</option>

            </select>

            <textarea
              name="notes"
              placeholder="Notes"
              value={formData.notes}
              onChange={handleChange}
            />

            <button type="submit">

              <FaPlus />

              {editingId
                ? ' Update Expense'
                : ' Add Expense'}

            </button>

          </form>

        </div>

      )}

      {/* TABLE */}
      <div className="expense-table-card">

        <h3>
          Expense Records ({expenses.length})
        </h3>

        <table className="expense-table">

          <thead>

            <tr>
              <th>Title</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>

          </thead>

          <tbody>

            {expenses.map(expense => (

              <tr key={expense.id}>

                <td>{expense.title}</td>

                <td>
                  ₹ {Number(expense.amount).toLocaleString()}
                </td>

                <td>
                  <span className="category-badge">
                    {expense.category}
                  </span>
                </td>

                <td>{expense.notes}</td>

                <td className="expense-actions">

                  <button
                    onClick={() => handleEdit(expense)}
                  >
                    <FaEdit />
                  </button>

                  <button
                    onClick={() => handleDelete(expense.id)}
                  >
                    <FaTrash />
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default Expenses;