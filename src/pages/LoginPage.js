import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Importa Link
import { users } from '../data/users';
import {
  LoginContainer,
  LoginForm,
  LoginTitle,
  LoginLabel,
  LoginInput,
  LoginButton,
  ErrorMessage,
  RegistrationLink // Aggiungi il nuovo stile
} from '../styles/StyledLoginComponents';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setError('');
      onLogin(user);
    } else {
      setError('Email o password errata.');
    }
  };

  return (
    <LoginContainer>
      <LoginForm onSubmit={handleSubmit}>
        <LoginTitle>Accedi</LoginTitle>
        
        <LoginLabel htmlFor="email">Email:</LoginLabel>
        <LoginInput 
          type="email" 
          id="email"
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          required 
        />
        
        <LoginLabel htmlFor="password">Password:</LoginLabel>
        <LoginInput 
          type="password" 
          id="password"
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          required 
        />

        <LoginButton type="submit">Login</LoginButton>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}

        {/* Link alla pagina di registrazione */}
        <RegistrationLink>
          <Link to="/register">Registrati ora</Link>
        </RegistrationLink>
      </LoginForm>
    </LoginContainer>
  );
};

export default Login;
