const express = require('express');
const encounterController = require('../controllers/encounterController');
const authMiddleware = require('../middleware/authMiddleware');
const validationMiddleware = require('../middleware/validationMiddleware');

const router = express.Router();

router.use(authMiddleware.protect);

router
  .route('/')
  .get(authMiddleware.restrictTo('Doctor', 'Admin'), encounterController.getAllEncounters)
  .post(
    authMiddleware.restrictTo('Doctor', 'Nurse', 'Admin'),
    validationMiddleware.validateEncounter,
    encounterController.createEncounter
  );

module.exports = router;
