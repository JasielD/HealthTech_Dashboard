import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // Decode JWT to get user info (assuming standard JWT structure where payload is base64 encoded)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // In a real app, you might want to fetch full user details from the backend using the token
        // For now, we will store the payload which typically contains the user ID and sometimes role.
        // But since our backend login sends the user object, let's just store the user object in localStorage too.
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Invalid token', error);
        logout();
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post('https://healthtech-dashboard.onrender.com/api/v1/users/login', { email, password });
      const { token, data } = response.data;
      
      setToken(token);
      setUser(data.user);
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const signup = async (name, email, password, role) => {
    try {
      const response = await axios.post('https://healthtech-dashboard.onrender.com/api/v1/users/signup', { name, email, password, role });
      const { token, data } = response.data;
      
      setToken(token);
      setUser(data.user);
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Signup failed' 
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
