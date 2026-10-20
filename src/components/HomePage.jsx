import React, { useState } from 'react';
import './HomePage.css';
import BalancePage from './BalancePage';
import CurrencyCalculator from './CurrencyCalculator';


const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const BankIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18M5 21v-7M19 21v-7M4 10l8-5 8 5M2 10h20" />
  </svg>
);

const HistoryIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
     <circle cx="12" cy="12" r="10"></circle>
     <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

function HomePage({ user, onProfileClick, onHistoryClick, onNewPaymentClick }) {
  const [isBalancePageOpen, setIsBalancePageOpen] = useState(false);
  const [showCalc, setShowCalc] = useState(false);

  const getInitials = (name) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  const people = [
    { id: 1, name: "John", color: "#8e44ad" },
    { id: 2, name: "Anisha", color: "#e67e22" },
    { id: 3, name: "Chandan", color: "#2ecc71" },
    { id: 4, name: "Momo wala", color: "#e74c3c" },
  ];

  const businesses = [
    { 
        id: 1, 
        name: "Recharge", 
        type: "image", 
        imgUrl: "https://img.icons8.com/fluency/48/smartphone--v1.png" 
    },
    { 
        id: 2, 
        name: "Zomato", 
        type: "image",
        imgUrl: "https://upload.wikimedia.org/wikipedia/commons/7/75/Zomato_logo.png",
        landingPage: "https://www.zomato.com"
    },
    { 
        id: 3, 
        name: "Uber", 
        type: "image",
        imgUrl: "https://www.google.com/s2/favicons?domain=uber.com&sz=64",
        landingPage: "https://www.uber.com"
    },
    { 
        id: 4, 
        name: "Swiggy", 
        type: "image",
        imgUrl: "https://www.google.com/s2/favicons?domain=swiggy.com&sz=64",
        landingPage: "https://www.swiggy.com"
    },
    { 
        id: 5, 
        name: "rapido", 
        type: "image",
        imgUrl: "https://upload.wikimedia.org/wikipedia/en/e/e7/Rapido-logo.png",
        landingPage: "https://www.rapido.bike"
    },
  ];

  const handleBusinessClick = (url) => {
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};
  
  if (showCalc) {
    return <CurrencyCalculator onBack={() => setShowCalc(false)} />;
  }

  return (
    <div className="home-wrapper">
      {isBalancePageOpen && (
        <BalancePage 
          user={user} 
          onClose={() => setIsBalancePageOpen(false)} 
        />
      )}
      <div className="gpay-header">
        <div className="top-bar">
          <div className="search-pill">
            <SearchIcon />
            <span className="search-text">Pay friends and merchants</span>
          </div>
          <div className="profile-pic-small" onClick={onProfileClick}>
            {getInitials(user?.displayName || user?.email)}
          </div>
        </div>
        <div className="welcome-section">
            <h1 className="welcome-title">Welcome to NexPay!</h1>
            <div style={{opacity: 0.8, fontSize: '14px'}}>Atithi Devo Bhava</div>
        </div>
      </div>
      <div className="white-sheet">

        <div className="action-card" onClick={() => setShowCalc(true)} style={{ marginBottom: '20px', border: '1px solid #e0e0e0', borderRadius: '12px' }}>
          <div className="action-card-icon" style={{ color: '#2ecc71', backgroundColor: '#e8f5e9' }}>
             <span style={{ fontSize: '24px' }}>🧮</span>
          </div>
          <div className="action-card-text">
            <h4>Currency Converter</h4>
            <p>Check real-time currency converter</p>
          </div>
        </div>

        <h3 className="section-title">People</h3>
        <div className="grid-row">
          {people.map((person) => (
            <div key={person.id} className="grid-item">
              <div 
                className="icon-circle" 
                style={{ backgroundColor: person.color, color: 'white', border: 'none' }}
              >
                {person.name.charAt(0)}
              </div>
              <span className="icon-label">{person.name}</span>
            </div>
          ))}
        </div>

        <button 
      className="new-payment-btn" 
      onClick={onNewPaymentClick}
    >
      + New Payment
    </button>
        <h3 className="section-title">Businesses & Bills</h3>
        <div className="grid-row">
  {businesses.map((biz) => (
      <div 
        key={biz.id} 
        className="grid-item" 
        onClick={() => handleBusinessClick(biz.landingPage)}
        style={{ cursor: biz.landingPage ? 'pointer' : 'default' }}
          >
            <div className="icon-circle" style={{ padding: 0 }}>
              {biz.type === 'image' ? (
                <img 
                  src={biz.imgUrl} 
                  alt={biz.name} 
                  style={{ 
                      width: '100%', height: '100%', 
                      objectFit: 'cover', borderRadius: '50%' 
                  }} 
                />
              ) : ( biz.icon )}
            </div>
            <span className="icon-label">{biz.name}</span>
          </div>
        ))}
      </div>
      <h3 className="section-title">Explore</h3>
        <div className="action-card" onClick={() => setIsBalancePageOpen(true)}>
          <div className="action-card-icon">
            <BankIcon />
          </div>
          <div className="action-card-text">
            <h4>Check Bank Balance</h4>
            <p>View account details</p>
          </div>
        </div>
        <div className="action-card" onClick={onHistoryClick}>
          <div className="action-card-icon" style={{ color: '#1a73e8', backgroundColor: '#e8f0fe' }}>
            <HistoryIcon />
          </div>
          <div className="action-card-text">
            <h4>Check History</h4>
            <p>View past transactions</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;