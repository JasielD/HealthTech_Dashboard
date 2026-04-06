import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Stethoscope, AlertCircle, CheckCircle } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const NewEncounter = () => {
  const [formData, setFormData] = useState({
    patientCode: '',
    age: '',
    gender: 'Male',
    region: '',
    symptoms: '',
    diagnosis: '',
    treatment: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Basic Validation
    if (parseInt(formData.age) < 0) {
      setError('Age must be a positive number');
      setIsLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // 1) Create or update patient
      const patientResponse = await axios.post(
        'http://localhost:5000/api/v1/patients',
        {
          patientCode: formData.patientCode,
          age: parseInt(formData.age),
          gender: formData.gender,
          region: formData.region,
        },
        config
      );

      const patientId = patientResponse.data.data.patient._id;

      // 2) Create encounter
      await axios.post(
        'http://localhost:5000/api/v1/encounters',
        {
          patientId,
          symptoms: formData.symptoms.split(',').map((s) => s.trim()),
          diagnosis: formData.diagnosis,
          treatment: formData.treatment,
        },
        config
      );

      setSuccess('Encounter recorded successfully!');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error recording encounter. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Stethoscope className="w-8 h-8 text-indigo-600" />
          New Clinical Encounter
        </h1>
        <p className="mt-2 text-gray-600">Enter patient details and clinical findings.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-sm text-green-700">{success}</span>
          </div>
        )}

        <div className="bg-white shadow sm:rounded-lg overflow-hidden border border-gray-200">
          <div className="p-6 space-y-4">
            <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-gray-400" />
              Patient Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Patient Code</label>
                <input
                  type="text"
                  name="patientCode"
                  required
                  value={formData.patientCode}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="P-12345"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Age</label>
                <input
                  type="number"
                  name="age"
                  required
                  value={formData.age}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="25"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Region</label>
                <input
                  type="text"
                  name="region"
                  required
                  value={formData.region}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Western Province"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow sm:rounded-lg overflow-hidden border border-gray-200">
          <div className="p-6 space-y-4">
            <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-gray-400" />
              Clinical Findings
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Symptoms (comma separated)</label>
              <textarea
                name="symptoms"
                required
                value={formData.symptoms}
                onChange={handleChange}
                rows={2}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Fever, Cough, Muscle pain"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Diagnosis</label>
              <input
                type="text"
                name="diagnosis"
                required
                value={formData.diagnosis}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Viral Fever"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Treatment Plan</label>
              <textarea
                name="treatment"
                required
                value={formData.treatment}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Prescribed Paracetamol 500mg every 6 hours..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto flex justify-center py-3 px-8 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Submitting...' : 'Save Encounter'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewEncounter;
