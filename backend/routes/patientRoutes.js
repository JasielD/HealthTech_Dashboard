const express = require('express');
const patientController = require('../controllers/patientController');
const authMiddleware = require('../middleware/authMiddleware');
const validationMiddleware = require('../middleware/validationMiddleware');

const router = express.Router();

router.use(authMiddleware.protect);

router
  .route('/')
  .get(authMiddleware.restrictTo('Admin', 'Doctor'), patientController.getAllPatients)
  .post(
    authMiddleware.restrictTo('Admin', 'Doctor', 'Nurse'),
    validationMiddleware.validatePatient,
    patientController.createPatient
  );

router
  .route('/:id')
  .patch(
    authMiddleware.restrictTo('Admin', 'Doctor'),
    validationMiddleware.validatePatient,
    patientController.updatePatient
  )
  .delete(
    authMiddleware.restrictTo('Admin', 'Doctor'),
    patientController.deletePatient
  );

module.exports = router;
