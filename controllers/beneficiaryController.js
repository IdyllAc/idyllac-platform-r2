// controllers/beneficiaryController.js

const { Beneficiary } = require('../models');



exports.createBeneficiary = async (req, res) => {

        try {

         
            // CREATE
            const beneficiary = await Beneficiary.create({

                userId: req.user.id,

                beneficiaryName:
                    req.body.beneficiaryName,

                iban:
                    req.body.iban,

                bic:
                    req.body.bic,

                bankName:
                    req.body.bankName,

                country:
                    req.body.country,

                currency:
                    req.body.currency,

                transferNetwork:
                    req.body.transferNetwork

            });

            return res.status(201).json({

                success: true,
                beneficiary

            });

        } catch (err) {

            console.error(err);

            res.status(500).json({

                success: false,
                error: err.message

            });

        }

    };


    // LIST
    exports.getBeneficiaries = async (req, res) => {

        try {
    
            const beneficiaries = await Beneficiary.findAll({
    
                where: {
    
                    userId: req.user.id
    
                },
    
                order: [
    
                    ['createdAt', 'DESC']
    
                ]
    
            });
    
            return res.status(201).json({
    
                success: true,
                beneficiaries
    
            });

        } catch (err) {

            console.error(err);

            res.status(500).json({

                success: false,
                error: err.message

            })

         }
    
     };



        // SINGLE
        exports.getBeneficiaryId = async (req, res) => {

            try {
        
                const beneficiary = await Beneficiary.findOne({
        
                    where: {
        
                        id: req.params.id,
        
                        userId: req.user.id
        
                    }
        
                });
        
                if (!beneficiary) {
        
                    return res.status(404).json({

                        success: false,
                        error: 'Beneficiary not found'
        
                    });
        
                }
        
                return res.status(201).json({
        
                    success: true,
                    beneficiary
        
                });

            } catch (err) {

                console.error(err);

                res.status(500).json({

                    success: false,
    
                    error: err.message
    
                });
    
            }
        
        };



        // UPDATE   
        exports.updateBeneficiary = async (req, res) => {

            try {

                const beneficiary = await Beneficiary.findOne({

                     where: {

                     id: req.params.id,

                     userId: req.user.id

                }

            });

            if (!beneficiary) {

                return res.status(404).json({

                    success: false,

                    error: 'Beneficiary not found'

                });

            }

            if (req.body.beneficiaryName) {

                beneficiary.beneficiaryName =
                      req.body.beneficiaryName;

            }

            if (req.body.isFavorite !== undefined) {

                beneficiary.isFavorite =
                      req.body.isFavorite;

            }

            await beneficiary.save();

                return res.status(201).json({

                    success: true,
                    beneficiary

            });

        } catch (err) {

            console.error(err);

            res.status(500).json({

                success: false,
                error: err.message

            });

         }

     };



          
        // DELETE
        exports.deleteBeneficiary = async (req, res) => {

            try {

             const beneficiary = await Beneficiary.findOne({

                    where: {

                    id: req.params.id,

                    userId: req.user.id

             }

        });

                   if (!beneficiary) {

                      return res.status(404).json({

                           error: 'Beneficiary not found'

                    });

               }

                     await beneficiary.destroy();

                         return res.status(201).json({

                             success: true,
                             beneficiary

                    });

                   } catch (err) {

                        console.error(err);

                            return res.status(500).json ({

                                success: false,
                                error: err.message

                       })

                   }

            };

        