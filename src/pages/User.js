import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../data/authContext';
import {API_URL} from '../data/api';
import {
  UserContainer,
  UserTitle,
  UserInfo,
  UserLabel,
  ErrorMessage,
  LoadingMessage,
  LogoutButton,
  EditButton,
  SaveButton,
  InputField,
  CancelButton,
  SectionTabs,
  TabButton,
  OrdersContainer,
  OrdersList,
  OrderItem,
} from '../styles/StyledUser';

const User = () => {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'orders'

  
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
          setEditData(user);
          setLoading(false);

          const ordersRes = await fetch(`${API_URL}/ordinis?filters[user][id][$eq]=${user.id}&populate=user`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          if (!ordersRes.ok) {
            throw new Error('Errore durante il recupero degli ordini');
          }

  
          const ordersData = await ordersRes.json();
          console.log('Dati degli ordini ricevuti:', ordersData);


          // Estrai i dati corretti dalla risposta
          const extractedOrders = ordersData.data.map(order => ({
          id: order.id,
          stato: order.stato,
          prezzo_totale: order.prezzo_totale,
          data: order.data,
          user: order.user,
          }));
          
          setOrders(extractedOrders);
          setLoading(false);

        } catch (err) {
          console.error('Errore durante la richiesta:', err);
          setError(err.message);
          setLoading(false);
        }
      };
  
      fetchUserData();
    }, []);

    const handleLogout = () => {
      logout();
      navigate('/'); // Reindirizza alla home
    };

    const handleEdit = () => {
      setIsEditing(true);
    };

    const handleCancel = () => {
      setIsEditing(false);
      setEditData(userData); // Ripristina i dati originali
    };

    const handleSave = async () => {
      try {
        const token = localStorage.getItem('jwt');
  
        if (!token) {
          throw new Error('Token non trovato. Accedi nuovamente.');
        }
  
        const response = await fetch(`${API_URL}/users/${userData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editData),
        });
  
        if (!response.ok) {
          throw new Error("Errore durante l' aggiornamento dei dati utente");
        }
  
        const updatedUser = await response.json();
        setUserData(updatedUser);
        setIsEditing(false);
      } catch (err) {
        console.error("Errore durante l' aggiornamento:", err);
        setError(err.message);
      }
    };
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setEditData({
        ...editData,
        [name]: value,
      });
    };
  
    if (loading) {
      return (
        <UserContainer>
          <LoadingMessage>Caricamento in corso...</LoadingMessage>
        </UserContainer>
      );
    }
  
    if (error) {
      return (
        <UserContainer>
          <ErrorMessage>Errore: {error}</ErrorMessage>
        </UserContainer>
      );
    }
  
    return (
      <UserContainer>
        <UserTitle>Benvenuto, {userData?.username || 'Utente'}!</UserTitle>
        <SectionTabs>
          <TabButton $active={activeTab === 'profile'} onClick={() => setActiveTab('profile')}>
            Profilo
          </TabButton>
          <TabButton $active={activeTab === 'orders'} onClick={() => setActiveTab('orders')}>
            Ordini
          </TabButton>
        </SectionTabs>
  
        {activeTab === 'profile' && (
          <div>
            <UserInfo>
              <UserLabel>Email:</UserLabel>{' '}
              {isEditing ? (
                <InputField type="text" name="email" value={editData.email} onChange={handleChange} />
              ) : (
                userData?.email
              )}
            </UserInfo>
            <UserInfo>
              <UserLabel>Nome completo:</UserLabel> {userData?.nome || 'Non specificato'} {userData?.cognome || ''}
            </UserInfo>
            <UserInfo>
              <UserLabel>Città:</UserLabel>{' '}
              {isEditing ? (
                <InputField type="text" name="citta" value={editData.citta} onChange={handleChange} />
              ) : (
                userData?.citta || 'Non specificata'
              )}
            </UserInfo>
            <UserInfo>
              <UserLabel>Indirizzo:</UserLabel>{' '}
              {isEditing ? (
                <InputField type="text" name="indirizzo" value={editData.indirizzo} onChange={handleChange} />
              ) : (
                userData?.indirizzo || 'Non specificato'
              )}
            </UserInfo>
            <UserInfo>
              <UserLabel>CAP:</UserLabel>{' '}
              {isEditing ? (
                <InputField type="text" name="cap" value={editData.cap} onChange={handleChange} />
              ) : (
                userData?.cap || 'Non specificato'
              )}
            </UserInfo>
            <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
            {isEditing ? (
              <>
                <SaveButton onClick={handleSave}>Salva</SaveButton>
                <CancelButton onClick={handleCancel}>Annulla</CancelButton>
              </>
            ) : (
              <EditButton onClick={handleEdit}>Modifica Profilo</EditButton>
            )}
          </div>
        )}
  
          {activeTab === 'orders' && 
          (
          <OrdersContainer>
            <h2>I tuoi ordini</h2>
            {orders.length > 0 ? (
              <OrdersList>
                {orders.map(order => (
                  <OrderItem key={order.id}>
                    <p><strong>Ordine #{order.id}</strong></p>
                    <p>Stato: {order.stato}</p>
                    <p>Prezzo Totale: €{order.prezzo_totale.toFixed(2)}</p>
                    <p>Data: {new Date(order.data).toLocaleDateString()}</p>
                  </OrderItem>
                ))}
              </OrdersList>
            ) : (
              <p>Non hai effettuato ordini.</p>
            )}
          </OrdersContainer>
        )}
      </UserContainer>
    );
  };
  
  export default User;