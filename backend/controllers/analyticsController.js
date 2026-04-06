const Encounter = require('../models/encounterModel');
const Patient = require('../models/patientModel');

exports.getDiagnosisTrends = async (req, res) => {
  try {
    const diagnosisTrends = await Encounter.aggregate([
      {
        $group: {
          _id: {
            month: { $month: '$timestamp' },
            year: { $year: '$timestamp' },
            diagnosis: '$diagnosis',
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    const regionDistribution = await Patient.aggregate([
      {
        $group: {
          _id: '$region',
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        diagnosisTrends,
        regionDistribution,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};
