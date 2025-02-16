import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../data/authContext";
import axios from "axios"; //utilizzato per richieste al backend
import { API_URL, PRODUCTS_URL, USERS_URL } from "../data/api";

import {
  AdminContainer,
  Sidebar,
  SidebarItem,
  DashboardSection,
  SidebarAvatar,
} from "../styles/StyledAdminProfile";

import {
  CatalogContainer,
  MainContent,
  ProductGrid,
  ProductCard,
  ProductImage,
  ProductName,
  ProductPrice,
} from "../styles/StyledCatalog";

import {
  Banner,
  Header,
  Title,
  StyledButton,
  Icon,
} from "../styles/StyledComponents";

const ServicePage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState(() => {
    return localStorage.getItem("activeSection") || "caseAperti";
  });

  const handleSetActiveSection = (section) => {
    setActiveSection(section);
    localStorage.setItem("activeSection", section);
  };

  const [openOrderDocumentIds, setOpenOrderDocumentIds] = useState([]); // Traccia i documentId aperti

  const [suppliers, setSuppliers] = useState(() => {
    const savedSuppliers = localStorage.getItem("suppliers");
    return savedSuppliers ? JSON.parse(savedSuppliers) : [];
  });

  const [supplierToDelete, setSupplierToDelete] = useState("");
  const [showDeleteForm, setShowDeleteForm] = useState(false);

  const [showForm, setShowForm] = useState(false); // Per mostrare/nascondere il form
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    link: "",
    logo: "",
  });

  // Inizializza i ticket leggendo da localStorage (se presenti)
  const [tickets, setTickets] = useState(() => {
    const savedTickets = localStorage.getItem("tickets");
    return savedTickets ? JSON.parse(savedTickets) : [];
  });

  const [newTicket, setNewTicket] = useState({
    cliente: "",
    email: "",
    descrizione: "",
    stato: "Aperto",
  });

  // Logout
  const handleLogout = () => {
    logout();
    setTimeout(() => navigate("/", { replace: true }), 100); // Aggiunge un leggero ritardo
  };

  // Sincronizza automaticamente i ticket con localStorage ogni volta che cambiano
  useEffect(() => {
    localStorage.setItem("tickets", JSON.stringify(tickets));
  }, [tickets]);

  // Funzione per aggiungere un nuovo ticket
  const handleAddTicket = (e) => {
    e.preventDefault();
    if (!newTicket.cliente || !newTicket.email || !newTicket.descrizione) {
      alert("Tutti i campi sono obbligatori!");
      return;
    }
    const updatedTickets = [...tickets, { ...newTicket, id: Date.now() }];
    setTickets(updatedTickets); // Aggiorna lo stato
    setNewTicket({ cliente: "", email: "", descrizione: "", stato: "Aperto" }); // Resetta il form
  };

  // Funzione per eliminare un ticket
  const handleDeleteTicket = (id) => {
    const updatedTickets = tickets.filter((ticket) => ticket.id !== id);
    setTickets(updatedTickets); // Aggiorna lo stato
  };

  // Funzione per cambiare lo stato di un ticket
  const handleChangeTicketStatus = (id, newStatus) => {
    const updatedTickets = tickets.map((ticket) =>
      ticket.id === id ? { ...ticket, stato: newStatus } : ticket
    );
    setTickets(updatedTickets); // Aggiorna lo stato
  };

  const toggleOrderDetails = (documentId) => {
    setOpenOrderDocumentIds(
      (prevState) =>
        prevState.includes(documentId)
          ? prevState.filter((id) => id !== documentId) // Rimuovi il documentId per chiudere
          : [...prevState, documentId] // Aggiungi il documentId per aprire
    );
  };

  // Funzione per aggiungere un nuovo fornitore
  const handleAddSupplier = (e) => {
    e.preventDefault();
    if (!newSupplier.name || !newSupplier.link || !newSupplier.logo) {
      alert("Tutti i campi sono obbligatori!");
      return;
    }

    const updatedSuppliers = [...suppliers, newSupplier];
    setSuppliers(updatedSuppliers);
    localStorage.setItem("suppliers", JSON.stringify(updatedSuppliers));

    setNewSupplier({ name: "", link: "", logo: "" }); // Resetta i campi del form
    setShowForm(false); // Nasconde il form
  };

  const handleDeleteSupplier = (e) => {
    e.preventDefault();
    const updatedSuppliers = suppliers.filter(
      (supplier) =>
        supplier.name.toLowerCase() !== supplierToDelete.toLowerCase()
    );
    setSuppliers(updatedSuppliers);
    localStorage.setItem("suppliers", JSON.stringify(updatedSuppliers));
    setSupplierToDelete(""); // Resetta il campo input
    setShowDeleteForm(false); // Nasconde il form
  };

  // ----------------------------
  // Numero totale ordini
  const [ordersCount, setOrdersCount] = useState(0);

  // Stato per salvare l'intera lista di ordini dalla API
  const [orders, setOrders] = useState([]);

  // Dati utenti
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [orderError, setOrderError] = useState(null);
  const [customers, setCustomers] = useState({});

  // Fattura / contabilità
  const [annualRevenue] = useState(30000);
  const [paidAmount, setPaidAmount] = useState(() => {
    const savedAmount = localStorage.getItem("paidAmount");
    return savedAmount ? parseFloat(savedAmount) : 10000;
  });
  const [newAmount, setNewAmount] = useState("");

  const coefficientRendita = 0.67;
  const aliquotaFiscale = 0.05;
  const aliquotaContributi = 0.25;
  const sogliaMinimaContributi = 3800;

  const imponibile = annualRevenue * coefficientRendita;
  const tasse = imponibile * aliquotaFiscale;
  const contributi = Math.max(
    imponibile * aliquotaContributi,
    sogliaMinimaContributi
  );
  const totaleDaPagare = tasse + contributi;

  // ----------------------------
  // SEZIONE PRODOTTI (stati)
  // ----------------------------
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState(null);
  const [editingQuantity, setEditingQuantity] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // ----------------------------
  // USEEFFECT
  // ----------------------------
  useEffect(() => {
    // Fetch ordini
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/ordine-prodottos?populate[cod_ordine][populate]=user&populate=cod_prodotto`
        );
        const allOrders = response.data.data || [];

        // Recupera i dettagli dei clienti usando `documentId`
        const customerPromises = allOrders.map(async (order) => {
          const customerDocumentId = order.user?.documentId;
          if (customerDocumentId) {
            try {
              const customerResponse = await axios.get(
                `${API_URL}/users/${customerDocumentId}`
              );
              return { [customerDocumentId]: customerResponse.data };
            } catch (err) {
              console.error(
                `Errore nel recupero dei dettagli del cliente con documentId ${customerDocumentId}:`,
                err
              );
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
        console.error("Errore nel recupero degli ordini:", err);
        setOrderError("Non è stato possibile caricare gli ordini.");
      }
    };

    // Fetch utenti
    const fetchUsers = async () => {
      try {
        const response = await axios.get(USERS_URL);

        // Mappa solo i campi che interessano
        const formattedUsers = response.data.map((user) => ({
          email: user.email || "N/A",
          nome: user.nome || "N/A",
          cognome: user.cognome || "N/A",
          indirizzo: user.indirizzo || "N/A",
        }));

        setUsers(formattedUsers); // Aggiorna lo stato con i dati filtrati
      } catch (err) {
        console.error("Errore nel caricamento dei dati utenti:", err);
        setError("Non è stato possibile caricare i dati degli utenti.");
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:1337/api/prodottis?populate=*"
        );
        const data = response.data;

        const mappedProducts = data.data.map((product) => {
          const imageData = product.immagine_prodotto?.[0]?.formats || {};
          const imageUrl =
            imageData.medium?.url ||
            imageData.small?.url ||
            imageData.thumbnail?.url ||
            product.immagine_prodotto?.[0]?.url ||
            "/default-image.jpg";

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
        console.error("Errore caricamento prodotti:", err);
        setProductsError("Impossibile recuperare i prodotti");
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
      alert("Inserisci un importo valido.");
      return;
    }
    const updatedAmount = paidAmount + parseFloat(newAmount);
    setPaidAmount(updatedAmount);
    localStorage.setItem("paidAmount", updatedAmount.toFixed(2));
    setNewAmount("");
  };

  // ----------------------------
  // LOGICA MODIFICA PRODOTTO
  // ----------------------------

  const toggleProductsVisibility = (documentId) => {
    const productListDiv = document.getElementById(
      `product-list-${documentId}`
    );
    if (!productListDiv) return;

    if (
      productListDiv.style.display === "none" ||
      !productListDiv.style.display
    ) {
      productListDiv.style.display = "block";
      productListDiv.scrollIntoView({ behavior: "smooth" });
    } else {
      productListDiv.style.display = "none";
    }
  };

  // ----------------------------
  // Filtri e Ordinamento Prodotti
  // ----------------------------
  const priceRanges = [
    { label: "Fino a 20 euro", maxPrice: 20 },
    { label: "Fino a 50 euro", maxPrice: 50 },
    { label: "Fino a 100 euro", maxPrice: 100 },
  ];

  const colors = [
    { name: "Beige", color: "#f5deb3" },
    { name: "Grigio", color: "#808080" },
    { name: "Bianco", color: "#ffffff" },
  ];

  const handleColorChange = (color) => {};

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Banner di esempio */}
      <Banner>Spedizione gratuita per ordini superiori a 50 euro</Banner>

      <Header>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Title>Zencasa</Title>
          <nav style={{ display: "flex", alignItems: "center", gap: "15px" }}>
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
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <StyledButton to="/">HOME</StyledButton>
          <StyledButton
            onClick={handleLogout}
            style={{ display: "flex", alignItems: "center", gap: "20px" }}
          >
            LOGOUT
          </StyledButton>
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
          <SidebarItem onClick={() => setActiveSection("caseAperti")}>
            Problemi
          </SidebarItem>
          <SidebarItem onClick={() => setActiveSection("gestisciUtenti")}>
            Gestisci Utenti
          </SidebarItem>
          <SidebarItem onClick={() => setActiveSection("prodotti")}>
            Prodotti
          </SidebarItem>
          <SidebarItem onClick={() => setActiveSection("ordini")}>
            Ordini
          </SidebarItem>
        </Sidebar>

        {/* Sezione principale */}
        <DashboardSection>
          <DashboardSection>
            {activeSection === "caseAperti" && (
              <>
                <h2 style={{ marginBottom: "20px" }}>Problemi</h2>

                {/* Form per aggiungere ticket */}
                <form
                  onSubmit={handleAddTicket}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "15px",
                    backgroundColor: "#f9f9f9",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    marginBottom: "20px",
                  }}
                >
                  <input
                    type="text"
                    value={newTicket.cliente}
                    onChange={(e) =>
                      setNewTicket({ ...newTicket, cliente: e.target.value })
                    }
                    placeholder="Nome Cliente"
                    style={{
                      flex: 1,
                      marginRight: "10px",
                      padding: "10px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                    }}
                  />
                  <input
                    type="email"
                    value={newTicket.email}
                    onChange={(e) =>
                      setNewTicket({ ...newTicket, email: e.target.value })
                    }
                    placeholder="Email Cliente"
                    style={{
                      flex: 1,
                      marginRight: "10px",
                      padding: "10px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                    }}
                  />
                  <textarea
                    value={newTicket.descrizione}
                    onChange={(e) =>
                      setNewTicket({
                        ...newTicket,
                        descrizione: e.target.value,
                      })
                    }
                    placeholder="Descrizione del problema"
                    style={{
                      flex: 2,
                      marginRight: "10px",
                      padding: "10px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#28a745",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Aggiungi Ticket
                  </button>
                </form>

                {/* Lista di ticket */}
                <div>
                  {tickets.length === 0 ? (
                    <p style={{ textAlign: "center", color: "#666" }}>
                      Nessun ticket aperto.
                    </p>
                  ) : (
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        backgroundColor: "#fff",
                        border: "1px solid #ddd",
                      }}
                    >
                      <thead>
                        <tr style={{ backgroundColor: "#f5f5f5" }}>
                          <th
                            style={{
                              padding: "10px",
                              borderBottom: "1px solid #ddd",
                            }}
                          >
                            Cliente
                          </th>
                          <th
                            style={{
                              padding: "10px",
                              borderBottom: "1px solid #ddd",
                            }}
                          >
                            Email
                          </th>
                          <th
                            style={{
                              padding: "10px",
                              borderBottom: "1px solid #ddd",
                            }}
                          >
                            Descrizione
                          </th>
                          <th
                            style={{
                              padding: "10px",
                              borderBottom: "1px solid #ddd",
                            }}
                          >
                            Stato
                          </th>
                          <th
                            style={{
                              padding: "10px",
                              borderBottom: "1px solid #ddd",
                            }}
                          >
                            Azioni
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {tickets.map((ticket) => (
                          <tr key={ticket.id}>
                            <td
                              style={{
                                padding: "10px",
                                borderBottom: "1px solid #ddd",
                              }}
                            >
                              {ticket.cliente}
                            </td>
                            <td
                              style={{
                                padding: "10px",
                                borderBottom: "1px solid #ddd",
                              }}
                            >
                              <a
                                href={`mailto:${ticket.email}`}
                                style={{
                                  color: "#007BFF",
                                  textDecoration: "underline",
                                  cursor: "pointer",
                                }}
                              >
                                {ticket.email}
                              </a>
                            </td>
                            <td
                              style={{
                                padding: "10px",
                                borderBottom: "1px solid #ddd",
                              }}
                            >
                              {ticket.descrizione}
                            </td>
                            <td
                              style={{
                                padding: "10px",
                                borderBottom: "1px solid #ddd",
                              }}
                            >
                              {ticket.stato}
                            </td>
                            <td
                              style={{
                                padding: "10px",
                                borderBottom: "1px solid #ddd",
                              }}
                            >
                              {ticket.stato === "Aperto" ? (
                                <button
                                  onClick={() =>
                                    handleChangeTicketStatus(
                                      ticket.id,
                                      "Chiuso"
                                    )
                                  }
                                  style={{
                                    padding: "5px 10px",
                                    backgroundColor: "#007bff",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    marginRight: "5px",
                                  }}
                                >
                                  Chiudi
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    handleChangeTicketStatus(
                                      ticket.id,
                                      "Aperto"
                                    )
                                  }
                                  style={{
                                    padding: "5px 10px",
                                    backgroundColor: "#28a745",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    marginRight: "5px",
                                  }}
                                >
                                  Riapri
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteTicket(ticket.id)}
                                style={{
                                  padding: "5px 10px",
                                  backgroundColor: "#dc3545",
                                  color: "#fff",
                                  border: "none",
                                  borderRadius: "4px",
                                  cursor: "pointer",
                                }}
                              >
                                Elimina
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </>
            )}
          </DashboardSection>

          {/* SEZIONE GESTISCI UTENTI */}
          {activeSection === "gestisciUtenti" && (
            <>
              <h2>Gestione Utenti</h2>
              {error ? (
                <p style={{ color: "red" }}>{error}</p>
              ) : (
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    backgroundColor: "#fff",
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: "#f5f5f5" }}>
                      <th
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        Nome
                      </th>
                      <th
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        Cognome
                      </th>
                      <th
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        Email
                      </th>
                      <th
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        Indirizzo
                      </th>
                      <th
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        Contatta Cliente
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          style={{ textAlign: "center", padding: "20px" }}
                        >
                          Nessun utente trovato.
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user.id}>
                          <td
                            style={{
                              padding: "10px",
                              borderBottom: "1px solid #ddd",
                            }}
                          >
                            {user.nome || "N/A"}
                          </td>
                          <td
                            style={{
                              padding: "10px",
                              borderBottom: "1px solid #ddd",
                            }}
                          >
                            {user.cognome || "N/A"}
                          </td>
                          <td
                            style={{
                              padding: "10px",
                              borderBottom: "1px solid #ddd",
                            }}
                          >
                            {user.email || "N/A"}
                          </td>
                          <td
                            style={{
                              padding: "10px",
                              borderBottom: "1px solid #ddd",
                            }}
                          >
                            {user.indirizzo || "N/A"}
                          </td>
                          <td
                            style={{
                              padding: "10px",
                              borderBottom: "1px solid #ddd",
                            }}
                          >
                            <a
                              href={`mailto:${user.email}?subject=Richiesta%20informazioni&body=Ciao%20${user.nome},`}
                              style={{
                                color: "#007BFF",
                                textDecoration: "underline",
                                cursor: "pointer",
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

          {/* SEZIONE PRODOTTI */}
          {activeSection === "prodotti" && (
            <>
              <h2>Gestione Prodotti</h2>

              {loadingProducts && <p>Caricamento dei prodotti...</p>}
              {productsError && <p style={{ color: "red" }}>{productsError}</p>}

              {!loadingProducts && !productsError && (
                <CatalogContainer style={{ marginTop: "20px" }}>
                  <MainContent>
                    {/* Barra di ricerca */}
                    <div style={{ marginBottom: "20px" }}>
                      <input
                        type="text"
                        placeholder="Cerca prodotto..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                      <span>{filteredProducts.length} Prodotti trovati</span>
                    </div>

                    {/* Griglia prodotti filtrati */}
                    <ProductGrid>
                      {filteredProducts.map((product) => (
                        <ProductCard key={product.documentId}>
                          <ProductImage
                            src={product.image}
                            alt={product.name}
                          />
                          <ProductName>{product.name}</ProductName>
                          <ProductPrice>{`€${product.price.toFixed(
                            2
                          )}`}</ProductPrice>
                          <p>Quantità: {product.quantity}</p>
                        </ProductCard>
                      ))}
                    </ProductGrid>
                  </MainContent>
                </CatalogContainer>
              )}
            </>
          )}

          {/* SEZIONE ORDINI */}
          {activeSection === "ordini" && (
            <>
              <h2>Gestione Ordini</h2>
              {orderError ? (
                <p style={{ color: "red" }}>{orderError}</p>
              ) : (
                <div style={{ marginTop: "20px" }}>
                  {orders.length > 0 ? (
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        backgroundColor: "#fff",
                        marginBottom: "20px",
                      }}
                    >
                      <thead>
                        <tr
                          style={{
                            backgroundColor: "#f5f5f5",
                            textAlign: "left",
                          }}
                        >
                          <th
                            style={{
                              padding: "10px",
                              borderBottom: "1px solid #ddd",
                            }}
                          >
                            Ordine ID
                          </th>
                          <th
                            style={{
                              padding: "10px",
                              borderBottom: "1px solid #ddd",
                            }}
                          >
                            Data
                          </th>
                          <th
                            style={{
                              padding: "10px",
                              borderBottom: "1px solid #ddd",
                            }}
                          >
                            Stato
                          </th>
                          <th
                            style={{
                              padding: "10px",
                              borderBottom: "1px solid #ddd",
                            }}
                          >
                            Prezzo Totale
                          </th>
                          <th
                            style={{
                              padding: "10px",
                              borderBottom: "1px solid #ddd",
                            }}
                          >
                            Cliente
                          </th>
                          <th
                            style={{
                              padding: "10px",
                              borderBottom: "1px solid #ddd",
                            }}
                          >
                            Azioni
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => {
                          const ordine = order.cod_ordine || {};
                          const user = ordine.user || {};
                          const prodotto = order.cod_prodotto || {};
                          const isOpen = openOrderDocumentIds.includes(
                            ordine.documentId
                          ); // Controlla se il gruppo è aperto
                          // Funzione per copiare i dati negli appunti
                          const copyOrderDetails = () => {
                            const textToCopy = `
                    Document ID: ${ordine.documentId || "N/A"}
                    Nome Prodotto: ${prodotto.nome_prodotto || "N/A"}
                    Nome Cliente: ${user.nome || "N/A"}
                    Cognome Cliente: ${user.cognome || "N/A"}
                    Indirizzo Cliente: ${user.indirizzo || "N/A"}
                  `;
                            navigator.clipboard.writeText(textToCopy.trim());
                            alert("Dettagli copiati negli appunti!");
                          };

                          return (
                            <React.Fragment key={ordine.id}>
                              <tr>
                                <td
                                  style={{
                                    padding: "10px",
                                    borderBottom: "1px solid #ddd",
                                  }}
                                >
                                  {ordine.documentId || "N/A"}
                                </td>
                                <td
                                  style={{
                                    padding: "10px",
                                    borderBottom: "1px solid #ddd",
                                  }}
                                >
                                  {ordine.data
                                    ? new Date(ordine.data).toLocaleDateString()
                                    : "N/A"}
                                </td>
                                <td
                                  style={{
                                    padding: "10px",
                                    borderBottom: "1px solid #ddd",
                                  }}
                                >
                                  {ordine.stato || "N/A"}
                                </td>
                                <td
                                  style={{
                                    padding: "10px",
                                    borderBottom: "1px solid #ddd",
                                  }}
                                >
                                  {ordine.prezzo_totale
                                    ? `€${ordine.prezzo_totale.toFixed(2)}`
                                    : "N/A"}
                                </td>
                                <td
                                  style={{
                                    padding: "10px",
                                    borderBottom: "1px solid #ddd",
                                  }}
                                >
                                  {user.email || "N/A"}
                                </td>
                                <td
                                  style={{
                                    padding: "10px",
                                    borderBottom: "1px solid #ddd",
                                  }}
                                >
                                  <button
                                    onClick={() =>
                                      toggleOrderDetails(ordine.documentId)
                                    }
                                    style={{
                                      padding: "5px 10px",
                                      backgroundColor: "#007bff",
                                      color: "#fff",
                                      border: "none",
                                      borderRadius: "4px",
                                      cursor: "pointer",
                                    }}
                                  >
                                    {isOpen ? "▲ Nascondi" : "▼ Mostra"}
                                  </button>
                                  <button
                                    onClick={copyOrderDetails}
                                    style={{
                                      padding: "5px 10px",
                                      backgroundColor: "#28a745",
                                      color: "#fff",
                                      border: "none",
                                      borderRadius: "4px",
                                      cursor: "pointer",
                                    }}
                                  >
                                    Copia Dati
                                  </button>
                                </td>
                              </tr>
                              {isOpen && (
                                <tr>
                                  <td
                                    colSpan="6"
                                    style={{
                                      backgroundColor: "#f9f9f9",
                                      padding: "10px",
                                    }}
                                  >
                                    <div>
                                      <p>
                                        <strong>Nome:</strong>{" "}
                                        {user.nome || "N/A"}
                                      </p>
                                      <p>
                                        <strong>Cognome:</strong>{" "}
                                        {user.cognome || "N/A"}
                                      </p>
                                      <p>
                                        <strong>Indirizzo:</strong>{" "}
                                        {user.indirizzo || "N/A"}
                                      </p>
                                      <p>
                                        <strong>Prodotto:</strong>{" "}
                                        {order.cod_prodotto?.nome_prodotto ||
                                          "N/A"}
                                      </p>
                                      <p>
                                        <strong>Prezzo Unitario:</strong>{" "}
                                        {order.cod_prodotto?.prezzo_unitario
                                          ? `€${order.cod_prodotto.prezzo_unitario.toFixed(
                                              2
                                            )}`
                                          : "N/A"}
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

          {/* Dettagli dei prodotti per un ordine */}
          {orders.map((order) => (
            <div
              key={order.documentId}
              id={`product-list-${order.documentId}`}
              style={{
                display: "none",
                marginBottom: "20px",
                padding: "10px",
                border: "1px solid #ddd",
              }}
            >
              {/* Dati Cliente */}
              <h4>Dettagli Cliente</h4>
              <p>
                <strong>Nome:</strong>{" "}
                {customers[order.user?.documentId]?.nome || "N/A"} <br />
                <strong>Cognome:</strong>{" "}
                {customers[order.user?.documentId]?.cognome || "N/A"} <br />
                <strong>Email:</strong>{" "}
                {customers[order.user?.documentId]?.email || "N/A"} <br />
                <strong>Indirizzo:</strong>{" "}
                {customers[order.user?.documentId]?.indirizzo || "N/A"} <br />
              </p>

              {/* Dati Prodotti */}
              <h4>Dettagli Prodotti</h4>
              {products.length > 0 ? (
                <ul>
                  {products.map((product, index) => (
                    <li key={index}>
                      <strong>{product.name}</strong> - Quantità:{" "}
                      {product.quantity} - Prezzo: €{product.price.toFixed(2)}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Nessun prodotto associato a questo ordine.</p>
              )}
            </div>
          ))}
        </DashboardSection>
      </AdminContainer>
    </>
  );
};

export default ServicePage;
