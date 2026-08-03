// routes/statements.js

const express = require('express');

const router = express.Router();

const combinedAuth =
    require('../middleware/combinedAuth');

const {
    buildStatement
} = require(
    '../services/statements/statementService'
);

router.get(
'/account/:accountId',

combinedAuth,

async (req, res) => {

    try {

        const {

            from,
            to

        } = req.query;

        const statement =
            await buildStatement({

                accountId:
                    req.params.accountId,

                fromDate:
                    new Date(from),

                toDate:
                    new Date(to)

            });

        return res.json({

            success: true,

            statement

        });

    }

    catch (err) {

        console.error(err);

        return res.status(500).json({

            error:
                err.message

        });

    }

});

module.exports = router;