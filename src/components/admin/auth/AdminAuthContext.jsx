import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_ENDPOINTS, apiCall } from '../../../config/api';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [adminInfo, setAdminInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if admin is authenticated on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('adminAccessToken');
      const storedAdminInfo = localStorage.getItem('adminInfo');

      if (!token || !storedAdminInfo) {
        setIsAuthenticated(false);
        setAdminInfo(null);
        setIsLoading(false);
        return;
      }

      // Try to refresh token to verify it's still valid
      const response = await apiCall(API_ENDPOINTS.ADMIN_REFRESH);

      if (response.ok) {
        const result = await response.json();
        
        // Update token if refreshed
        localStorage.setItem('adminAccessToken', result.accessToken);
        
        // Set admin info
        const parsedAdminInfo = JSON.parse(storedAdminInfo);
        setAdminInfo(parsedAdminInfo);
        setIsAuthenticated(true);
      } else {
        // Token invalid, clear storage
        localStorage.removeItem('adminAccessToken');
        localStorage.removeItem('adminInfo');
        setIsAuthenticated(false);
        setAdminInfo(null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
      setAdminInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (token, adminData) => {
    localStorage.setItem('adminAccessToken', token);
    localStorage.setItem('adminInfo', JSON.stringify(adminData));
    setAdminInfo(adminData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      // Call logout API
      await apiCall(API_ENDPOINTS.ADMIN_LOGOUT, { method: 'DELETE' });
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear local storage and state
      localStorage.removeItem('adminAccessToken');
      localStorage.removeItem('adminInfo');
      setAdminInfo(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    adminInfo,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuthStatus
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};