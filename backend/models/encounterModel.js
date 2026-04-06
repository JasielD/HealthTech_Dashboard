const mongoose = require('mongoose');

const encounterSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'Encounter must belong to a patient'],
  },
  clinicianId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Encounter must have a clinician'],
  },
  symptoms: {
    type: [String],
    required: [true, 'Encounter must have symptoms'],
  },
  diagnosis: {
    type: String,
    required: [true, 'Encounter must have a diagnosis'],
  },
  treatment: {
    type: String,
    required: [true, 'Encounter must have a treatment'],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

const Encounter = mongoose.model('Encounter', encounterSchema);

module.exports = Encounter;
