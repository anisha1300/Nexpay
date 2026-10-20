import React, { useState } from 'react';
import { db } from '../firebase';
import { doc, setDoc } from "firebase/firestore";
import './UpdatePinPage.css';

const TickIcon = () => (
  <svg className="success-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" width="80" height="80">
    <circle className="success-icon-circle" cx="26" cy="26" r="25" fill="none" stroke="#388e3c" strokeWidth="2" />
    <path className="success-icon-tick" fill="none" stroke="#388e3c" strokeWidth="3" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
  </svg>
);

function UpdatePinPage({ user, onBack }) {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [stage, setStage] = useState('set');
  const [error, setError] = useState('');

  const handleNumClick = (num) => {
    setError('');
    if (stage === 'set' && pin.length < 4) setPin(prev => prev + num);
    if (stage === 'confirm' && confirmPin.length < 4) setConfirmPin(prev => prev + num);
  };

  const handleBackspace = () => {
    if (stage === 'set') setPin(prev => prev.slice(0, -1));
    if (stage === 'confirm') setConfirmPin(prev => prev.slice(0, -1));
  };

  const handleNext = () => {
    if (stage === 'set' && pin.length === 4) {
      setStage('confirm');
    } else if (stage === 'confirm' && confirmPin.length === 4) {
      if (pin === confirmPin) {
        handleSave();
      } else {
        setError("PINs do not match. Try again.");
        setConfirmPin('');
      }
    }
  };

  const handleSave = async () => {
    setStage('loading');
    try {
      await setDoc(doc(db, "users", user.uid), { pin: pin }, { merge: true });
      setTimeout(() => setStage('success'), 1000);
    } catch (err) {
      console.error(err);
      setStage('confirm');
      setError("Failed to save PIN.");
    }
  };

  if (stage === 'loading') return (
    <div className="update-pin-container items-center justify-center"><div className="loader"></div></div>
  );

  if (stage === 'success') return (
    <div className="update-pin-container items-center justify-center text-center p-6">
      <TickIcon />
      <h1 className="text-2xl font-bold mt-4">PIN Set!</h1>
      <button className="next-btn active mt-8 w-full" onClick={onBack}>Done</button>
    </div>
  );

  return (
    <div className="update-pin-container">
      <button className="close-btn" onClick={onBack}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>

      <div className="pin-top-section">
        <div className="lock-icon">🔒</div>
        <h1>{stage === 'set' ? 'Set a PIN' : 'Confirm PIN'}</h1>
        <p>{stage === 'set' ? 'Enter a 4-digit PIN' : 'Re-enter your PIN to confirm'}</p>
        
        <div className="pin-display-area">
          {(stage === 'set' ? pin : confirmPin).padEnd(4, ' ').split('').map((char, i) => (
            <span key={i}>{char === ' ' ? '' : '●'}</span>
          ))}
        </div>
        {error && <p className="error-message" style={{color: 'red', fontSize: '14px'}}>{error}</p>}
      </div>

      <div className="pin-controls">
        <button className="clear-btn" onClick={() => stage === 'set' ? setPin('') : setConfirmPin('')}>Clear</button>
        <button 
          className={`next-btn ${(stage === 'set' ? pin : confirmPin).length === 4 ? 'active' : ''}`}
          onClick={handleNext}
        >
          {stage === 'set' ? 'Next' : 'Confirm'}
        </button>
      </div>

      <div className="num-pad">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button key={num} className="num-key" onClick={() => handleNumClick(num.toString())}>{num}</button>
        ))}
        <button className="num-key key-backspace" onClick={handleBackspace}>⌫</button>
        <button className="num-key" onClick={() => handleNumClick('0')}>0</button>
        <button className="num-key key-submit" onClick={handleNext}>➔</button>
      </div>
    </div>
  );
}

export default UpdatePinPage;