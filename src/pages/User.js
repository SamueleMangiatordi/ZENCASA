import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../data/authContext';
import { API_URL } from '../data/api';

// Stili già esistenti (lasciati per non compromettere la logica)
// Alcuni potranno non essere più utilizzati, ma li manteniamo intatti
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

// Stili per la navigation bar e banner
import {
  Banner,
  Header,
  Title,
  StyledButton,
  Icon,
} from '../styles/StyledComponents';

const User = () => {
  const { isAuthenticated, logout, role } = useAuth();
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Stato per la modalità di editing
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  // Tabs dinamici: 'profile' | 'orders' | 'contacts'
  const [activeTab, setActiveTab] = useState('profile');

  // Gestione apertura/chiusura dettaglio ordini
  const [openOrderId, setOpenOrderId] = useState(null);

  // Effetto per recuperare i dati utente e ordini
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('jwt');
        if (!token) {
          throw new Error('Token non trovato. Accedi nuovamente.');
        }

        // Recupera dati utente
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

        // Prepara i dati di edit con i campi modificabili
        setEditData({
          email: meData.email,
          indirizzo: meData.indirizzo,
          citta: meData.citta,
          cap: meData.cap,
        });
        setLoading(false);

        // Recupera ordini
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
        // Mappa i dati ordini
        const extractedOrders = ordersData.data.map((item) => ({
          orderId: item.cod_ordine.id,
          stato: item.cod_ordine.stato,
          prezzo_totale: item.cod_ordine.prezzo_totale,
          data: item.cod_ordine.data,
          prodotto: {
            id: item.cod_prodotto.id,
            nome: item.cod_prodotto.nome_prodotto,
            prezzo_unitario: item.cod_prodotto.prezzo_unitario,
          },
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

  // Logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Toggle per mostrare/nascondere dettagli di un ordine
  const toggleOrderDetails = (orderId) => {
    setOpenOrderId(openOrderId === orderId ? null : orderId);
  };

  // Attiva la modalità modifica
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Annulla la modifica
  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      email: userData.email,
      indirizzo: userData.indirizzo,
      citta: userData.citta,
      cap: userData.cap,
    });
  };

  // Salva le modifiche
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

  // Gestione input form
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

  // --- LAYOUT COMPLETO ---
  return (
    <>
      {/* NAVBAR come da snippet */}
      <Banner>Spedizione gratuita per ordini superiori a 50 euro</Banner>
      <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1% 5%' }}>
        {/* Left Section: Zencasa Title and Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Title>Zencasa</Title>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <StyledButton to="/products">CATALOGO</StyledButton>
            <StyledButton
              as="a"
              href="https://wa.me/393883816904"
              target="_blank"
              rel="noopener noreferrer"
            >
              CONTATTI
            </StyledButton>
          </nav>
        </div>

        {/* Right Section: Login and Cart Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <StyledButton
            onClick={() => {
              if (isAuthenticated) {
                if (role === 'Admin') {
                  setTimeout(() => navigate("/admin"), 0);
                } else if (role === 'assistenzaClienti') {
                  setTimeout(() => navigate("/service"), 0);
                } else {
                  setTimeout(() => navigate("/user"), 0);
                }
              } else {
                setTimeout(() => navigate("/login"), 0);
              }
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <Icon>👤</Icon>
          </StyledButton>

          <StyledButton
            onClick={() => {
              if (isAuthenticated) {
                setTimeout(() => navigate("/cart"), 0);
              } else {
                setTimeout(() => navigate("/login"), 0);
              }
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <Icon>🛍️</Icon>
          </StyledButton>
        </div>
      </Header>

      {/* Contenuto principale: Sidebar + Area dinamica */}
      <div style={{ display: 'flex', backgroundColor: '#f1f2f6', minHeight: '100vh' }}>
        {/* Sidebar a sinistra */}
        {/* Sidebar con layout aggiornato */}
<div style={{ width: '220px', backgroundColor: '#fff', padding: '20px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
  {/* Immagine profilo */}
  <div style={{ textAlign: 'center', marginBottom: '20px' }}>
    <img
      src="https://png.pngtree.com/png-vector/20221203/ourmid/pngtree-cartoon-style-male-user-profile-icon-vector-illustraton-png-image_6489287.png"
      alt="User"
      style={{ width: '100px', borderRadius: '50%', border: '2px solid #ccc' }}
    />
  </div>

  {/* Pulsanti dinamici */}
  {[
    { label: 'Panoramica profilo', tab: 'profile' },
    { label: 'Ordini', tab: 'orders' },
    { label: 'Contatti', tab: 'contacts' },
  ].map(({ label, tab }) => (
    <button
      key={tab}
      onClick={() => setActiveTab(tab)}
      style={{
        width: '100%',
        textAlign: 'left',
        padding: '10px',
        marginBottom: '10px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        backgroundColor: activeTab === tab ? '#ffe4cc' : '#f9f9f9',
        fontWeight: activeTab === tab ? 'bold' : 'normal',
        color: activeTab === tab ? '#ff7a00' : '#333',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
      }}
    >
      {label}
    </button>
  ))}

  {/* Pulsante logout in fondo */}
  <button
    onClick={handleLogout}
    style={{
      width: '100%',
      textAlign: 'left',
      padding: '10px',
      marginTop: '30px',
      borderRadius: '8px',
      border: '1px solid #ff4b5c',
      backgroundColor: '#ff4b5c',
      color: '#fff',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    }}
  >
    Logout
  </button>
</div>


        {/* Contenuto dinamico a destra */}
        <div style={{ flex: 1, padding: '30px' }}>
          {/* PANORAMICA PROFILO */}
          {activeTab === 'profile' && (
  <>
    <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
      Benvenuto, {userData?.username || 'Utente'}!
    </h2>
    <div
      style={{
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        maxWidth: '600px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          rowGap: '15px',
          columnGap: '20px',
          alignItems: 'center',
        }}
      >
        {/* Email */}
        <div style={{ fontWeight: 'bold', color: '#555' }}>Email:</div>
        <div>
          {isEditing ? (
            <InputField
              type="email"
              name="email"
              value={editData.email}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
            />
          ) : (
            <span style={{ color: '#333' }}>{userData?.email}</span>
          )}
        </div>

        {/* Nome */}
        <div style={{ fontWeight: 'bold', color: '#555' }}>Nome:</div>
        <div style={{ color: '#333' }}>{userData?.nome || 'Non specificato'}</div>

        {/* Cognome */}
        <div style={{ fontWeight: 'bold', color: '#555' }}>Cognome:</div>
        <div style={{ color: '#333' }}>{userData?.cognome || 'Non specificato'}</div>

        {/* Indirizzo */}
        <div style={{ fontWeight: 'bold', color: '#555' }}>Indirizzo:</div>
        <div>
          {isEditing ? (
            <InputField
              type="text"
              name="indirizzo"
              value={editData.indirizzo}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
            />
          ) : (
            <span style={{ color: '#333' }}>{userData?.indirizzo || 'Non specificato'}</span>
          )}
        </div>

        {/* Città */}
        <div style={{ fontWeight: 'bold', color: '#555' }}>Città:</div>
        <div>
          {isEditing ? (
            <InputField
              type="text"
              name="citta"
              value={editData.citta}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
            />
          ) : (
            <span style={{ color: '#333' }}>{userData?.citta || 'Non specificata'}</span>
          )}
        </div>

        {/* CAP */}
        <div style={{ fontWeight: 'bold', color: '#555' }}>CAP:</div>
        <div>
          {isEditing ? (
            <InputField
              type="text"
              name="cap"
              value={editData.cap}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
            />
          ) : (
            <span style={{ color: '#333' }}>{userData?.cap || 'Non specificato'}</span>
          )}
        </div>
      </div>

      {/* Bottoni di azione */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        {isEditing ? (
          <>
            <SaveButton
              onClick={handleSave}
              style={{
                marginRight: '10px',
                padding: '10px 20px',
                borderRadius: '5px',
                backgroundColor: '#4caf50',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Salva
            </SaveButton>
            <CancelButton
              onClick={handleCancel}
              style={{
                padding: '10px 20px',
                borderRadius: '5px',
                backgroundColor: '#f44336',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Annulla
            </CancelButton>
          </>
        ) : (
          <EditButton
            onClick={handleEdit}
            style={{
              padding: '10px 20px',
              borderRadius: '5px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Modifica Profilo
          </EditButton>
        )}
      </div>
    </div>
  </>
)}


          {/* ORDINI */}
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
                        <div style={{ marginLeft: '20px', marginBottom: '10px' }}>
                          <p>Stato: {order.stato}</p>
                          <p>Prezzo Totale: €{order.prezzo_totale.toFixed(2)}</p>
                          <p>Prezzo Unitario: €{order.prodotto.prezzo_unitario}</p>
                          <p>Data: {new Date(order.data).toLocaleDateString()}</p>
                          <p>
                            <strong>Prodotto:</strong> {order.prodotto.nome}
                          </p>
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

          {/* CONTATTI */}
          {activeTab === 'contacts' && (
  <div
    style={{
      padding: '20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '10px',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
      maxWidth: '600px',
      margin: '20px auto',
    }}
  >
    <h2
      style={{
        textAlign: 'center',
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '20px',
        color: '#333',
      }}
    >
      Contatta Zencasa
    </h2>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        rowGap: '15px',
        columnGap: '20px',
        alignItems: 'center',
      }}
    >
      {/* Email */}
      <img
        src="https://cdn-icons-png.flaticon.com/512/2989/2989993.png"
        alt="Email Icon"
        style={{ width: '40px', height: '40px' }}
      />
      <p style={{ fontSize: '16px', color: '#555' }}>
        Email: <a href="mailto:info@zencasaitalia.it" style={{ color: '#007bff', textDecoration: 'none' }}>info@zencasaitalia.it</a>
      </p>

      {/* Telefono */}
      <img
        src="https://www.iconpacks.net/icons/1/free-phone-icon-1-thumb.png"
        alt="Phone Icon"
        style={{ width: '40px', height: '40px' }}
      />
      <p style={{ fontSize: '16px', color: '#555' }}>
        Telefono: <a href="tel:+393883816904" style={{ color: '#007bff', textDecoration: 'none' }}>+39 388 381 6904</a>
      </p>

      {/* Orari di Supporto */}
      <img
        src="https://img.icons8.com/ios7/512/clock.png"
        alt="Clock Icon"
        style={{ width: '40px', height: '40px' }}
      />
      <p style={{ fontSize: '16px', color: '#555' }}>
        Orari di Supporto: Lun-Ven 9:00 - 18:00
      </p>
    </div>

    {/* Social Media Links */}
    <div style={{ marginTop: '30px', textAlign: 'center' }}>
      <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>Seguici sui social</h3>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '10px' }}>
        {/* Instagram */}
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
            alt="Instagram"
            style={{ width: '40px', height: '40px' }}
          />
        </a>
        {/* Facebook */}
        <a
          href="https://www.facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
            alt="Facebook"
            style={{ width: '40px', height: '40px' }}
          />
        </a>
        {/* WhatsApp */}
        <a
          href="https://wa.me/393883816904"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
            alt="WhatsApp"
            style={{ width: '40px', height: '40px' }}
          />
        </a>
      </div>
    </div>

    {/* Pulsante di Contatto */}
    <div style={{ marginTop: '30px', textAlign: 'center' }}>
      <a
        href="mailto:info@zencasaitalia.it"
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: '5px',
          fontWeight: 'bold',
          display: 'inline-block',
        }}
      >
        Contattaci via Email
      </a>
    </div>
  </div>
)}

        </div>
      </div>
    </>
  );
};

export default User;
