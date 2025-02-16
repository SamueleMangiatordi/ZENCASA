import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Importa Link per la pagina di registrazione
import { useAuth } from '../data/authContext'; //fornisce il contesto di autenticazione
import { API_URL } from '../data/api';

import {
  LoginContainer,
  LoginForm,
  LoginTitle,
  LoginLabel,
  LoginInput,
  LoginButton,
  RegistrationLink,
  ErrorMessage,
  Loader
} from '../styles/StyledLoginComponents';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    identifier: '', // username o email
    password: '',
  });

  const [error, setError] = useState(null); // Per gestire errori
  const [loading, setLoading] = useState(false); // Per gestire lo stato di caricamento
  const navigate = useNavigate(); // Hook per navigazione
  const { login } = useAuth(); //funzione di useAuth per l'autenticazione

  //permette di gestire il cambiamento nell'input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  //eseguito dopo aver cliccato "login"
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Resetta eventuali errori

    //i dati vengono inviati all'API
    try {
      const response = await fetch(`${API_URL}/auth/local`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      //gestisce l'errore
      if (!response.ok) {
        if (response.status === 400) {
          setError('Credenziali non valide. Riprova.'); // Mostra errore se 400 (Bad Request)
        } else {
          setError(`Errore del server: ${response.status}`); // Mostra altri errori
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Controlla il ruolo dell'utente autenticato 
      const userResponse = await fetch(`${API_URL}/users/me?populate=role`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${data.jwt}`, // Passa il token JWT ricevuto
        },
      });

      if (!userResponse.ok) {
        setError('Errore durante il recupero dei dettagli utente.');
        throw new Error(`HTTP error! status: ${userResponse.status}`);
      }

      const userData = await userResponse.json();
      console.log('user data: ', userData);

      // Logica di reindirizzamento basata sul ruolo
      if (userData.role?.name === 'Admin') {
        login(data.jwt, userData.role.name);
        navigate('/admin'); // Vai alla pagina admin
      } else if (userData.role?.name === 'assistenzaClienti') {
        login(data.jwt, userData.role.name);
        navigate('/service'); // Vai alla pagina assistenza clienti
      } else {
        login(data.jwt, 'user');
        navigate('/user'); // Vai alla pagina utente normale
      }
    } catch (error) {
      console.error('Errore durante il login:', error);
    } finally {
      setLoading(false); // Ferma il caricamento
    }
  };


  return (
    <LoginContainer>
      <LoginForm onSubmit={handleSubmit}>
        <LoginTitle>Accedi</LoginTitle>

        {/* Mostra un messaggio di errore */}
        {error && <ErrorMessage>{error}</ErrorMessage>}

        {loading && <Loader>Caricamento...</Loader>}

        
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

        <LoginButton type="submit" disabled={loading}>
          Login
        </LoginButton>
        
        {/* Link alla pagina di registrazione */}
        <RegistrationLink>
          <Link to="/register">Registrati ora</Link>
        </RegistrationLink>
      </LoginForm>
    </LoginContainer>
  );
};

export default LoginPage;