import React from 'react';
import './ProfilePage.css';

function ProfilePage({ user, onLogout, onBack, onUpdatePin }) {
  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : 'U';

  return (
    <div className="profile-container">
      <div className="profile-header">
        <button className="back-btn" onClick={onBack}>
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
          </svg>
        </button>
        <h2>Profile & Settings</h2>
      </div>

      <div className="profile-info-section">
        <div className="profile-avatar">{userInitial}</div>
        <h3 className="profile-email">{user?.email || 'User Email'}</h3>
        <button className="edit-btn">Edit Name & Picture</button>
      </div>

      <div className="profile-menu">
        <div className="menu-item">Help & Support</div>
        <div className="menu-item">Security & Privacy</div>
        <div className="menu-item" onClick={onUpdatePin} style={{cursor: 'pointer'}}>
          Update PIN
        </div>
        <div className="menu-item">Manage Notifications</div>
        <div className="menu-item">About Us</div>
      </div>

      <div className="sign-out-container">
        <button className="sign-out-btn" onClick={onLogout}>
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default ProfilePage;