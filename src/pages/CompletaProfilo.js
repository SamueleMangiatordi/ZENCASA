import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ProfileFormContainer,
  ProfileForm,
  ProfileLabel,
  ProfileInput,
  ProfileButton,
  ProfileTitle,
} from '../styles/StyledProfileComponents'; // Stili per il profilo
import { API_URL } from '../data/api';

const CompletaProfilo = () => {
  
  const [userData, setUserData] = useState({
    nome: '',
    cognome: '',
    data_nascita: '',
    indirizzo: '',
    cap: '',
    citta: '',
    riceviNotizie: '',
  });
  
  const navigate = useNavigate();
  const token = localStorage.getItem('jwt');
  console.log('Token:', token);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData({
      ...userData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      console.error('Token mancante, impossibile aggiornare il profilo.');
      return;
    }
    try {
      // Recupera i dati dell'utente loggato (così hai l'ID).
      const meRes = await fetch(`${API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const meData = await meRes.json();
  
      if (!meData?.id) {
        throw new Error('Impossibile recuperare l\'ID utente');
      }
  
      const userId = meData.id;
  
      // Aggiorna l'utente usando il suo ID
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(userData),
      });
    if (response.ok) {
      //Reinderizza alla home
      console.log('Profilo aggiornato con successo.');
      navigate('/');
    } else {
      //Gestisce l'errore
      const errorData = await response.json();
      
      console.error('Profile update failed:', errorData);
      }
    } catch (error) {
      console.error('Errore durante la richiesta:', error);
    }
  };

  return (
    <ProfileFormContainer>
      <ProfileTitle>Completa la registrazione, inserisci i tuoi dati.</ProfileTitle>
      <ProfileForm onSubmit={handleSubmit}>
        <ProfileLabel>Nome</ProfileLabel>
        <ProfileInput
          type="text"
          name="nome"
          placeholder="Nome"
          value={userData.nome}
          onChange={handleChange}
          required
        />
        <ProfileLabel>Cognome</ProfileLabel>
        <ProfileInput
          type="text"
          name="cognome"
          placeholder="Cognome"
          value={userData.cognome}
          onChange={handleChange}
          required
        />

        <ProfileLabel>Data di nascita</ProfileLabel>
        <ProfileInput
          type="date"
          name="data_nascita"
          placeholder="Data di Nascita"
          value={userData.data_nascita}
          onChange={handleChange}
          required
        />

        <ProfileLabel>Indirizzo</ProfileLabel>
        <ProfileInput
          type="text"
          name="indirizzo"
          placeholder="Indirizzo"
          value={userData.indirizzo}
          onChange={handleChange}
          required
        />

        <ProfileLabel>CAP</ProfileLabel>
        <ProfileInput
          type="text"
          name="cap"
          placeholder ="CAP"
          value={userData.cap}
          onChange={handleChange}
          required
        />

        <ProfileLabel>Città</ProfileLabel>
        <ProfileInput
          type="text"
          name="citta"
          placeholder ="Città"
          value={userData.citta}
          onChange={handleChange}
          required
        />

        <ProfileLabel>
          <input
            type="checkbox"
            name="riceviNotizie"
            checked={userData.riceviNotizie}
            onChange={handleChange}
            />
          Ricevi notizie via email
        </ProfileLabel>

        <ProfileButton type="submit">Completa Profilo</ProfileButton>
      </ProfileForm>
    </ProfileFormContainer>
  );
};

export default CompletaProfilo;
