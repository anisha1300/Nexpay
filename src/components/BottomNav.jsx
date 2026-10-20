const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </svg>
);

const ScanIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v2h-3v-2zm-3 0h2v2h-2v-2zm3 3h2v2h-2v-2zm-3 3h2v2h-2v-2zm3 0h2v2h-2v-2zm-3-3h2v2h-2v-2z" />
  </svg>
);

const QRIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zM3 21h8v-8H3v8zm2-6h4v4H5v-4zM13 3v8h8V3h-8zm6 6h-4V5h4v4zM13 21h8v-8h-8v8zm2-6h4v4h-4v-4z" />
  </svg>
);

function BottomNav({ activePage, setPage }) {
  return (
    <nav className="bottom-nav">
      <button
        className={`nav-button ${activePage === 'home' ? 'active' : ''}`}
        onClick={() => setPage('home')}
      >
        <HomeIcon />
        <span>Home</span>
      </button>

      <button
        className="nav-button scan-button"
        onClick={() => setPage('scanner')}
      >
        <ScanIcon />
        <span>Pay</span>
      </button>

      <button
        className={`nav-button ${activePage === 'qrcode' ? 'active' : ''}`}
        onClick={() => setPage('qrcode')}
      >
        <QRIcon />
        <span>My Code</span>
      </button>
    </nav>
  );
}

export default BottomNav;

