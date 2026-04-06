const { body, validationResult } = require('express-validator');

exports.validateEncounter = [
  body('patientId').isMongoId().withMessage('Invalid patient ID'),
  body('symptoms').isArray({ min: 1 }).withMessage('Symptoms must be an array and not empty'),
  body('diagnosis').notEmpty().withMessage('Diagnosis is required'),
  body('treatment').notEmpty().withMessage('Treatment is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'fail', errors: errors.array() });
    }
    next();
  },
];

exports.validatePatient = [
  body('patientCode').notEmpty().withMessage('Patient code is required'),
  body('age').isInt({ min: 0 }).withMessage('Valid age is required'),
  body('gender').isIn(['Male', 'Female', 'Other']).withMessage('Invalid gender'),
  body('region').notEmpty().withMessage('Region is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'fail', errors: errors.array() });
    }
    next();
  },
];
