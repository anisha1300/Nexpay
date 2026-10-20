import React, { useState, useEffect } from 'react';
import './App.css';
import { auth } from './firebase.js';
import { onAuthStateChanged, signOut } from "firebase/auth";
import AuthPage from './components/AuthPage.jsx';
import HomePage from './components/HomePage.jsx';
import MyQRCodePage from './components/MyQRCodePage.jsx';
import ScannerPage from './components/ScannerPage.jsx';
import BottomNav from './components/BottomNav.jsx';
import ProfilePage from './components/ProfilePage.jsx';
import HistoryPage from './components/HistoryPage.jsx';
import UpdatePinPage from './components/UpdatePinPage.jsx';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState('home');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleLogout = () => {
    signOut(auth);
    setPage('home');
    setError(null);
  };

  if (loading) {
    return <div className="loading-screen">Loading App...</div>;
  }
  if (!user) {
    return (
      <div className="App">
        <AuthPage error={error} setError={setError} />
        {error && (
          <div className="error-toast" onClick={() => setError(null)}>
            {error}
          </div>
        )}
      </div>
    );
  }

const renderPage = () => {
  switch (page) {
    case 'home':
    return (
      <HomePage 
        user={user} 
        onProfileClick={() => setPage('profile')} 
        onHistoryClick={() => setPage('history')}
        onNewPaymentClick={() => setPage('scanner')}
      />
    );
    case 'scanner':
  return (
    <ScannerPage 
      user={user} 
      activePage={page} 
      onClose={() => setPage('home')}
    />
  );
    case 'qrcode':
      return <MyQRCodePage user={user} />;
    case 'profile':
      return (
        <ProfilePage 
          user={user} 
          onLogout={handleLogout} 
          onBack={() => setPage('home')}
          onUpdatePin={() => setPage('updatepin')}
        />
      );
    case 'history':
      return <HistoryPage user={user} onBack={() => setPage('home')} />;
    case 'updatepin':
      return <UpdatePinPage user={user} onBack={() => setPage('profile')} />;
      
    default:
      return <HomePage user={user} onProfileClick={() => setPage('profile')} />;
  }
};

  return (
    <div className="App">
      {error && (
        <div className="error-toast" onClick={() => setError(null)}>
          {error}
        </div>
      )}
      
      <main className="main-content">
        {renderPage()}
      </main>
      {(page === 'home' || page === 'scanner' || page === 'qrcode') && (
        <BottomNav activePage={page} setPage={setPage} />
      )}
    </div>
  );
}

export default App;

