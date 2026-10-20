import React, { useState } from 'react';
import { auth } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "firebase/auth";
import './AuthPage.css'; 

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
);

const LockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
  </svg>
);

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
  </svg>
);

function AuthPage({ setError }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (isLogin) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (err) {
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
          setError("Invalid email or password.");
        } else {
          setError(err.message);
        }
      }
    } else {
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return; 
      }
      try {
        await createUserWithEmailAndPassword(auth, email, password);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError("Please enter your email to reset password.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent! Check your inbox.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="top-section">
        <img 
            src="/NEXPAY.png" 
            alt="Welcome Illustration" 
            className="illustration-image"
        />
        <h2 className="intro-title">
            {isLogin ? "Vasudhaiva Kutumbakam" : "Create Account"}
        </h2>
        <p className="intro-subtitle">
            {isLogin 
             ? "The World, One Family."
             : "Join us and experience seamless payments."}
        </p>
      </div>
      <div className="bottom-section">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <span className="input-icon"><MailIcon /></span>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="material-input"
              required
            />
          </div>

          <div className="input-group">
            <span className="input-icon"><LockIcon /></span>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="material-input"
              required
            />
          </div>

          {!isLogin && (
            <div className="input-group">
              <span className="input-icon"><LockIcon /></span>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="material-input"
                required
              />
            </div>
          )}

          {isLogin && (
            <button type="button" onClick={handlePasswordReset} className="forgot-pass-link">
              Forgot Password?
            </button>
          )}

          <button type="submit" className="login-btn">
            {isLogin ? 'LOGIN' : 'REGISTER'}
          </button>

        </form>
        <div className="bottom-text">
          {isLogin ? "Don't have an account?" : "Already have an account?"} 
          <button 
            onClick={() => {
                setIsLogin(!isLogin); 
                setError(null);
            }} 
            className="register-link"
          >
            {isLogin ? "Register Now" : "Log In"}
          </button>
        </div>

      </div>
    </div>
  );
}

export default AuthPage;