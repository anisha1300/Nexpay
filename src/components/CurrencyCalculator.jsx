import React, { useState, useEffect } from 'react';
import './CurrencyCalculator.css';

const CURRENCIES = [
  { code: 'USD', name: 'United States Dollar', flag: 'us' },
  { code: 'INR', name: 'Indian Rupee', flag: 'in' },
  { code: 'EUR', name: 'Euro', flag: 'eu' },
  { code: 'GBP', name: 'British Pound', flag: 'gb' },
  { code: 'AED', name: 'UAE Dirham', flag: 'ae' },
  { code: 'JPY', name: 'Japanese Yen', flag: 'jp' },
  { code: 'CAD', name: 'Canadian Dollar', flag: 'ca' },
];

const CurrencyCalculator = ({ onBack }) => {
  const [fromCurrency, setFromCurrency] = useState(CURRENCIES[0]);
  const [toCurrency, setToCurrency] = useState(CURRENCIES[1]);
  const [amount, setAmount] = useState('0');
  const [rate, setRate] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerTarget, setPickerTarget] = useState('from');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/4b10a8a6bc9fe8bbe631c9ef/latest/${fromCurrency.code}`);
        const data = await response.json();
        if (data.result === "success") {
          setRate(data.conversion_rates[toCurrency.code]);
        }
      } catch (error) { console.error(error); }
    };
    fetchRate();
  }, [fromCurrency, toCurrency]);

  const handleKeyClick = (val) => {
    if (val === 'AC') {
      setAmount('0');
    } else if (val === 'back') {
      setAmount(prev => (prev.length <= 1 ? '0' : prev.slice(0, -1)));
    } else if (val === '.') {
      setAmount(prev => (prev.includes('.') ? prev : prev + '.'));
    } else {
      setAmount(prev => {
        if (prev === '0') return val === '00' ? '0' : val;
        if (prev.length >= 10) return prev; 
        return prev + val;
      });
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const filteredCurrencies = CURRENCIES.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectCurrency = (currency) => {
    if (pickerTarget === 'from') setFromCurrency(currency);
    else setToCurrency(currency);
    setShowPicker(false);
    setSearchQuery('');
  };

  const openPicker = (target) => {
    setPickerTarget(target);
    setShowPicker(true);
  };

  return (
    <div className="calculator-container">
      {showPicker && (
        <div className="picker-modal">
          <div className="picker-content">
            <div className="picker-header">
              <input 
                type="text" 
                placeholder="Search country or currency..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button onClick={() => setShowPicker(false)}>✕</button>
            </div>
            <div className="currency-list">
              {filteredCurrencies.map(c => (
                <div key={c.code} className="currency-item" onClick={() => selectCurrency(c)}>
                  <img src={`https://flagcdn.com/w40/${c.flag}.png`} alt={c.code} />
                  <div>
                    <div className="item-code">{c.code}</div>
                    <div className="item-name">{c.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="calc-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <h2>Online Currency Converter</h2>
        <button className="swap-btn-header" onClick={swapCurrencies}>
            ⇄ 
        </button>
      </div>

      <div className="display-section">
        <div className="currency-row">
          <div className="currency-info" onClick={() => openPicker('from')}>
            <img src={`https://flagcdn.com/w40/${fromCurrency.flag}.png`} alt="" />
            <span>{fromCurrency.code} ▶</span>
          </div>
          <div className="amount-info">
            <div className="amount-val">{amount}</div>
            <div className="currency-label">{fromCurrency.name}</div>
          </div>
        </div>

        <div className="currency-row inr-row">
          <div className="currency-info" onClick={() => openPicker('to')}>
            <img src={`https://flagcdn.com/w40/${toCurrency.flag}.png`} alt="" />
            <span>{toCurrency.code} ▶</span>
          </div>
          <div className="amount-info">
            <div className="amount-val highlighted">
              {rate ? (parseFloat(amount) * rate).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 4}) : '...'}
            </div>
            <div className="currency-label">{toCurrency.name}</div>
          </div>
        </div>
      </div>

      <div className="keypad">
        <div className="keys-grid">
          {[7, 8, 9, 4, 5, 6, 1, 2, 3, '00', 0, '.'].map(num => (
            <button key={num} onClick={() => handleKeyClick(num.toString())}>{num}</button>
          ))}
        </div>
        <div className="action-keys">
          <button className="ac-key" onClick={() => handleKeyClick('AC')}>AC</button>
          <button className="del-key" onClick={() => handleKeyClick('back')}>⌫</button>
        </div>
      </div>
    </div>
  );
};

export default CurrencyCalculator;