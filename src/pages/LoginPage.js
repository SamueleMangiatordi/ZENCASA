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
  RegistrationLink,
  Loader
} from '../styles/StyledLoginComponents';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    identifier: '', // This can be username or email
    password: '',
  });

  const [error, setError] = useState(null); // Per gestire errori
  const [loading, setLoading] = useState(false); // Per gestire lo stato di caricamento
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
    setLoading(true);
    setError(null); // Resetta eventuali errori

    try {
      const response = await fetch(`${API_URL}/auth/local`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        if (response.status === 400) {
          setError('Credenziali non valide. Riprova.'); // Mostra errore se 400 (Bad Request)
        } else {
          setError(`Errore del server: ${response.status}`); // Mostra altri errori
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Controlla se l'utente autenticato Ã¨ un admin
      const userResponse = await fetch(`${API_URL}/users/me?populate=role`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${data.jwt}`, // Passa il token JWT ricevuto
        },
      });

      if (!userResponse.ok) {
        throw new Error(`HTTP error! status: ${userResponse.status}`);
      }

      const userData = await userResponse.json();
      console.log('user data: ', userData);

      if (userData.role?.name === 'Admin') {
        // Salva il token e reindirizza alla pagina admin
        login(data.jwt, userData.role.name);
        navigate('/admin');
      } else {
        // Salva il token e reindirizza alla pagina utente normale
        login(data.jwt, 'user');
        navigate('/user');
      }
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