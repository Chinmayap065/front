import React, { createContext, useState, useContext } from 'react';

// 1. Create the context
const AuthContext = createContext(null);

// 2. Create the provider component
export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage to stay logged in on refresh
  const [token, setToken] = useState(() => localStorage.getItem("tripsterToken"));
  const [username, setUsername] = useState(() => localStorage.getItem("tripsterUser"));

  // Function to log in
  const login = (token, user) => {
    localStorage.setItem("tripsterToken", token);
    localStorage.setItem("tripsterUser", user);
    setToken(token);
    setUsername(user);
  };

  // Function to log out
  const logout = () => {
    localStorage.removeItem("tripsterToken");
    localStorage.removeItem("tripsterUser");
    setToken(null);
    setUsername(null);
  };

  // The value that will be available to all children
  const authValue = {
    token,
    username,
    isLoggedIn: !!token, // True if token exists, false otherwise
    login,
    logout
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Create a custom hook for easy access
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};