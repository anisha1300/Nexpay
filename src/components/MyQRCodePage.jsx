import { QRCodeSVG } from 'qrcode.react';

function MyQRCodePage({ user }) {
  
  if (!user || !user.uid) {
    return <div style={styles.loadingScreen}>Loading QR Code...</div>;
  }

  const userName = user.displayName || user.email || "User";
  const paymentValue = `nexpay://pay?uid=${user.uid}&name=${encodeURIComponent(userName)}`;

  const styles = {
    pageContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 24px 24px 24px',
      boxSizing: 'border-box',
      textAlign: 'center',
      backgroundColor: '#f9f9f9',
      minHeight: '100vh', 
    },
    header: {
      marginBottom: '24px',
    },
    headerH2: {
      fontSize: '1.75rem',
      fontWeight: '700',
      color: '#121212',
      margin: 0,
      marginBottom: '12px',
    },
    headerP: {
      fontSize: '1.1rem',
      color: '#666',
      margin: 0,
      lineHeight: 1.5,
      maxWidth: '300px', 
    },
    codeWrapper: {
      margin: '24px 0',
      backgroundColor: '#ffffff',
      padding: '20px',
      borderRadius: '16px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    },
    footer: {
      marginTop: '24px',
    },
    footerP: {
      fontSize: '0.9rem',
      color: '#888',
      fontWeight: '500',
    },
    loadingScreen: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      fontSize: '1.2rem',
      color: '#666',
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.header}>
        <h2 style={styles.headerH2}>My Wallet Code</h2>
        <p style={styles.headerP}>
          Ask another NexPay user to scan this code to receive a payment.
        </p>
      </div>
      
      <div style={styles.codeWrapper}>
        <QRCodeSVG
          value={paymentValue}
          size={256}
          bgColor={"#ffffff"}
          fgColor={"#000000"}
          level={"M"}
          includeMargin={false}
        />
      </div>

      <div style={styles.footer}>
        <p style={styles.footerP}>
          Scannable by NexPay App users.
        </p>
      </div>
    </div>
  );
}

export default MyQRCodePage;