import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../data/authContext';
import {API_URL} from '../data/api';
import { UserContainer, UserTitle, UserInfo, UserLabel, ErrorMessage, LoadingMessage } from '../styles/StyledUser';


const User = () => {
    const { isAuthenticated } = useAuth();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const token = localStorage.getItem('jwt');
  
          if (!token) {
            throw new Error('Token non trovato. Accedi nuovamente.');
          }
  
          // Recupera i dati dell'utente loggato
          const meRes = await fetch(`${API_URL}/users/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!meRes.ok) {
            throw new Error(`Errore durante il recupero dei dati utente: ${meRes.status}`);
          }
      
          
          const meData = await meRes.json();
  
          if (!meData?.id) {
            throw new Error("Impossibile recuperare l'ID utente");
          }
  
          // Recupera i dettagli completi dell'utente usando il suo ID
          const userRes = await fetch(`${API_URL}/users/${meData.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          if (!userRes.ok) {
            throw new Error('Errore durante il recupero dei dati utente');
          }
  
          const user = await userRes.json();
          setUserData(user);
          setLoading(false);
        } catch (err) {
          console.error('Errore durante la richiesta:', err);
          setError(err.message);
          setLoading(false);
        }
      };
  
      fetchUserData();
    }, []);
  
    if (loading) {
      return <div>Caricamento in corso...</div>;
    }
  
    if (error) {
      return <div>Errore: {error}</div>;
    }
  
    return (
        <UserContainer>
          <UserTitle>Benvenuto, {userData?.username || 'Utente'}!</UserTitle>
          <UserInfo>
            <UserLabel>Email:</UserLabel> {userData?.email}
          </UserInfo>
          <UserInfo>
            <UserLabel>Nome completo:</UserLabel> {userData?.nome || 'Non specificato'} {userData?.cognome || ''}
          </UserInfo>
          <UserInfo>
            <UserLabel>Indirizzo:</UserLabel> {userData?.indirizzo || 'Non specificato'}
          </UserInfo>
          <UserInfo>
            <UserLabel>Data di nascita:</UserLabel> {userData?.data_nascita || 'Non specificata'}
          </UserInfo>
          <UserInfo>
            <UserLabel>Città:</UserLabel> {userData?.citta || 'Non specificata'} - <UserLabel>CAP:</UserLabel> {userData?.cap || ''}
          </UserInfo>
        </UserContainer>
      );
    };
  
  export default User;
  