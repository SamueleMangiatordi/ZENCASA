import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(); //crea contesto globale per l'autenticazione, utilizzato in tutta l'app

//avvolge l'intera app, tutti i componenti figli possono accedere al contesto
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("jwt") //controlla se esiste il token, se si imposta true
  );
  const [role, setRole] = useState(localStorage.getItem("role") || null); //recupera ruolo (admin, servizioClienti, utente)

  // Controlla il token e il ruolo dell'utente al caricamento dell'app
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    const savedRole = localStorage.getItem("role");
    if (token) {
      setIsAuthenticated(true);
      setRole(savedRole); // Imposta il ruolo salvato
    }
  }, []);

  const login = (token, role = "user") => {
    localStorage.setItem("jwt", token); // quando effettui il login, salva il token
    localStorage.setItem("role", role); // Salva anche il ruolo dell'utente
    setIsAuthenticated(true);
    setRole(role);
  };

  const logout = () => {
    localStorage.removeItem("jwt"); //al logout, rimuovi token e ruolo
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    setRole(null);
  };

  //rende disponibili le funzioni a tutti i componenti
  return (
    <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
