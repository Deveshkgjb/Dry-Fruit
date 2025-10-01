import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ManagerLogin from './ManagerLogin.jsx';

const ManagerAuthGuard = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [managerUser, setManagerUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const token = localStorage.getItem('managerToken');
      const user = JSON.parse(localStorage.getItem('managerUser') || 'null');
      
      if (token && user && user.role === 'manager') {
        setIsAuthenticated(true);
        setManagerUser(user);
      } else {
        setIsAuthenticated(false);
        setManagerUser(null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
      setManagerUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('managerToken');
    localStorage.removeItem('managerUser');
    setIsAuthenticated(false);
    setManagerUser(null);
    navigate('/manager-login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <ManagerLogin />;
  }

  // Pass manager user and logout function to children
  return React.cloneElement(children, { managerUser, logout });
};

export default ManagerAuthGuard;
