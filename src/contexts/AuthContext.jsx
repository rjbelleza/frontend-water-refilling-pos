import api from '../api/axios';
import { createContext, useContext, useState, useEffect } from 'react';

// Create auth context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isClose, setIsClose] = useState(true);
  const [isDropped, setIsDropped] = useState(true);


  const dropped = () => {
    setIsDropped((prev) => !prev);
  }

  const close = () => {
    setIsClose((prev) => !prev);
  }
  
  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);
  
  // Fetch current user
  const fetchUser = async () => {
    try {
      const response = await api.get('/user');
      setUser(response.data.user);
    } catch (error) {
      localStorage.removeItem('auth_token');
    } finally {
      setLoading(false);
    }
  };
  
  // Login function
  const login = async (username, password) => {
    const response = await api.post('/login', {
      username,
      password,
      device_name: 'web',
    });
    
    const { token, user } = response.data;
    
    localStorage.setItem('auth_token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    setUser(user);
    
    return user;
  };
  
  // Logout function
  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      localStorage.removeItem('auth_token');
      api.defaults.headers.common['Authorization'] = '';
      setUser(null);
    }
  };
  
  // Register function
  const register = async (userData) => {
    const response = await api.post('/register', {
      ...userData,
      device_name: 'web',
    });
    
    const { token, user } = response.data;
    
    localStorage.setItem('auth_token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    setUser(user);
    
    return user;
  };
  
  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, close, isClose, setIsClose, isDropped, dropped }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
