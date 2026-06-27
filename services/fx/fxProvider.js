// services/fx/fxProvider.js

const rates = {
    EUR: {
      EUR: 1,
      USD: 1.17,
      GBP: 0.86
    },
  
    USD: {
      USD: 1,
      EUR: 0.85,
      GBP: 0.74
    },
  
    GBP: {
      GBP: 1,
      EUR: 1.16,
      USD: 1.35
    }
  };
  
  async function getRate(from, to) {
  
    if (from === to) return 1;
  
    if (!rates[from] || !rates[from][to]) {
      throw new Error(
        `FX rate not available: ${from} -> ${to}`
      );
    }
  
    return rates[from][to];
  }
  
  module.exports = {
    getRate
  };




//   is fine for a mock provider.

// Later in production you can replace this provider with:

// ECB rates
// Visa FX
// Mastercard FX
// OpenExchangeRates
// Wise FX API

// without touching business logic.