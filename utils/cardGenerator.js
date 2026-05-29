// utils/cardGenerator.js

// =====================================
// GENERATE CARD NUMBER
// =====================================

function generateCardNumber() {

  let number = "4"; // VISA starts with 4

  for (let i = 0; i < 15; i++) {

    number += Math.floor(Math.random() * 10);

  }

  return number.replace(/(.{4})/g, '$1 ').trim();

}


// =====================================
// MASK CARD NUMBER
// =====================================

function generateMaskedNumber(number) {

  const clean =
    number.replace(/\s/g, '');

  return `**** **** **** ${clean.slice(-4)}`;

}


// =====================================
// GENERATE IBAN
// =====================================

function generateIBAN() {

  // FR = France
  // 76 = example checksum

  return (
    'FR76' +
    Math.random()
      .toString()
      .slice(2, 25)
  );

}


// =====================================
// GENERATE BIC / SWIFT
// =====================================

function generateBIC() {

  return 'IDYLFRPP';

}


// =====================================
// GENERATE EXPIRY
// =====================================

function generateExpiry() {

  const month =
    String(Math.floor(Math.random() * 12) + 1)
      .padStart(2, '0');

  const year =
    String(new Date().getFullYear() + 4);

  return {
    month,
    year
  };

}


// =====================================
// GENERATE CVV
// =====================================

function generateCVV() {

  return String(
    Math.floor(100 + Math.random() * 900)
  );

}


module.exports = {

  generateCardNumber,

  generateMaskedNumber,

  generateIBAN,

  generateBIC,

  generateExpiry,

  generateCVV

};