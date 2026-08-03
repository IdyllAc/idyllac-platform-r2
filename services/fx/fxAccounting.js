// services/fx/fxAccounting.js

function calculateFXResult({
    sourceAmount,
    sourceCurrency,
    destinationAmount,
    destinationCurrency,
    exchangeRate
  }) {
  
    /*
      SIMULATION ONLY
  
      Assume Treasury bought currency at:
  
      marketRate = exchangeRate - 0.02
    */
  
    const marketRate =
      Number(exchangeRate) - 0.02;
  
    const marketDestinationAmount =
      Number(sourceAmount) * marketRate;
  
    const gainOrLoss =
      Number(destinationAmount)
        - marketDestinationAmount;
  
    return {
  
      marketRate,
  
      gainOrLoss,
  
      isGain:
        gainOrLoss > 0,
  
      isLoss:
        gainOrLoss < 0
  
    };
  
  }
  
  module.exports = {
    calculateFXResult
  };