   // middleware/idempotency.js
   const { IdempotencyKey } = require('../models');

module.exports = async function idempotency(req, res, next) {
  const key = req.headers['idempotency-key'];

  if (!key) {
    return res.status(400).json({ error: 'Missing idempotency key' });
  }

  const userId = req.user.id;

  try {
    // 1. ATOMIC CREATE (race-safe because of UNIQUE constraint)
    const [record, created] = await IdempotencyKey.findOrCreate({
      where: {
        key,
        userId,
        endpoint: req.originalUrl,
        method: req.method
      },
      defaults: {
        status: 'PROCESSING'
      }
    });

    // 2. CASE: already completed → RETURN STORED RESPONSE (NO RE-RUN)
    if (!created && record.status === 'COMPLETED') {
      return res.json(record.response);
    }

    // 3. CASE: already processing → BLOCK (race condition protection)
    if (!created && record.status === 'PROCESSING') {
      return res.status(409).json({
        error: 'Request already in progress'
      });
    }

    // 4. attach record for later update
    req.idempotencyRecord = record;

    next();

  } catch (err) {
    return res.status(500).json({
      error: 'Idempotency system failure'
    });
  }
};







// const {IdempotencyKey} = require('../models');
  
//   async function idempotency(req, res, next) {
  
//     try {
  
//       const key =
//         req.headers['idempotency-key'];
  
//       if (!key) {
  
//         return res.status(400).json({
//           error:
//             'Idempotency-Key header required'
//         });
  
//       }
  
//       // ===================================
//       // CHECK EXISTING KEY
//       // ===================================
  
//       const existing =
//         await IdempotencyKey.findOne({
  
//           where: {
//             key
//           }
  
//         });
  
//       // ===================================
//       // ALREADY COMPLETED
//       // ===================================
  
//       if (
//         existing &&
//         existing.status === 'COMPLETED'
//       ) {
  
//         return res.json(
//           existing.response
//         );
  
//       }
  
//       // ===================================
//       // ALREADY PROCESSING
//       // ===================================
  
//       if (
//         existing &&
//         existing.status === 'PROCESSING'
//       ) {
  
//         return res.status(409).json({
//           error:
//             'Request already processing'
//         });
  
//       }
  
//       // ===================================
//       // CREATE NEW KEY
//       // ===================================
  
//       const record =
//         await IdempotencyKey.create({
  
//           key,
  
//           endpoint: req.originalUrl,
  
//           method: req.method,
  
//           status: 'PROCESSING'
  
//         });
  
//       // ===================================
//       // SAVE FOR ROUTE USAGE
//       // ===================================
  
//       req.idempotencyRecord =
//         record;
  
//       next();
  
//     } catch (err) {
  
//       console.error(err);
  
//       return res.status(500).json({
//         error:
//           'Idempotency engine failed'
//       });
  
//     }
  
//   }
  
//   module.exports =
//     idempotency;