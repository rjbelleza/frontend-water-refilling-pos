import React, { createContext, useState, useContext, useEffect } from 'react';

// Create a context for user credentials
const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Initialize as null or {}

  // Load user from localStorage on initial render
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem('user'); // Clear invalid data
      }
    }
  }, []);

  // Function to log in the user
  const login = (credentials) => {
    setUser(credentials);
    localStorage.setItem('user', JSON.stringify(credentials)); // Save to local storage
  };

  // Function to log out the user
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user'); // Clear local storage
  };

  // Function to check if the user has a specific role
  const hasRole = (requiredRole) => {
    return user && user.role === requiredRole; // Ensure user is defined
  };

  return (
    <UserContext.Provider value={{ user, login, logout, hasRole }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUser = () => useContext(UserContext);
