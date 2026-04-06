const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  patientCode: {
    type: String,
    required: [true, 'Patient must have a unique code'],
    unique: true,
  },
  age: {
    type: Number,
    required: [true, 'Patient must have an age'],
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: [true, 'Patient must have a gender'],
  },
  region: {
    type: String,
    required: [true, 'Patient must have a region'],
  },
}, {
  timestamps: true,
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
