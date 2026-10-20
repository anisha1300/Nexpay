import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
function MyQRCode({ uid }) {

  if (!uid) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', textAlign: 'center' }}>
      <h2>My Wallet QR Code</h2>
      <p>Show this to an employee to add funds.</p>

      <QRCodeSVG 
        value={uid}
        size={256}
        style={{ margin: '20px 0' }}
      />
      
      <p>
        <small>Your secure ID (this is not public):</small><br />
        <code>{uid}</code>
      </p>
    </div>
  );
}

export default MyQRCode;
