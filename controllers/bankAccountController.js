// controllers/bankAccountController.js
const { BankAccount } = require('../models');
const createAccount = require('../services/bankAccounts/createAccount');
const getAccounts = require('../services/bankAccounts/getAccounts');
const getAccount = require('../services/bankAccounts/getAccount');
const updateAccount = require('../services/bankAccounts/updateAccount');
const freezeAccount = require('../services/bankAccounts/freezeAccount');
const unfreezeAccount = require('../services/bankAccounts/unfreezeAccount');
const closeAccount = require('../services/bankAccounts/closeAccount');
const setPrimaryAccount = require('../services/bankAccounts/setPrimaryAccount');



exports.getAccounts = async (req, res) => {

    try {

        const accounts = await getAccounts({

            userId: req.user.id

        });

        return res.json({

            success: true,
            accounts

        });

    } catch (err) {

        return res.status(500).json({

            success: false,
            error: err.message

        });

    }

};



exports.getAccount = async (req, res) => {

    try {

        const account = await getAccount({

        
                id: req.params.id,
                userId: req.user.id
         

        });

         if (!account) {

             return res.status(404).json({

                 success: false,
                 error: 'Account not found'

             });

         }

         return res.json({

             success: true,
            
             account
            
         });


    } catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,
            error: err.message

        });

    }

};



exports.createAccount = async (req, res) => {
    try {

        const account = await createAccount({
            userId: req.user.id,
            body: req.body
        });

        return res.status(201).json({
            success: true,
            account
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            error: err.message
        });

    }
};




exports.updateAccount = async (req, res) => {

    try {

        const account = await BankAccount.findOne({

            where: {

                id: req.params.id,
                userId: req.user.id

            }

        });

        if (!account) {

            return res.status(404).json({

                success: false,
                error: 'Account not found'

            })

        }


    const updatedAccount =
    await updateAccount({

        account,
        updates: req.body

    });

    return res.json({

        success: true,
        account: updatedAccount

    });

    } catch (err) {

    console.error(err);

    return res.status(500).json({

        success: false,
        error: err.message

    });

 }

};




exports.freezeAccount = async (req, res) => {

    try {

        const account = await BankAccount.findOne({

            where: {
                id: req.params.id,
                userId: req.user.id
            }

        });

        if (!account) {

            return res.status(404).json({

                success: false,
                error: 'Account not found'

            });

        }

       await freezeAccount({

          account

      });

        return res.json({

            success: true,
            account

        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,
            error: err.message

        });

    }

};



exports.unfreezeAccount = async (req, res) => {

    try {

        const account = await BankAccount.findOne({

            where: {
                id: req.params.id,
                userId: req.user.id
            }

        });

        if (!account) {

            return res.status(404).json({

                success: false,
                error: 'Account not found'

            });

        }

        await unfreezeAccount({

            account
        
        });

        return res.json({

            success: true,
            account

        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,
            error: err.message

        });

    }

};



exports.closeAccount = async (req, res) => {

    try {

        const account = await BankAccount.findOne({

            where: {
                id: req.params.id,
                userId: req.user.id
            }

        });

        if (!account) {

            return res.status(404).json({

                success: false,
                error: 'Account not found'

            });

        }

        const updatedAccount = 
        await closeAccount({

            account
        
        });

        return res.json({

            success: true,
            account: updatedAccount

        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,
            error: err.message

        });

    }

};



exports.setPrimaryAccount = async (req, res) => {

    try {

        const account = await BankAccount.findOne({

            where: {
                id: req.params.id,
                userId: req.user.id
            }

        });

        if (!account) {

            return res.status(404).json({

                success: false,
                error: 'Account not found'

            });

        }

        const updatedAccount =
            await setPrimaryAccount({

                account,
                userId: req.user.id

            });

            return res.json({

                success: true,
                account: updatedAccount

            });

        } catch (err) {

               console.error(err);

               return res.status(500).json({

               success: false,
               error: err.message

            });

        }

    };


       