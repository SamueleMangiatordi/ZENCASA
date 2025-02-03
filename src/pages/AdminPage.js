import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  API_URL,
  PRODUCTS_URL,
  USERS_URL,
} from '../data/api';

import {
  AdminContainer,
  Sidebar,
  SidebarItem,
  DashboardSection,
  StatsContainer,
  StatsCard,
  StatIcon,
  SidebarAvatar,
} from '../styles/StyledAdminProfile';

import {
  CatalogContainer,
  FilterTitle,
  FilterOption,
  Checkbox,
  MainContent,
  SortContainer,
  ProductGrid,
  ProductCard,
  ProductImage,
  ProductName,
  ProductPrice,
  AddToCartButton,
  ColorCircle,
} from '../styles/StyledCatalog';

import {
  Banner,
  Header,
  Title,
  StyledButton,
  Icon,
} from '../styles/StyledComponents';

//import { StyledLink } from '../styles/StyledCatalog'; // Link personalizzato
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../data/authContext';


const AdminPage = () => {
  const [activeSection, setActiveSection] = useState('statistiche');
  //const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState(() => {
  const savedSuppliers = localStorage.getItem('suppliers');

  return savedSuppliers ? JSON.parse(savedSuppliers) : [];
  });

  

  
  const [showForm, setShowForm] = useState(false); // Per mostrare/nascondere il form
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    link: '',
    logo: '',
  });

  const [showDeleteForm, setShowDeleteForm] = useState(false); // Mostra/Nascondi il form di eliminazione
  const [supplierToDelete, setSupplierToDelete] = useState(''); // Nome del fornitore da eliminare
  const [openOrderDocumentIds, setOpenOrderDocumentIds] = useState([]); // Traccia i documentId aperti


  // Funzione per aggiungere un nuovo fornitore
  const handleAddSupplier = (e) => {
    e.preventDefault();
    if (!newSupplier.name || !newSupplier.link || !newSupplier.logo) {
      alert('Tutti i campi sono obbligatori!');
      return;
    }

    const updatedSuppliers = [...suppliers, newSupplier];
    setSuppliers(updatedSuppliers);
    localStorage.setItem('suppliers', JSON.stringify(updatedSuppliers));

    setNewSupplier({ name: '', link: '', logo: '' }); // Resetta i campi del form
    setShowForm(false); // Nasconde il form
  };

  const handleDeleteSupplier = (e) => {
    e.preventDefault();
    const updatedSuppliers = suppliers.filter(
      (supplier) => supplier.name.toLowerCase() !== supplierToDelete.toLowerCase()
    );
    setSuppliers(updatedSuppliers);
    localStorage.setItem('suppliers', JSON.stringify(updatedSuppliers));
    setSupplierToDelete(''); // Resetta il campo input
    setShowDeleteForm(false); // Nasconde il form
  };
  
  // ----------------------------
  // SEZIONE STATISTICHE (stati)
  // ----------------------------
  // Numero totale ordini (indipendentemente dai 7 giorni)
  const [ordersCount, setOrdersCount] = useState(0);

  const [orders, setOrders] = useState([]); // Stato per gli ordini

const [loadingOrders, setLoadingOrders] = useState(true); // Stato di caricamento ordini



  // Dati utenti
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [orderError, setOrderError] = useState(null);

  // Fattura / contabilità
  const [annualRevenue] = useState(30000);
  const [paidAmount, setPaidAmount] = useState(() => {
    const savedAmount = localStorage.getItem('paidAmount');
    return savedAmount ? parseFloat(savedAmount) : 10000;
  });
  const [newAmount, setNewAmount] = useState('');

  const coefficientRendita = 0.67;
  const aliquotaFiscale = 0.05;
  const aliquotaContributi = 0.25;
  const sogliaMinimaContributi = 3800;

  const imponibile = annualRevenue * coefficientRendita;
  const tasse = imponibile * aliquotaFiscale;
  const contributi = Math.max(imponibile * aliquotaContributi, sogliaMinimaContributi);
  const totaleDaPagare = tasse + contributi;

  // ----------------------------
  // SEZIONE PRODOTTI (stati)
  // ----------------------------
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState(null);
  const [editingQuantity, setEditingQuantity] = useState('');
  const [searchTerm, setSearchTerm] = useState('');



 
  // Stati per la modifica di un prodotto
  const [editingProductId, setEditingProductId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [editingPrice, setEditingPrice] = useState('');
  const [editingDescription, setEditingDescription] = useState('');
  const [customers, setCustomers] = useState({});

  const toggleOrderDetails = (documentId) => {
    setOpenOrderDocumentIds((prevState) =>
      prevState.includes(documentId)
        ? prevState.filter((id) => id !== documentId) // Rimuovi il documentId per chiudere
        : [...prevState, documentId] // Aggiungi il documentId per aprire
    );
  };
  // ----------------------------
  // USEEFFECT
  // ----------------------------
  useEffect(() => {
    // Se il token non è quello dell'admin, reindirizza alla home
   
    
    // Fetch ordini
    const fetchOrders = async () => {
      try {

        const response = await axios.get(`${API_URL}/ordine-prodottos?populate[cod_ordine][populate]=user&populate=cod_prodotto`);
        const allOrders = response.data.data || [];
    
        // Recupera i dettagli dei clienti usando `documentId`
        const customerPromises = allOrders.map(async (order) => {
          const customerDocumentId = order.user?.documentId;
          if (customerDocumentId) {
            try {
              const customerResponse = await axios.get(`${API_URL}/users/${customerDocumentId}`);
              return { [customerDocumentId]: customerResponse.data };
            } catch (err) {
              console.error(`Errore nel recupero dei dettagli del cliente con documentId ${customerDocumentId}:`, err);
              return null;
            }
          }
          return null;
        });
    
        // Risolvi tutte le promesse dei clienti
        const customerResults = await Promise.all(customerPromises);
        const customersData = {};
        customerResults.forEach((result) => {
          if (result) {
            Object.assign(customersData, result);
          }
        });
    
        setOrders(allOrders); // Salva gli ordini nello stato
        setCustomers(customersData); // Salva i dati dei clienti nello stato
        setOrdersCount(allOrders.length);
      } catch (err) {
        console.error('Errore nel recupero degli ordini:', err);
        setOrderError('Non è stato possibile caricare gli ordini.');
      }
    };
    

  
    // Fetch utenti
    const fetchUsers = async () => {
      try {
        const response = await axios.get(USERS_URL);
        
        // Mappa solo i campi che ti interessano
        const formattedUsers = response.data.map((user) => ({
          email: user.email || 'N/A',
          nome: user.nome || 'N/A',
          cognome: user.cognome || 'N/A',
          indirizzo: user.indirizzo || 'N/A',
        }));
        
        setUsers(formattedUsers); // Aggiorna lo stato con i dati filtrati
      } catch (err) {
        console.error('Errore nel caricamento dei dati utenti:', err);
        setError('Non è stato possibile caricare i dati degli utenti.');
      }
    };
    
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/prodottis?populate=*`);
        const data = response.data;
    
        const mappedProducts = data.data.map((product) => {
          const imageData = product.immagine_prodotto?.[0]?.formats || {};
          const imageUrl =
            imageData.medium?.url ||
            imageData.small?.url ||
            imageData.thumbnail?.url ||
            product.immagine_prodotto?.[0]?.url ||
            '/default-image.jpg';
    
          return {
            documentId: product.documentId,
            name: product.nome_prodotto,
            description: product.descrizione,
            price: product.prezzo_unitario,
            quantity: product.quantita_disponibili,
            image: `http://localhost:1337${imageUrl}`,
          };
        });
    
        setProducts(mappedProducts);
        setLoadingProducts(false);
      } catch (err) {
        console.error('Errore caricamento prodotti:', err);
        setProductsError('Impossibile recuperare i prodotti');
        setLoadingProducts(false);
      }
    };
    
  
    // Fetch prodotti
    fetchProducts();
  
    fetchOrders();
    fetchUsers();
  }, []); //il reinderizzamento dipende dal valore di token
  

  // ----------------------------
  // HANDLER: AGGIUNTA IMPORTO
  // ----------------------------
  const handleAddAmount = () => {
    if (isNaN(newAmount) || newAmount <= 0) {
      alert('Inserisci un importo valido.');
      return;
    }
    const updatedAmount = paidAmount + parseFloat(newAmount);
    setPaidAmount(updatedAmount);
    localStorage.setItem('paidAmount', updatedAmount.toFixed(2));
    setNewAmount('');
  };

  // ----------------------------
  // LOGICA MODIFICA PRODOTTO
  // ----------------------------
  const startEditing = (product) => {
    setEditingProductId(product.documentId); // Imposta il prodotto in modifica
    setEditingName(product.name); // Carica il nome del prodotto
    setEditingPrice(product.price); // Carica il prezzo
    setEditingDescription(product.description); // Carica la descrizione
    setEditingQuantity(product.quantity);
  };
  
  const cancelEditing = () => {
    setEditingProductId(null); // Annulla la modifica
    setEditingName(''); // Resetta il nome
    setEditingPrice(''); // Resetta il prezzo
    setEditingDescription(''); // Resetta la descrizione
  };
  
  const saveProduct = async () => {
    console.log(localStorage.getItem('jwt'));
    if (!editingName || !editingPrice) {
      alert('Nome e Prezzo sono obbligatori!');
      return;
    }
  
    try {
      await axios.put(`${PRODUCTS_URL}/${editingProductId}`, {
        data: {
          nome_prodotto: editingName,
          prezzo_unitario: parseFloat(editingPrice),
          descrizione: editingDescription,
          quantita_disponibili: parseInt(editingQuantity, 10),
        },
      },
      {
        
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`, // Assicurati che il token sia presente
        },
      });
  
      // Aggiorna lo stato locale
      setProducts((prev) =>
        prev.map((product) =>
          product.documentId === editingProductId
            ? {
                ...product,
                name: editingName,
                price: parseFloat(editingPrice),
                description: editingDescription,
                quantity: parseInt(editingQuantity, 10),
              }
            : product
        )
      );
  
      cancelEditing();
      alert('Prodotto modificato con successo!');
    } catch (err) {
      console.error('Errore durante la modifica:', err);
      alert('Errore durante la modifica del prodotto.');
    }
  };
  

  const toggleProductsVisibility = (documentId) => {
    const productListDiv = document.getElementById(`product-list-${documentId}`);
    if (!productListDiv) return;
  
    if (productListDiv.style.display === 'none' || !productListDiv.style.display) {
      productListDiv.style.display = 'block';
      productListDiv.scrollIntoView({ behavior: 'smooth' });
    } else {
      productListDiv.style.display = 'none';
    }
  };
  

  // ----------------------------
  // Filtri e Ordinamento Prodotti
  // ----------------------------
  const priceRanges = [
    { label: 'Fino a 20 euro', maxPrice: 20 },
    { label: 'Fino a 50 euro', maxPrice: 50 },
    { label: 'Fino a 100 euro', maxPrice: 100 },
  ];

  const colors = [
    { name: 'Beige', color: '#f5deb3' },
    { name: 'Grigio', color: '#808080' },
    { name: 'Bianco', color: '#ffffff' },
  ];

 

  const handleColorChange = (color) => {
    
  };


  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  


  return (
    <>
      {/* Banner di esempio */}
      <Banner>Spedizione gratuita per ordini superiori a 50 euro</Banner>

      <Header>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <StyledButton to="/">HOME</StyledButton>
        </div>
      </Header>

      <AdminContainer>
        {/* Sidebar */}
        <Sidebar>
          <SidebarAvatar>
            <img
              src="https://cdn-icons-png.flaticon.com/512/1054/1054744.png"
              alt="User Avatar"
            />
          </SidebarAvatar>
          <SidebarItem onClick={() => setActiveSection('statistiche')}>
            Statistiche
          </SidebarItem>
          <SidebarItem onClick={() => setActiveSection('gestisciUtenti')}>
            Gestisci Utenti
          </SidebarItem>
          <SidebarItem onClick={() => setActiveSection('riferimentiFornitore')}>
            Riferimenti Fornitore
          </SidebarItem>
          <SidebarItem onClick={() => setActiveSection('prodotti')}>
            Prodotti
          </SidebarItem>
          <SidebarItem onClick={() => setActiveSection('ordini')}>
            Ordini
          </SidebarItem>
        </Sidebar>

        {/* Sezione principale */}
        <DashboardSection>
          {/* SEZIONE STATISTICHE */}
          {activeSection === 'statistiche' && (
            <>
              <h2>Statistiche</h2>

              {/* Riquadri con le info contabili */}
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
                    <small>
                      (Tasse: {tasse.toFixed(2)} €, Contributi: {contributi.toFixed(2)} €)
                    </small>
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

              {/* Link utili */}
              <div
                style={{
                  marginTop: '40px',
                  padding: '20px',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '8px',
                }}
              >
                <h2 style={{ marginBottom: '20px' }}>Link utili</h2>

                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                  <a
                    href="https://app.fiscozen.it/app/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: '#007BFF',
                      color: '#fff',
                      padding: '10px 15px',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                    }}
                  >
                    Contatta Commercialista
                  </a>

                  <a
                    href="https://sellercentral.amazon.it/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: '#28a745',
                      color: '#fff',
                      padding: '10px 15px',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                    }}
                  >
                    Amazon Seller Central
                  </a>

                  <a
                    href="https://programma-affiliazione.amazon.it/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: '#17a2b8',
                      color: '#fff',
                      padding: '10px 15px',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                    }}
                  >
                    Affiliazione Amazon
                  </a>

                  <a
                    href="https://www.inps.it"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: '#ffc107',
                      color: '#000',
                      padding: '10px 15px',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                    }}
                  >
                    Cassetto Fiscale
                  </a>

                  <a
                    href="https://app.fiscozen.it/app/adempimenti"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: '#6f42c1',
                      color: '#fff',
                      padding: '10px 15px',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                    }}
                  >
                    I tuoi adempimenti
                  </a>

                  <a
                    href="https://services.brt.it/it/area-clienti?_gl=1*ggrmsa*_ga*OTE3MTc2MTYwLjE3MzcxMjY0MDA.*_ga_Q3RB6RNZ25*MTczNzEyNjM5OS4xLjEuMTczNzEyNjQ0My4xNi4wLjA.*_ga_ZH0LMMM3CM*MTczNzEyNjM5OS4xLjEuMTczNzEyNjQ0My4xNi4wLjA."
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: '#6f42c1',
                      color: '#fff',
                      padding: '10px 15px',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                    }}
                  >
                    Bartolini
                  </a>
                </div>
              </div>
            </>
          )}

          {/* SEZIONE GESTISCI UTENTI */}
          {activeSection === 'gestisciUtenti' && (
            <>
              <h2>Gestione Utenti</h2>
              {error ? (
                <p style={{ color: 'red' }}>{error}</p>
              ) : (
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    backgroundColor: '#fff',
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: '#f5f5f5' }}>
                      <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                        Nome
                      </th>
                      <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                        Cognome
                      </th>
                      <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                        Email
                      </th>
                      <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                        Indirizzo
                      </th>
                      <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                        Contatta Cliente
                      </th>
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
                          <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                            {user.nome || 'N/A'}
                          </td>
                          <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                            {user.cognome || 'N/A'}
                          </td>
                          <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                            {user.email || 'N/A'}
                          </td>
                          <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                            {user.indirizzo || 'N/A'}
                          </td>
                          <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                            <a
                              href={`mailto:${user.email}?subject=Richiesta%20informazioni&body=Ciao%20${user.nome},`}
                              style={{
                                color: '#007BFF',
                                textDecoration: 'underline',
                                cursor: 'pointer',
                              }}
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

          {activeSection === 'riferimentiFornitore' && (
  <>
    <h2>Riferimenti Fornitore</h2>

    {/* Contenitore per i pulsanti */}
    <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
      {/* Bottone per aggiungere un nuovo fornitore */}
      <button
        onClick={() => setShowForm(!showForm)}
        style={{
          padding: '10px 15px',
          backgroundColor: '#007BFF',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Aggiungi Fornitore
      </button>

      {/* Bottone per eliminare un fornitore */}
      <button
        onClick={() => setShowDeleteForm(!showDeleteForm)}
        style={{
          padding: '10px 15px',
          backgroundColor: '#FF0000',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Elimina Fornitore
      </button>
    </div>

    {/* Form per aggiungere un nuovo fornitore */}
    {showForm && (
      <form
        onSubmit={handleAddSupplier}
        style={{
          marginBottom: '20px',
          padding: '10px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: '#f9f9f9',
        }}
      >
        <div style={{ marginBottom: '10px' }}>
          <label>
            Nome:
            <input
              type="text"
              value={newSupplier.name}
              onChange={(e) =>
                setNewSupplier({ ...newSupplier, name: e.target.value })
              }
              style={{ marginLeft: '10px', padding: '5px', width: '80%' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Link:
            <input
              type="text"
              value={newSupplier.link}
              onChange={(e) =>
                setNewSupplier({ ...newSupplier, link: e.target.value })
              }
              style={{ marginLeft: '10px', padding: '5px', width: '80%' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Logo:
            <input
              type="text"
              value={newSupplier.logo}
              onChange={(e) =>
                setNewSupplier({ ...newSupplier, logo: e.target.value })
              }
              style={{ marginLeft: '10px', padding: '5px', width: '80%' }}
            />
          </label>
        </div>
        <button
          type="submit"
          style={{
            padding: '10px 15px',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Continua
        </button>
      </form>
    )}

    {/* Form per eliminare un fornitore */}
    {showDeleteForm && (
      <form
        onSubmit={handleDeleteSupplier}
        style={{
          marginBottom: '20px',
          padding: '10px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: '#f9f9f9',
        }}
      >
        <div style={{ marginBottom: '10px' }}>
          <label>
            Nome del Fornitore da Eliminare:
            <input
              type="text"
              value={supplierToDelete}
              onChange={(e) => setSupplierToDelete(e.target.value)}
              style={{ marginLeft: '10px', padding: '5px', width: '80%' }}
            />
          </label>
        </div>
        <button
          type="submit"
          style={{
            padding: '10px 15px',
            backgroundColor: '#FF0000',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Elimina
        </button>
      </form>
    )}

    {/* Elenco dei fornitori */}
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
      {[
        {
          name: 'Zentrada',
          link: 'https://www.zentrada.com/it/',
          logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBPz_hTPHnIVjjbli09Wvw00ACmOxDZcBT0g&s',
        },
        {
          name: 'Donato Martinelli',
          link: 'https://www.donatomartinelli.com/',
          logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHpVv6B687OBwQXXlnla8j-yys92_Xj_Aheg&s',
        },
        {
          name: 'Alibaba',
          link: 'https://www.alibaba.com/',
          logo: 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/alibaba-color.png',
        },
        {
          name: 'GreenFoam',
          link: 'https://www.greenfoam.it/',
          logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTycJCDXOYYTPt753BudVG6V1W9cG7uKKX6TA&s',
        },
        ...suppliers, // Aggiungi i fornitori dinamici
      ].map((supplier, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            alignItems: 'center',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '10px',
            backgroundColor: '#fff',
            width: '300px',
          }}
        >
          <img
            src={supplier.logo}
            alt={`${supplier.name} logo`}
            style={{
              width: '50px',
              height: '50px',
              marginRight: '15px',
              objectFit: 'contain',
            }}
          />
          <a
            href={supplier.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#007BFF',
              textDecoration: 'none',
            }}
          >
            {supplier.name}
          </a>
        </div>
      ))}
    </div>
  </>
)}


      
          {/* SEZIONE PRODOTTI */}
          {activeSection === 'prodotti' && (
  <>
    <h2>Gestione Prodotti</h2>

    {loadingProducts && <p>Caricamento dei prodotti...</p>}
    {productsError && <p style={{ color: 'red' }}>{productsError}</p>}

    {!loadingProducts && !productsError && (
      <CatalogContainer style={{ marginTop: '20px' }}>
        <MainContent>
        <div style={{ marginBottom: '20px' }}>
        <input
              type="text"
              placeholder="Cerca prodotto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
              }}
            />
</div>

<div style={{ marginBottom: '20px' }}>
            <span>{filteredProducts.length} Prodotti trovati</span>
          </div>


<ProductGrid>
  {filteredProducts.map((product) => (
    <ProductCard key={product.documentId}>
      <ProductImage src={product.image} alt={product.name} />
      
      {editingProductId === product.documentId ? (
        <>
          {/* Modifica del prodotto */}
          <input
            type="text"
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            placeholder="Nome prodotto"
            style={{ marginBottom: '10px', padding: '5px', width: '90%' }}
          />
          <input
            type="number"
            value={editingPrice}
            onChange={(e) => setEditingPrice(e.target.value)}
            placeholder="Prezzo"
            style={{ marginBottom: '10px', padding: '5px', width: '90%' }}
          />
          <textarea
            value={editingDescription}
            onChange={(e) => setEditingDescription(e.target.value)}
            placeholder="Descrizione"
            rows="3"
            style={{ marginBottom: '10px', padding: '5px', width: '90%' }}
          />
           <input
              type="number"
              value={editingQuantity}
              onChange={(e) => setEditingQuantity(e.target.value)}
              placeholder="Quantità Disponibili"
              style={{ marginBottom: '10px', padding: '5px', width: '90%' }}
            />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={saveProduct}
              style={{
                padding: '5px 10px',
                backgroundColor: '#28a745',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Salva
            </button>
            <button
              onClick={cancelEditing}
              style={{
                padding: '5px 10px',
                backgroundColor: '#dc3545',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Annulla
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Visualizzazione normale del prodotto */}
          <ProductName>{product.name}</ProductName>
          <ProductPrice>{`€${product.price.toFixed(2)}`}</ProductPrice>
          <p>Quantità: {product.quantity}</p>
          <button
            onClick={() => startEditing(product)}
            style={{
              padding: '5px 10px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Modifica
          </button>
        </>
      )}
    </ProductCard>
  ))}
</ProductGrid>



        </MainContent>
      </CatalogContainer>
    )}
  </>
)}


          {/* SEZIONE ORDINI */}
          
          {activeSection === 'ordini' && (
  <>
    <h2>Gestione Ordini</h2>
    {orderError ? (
      <p style={{ color: 'red' }}>{orderError}</p>
    ) : (
      <div style={{ marginTop: '20px' }}>
        {orders.length > 0 ? (
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              backgroundColor: '#fff',
              marginBottom: '20px',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5', textAlign: 'left' }}>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Ordine ID</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Data</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Stato</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Prezzo Totale</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Cliente</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const ordine = order.cod_ordine || {};
                const user = ordine.user || {};
                const prodotto = order.cod_prodotto || {};
                const isOpen = openOrderDocumentIds.includes(ordine.documentId); // Controlla se il gruppo è aperto
                // Funzione per copiare i dati negli appunti
                const copyOrderDetails = () => {
                  const textToCopy = `
                    Document ID: ${ordine.documentId || 'N/A'}
                    Nome Prodotto: ${prodotto.nome_prodotto || 'N/A'}
                    Nome Cliente: ${user.nome || 'N/A'}
                    Cognome Cliente: ${user.cognome || 'N/A'}
                    Indirizzo Cliente: ${user.indirizzo || 'N/A'}
                  `;
                  navigator.clipboard.writeText(textToCopy.trim());
                  alert('Dettagli copiati negli appunti!');
                };

                return (
                  <React.Fragment key={ordine.id}>
                    <tr>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                        {ordine.documentId || 'N/A'}
                      </td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                        {ordine.data ? new Date(ordine.data).toLocaleDateString() : 'N/A'}
                      </td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                        {ordine.stato || 'N/A'}
                      </td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                        {ordine.prezzo_totale ? `€${ordine.prezzo_totale.toFixed(2)}` : 'N/A'}
                      </td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                        {user.email || 'N/A'}
                      </td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                        <button
                          onClick={() => toggleOrderDetails(ordine.documentId)}
                          style={{
                            padding: '5px 10px',
                            backgroundColor: '#007bff',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                          }}
                        >
                          {isOpen ? '▲ Nascondi' : '▼ Mostra'}
                        </button>
                        <button
                          onClick={copyOrderDetails}
                          style={{
                            padding: '5px 10px',
                            backgroundColor: '#28a745',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                          }}
                        >
                          Copia Dati
                        </button>
                      </td>
                    </tr>
                    {isOpen && (
                      <tr>
                        <td colSpan="6" style={{ backgroundColor: '#f9f9f9', padding: '10px' }}>
                          <div>
                            <p>
                              <strong>Nome:</strong> {user.nome || 'N/A'}
                            </p>
                            <p>
                              <strong>Cognome:</strong> {user.cognome || 'N/A'}
                            </p>
                            <p>
                              <strong>Indirizzo:</strong> {user.indirizzo || 'N/A'}
                            </p>
                            <p>
                              <strong>Prodotto:</strong> {order.cod_prodotto?.nome_prodotto || 'N/A'}
                            </p>
                            <p>
                              <strong>Prezzo Unitario:</strong>{' '}
                              {order.cod_prodotto?.prezzo_unitario
                                ? `€${order.cod_prodotto.prezzo_unitario.toFixed(2)}`
                                : 'N/A'}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>Nessun ordine trovato.</p>
        )}
      </div>
    )}
  </>
)}


        </DashboardSection>
      </AdminContainer>
    </>
  );
};

export default AdminPage;