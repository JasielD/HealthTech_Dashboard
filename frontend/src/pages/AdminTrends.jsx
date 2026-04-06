import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { LayoutDashboard, TrendingUp, MapPin, Loader2 } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const AdminTrends = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const response = await axios.get('https://healthtech-dashboard.onrender.com/api/v1/analytics/trends', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { diagnosisTrends, regionDistribution } = response.data.data;

        // Process line chart data: Group by Month/Year
        const months = [...new Set(diagnosisTrends.map(t => `${t._id.month}/${t._id.year}`))];
        const lineChartData = months.map(m => {
          const [month, year] = m.split('/').map(Number);
          const monthData = { name: m };
          
          const viralFever = diagnosisTrends.find(t => t._id.month === month && t._id.year === year && t._id.diagnosis === 'Viral Fever');
          const diabetes = diagnosisTrends.find(t => t._id.month === month && t._id.year === year && t._id.diagnosis === 'Diabetes');
          
          monthData['Viral Fever'] = viralFever ? viralFever.count : 0;
          monthData['Diabetes'] = diabetes ? diabetes.count : 0;
          
          return monthData;
        });

        // Process pie chart data
        const pieChartData = regionDistribution.map(r => ({
          name: r._id,
          value: r.count,
        }));

        setData({ lineChartData, pieChartData });
      } catch (err) {
        setError('Failed to fetch analytics data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrends();
  }, [token]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        <p className="mt-4 text-gray-600">Loading clinical analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <LayoutDashboard className="w-8 h-8 text-indigo-600" />
          Administrative Analytics
        </h1>
        <p className="text-gray-600">Real-time health trends across regions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Line Chart: Diagnosis Trends */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 min-w-0">
          <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-500" />
            Diagnosis Trends (Last 6 Months)
          </h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="99%" height="100%">
              <LineChart data={data.lineChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Viral Fever" stroke="#4f46e5" strokeWidth={2} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="Diabetes" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Region Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 min-w-0">
          <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-indigo-500" />
            Patient Distribution by Region
          </h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="99%" height="100%">
              <PieChart>
                <Pie
                  data={data.pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTrends;
