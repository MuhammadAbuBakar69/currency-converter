import './App.css';
import React, { useState, useEffect } from 'react';

// Popular currencies meta info with flag emojis and full names
const CURRENCY_INFO = {
  USD: { name: 'United States Dollar', flag: '🇺🇸', symbol: '$' },
  EUR: { name: 'Euro', flag: '🇪🇺', symbol: '€' },
  GBP: { name: 'British Pound', flag: '🇬🇧', symbol: '£' },
  JPY: { name: 'Japanese Yen', flag: '🇯🇵', symbol: '¥' },
  CAD: { name: 'Canadian Dollar', flag: '🇨🇦', symbol: 'CA$' },
  AUD: { name: 'Australian Dollar', flag: '🇦🇺', symbol: 'A$' },
  CHF: { name: 'Swiss Franc', flag: '🇨🇭', symbol: 'CHF' },
  CNY: { name: 'Chinese Yuan', flag: '🇨🇳', symbol: '¥' },
  INR: { name: 'Indian Rupee', flag: '🇮🇳', symbol: '₹' },
  BRL: { name: 'Brazilian Real', flag: '🇧🇷', symbol: 'R$' },
  ZAR: { name: 'South African Rand', flag: '🇿🇦', symbol: 'R' },
  MXN: { name: 'Mexican Peso', flag: '🇲🇽', symbol: 'MX$' },
  SGD: { name: 'Singapore Dollar', flag: '🇸🇬', symbol: 'S$' },
  HKD: { name: 'Hong Kong Dollar', flag: '🇭🇰', symbol: 'HK$' },
  NZD: { name: 'New Zealand Dollar', flag: '🇳🇿', symbol: 'NZ$' },
  AED: { name: 'United Arab Emirates Dirham', flag: '🇦🇪', symbol: 'AED' }
};

export default function App() {
  const [amount, setAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');

  const [rates, setRates] = useState({});
  const [lastUpdated, setLastUpdated] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch exchange rates relative to USD
  const fetchRates = () => {
    setLoading(true);
    setError(null);

    fetch('https://open.er-api.com/v6/latest/USD')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch exchange rates');
        return res.json();
      })
      .then((data) => {
        if (data && data.rates) {
          setRates(data.rates);
          if (data.time_last_update_utc) {
            setLastUpdated(new Date(data.time_last_update_utc).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }));
          }
        } else {
          throw new Error('Invalid rate data received');
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Error fetching rates');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRates();
  }, []);

  // Swap currencies
  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  // Convert calculation
  const getConvertedAmount = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return '0.00';

    if (!rates[fromCurrency] || !rates[toCurrency]) return '...';

    // USD is base in open.er-api.com
    const rateFromUSD = rates[fromCurrency];
    const rateToUSD = rates[toCurrency];

    const result = numAmount * (rateToUSD / rateFromUSD);
    return result.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Unit Exchange Rate (1 From = X To)
  const getUnitRate = () => {
    if (!rates[fromCurrency] || !rates[toCurrency]) return null;
    const rateFromUSD = rates[fromCurrency];
    const rateToUSD = rates[toCurrency];
    const unitRate = rateToUSD / rateFromUSD;
    return unitRate.toFixed(4);
  };

  const availableCurrencies = Object.keys(rates).length > 0 ? Object.keys(rates) : Object.keys(CURRENCY_INFO);

  return (
    <div className="cc-app">
      <div className="cc-card">
        {/* Header */}
        <header className="cc-header">
          <h1>💱 Currency Converter</h1>
          <p>Real-time exchange rates powered by Open ER API</p>
        </header>

        {loading ? (
          <div className="cc-loading">
            <div className="cc-spinner"></div>
            <p>Fetching live exchange rates...</p>
          </div>
        ) : error ? (
          <div className="cc-error">
            <p>⚠️ {error}</p>
            <button onClick={fetchRates}>Retry Fetching Rates</button>
          </div>
        ) : (
          <>
            {/* Amount Input */}
            <div className="cc-form-group">
              <label>Amount</label>
              <div className="cc-input-wrapper">
                <span className="cc-currency-symbol">
                  {CURRENCY_INFO[fromCurrency]?.symbol || '$'}
                </span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                />
              </div>
            </div>

            {/* Currency Selectors & Swap */}
            <div className="cc-converter-row">
              <div className="cc-form-group flex-1">
                <label>From Currency</label>
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                >
                  {availableCurrencies.map((code) => {
                    const info = CURRENCY_INFO[code];
                    return (
                      <option key={code} value={code}>
                        {info ? `${info.flag} ${code} - ${info.name}` : code}
                      </option>
                    );
                  })}
                </select>
              </div>

              <button className="cc-swap-btn" onClick={handleSwap} title="Swap Currencies">
                ⇄
              </button>

              <div className="cc-form-group flex-1">
                <label>To Currency</label>
                <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
                  {availableCurrencies.map((code) => {
                    const info = CURRENCY_INFO[code];
                    return (
                      <option key={code} value={code}>
                        {info ? `${info.flag} ${code} - ${info.name}` : code}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Result Box */}
            <div className="cc-result-box">
              <span className="cc-result-label">Converted Amount</span>
              <div className="cc-result-val">
                {getConvertedAmount()} {toCurrency}
              </div>
              <p className="cc-unit-rate">
                1 {fromCurrency} = {getUnitRate()} {toCurrency}
              </p>
            </div>

            {/* Quick Popular Rates Comparison Table */}
            <div className="cc-popular-section">
              <h3>Popular {fromCurrency} Rates</h3>
              <div className="cc-popular-grid">
                {['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD']
                  .filter((c) => c !== fromCurrency)
                  .map((targetCode) => {
                    const unitRate = (rates[targetCode] / rates[fromCurrency]).toFixed(4);
                    const info = CURRENCY_INFO[targetCode];
                    return (
                      <div key={targetCode} className="cc-popular-chip">
                        <span>{info?.flag || '🌐'} 1 {fromCurrency} =</span>
                        <strong>{unitRate} {targetCode}</strong>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Footer timestamp */}
            {lastUpdated && (
              <footer className="cc-footer">
                <span>Rates updated: {lastUpdated}</span>
              </footer>
            )}
          </>
        )}
      </div>
    </div>
  );
}
