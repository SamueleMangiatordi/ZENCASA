import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CLIENTS_URL,
  PRODUCTS_URL,
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

import { StyledLink } from '../styles/StyledCatalog'; // Link personalizzato

const AdminPage = () => {
  const [activeSection, setActiveSection] = useState('statistiche');
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

  // Stato per salvare l'intera lista di ordini dalla tua API
  const [orders, setOrders] = useState([]);

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

 
  // Stati per la modifica di un prodotto
  const [editingProductId, setEditingProductId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [editingPrice, setEditingPrice] = useState('');

  // ----------------------------
  // USEEFFECT
  // ----------------------------
  useEffect(() => {
    // Fetch ordini
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:1337/api/ordinis?populate=*');
        const allOrders = response.data.data || [];
        setOrders(allOrders);
        setOrdersCount(allOrders.length);
      } catch (err) {
        console.error('Errore nel recupero degli ordini:', err);
        setOrderError('Non è stato possibile caricare gli ordini.');
      }
    };
  
    // Fetch utenti
    const fetchUsers = async () => {
      try {
        const response = await axios.get(CLIENTS_URL);
        setUsers(response.data.data);
      } catch (err) {
        console.error('Errore nel caricamento dei dati utenti:', err);
        setError('Non è stato possibile caricare i dati degli utenti.');
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:1337/api/prodottis?populate=*');
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
            id: product.id,
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
  }, []);
  

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
    setEditingProductId(product.id);
    setEditingName(product.name);
    setEditingPrice(product.price);
  };

  const cancelEditing = () => {
    setEditingProductId(null);
    setEditingName('');
    setEditingPrice('');
  };

  const saveProduct = async (productId) => {
    try {
      await axios.put(`${PRODUCTS_URL}/${productId}`, {
        data: {
          nome_prodotto: editingName,
          prezzo_unitario: Number(editingPrice),
        },
      });

      // Aggiorna lo stato locale
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId
            ? { ...p, name: editingName, price: Number(editingPrice) }
            : p
        )
      );

      cancelEditing();
      alert('Prodotto modificato con successo!');
    } catch (err) {
      console.error('Errore durante la modifica:', err);
      alert('Errore durante la modifica del prodotto.');
    }
  };

  const toggleProductsVisibility = (orderId) => {
    const productListDiv = document.getElementById(`product-list-${orderId}`);
    if (!productListDiv) return;
    if (productListDiv.style.display === 'none' || !productListDiv.style.display) {
      productListDiv.style.display = 'block';
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


  const filteredProducts = products;


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
  <span>{products.length} Prodotti trovati</span>
</div>


          <ProductGrid>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id}>
                <ProductImage src={product.image} alt={product.name} />
                <ProductName>{product.name}</ProductName>
                <ProductPrice>{`€${product.price.toFixed(2)}`}</ProductPrice>
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
                <div className="container">
                  <div className="alert alert-info" role="alert" id="status-message">
                    Caricamento in corso...
                  </div>
                  <div className="row">
                    {orders.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '20px' }}>
                        <p>Nessun ordine trovato.</p>
                      </div>
                    ) : (
                      orders.map((order) => {
                        // Dati cliente: in base al JSON potresti averli in "order.attributes.cod_cliente"
                        const attr = order.attributes || {};
                        const cliente = attr.cod_cliente || {};

                        return (
                          <div key={order.id} className="col-md-6">
                            <div
                              className="order-card"
                              style={{
                                padding: '20px',
                                border: '1px solid #ddd',
                                marginBottom: '20px',
                                backgroundColor: '#f9f9f9',
                              }}
                            >
                              <h5 className="card-title">Ordine #{order.id}</h5>
                              <p>
                                <strong>ID Ordine:</strong> {order.id}
                                <br />
                                <strong>Data:</strong>{' '}
                                {attr.data
                                  ? new Date(attr.data).toLocaleString('it-IT')
                                  : 'N/A'}
                                <br />
                                <strong>Stato:</strong> {attr.stato || 'N/A'}
                                <br />
                                <strong>Prezzo Totale:</strong> €
                                {(attr.prezzo_totale ?? 0).toFixed(2)}
                                <br />
                                <strong>Cliente:</strong> {cliente.nome || 'N/A'}{' '}
                                {cliente.cognome || ''}
                                <br />
                                <strong>Indirizzo:</strong> {cliente.indirizzo || 'N/A'}
                              </p>
                              <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => toggleProductsVisibility(order.id)}
                              >
                                Dettagli Prodotti
                              </button>
                              <div
                                id={`product-list-${order.id}`}
                                style={{ display: 'none' }}
                              >
                                {/* Placeholder o elenco prodotti associati */}
                                <p>Elenco prodotti per l'ordine #{order.id}...</p>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
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