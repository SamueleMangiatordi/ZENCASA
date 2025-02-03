import React, { createContext, useState, useContext, useEffect} from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('jwt'));
  const [role, setRole] = useState(localStorage.getItem('role') || null);

  // Controlla il token e il ruolo dell'utente al caricamento dell'app
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    const savedRole = localStorage.getItem('role');
    if (token) {
      setIsAuthenticated(true);
      setRole(savedRole); // Imposta il ruolo salvato
    }
  }, []);

  const login = (token, role = 'user') => {
    localStorage.setItem('jwt', token);
    localStorage.setItem('role', role); // Salva anche il ruolo dell'utente
    setIsAuthenticated(true);
    setRole(role);
  };

  const logout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);