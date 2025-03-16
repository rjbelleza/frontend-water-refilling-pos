import React, { createContext, useState, useContext, useEffect } from 'react';

// Create a context for user credentials
const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Initialize as null
  const [loading, setLoading] = useState(true); // Add a loading state

  // Load user from localStorage on initial render
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser); // Automatically log in the user
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem('user'); // Clear invalid data
      }
    }
    setLoading(false); // Set loading to false after checking localStorage
  }, []);

  // Function to log in the user
  const login = (credentials, rememberMe = false) => {
    setUser(credentials);
    if (rememberMe) {
      localStorage.setItem('user', JSON.stringify(credentials)); // Save to local storage
    } else {
      sessionStorage.setItem('user', JSON.stringify(credentials)); // Save to session storage
    }
  };

  // Function to log out the user
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user'); // Clear local storage
    sessionStorage.removeItem('user'); // Clear session storage
  };

  // Function to check if the user has a specific role
  const hasRole = (requiredRole) => {
    return user && user.role === requiredRole; // Ensure user is defined
  };

  return (
    <UserContext.Provider value={{ user, login, logout, hasRole, loading }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUser = () => useContext(UserContext);
