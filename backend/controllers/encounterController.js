const Encounter = require('../models/encounterModel');

exports.createEncounter = async (req, res) => {
  try {
    const newEncounter = await Encounter.create({
      ...req.body,
      clinicianId: req.user.id,
    });

    res.status(201).json({
      status: 'success',
      data: {
        encounter: newEncounter,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getAllEncounters = async (req, res) => {
  try {
    const encounters = await Encounter.find()
      .populate('patientId', 'patientCode age gender region')
      .populate('clinicianId', 'name role');

    res.status(200).json({
      status: 'success',
      results: encounters.length,
      data: {
        encounters,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};
