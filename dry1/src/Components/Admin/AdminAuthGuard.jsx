import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api.js';

const AdminAuthGuard = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        navigate('/admin-login');
        return;
      }

      // Verify token with backend
      const response = await authAPI.getAdminProfile();
      
      if (response.user && response.user.role === 'admin') {
        setAdminUser(response.user);
        setIsAuthenticated(true);
      } else {
        // Invalid token or not admin
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin-login');
      }
    } catch (error) {
      console.error('Admin auth check failed:', error);
      // Token is invalid or expired
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      navigate('/admin-login');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authAPI.adminLogout();
    localStorage.removeItem('adminUser');
    setIsAuthenticated(false);
    setAdminUser(null);
    navigate('/admin-login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  // Pass admin user and logout function to children
  return React.cloneElement(children, { 
    adminUser, 
    logout 
  });
};

export default AdminAuthGuard;
