// routes/beneficiary.js

const express = require('express');
const router = express.Router();

const combinedAuth = require('../middleware/combinedAuth');

const { Beneficiary } = require('../models');


// CREATE

router.post(
'/',
combinedAuth,
async(req,res)=>{

try{

const beneficiary =
await Beneficiary.create({

userId:req.user.id,

beneficiaryName:
req.body.beneficiaryName,

iban:req.body.iban,

bic:req.body.bic,

bankName:req.body.bankName,

country:req.body.country,

currency:req.body.currency,

transferNetwork:
req.body.transferNetwork

});

res.status(201).json({

success:true,
beneficiary

});

}catch(err){

res.status(500).json({

error:err.message

});

}

});




// LIST

router.get(
'/',
combinedAuth,
async(req,res)=>{

const beneficiaries =
await Beneficiary.findAll({

where:{
userId:req.user.id
},

order:[
['createdAt','DESC']
]

});

res.json({

success:true,
beneficiaries

});

});




// SINGLE

router.get(
'/:id',
combinedAuth,
async(req,res)=>{

const beneficiary =
await Beneficiary.findOne({

where:{
id:req.params.id,
userId:req.user.id
}

});

if(!beneficiary){

return res.status(404).json({

error:'Beneficiary not found'

});

}

res.json({

success:true,
beneficiary

});

});




// UPDATE

router.patch(
'/:id',
combinedAuth,
async(req,res)=>{

const beneficiary =
await Beneficiary.findOne({

where:{
id:req.params.id,
userId:req.user.id
}

});

if(!beneficiary){

return res.status(404).json({

error:'Beneficiary not found'

});

}

if(req.body.beneficiaryName){

beneficiary.beneficiaryName =
req.body.beneficiaryName;

}

if(
req.body.isFavorite !== undefined
){

beneficiary.isFavorite =
req.body.isFavorite;

}

await beneficiary.save();

res.json({

success:true,
beneficiary

});

});




// DELETE

router.delete(
'/:id',
combinedAuth,
async(req,res)=>{

const beneficiary =
await Beneficiary.findOne({

where:{
id:req.params.id,
userId:req.user.id
}

});

if(!beneficiary){

return res.status(404).json({

error:'Beneficiary not found'

});

}

await beneficiary.destroy();

res.json({

success:true

});

});

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