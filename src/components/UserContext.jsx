import React, { createContext, useState, useContext } from 'react';

// Create a context for user credentials
const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState("");

  // Function to log in the user
  const login = (credentials) => {
    setUser(credentials);
    localStorage.setItem('user', JSON.stringify(credentials)); // Save to local storage
  };

  // Function to log out the user
  const logout = () => {
    setUser("");
    localStorage.removeItem('user'); // Clear local storage
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUser = () => useContext(UserContext);
