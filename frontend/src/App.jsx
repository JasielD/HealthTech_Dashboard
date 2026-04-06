import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Users, Activity, ClipboardList, ShieldAlert } from 'lucide-react';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navigation from './components/Navigation';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NewEncounter from './pages/NewEncounter';
import AdminTrends from './pages/AdminTrends';
import PatientList from './pages/PatientList';
import AuthContext from './context/AuthContext';

const Dashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [stats, setStats] = useState({ patients: 0, encounters: 0 });
  const navigate = useNavigate()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const patientsRes = await axios.get('http://localhost:5000/api/v1/patients', config);
        const encountersRes = await axios.get('http://localhost:5000/api/v1/encounters', config);
        setStats({
          patients: patientsRes.data.results,
          encounters: encountersRes.data.results
        });
      } catch (err) {
        console.error('Error fetching stats', err);
      }
    };
    if (user.role !== 'Nurse') fetchStats(); // Nurses might not have access to getAll
  }, [token, user.role]);

  const cards = [
    { title: 'Total Patients', value: stats.patients, icon: Users, color: 'bg-blue-500' },
    { title: 'Total Encounters', value: stats.encounters, icon: Activity, color: 'bg-green-500' },
    { title: 'Your Role', value: user.role, icon: ShieldAlert, color: 'bg-purple-500' },
  ];

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}</h1>
        <p className="text-gray-600">Here's what's happening in your clinic today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
              <div className={`${card.color} p-3 rounded-lg text-white`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 bg-indigo-600 rounded-2xl p-8 text-white relative overflow-hidden shadow-lg">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">Ready to record a new encounter?</h2>
          <p className="text-indigo-100 mb-6 max-w-md">Quickly log patient symptoms and diagnosis using our mobile-friendly form.</p>
          <button 
            onClick={() => navigate('/new-encounter')}
            className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
          >
            Start New Form
          </button>
        </div>
        <ClipboardList className="absolute right-[-20px] bottom-[-20px] w-48 h-48 text-indigo-500 opacity-20" />
      </div>
    </div>
  );
};

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <Navigation />
      <main className="flex-1 md:ml-64 pb-20 md:pb-0">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route element={<ProtectedRoute allowedRoles={['Admin', 'Doctor', 'Nurse']} />}>
            <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          </Route>
          
          <Route element={<ProtectedRoute allowedRoles={['Admin', 'Doctor']} />}>
            <Route path="/patients" element={<Layout><PatientList /></Layout>} />
          </Route>
          
          <Route element={<ProtectedRoute allowedRoles={['Doctor', 'Nurse', 'Admin']} />}>
            <Route path="/new-encounter" element={<Layout><NewEncounter /></Layout>} />
          </Route>
          
          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route path="/admin-trends" element={<Layout><AdminTrends /></Layout>} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
