import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CLIENTS_URL, ORDERS_URL } from '../data/api';
import {
  AdminContainer,
  Sidebar,
  SidebarItem,
  DashboardSection,
  StatsContainer,
  StatsCard,
  StatIcon,
  CarouselContainer,
  ProductCarousel,
  ProductCard,
  SidebarAvatar,
} from '../styles/StyledAdminProfile';
import {
  Header,
  Title,
  StyledButton,
  Banner,
} from '../styles/StyledComponents';

const AdminPage = () => {
  const [activeSection, setActiveSection] = useState('statistiche');
  const [ordersCount, setOrdersCount] = useState(0);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [orderError, setOrderError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [annualRevenue] = useState(30000); // Reddito annuo lordo stimato
  const [paidAmount, setPaidAmount] = useState(() => {
    const savedAmount = localStorage.getItem('paidAmount');
    return savedAmount ? parseFloat(savedAmount) : 10000; // Importo iniziale con valore da localStorage
  });
  const [newAmount, setNewAmount] = useState(''); // Nuovo importo inserito dall'utente

  const coefficientRendita = 0.67; // Coefficiente di redditività (67% per servizi)
  const aliquotaFiscale = 0.05; // Aliquota fiscale ridotta al 5% per nuova impresa
  const aliquotaContributi = 0.25; // Aliquota contributi INPS (25%)
  const sogliaMinimaContributi = 3800; // Soglia minima contributi INPS

  const imponibile = annualRevenue * coefficientRendita;
  const tasse = imponibile * aliquotaFiscale;
  const contributi = Math.max(imponibile * aliquotaContributi, sogliaMinimaContributi);
  const totaleDaPagare = tasse + contributi;

  useEffect(() => {
    const fetchOrdersCount = async () => {
      try {
        const response = await axios.get(ORDERS_URL);
        const totalOrders = response.data.data.length;
        setOrdersCount(totalOrders);
      } catch (error) {
        console.error('Errore nel recupero del numero di ordini:', error);
        setOrdersCount(0);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get(CLIENTS_URL);
        setUsers(response.data.data);
      } catch (err) {
        console.error('Errore nel caricamento dei dati utenti:', err);
        setError('Non è stato possibile caricare i dati degli utenti.');
      }
    };

    const fetchOrders = async () => {
      try {
        const responseOrders = await axios.get(ORDERS_URL, {
          params: { populate: '*' },
        });
        setOrders(responseOrders.data.data || []);
      } catch (err) {
        console.error('Errore durante la richiesta degli ordini:', err);
        setOrderError('Non è stato possibile caricare gli ordini.');
      }
    };

    fetchOrdersCount();
    fetchUsers();
    fetchOrders();
  }, []);

  const handleAddAmount = () => {
    if (isNaN(newAmount) || newAmount <= 0) {
      alert('Inserisci un importo valido.');
      return;
    }

    const updatedAmount = paidAmount + parseFloat(newAmount); // Somma l'importo inserito
    setPaidAmount(updatedAmount);
    localStorage.setItem('paidAmount', updatedAmount.toFixed(2)); // Salva l'importo aggiornato in localStorage
    setNewAmount(''); // Svuota il campo input
  };

  const products = [
    { id: 1, name: 'Scatola Organizer', img: '/assets/immagini/organizer_cassetti.jpg', price: '€19.99' },
    { id: 2, name: 'Set Organizer', img: '/assets/immagini/scatoleBeige.jpg', price: '€29.99' },
    { id: 3, name: 'Contenitore Salvaspazio', img: '/assets/immagini/scatoleGrigie.jpg', price: '€39.99' },
  ];

  return (
    <>
      <Banner>Spedizione gratuita per ordini superiori a 50 euro</Banner>

      <Header>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Title>Zencasa</Title>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <StyledButton to="/products">CATALOGO</StyledButton>
            <StyledButton as="a" href="https://wa.me/393883816904" target="_blank" rel="noopener noreferrer">
              CONTATTI
            </StyledButton>
          </nav>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <StyledButton to="/">HOME</StyledButton>
        </div>
      </Header>

      <AdminContainer>
        <Sidebar>
          <SidebarAvatar>
            <img src="https://cdn-icons-png.flaticon.com/512/1054/1054744.png" alt="User Avatar" />
          </SidebarAvatar>
          <SidebarItem onClick={() => setActiveSection('statistiche')}>Statistiche</SidebarItem>
          <SidebarItem onClick={() => setActiveSection('gestisciUtenti')}>Gestisci Utenti</SidebarItem>
          <SidebarItem>Riferimenti Fornitore</SidebarItem>
          <SidebarItem onClick={() => setActiveSection('prodotti')}>Prodotti</SidebarItem>
          <SidebarItem onClick={() => setActiveSection('ordini')}>Ordini</SidebarItem>
        </Sidebar>

        <DashboardSection>
          {activeSection === 'statistiche' && (
            <>
              <h2>Statistiche</h2>
              <StatsContainer>
                <StatsCard>
                  <StatIcon>
                    <img src="/assets/immagini/carrello.png" alt="Ordini" />
                  </StatIcon>
                  <div>
                    <h3>ORDINI</h3>
                    <p>{ordersCount}</p>
                  </div>
                </StatsCard>
                <StatsCard>
                  <StatIcon>
                    <img src="/assets/immagini/credito.png" alt="Da Pagare" />
                  </StatIcon>
                  <div>
                    <h3>DA PAGARE</h3>
                    <p>{totaleDaPagare.toFixed(2)} €</p>
                    <small>(Tasse: {tasse.toFixed(2)} €, Contributi: {contributi.toFixed(2)} €)</small>
                  </div>
                </StatsCard>
                <StatsCard>
                  <StatIcon>
                    <img src="/assets/immagini/banconota.png" alt="Pagati" />
                  </StatIcon>
                  <div>
                    <h3>PAGATI</h3>
                    <p>{paidAmount.toFixed(2)} €</p>
                    <div style={{ marginTop: '10px' }}>
                      <input
                        type="number"
                        placeholder="Inserisci importo"
                        value={newAmount}
                        onChange={(e) => setNewAmount(e.target.value)}
                        style={{
                          padding: '5px',
                          marginRight: '10px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                        }}
                      />
                      <button
                        onClick={handleAddAmount}
                        style={{
                          padding: '5px 10px',
                          backgroundColor: '#007BFF',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                      >
                        Aggiungi
                      </button>
                    </div>
                  </div>
                </StatsCard>
              </StatsContainer>

              <h2>I tuoi Prodotti</h2>
              <CarouselContainer>
                <ProductCarousel>
                  {products.map((product) => (
                    <ProductCard key={product.id}>
                      <img src={product.img} alt={product.name} />
                      <h4>{product.name}</h4>
                      <p>{product.price}</p>
                    </ProductCard>
                  ))}
                </ProductCarousel>
              </CarouselContainer>
            </>
          )}

          {activeSection === 'gestisciUtenti' && (
            <>
              <h2>Gestione Utenti</h2>
              {error ? (
                <p style={{ color: 'red' }}>{error}</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f5f5f5' }}>
                      <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Nome</th>
                      <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Cognome</th>
                      <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Email</th>
                      <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Indirizzo</th>
                      <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Contatta Cliente</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                          Nessun utente trovato.
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user.id}>
                          <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{user.nome || 'N/A'}</td>
                          <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{user.cognome || 'N/A'}</td>
                          <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{user.email || 'N/A'}</td>
                          <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{user.indirizzo || 'N/A'}</td>
                          <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                            <a
                              href={`mailto:${user.email}?subject=Richiesta%20informazioni&body=Ciao%20${user.nome},`}
                              style={{ color: '#007BFF', textDecoration: 'underline', cursor: 'pointer' }}
                            >
                              Invia Email a {user.email}
                            </a>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </>
          )}

          {activeSection === 'ordini' && (
            <>
              <h2>Gestione Ordini</h2>
              {orderError ? (
                <p style={{ color: 'red' }}>{orderError}</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f5f5f5' }}>
                      <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>ID Ordine</th>
                      <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Cliente</th>
                      <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Totale (€)</th>
                      <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Data Ordine</th>
                      <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Stato</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                          Nessun ordine trovato.
                        </td>
                      </tr>
                    ) : (
                      orders.map((order) => (
                        <tr key={order.id}>
                          <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{order.id}</td>
                          <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                            {order.attributes?.cod_cliente?.data?.attributes?.nome || 'N/A'}{' '}
                            {order.attributes?.cod_cliente?.data?.attributes?.cognome || ''}
                          </td>
                          <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                            €{order.attributes?.prezzo_totale || '0.00'}
                          </td>
                          <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                            {order.attributes?.data
                              ? new Date(order.attributes.data).toLocaleDateString('it-IT', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })
                              : 'Data non disponibile'}
                          </td>
                          <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                            {order.attributes?.stato || 'N/A'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </>
          )}
        </DashboardSection>
      </AdminContainer>
    </>
  );
};

export default AdminPage;