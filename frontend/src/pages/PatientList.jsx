import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Edit2, Trash2, Search, X, Check, Loader2, AlertCircle } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPatient, setEditingPatient] = useState(null);
  const [editFormData, setEditFormData] = useState({
    patientCode: '',
    age: '',
    gender: 'Male',
    region: '',
  });
  const { token } = useContext(AuthContext);

  const fetchPatients = async () => {
    try {
      const response = await axios.get('https://healthtech-dashboard.onrender.com/api/v1/patients', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(response.data.data.patients);
    } catch (err) {
      setError('Failed to fetch patients');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [token]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient record? This will not delete their encounters, but they will become unlinked.')) {
      try {
        await axios.delete(`https://healthtech-dashboard.onrender.com/api/v1/patients/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPatients(patients.filter((p) => p._id !== id));
      } catch (err) {
        alert('Failed to delete patient');
      }
    }
  };

  const startEditing = (patient) => {
    setEditingPatient(patient._id);
    setEditFormData({
      patientCode: patient.patientCode,
      age: patient.age,
      gender: patient.gender,
      region: patient.region,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (id) => {
    try {
      const response = await axios.patch(
        `https://healthtech-dashboard.onrender.com/api/v1/patients/${id}`,
        {
          ...editFormData,
          age: parseInt(editFormData.age),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      setPatients(patients.map((p) => (p._id === id ? response.data.data.patient : p)));
      setEditingPatient(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update patient');
    }
  };

  const filteredPatients = patients.filter((p) =>
    p.patientCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        <p className="mt-4 text-gray-600">Loading patient records...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Patient Management</h1>
        <p className="text-gray-600">View, update, or remove patient records.</p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by code or region..."
            className="bg-transparent border-none focus:ring-0 w-full text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Patient Code</th>
                <th className="px-6 py-4 font-semibold">Age</th>
                <th className="px-6 py-4 font-semibold">Gender</th>
                <th className="px-6 py-4 font-semibold">Region</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPatients.map((patient) => (
                <tr key={patient._id} className="hover:bg-gray-50 transition-colors">
                  {editingPatient === patient._id ? (
                    <>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          name="patientCode"
                          value={editFormData.patientCode}
                          onChange={handleEditChange}
                          className="w-full border-gray-300 rounded-md shadow-sm text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          name="age"
                          value={editFormData.age}
                          onChange={handleEditChange}
                          className="w-20 border-gray-300 rounded-md shadow-sm text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <select
                          name="gender"
                          value={editFormData.gender}
                          onChange={handleEditChange}
                          className="border-gray-300 rounded-md shadow-sm text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          name="region"
                          value={editFormData.region}
                          onChange={handleEditChange}
                          className="w-full border-gray-300 rounded-md shadow-sm text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleUpdate(patient._id)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => setEditingPatient(null)}
                            className="p-1 text-gray-400 hover:bg-gray-100 rounded"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 font-medium text-gray-900">{patient.patientCode}</td>
                      <td className="px-6 py-4 text-gray-600">{patient.age}</td>
                      <td className="px-6 py-4 text-gray-600">{patient.gender}</td>
                      <td className="px-6 py-4 text-gray-600">{patient.region}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => startEditing(patient)}
                            className="p-1 text-indigo-600 hover:bg-indigo-50 rounded"
                            title="Edit"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(patient._id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
              {filteredPatients.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No patient records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PatientList;
