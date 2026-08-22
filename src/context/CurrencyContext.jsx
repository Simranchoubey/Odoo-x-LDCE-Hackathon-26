import { createContext, useContext, useEffect, useState } from 'react';

// All stored amounts are USD-based; these are display-only conversion rates.
export const RATES = {
  USD: 1,
  INR: 83.5,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 150,
  AED: 3.67,
};

const CURRENCY_KEY = 'gt_currency';

const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(() => {
    const saved = localStorage.getItem(CURRENCY_KEY);
    return RATES[saved] ? saved : 'USD';
  });

  useEffect(() => {
    localStorage.setItem(CURRENCY_KEY, currency);
  }, [currency]);

  // Convert a USD-stored amount and format it in the selected currency
  const fmt = (usdAmount) => {
    const value = Number(usdAmount || 0) * RATES[currency];
    try {
      return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
        style: 'currency',
        currency,
        maximumFractionDigits: value >= 100 || currency === 'JPY' ? 0 : 2,
      }).format(value);
    } catch {
      return `${currency} ${Math.round(value)}`;
    }
  };

  const symbol = fmt(0).replace(/[\d.,\s]/g, '') || currency;

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, fmt, symbol }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}
