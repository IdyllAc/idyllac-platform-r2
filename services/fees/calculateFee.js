// services/fees/calculateFee.js

function calculateFee({

    transferType,
    amount,
    requiresFX
 
 }) {
 
    let fee = 0;
 
    switch (transferType) {
 
       case 'INTERNAL':
          fee = 0;
          break;
 
       case 'SEPA':
          fee = 1;
          break;
 
       case 'SWIFT':
          fee = 10;
          break;
 
       default:
          fee = 0;
    }
 
    if (requiresFX) {
 
       fee += Number(amount) * 0.005;
 
    }
 
    return Number(
       fee.toFixed(2)
    );
 
 }
 
 module.exports = {
    calculateFee
 };