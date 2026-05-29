// services/fx/convertAmount.js
async function convertAmount(amount, from, to, rateProvider) {
    if (from === to) return { amount, rate: 1 };
  
    const rate = await rateProvider.getRate(from, to);
  
    return {
      amount: amount * rate,
      rate
    };
  }