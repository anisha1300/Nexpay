import React, { useEffect, useState } from 'react';
import { getTransactionHistory } from '../services/transactionService';
import './HistoryPage.css';

const HistoryPage = ({ user, onBack }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (user?.uid) {
        const data = await getTransactionHistory(user.uid);
        setTransactions(data);
      }
      setLoading(false);
    };
    fetchHistory();
  }, [user]);

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate(); 
    return date.toLocaleDateString('en-US', { 
      month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' 
    });
  };

  return (
    <div className="page-container history-page">
      <div className="profile-page-header">
        <button className="back-arrow-btn" onClick={onBack}>
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1c1e21" strokeWidth="2">
             <path d="M19 12H5M12 19l-7-7 7-7" />
           </svg>
        </button>
        <h1 className="app-title">Transaction History</h1>
      </div>

      <div className="history-list">
        {loading ? (
          <div className="loader"></div>
        ) : transactions.length === 0 ? (
          <div className="transaction-empty">
            <p>No transactions yet.</p>
          </div>
        ) : (
          transactions.map((txn) => (
            <div key={txn.id} className="history-item">
              <div className="history-icon">
                {txn.merchantName.charAt(0).toUpperCase()}
              </div>
              <div className="history-details">
                <h4>{txn.merchantName}</h4>
                <p>{formatDate(txn.timestamp)}</p>
              </div>
              <div className="history-amount">
                - ₹{txn.amount}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryPage;