import React, { useState } from 'react';
import {
  RegisterContainer,
  RegisterForm,
  RegisterTitle,
  RegisterLabel,
  RegisterInput,
  RegisterButton,
} from '../styles/StyledRegisterComponents';

import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import {API_URL} from '../data/api'; // Importa la funzione getProducts

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();

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
      const response = await fetch(`${API_URL}/auth/local/register`, {
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
      localStorage.setItem('jwt', data.jwt); // Store the token
      navigate('/completa-profilo'); // Redirect to complete profile page
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };


  return (
    <RegisterContainer>
      <RegisterForm onSubmit={handleSubmit}>
        <RegisterTitle>Zencasa - Registrazione</RegisterTitle>

        <RegisterLabel>Username</RegisterLabel>
        <RegisterInput
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <RegisterLabel>Email</RegisterLabel>
        <RegisterInput
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <RegisterLabel>Password</RegisterLabel>
        <RegisterInput
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <RegisterButton type="submit">Registrati</RegisterButton>
      </RegisterForm>
    </RegisterContainer>
  );
};

export default Register;
