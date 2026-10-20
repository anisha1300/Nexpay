import React, { useState, useEffect, useRef } from 'react';
import './ScannerPage.css';
import QrScanner from 'qr-scanner'; 
import PaymentFlow from './PaymentFlow';
import { recordTransaction } from '../services/transactionService';

function parseAnyPaymentQR(link) {
  try {
    if (!link) return null;
    if (link.startsWith('nexpay://')) {
      const url = new URL(link);
      const params = new URLSearchParams(url.search);
      return {
        merchantName: params.get('name') || "NexPay User",
        merchantId: params.get('uid'),
        type: 'INTERNAL'
      };
    }

    if (link.startsWith('upi://')) {
      const url = new URL(link.replace('upi://', 'http://'));
      const params = new URLSearchParams(url.search);
      return {
        merchantName: params.get('pn') || "UPI Merchant",
        merchantId: params.get('pa'),
        type: 'EXTERNAL'
      };
    }

    return null;
  } catch (error) {
    console.error("QR Parsing Error:", error);
    return null;
  }
}

function ScannerPage({ user, activePage }) {
  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const [scannedData, setScannedData] = useState(null);
  const [message, setMessage] = useState('');

  const handleScanResult = (result) => {
  console.log("Raw scanned data:", result.data);
  setMessage('Processing QR code...');
  const paymentData = parseAnyPaymentQR(result.data);
  
  if (paymentData) {
    scannerRef.current?.stop();
    setScannedData(paymentData); 
    setMessage('');
  } else {
    setMessage("Invalid QR code. Please scan NexPay or UPI.");
    setTimeout(() => setMessage(''), 2500);
  }
};

  useEffect(() => {
    if (activePage !== 'scanner' || !videoRef.current) {
      if (scannerRef.current) {
        scannerRef.current.stop();
        scannerRef.current.destroy();
        scannerRef.current = null;
      }
      return;
    }

    //  Start the scanner
    const videoElem = videoRef.current;
    if (scannerRef.current) {
      scannerRef.current.start();
      return;
    }

    setMessage('⌛ Requesting camera permission...');
    
    const qrScanner = new QrScanner(
      videoElem,
      handleScanResult,
      {
        returnDetailedScanResult: true,
        highlightScanRegion: true,
        highlightCodeOutline: true,
      }
    );
    scannerRef.current = qrScanner;

    qrScanner.start()
      .then(() => {
        setMessage('Point camera at a QR code');
      })
      .catch(err => {
        console.error("QR Scanner start error:", err);
        if (err === 'Camera not found.') {
           setMessage('❌ No camera found.');
        } else if (err === 'User denied camera access.') {
           setMessage('❌ Camera permission denied.');
        } else {
           setMessage('❌ Error starting camera.');
        }
      });

    return () => {
      console.log("Cleaning up scanner...");
      scannerRef.current?.stop();
      scannerRef.current?.destroy();
      scannerRef.current = null;
    };
    
  }, [activePage]);

if (scannedData) {
    // CONFIRMATION VIEW
    return (
      <div className="page-container scanner-page" style={{ justifyContent: 'center' }}>
        <h1 className="app-title">Make Payment</h1>
        <PaymentFlow
          user={user}
          merchantName={scannedData.merchantName}
          merchantId={scannedData.merchantId}
          onCancel={() => {
            setScannedData(null);
            setMessage('');
          }}
          onPaymentSuccess={async (amountPaid) => {
  try {
    setMessage('Processing Transaction...');
    
    // Call the new service with the 'type' argument
    await recordTransaction(
      user.uid, 
      scannedData.merchantName, 
      scannedData.merchantId, 
      amountPaid,
      scannedData.type
    );

    setScannedData(null);
    setMessage('Payment successful!');
    setTimeout(() => setMessage(''), 2000);
  } catch (error) {
    console.error("Payment Error:", error);
    setMessage('Transaction Failed: ' + error.message);
  }
}}
        />
      </div>
    );
  }

  return (
    <div className="page-container scanner-page">
      <h1 className="app-title">Pay Merchant</h1>
      <p className="scanner-subtitle">
        Scan any UPI QR code to make a payment.
      </p>

      <div className="scanner-window" style={{ 
          width: '90%',
          maxWidth: '350px', 
          aspectRatio: '1 / 1',
          height: 'auto',
          borderRadius: '16px', 
          overflow: 'hidden',
          backgroundColor: '#222',
          margin: '10px auto',
          position: 'relative'
        }}>
        <video 
          ref={videoRef}
          playsInline
          muted
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>

      <p className="scanner-message">{message}</p>
    </div>
  );
}

export default ScannerPage;