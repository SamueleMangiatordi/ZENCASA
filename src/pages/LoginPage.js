import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Importa Link
import { useAuth } from '../data/authContext';
import { API_URL } from '../data/api';

import {
  LoginContainer,
  LoginForm,
  LoginTitle,
  LoginLabel,
  LoginInput,
  LoginButton,
  RegistrationLink
} from '../styles/StyledLoginComponents';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    identifier: '', // This can be username or email
    password: '',
  });

  const navigate = useNavigate(); // Hook per navigazione
  const { login } = useAuth();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/auth/local`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      login(data.jwt); // Usa il contesto di autenticazione
      navigate('/user'); // Reindirizza alla pagina utente
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };


  return (
    <LoginContainer>
      <LoginForm onSubmit={handleSubmit}>
        <LoginTitle>Accedi</LoginTitle>
        
        <LoginLabel htmlFor="identifier">Email:</LoginLabel>
        <LoginInput 
          type="email" 
          name="identifier"
          placeholder="Email"
          value={formData.identifier}
          onChange={handleChange}
          required 
        />
        
        <LoginLabel htmlFor="password">Password:</LoginLabel>
        <LoginInput 
          type="password" 
          name="password"
          placeholder="Password"
          value={formData.password} 
          onChange={handleChange}
          required 
        />

        <LoginButton type="submit">Login</LoginButton>
        
        {/* Link alla pagina di registrazione */}
        <RegistrationLink>
          <Link to="/register">Registrati ora</Link>
        </RegistrationLink>
      </LoginForm>
    </LoginContainer>
  );
};

export default LoginPage;
