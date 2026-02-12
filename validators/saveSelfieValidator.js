// validators/saveSelfieValidator.js
const { body } = require('express-validator');

exports.saveSelfieValidator = [
  body('key').isString().notEmpty().withMessage('Selfie R2 key is required'),
];
