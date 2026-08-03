// routes/beneficiary.js

const express = require('express');
const router = express.Router();

const combinedAuth = require('../middleware/combinedAuth');
const beneficiaryController = require('../controllers/beneficiaryController');



// CREATE
router.post('/', combinedAuth, beneficiaryController.createBeneficiary);

// LIST
router.get('/', combinedAuth, beneficiaryController.getBeneficiaries);

// SINGLE
router.get('/:id', combinedAuth, beneficiaryController.getBeneficiaryId);

// UPDATE
router.patch('/:id', combinedAuth, beneficiaryController.updateBeneficiary);

// DELETE
router.delete('/:id', combinedAuth, beneficiaryController.deleteBeneficiary);


module.exports = router;




// // routes/beneficiary.js

// const express = require('express');
// const router = express.Router();

// const combinedAuth =
// require('../middleware/combinedAuth');

// const {
//     Beneficiary
// } = require('../models');


// // ===================================
// // GET ALL BENEFICIARIES
// // ===================================

// router.get(
// '/',
// combinedAuth,
// async (req, res) => {

//     try {

//         const beneficiaries =
//         await Beneficiary.findAll({

//             where: {
//                 userId: req.user.id
//             },

//             order: [['createdAt', 'DESC']]

//         });

//         return res.json({

//             success: true,
//             beneficiaries

//         });

//     }

//     catch (error) {

//         console.error(error);

//         return res.status(500).json({

//             success: false,
//             error: error.message

//         });

//     }

// });


// // ===================================
// // GET ONE BENEFICIARY
// // ===================================

// router.get(
// '/:id',
// combinedAuth,
// async (req, res) => {

//     try {

//         const beneficiary =
//         await Beneficiary.findOne({

//             where: {

//                 id: req.params.id,
//                 userId: req.user.id

//             }

//         });

//         if (!beneficiary) {

//             return res.status(404).json({

//                 success: false,
//                 error: 'Beneficiary not found'

//             });

//         }

//         return res.json({

//             success: true,
//             beneficiary

//         });

//     }

//     catch (error) {

//         return res.status(500).json({

//             success: false,
//             error: error.message

//         });

//     }

// });


// // ===================================
// // CREATE BENEFICIARY
// // ===================================

// router.post(
// '/',
// combinedAuth,
// async (req, res) => {

//     try {

//         const {

//             beneficiaryName,
//             iban,
//             bic,
//             bankName,
//             country,
//             currency,
//             transferNetwork

//         } = req.body;

//         const beneficiary =
//         await Beneficiary.create({

//             userId: req.user.id,

//             beneficiaryName,
//             iban,
//             bic,
//             bankName,

//             country: country || 'FR',

//             currency: currency || 'EUR',

//             transferNetwork:
//                 transferNetwork || 'SEPA'

//         });

//         return res.status(201).json({

//             success: true,
//             beneficiary

//         });

//     }

//     catch (error) {

//         return res.status(500).json({

//             success: false,
//             error: error.message

//         });

//     }

// });


// // ===================================
// // DELETE BENEFICIARY
// // ===================================

// router.delete(
// '/:id',
// combinedAuth,
// async (req, res) => {

//     try {

//         const deleted =
//         await Beneficiary.destroy({

//             where: {

//                 id: req.params.id,
//                 userId: req.user.id

//             }

//         });

//         if (!deleted) {

//             return res.status(404).json({

//                 success: false,
//                 error: 'Beneficiary not found'

//             });

//         }

//         return res.json({

//             success: true,
//             message: 'Beneficiary deleted'

//         });

//     }

//     catch (error) {

//         return res.status(500).json({

//             success: false,
//             error: error.message

//         });

//     }

// });


// module.exports = router;