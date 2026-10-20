import React, { useState, useEffect } from 'react';
import './BalancePage.css'; 
import { getUserBalance } from '../services/transactionService';
import { db } from '../firebase';
import { doc, getDoc } from "firebase/firestore";

const BalancePage = ({ user, onClose }) => {
  const [step, setStep] = useState('check-pin');
  const [enteredPin, setEnteredPin] = useState('');
  const [storedPin, setStoredPin] = useState(null);
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid) return;

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setStoredPin(userSnap.data().pin);
        }
        const bal = await getUserBalance(user.uid);
        setBalance(bal);
        
        setLoading(false);
      } catch (err) {
        console.error("Error loading balance data:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);
  const handlePinSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!storedPin) {
      setError("No PIN set. Please set a PIN in Profile.");
      return;
    }

    if (enteredPin === storedPin) {
      setStep('show-balance');
    } else {
      setError("Incorrect PIN");
      setEnteredPin('');
    }
  };

  return (
    <div className="balance-page-overlay" onClick={onClose}>
      <div className="balance-popup" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        {step === 'check-pin' && (
          <div className="pin-check-section">
            <h3>Enter UPI PIN</h3>
            <p className="pin-subtitle">Enter your 4-digit PIN to view balance</p>
            
            {loading ? (
               <div className="loader-small"></div>
            ) : (
              <form onSubmit={handlePinSubmit}>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength="4"
                  value={enteredPin}
                  onChange={(e) => setEnteredPin(e.target.value)}
                  className="pin-input-field"
                  autoFocus
                  placeholder="••••"
                />
                
                {error && <p className="error-text">{error}</p>}

                <button 
                  type="submit" 
                  className="view-balance-btn"
                  disabled={enteredPin.length < 4}
                >
                  View Balance
                </button>
              </form>
            )}
            
            <p className="secure-badge">POWERED BY NEXPAY SECURE</p>
          </div>
        )}
        {step === 'show-balance' && (
          <div className="balance-display-section">
            <h3>Bank Balance</h3>
            
            <div className="balance-display">
               <h1>₹{balance !== null ? balance.toLocaleString('en-IN') : '0'}</h1>
            </div>

            <p className="account-info">Savings Account •• 4291</p>
            <p className="secure-badge">POWERED BY NEXPAY SECURE</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default BalancePage;