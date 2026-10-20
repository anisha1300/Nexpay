import React, { useState, useEffect } from 'react';
import './PaymentFlow.css'; 
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { processPayment } from '../services/transactionService';

const SuccessTick = () => (
  <div className="np-success-circle">
    <svg className="np-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
      <circle className="np-checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
      <path className="np-checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
    </svg>
  </div>
);

function PaymentFlow({ user, merchantName, merchantId, onPaymentSuccess, onCancel }) {
  const [step, setStep] = useState('amount'); 
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [userPin, setUserPin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [transactionId, setTransactionId] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      try {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists() && userDoc.data().pin) setUserPin(userDoc.data().pin);
      } catch (e) { console.error(e); }
      setIsLoading(false);
    };
    fetchUserData();
  }, [user]);

  const handleKeyClick = (key) => {
    const isPin = step === 'pin';
    const setter = isPin ? setPin : setAmount;
    const current = isPin ? pin : amount;
    if (key === 'backspace') {
      setter(current.slice(0, -1));
    } else {
      if (isPin && current.length >= 4) return;
      if (!isPin && current.includes('.') && current.split('.')[1].length >= 2) return;
      setter(current + key);
    }
  };

  const handleFinalSubmit = async () => {
    if (pin.length < 4) return;
    setIsLoading(true);
    try {
      if (!userPin) await updateDoc(doc(db, "users", user.uid), { pin: pin });
      else if (pin !== userPin) throw new Error("Incorrect PIN");
      await processPayment(user.uid, parseFloat(amount));
      const audio = new Audio('/success-tone.mp3'); 
      audio.play().catch(e => console.error("Audio play failed:", e));
      setTransactionId(Math.random().toString(36).substr(2, 9).toUpperCase());
      setStep('success');
    } catch (e) {
      setErrorMessage(e.message);
      setPin('');
      setIsLoading(false);
      setStep('pin');
    }
  };

  if (isLoading && step !== 'success') return <div className="np-status">Loading Security...</div>;

  if (step === 'success') {
    return (
      <div className="np-app-container np-success-screen">
        <SuccessTick />
        <h1 className="np-success-title">Payment Complete</h1>
        <p className="np-success-msg">Your payment of ₹{amount} was approved.</p>
        <span className="np-tx-id">Transaction ID: {transactionId}</span>
        <button className="np-home-btn" onClick={onCancel}>Back to Home</button>
      </div>
    );
  }

  return (
    <div className="np-app-container">
      {step === 'amount' ? (
        <div className="np-view-wrapper">
          <div className="np-top-section">
            <div className="np-header">
              <button className="np-header-btn" onClick={onCancel}>✕</button>
              <button className="np-header-btn">⋮</button>
            </div>
            <div className="np-profile">
              <div className="np-avatar">{merchantName ? merchantName.charAt(0).toUpperCase() : 'A'}</div>
              <h2 className="np-m-name">Paying {merchantName || 'ANGAD KUMAR'}</h2>
              <p className="np-m-id">{merchantId || '7050210415@axl'}</p>
            </div>
          </div>
          
          <div className="np-middle-section">
            <div className="np-amount-row">
              <span className="np-symbol">₹</span>
              <span className="np-val">{amount || '0'}</span>
            </div>
          </div>

          <div className="np-bottom-section">
            <button className="np-fab-next" onClick={() => amount > 0 && setStep('pin')} disabled={!amount}>→</button>
            <div className="np-keyboard np-grid-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                <button key={n} className="np-pill-key" onClick={() => handleKeyClick(n.toString())}>{n}</button>
              ))}
              <button className="np-pill-key np-back-rose" onClick={() => handleKeyClick('backspace')}>⌫</button>
              <button className="np-pill-key" onClick={() => handleKeyClick('0')}>0</button>
              <button className="np-pill-key np-go-indigo" onClick={() => amount > 0 && setStep('pin')}>→</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="np-view-wrapper np-pin-theme">
          <div className="np-top-section">
            <button className="np-close-x" onClick={onCancel}>✕</button>
            <div className="np-pin-intro">
               <span className="np-lock-icon">🔒</span>
               <h1 className="np-pin-title">{userPin ? 'Enter PIN' : 'Set a PIN'}</h1>
               <p className="np-pin-subtitle">Pay ₹{amount} to {merchantName}</p>
            </div>
          </div>

          <div className="np-middle-section">
            <div className="np-pin-dots">
              {[...Array(4)].map((_, i) => (
                <span key={i} className={`np-dot ${pin.length > i ? 'filled' : ''}`}>●</span>
              ))}
            </div>
            <div className="np-pin-underline"></div>
            {errorMessage && <p className="np-pin-error">{errorMessage}</p>}
          </div>

          <div className="np-bottom-section">
            <div className="np-pin-actions">
               <button className="np-clear-text" onClick={() => setPin('')}>Clear</button>
               <button className={`np-next-pill ${pin.length === 4 ? 'active' : ''}`} onClick={handleFinalSubmit}>Next</button>
            </div>
            <div className="np-keyboard np-grid-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                <button key={n} className="np-pill-key" onClick={() => handleKeyClick(n.toString())}>{n}</button>
              ))}
              <button className="np-pill-key np-back-rose" onClick={() => handleKeyClick('backspace')}>⌫</button>
              <button className="np-pill-key" onClick={() => handleKeyClick('0')}>0</button>
              <button className="np-pill-key np-go-indigo" onClick={handleFinalSubmit}>→</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentFlow;