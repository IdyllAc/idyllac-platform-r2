// services/cards/createCardIdentity.js

const crypto = require('crypto');

function createCardIdentity() {

    //
    // GENERATE PAN
    //

     // const digits =
     //     crypto.randomInt(
     //         1000000000000000,
     //         9999999999999999
     //     ).toString();

    let digits = String(
        crypto.randomInt(4, 6)
    );

    for (let i = 1; i < 16; i++) {

        digits += crypto.randomInt(0, 10);

    }

    const number =   // << formattedPan
        digits.match(/.{1,4}/g).join(' ');


    //
    // last4
    //

    const last4 =
        digits.slice(-4);

    //
    // masked
    //

    const maskedNumber =
        `**** **** **** ${last4}`;

    //
    // expiry
    //

    const today = new Date();

    const expiryMonth =
        String(today.getMonth() + 1)
            .padStart(2, '0');

    const expiryYear =
        String(today.getFullYear() + 4);

    //
    // cvv
    //

    const cvv =
        String(
            crypto.randomInt(100, 999)
        );

    return {

        number,

        maskedNumber,

        last4,

        expiryMonth,

        expiryYear,

        cvv

    };

}

module.exports = createCardIdentity;
















// // services/cards/createCardIdentity.js

// const crypto = require('crypto');

// const {

//     generateCardNumber,
//     generateMaskedNumber,
//     // generateIBAN,
//     // generateBIC,
//     generateExpiry,
//     generateCVV

// } = require('../../utils/cardGenerator');

// function createCardIdentity() {

//     const number = generateCardNumber();

//     const expiry = generateExpiry();

//     return {

//         number,

//         maskedNumber:
//             generateMaskedNumber(number),

//         last4:
//             number.replace(/\s/g, '').slice(-4),

//         expiryMonth:
//             expiry.month,

//         expiryYear:
//             expiry.year,

//         cvv:
//             generateCVV(),

//         iban:
//             generateIBAN(),

//         bic:
//             generateBIC()

//     };

// }

// module.exports = createCardIdentity;








