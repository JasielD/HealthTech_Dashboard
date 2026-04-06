import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Stethoscope, LineChart, LogOut, Users, User as UserIcon } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const Navigation = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: Home, roles: ['Admin', 'Doctor', 'Nurse'] },
    { name: 'Manage Patients', path: '/patients', icon: Users, roles: ['Admin', 'Doctor'] },
    { name: 'New Encounter', path: '/new-encounter', icon: Stethoscope, roles: ['Doctor', 'Nurse', 'Admin'] },
    { name: 'Admin Trends', path: '/admin-trends', icon: LineChart, roles: ['Admin'] },
  ];

  const visibleLinks = navLinks.filter((link) => link.roles.includes(user?.role));

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen bg-white border-r border-gray-200 shadow-sm fixed left-0 top-0">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
            <Stethoscope className="w-8 h-8" />
            HealthTech
          </h1>
        </div>
        
        <div className="flex flex-col px-4 flex-1">
          <nav className="flex-1 space-y-2 mt-4">
            {visibleLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-indigo-50 text-indigo-700 font-semibold' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  {link.name}
                </NavLink>
              );
            })}
          </nav>
          
          <div className="py-6 mt-auto border-t border-gray-100">
            <div className="flex items-center gap-3 px-4 mb-4">
              <div className="bg-indigo-100 p-2 rounded-full">
                <UserIcon className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900">{user?.name}</span>
                <span className="text-xs text-gray-500">{user?.role}</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 z-50 pb-safe">
        <div className="flex justify-around items-center h-16">
          {visibleLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center w-full h-full space-y-1 ${
                    isActive ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'
                  }`
                }
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{link.name}</span>
              </NavLink>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center justify-center w-full h-full space-y-1 text-gray-500 hover:text-red-600"
          >
            <LogOut className="w-6 h-6" />
            <span className="text-xs font-medium">Logout</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
