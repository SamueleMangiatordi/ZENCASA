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
  HomeLink,
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
    const [openOrderId, setOpenOrderId] = useState(null); // Stato per il menu a tendina
  
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
          setUserData(meData);
          setEditData({
            email: meData.email,
            //nome: meData.nome,
            //cognome: meData.cognome,
            indirizzo: meData.indirizzo,
            citta: meData.citta,
            cap: meData.cap,
          });
          setLoading(false);

          const ordersRes = await fetch(
            `${API_URL}/ordine-prodottos?filters[cod_ordine][user][id][$eq]=${meData.id}` +
            `&populate[cod_ordine][populate]=user&populate=cod_prodotto`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
  
          if (!ordersRes.ok) {
            throw new Error('Errore durante il recupero degli ordini');
          }
  
          const ordersData = await ordersRes.json();
          console.log('Dati degli ordini ricevuti:', ordersData);


          // Estrai i dati corretti dalla risposta
        const extractedOrders = ordersData.data.map((item) => {
          return {
            orderId: item.cod_ordine.id,
            stato: item.cod_ordine.stato,
            prezzo_totale: item.cod_ordine.prezzo_totale,
            data: item.cod_ordine.data,
            prodotto: {
              id: item.cod_prodotto.id,
              nome: item.cod_prodotto.nome_prodotto,
              prezzo_unitario: item.cod_prodotto.prezzo_unitario,
            },
          };
        });

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

  const toggleOrderDetails = (orderId) => {
    // Se clicchi sull'ordine già aperto, chiudilo. Altrimenti, aprilo.
    setOpenOrderId(openOrderId === orderId ? null : orderId);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      email: userData.email,
      //nome: userData.nome,
      //cognome: userData.cognome,
      indirizzo: userData.indirizzo,
      citta: userData.citta,
      cap: userData.cap,
    });
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
        throw new Error("Errore durante l'aggiornamento dei dati utente");
      }

      const updatedUser = await response.json();
      setUserData(updatedUser);
      setIsEditing(false);
    } catch (err) {
      console.error("Errore durante l'aggiornamento:", err);
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
      <HomeLink to="/">Zencasa</HomeLink>
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
              <InputField type="email" name="email" value={editData.email} onChange={handleChange} />
            ) : (
              userData?.email
            )}
          </UserInfo>
          <UserInfo>
            <UserLabel>Nome:</UserLabel> {userData?.nome || 'Non specificato'}
          </UserInfo>
          <UserInfo>
            <UserLabel>Cognome:</UserLabel> {userData?.cognome || 'Non specificato'}
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
            <UserLabel>Città:</UserLabel>{' '}
            {isEditing ? (
              <InputField type="text" name="citta" value={editData.citta} onChange={handleChange} />
            ) : (
              userData?.citta || 'Non specificata'
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
          {isEditing ? (
            <>
              <SaveButton onClick={handleSave}>Salva</SaveButton>
              <CancelButton onClick={handleCancel}>Annulla</CancelButton>
            </>
          ) : (
            <EditButton onClick={handleEdit}>Modifica Profilo</EditButton>
          )}
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </div>
      )}

{activeTab === 'orders' && (
        <OrdersContainer>
          <h2>I tuoi ordini</h2>
          {orders.length > 0 ? (
            <OrdersList>
              {orders.map((order) => (
                <OrderItem key={order.orderId}>
                  <p>
                    <strong>Ordine #{order.orderId}</strong>{' '}
                    <button onClick={() => toggleOrderDetails(order.orderId)}>
                      {openOrderId === order.orderId ? '▲' : '▼'}
                    </button>
                  </p>
                  {openOrderId === order.orderId && (
                    <div style={{ marginLeft: '20px' }}>
                      <p>Stato: {order.stato}</p>
                      <p>Prezzo Totale: €{order.prezzo_totale.toFixed(2)}</p>
                      <p>Prezzo Unitario: €{order.prodotto.prezzo_unitario}</p>
                      <p>Data: {new Date(order.data).toLocaleDateString()}</p>
                      <p><strong>Prodotto:</strong> {order.prodotto.nome}</p>
                    </div>
                  )}
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