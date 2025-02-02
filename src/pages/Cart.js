import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from '@stripe/stripe-js';

import {
  CartContainer,
  ProductList,
  ProductCard,
  ProductInfo,
  QuantityControls,
  SummarySection,
  SummaryItem,
  TotalPrice,
  CheckoutButton,
  FreeShippingContainer,
  ProgressBarOuter,
  ProgressBarInner,
  ProgressLabels,
  HighlightText,
  CheckoutForm,
  FormField,
  Input,
  ProceedButton,
} from "../styles/StyledCart";

import {
  Banner,
  Header,
  Title,
  StyledButton,
} from "../styles/StyledComponents";

import { fetchProducts } from "../data/api";

// Inizializza Stripe con la tua chiave pubblica
const stripePromise = loadStripe('pk_test_51Qk6KcCOYow4mpBKhOXc4XlwerQUDyOr24T8J0BEav19jWSHHZ6QrAzL2I1gCxIsqsiDq5ms0g5LXcVIEz6ErJK300EuNrpmCI');

const Cart = () => {
  const [products, setProducts] = useState([]);
  const [isCheckoutVisible, setIsCheckoutVisible] = useState(false);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    address1: "",
    postalCode: "",
    city: "",
  });
  
  const SHIPPING_COST = 5.6;
  const FREE_SHIPPING_THRESHOLD = 50;
  const DISCOUNT_THRESHOLD = 100;
  
  const navigate = useNavigate();
  
  // Recupera i prodotti
  useEffect(() => {
    const getProducts = async () => {
      try {
        const productsData = await fetchProducts();
        setProducts(productsData);
      } catch (error) {
        console.error("Errore nel caricamento dei prodotti:", error);
      }
    };
    getProducts();
  }, []);
  
  // Funzioni per aggiornare il carrello
  const increaseQuantity = (documentId) => {
    const updatedCart = cart.map((item) =>
      item.documentId === documentId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const decreaseQuantity = (documentId) => {
    const updatedCart = cart
      .map((item) =>
        item.documentId === documentId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeFromCart = (documentId) => {
    const updatedCart = cart.filter((item) => item.documentId !== documentId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Mostra il form di checkout
  const handleProceedToCheckout = () => {
    if (cart.length > 0) {
      setIsCheckoutVisible(true);
    }
  };

  // Calcola totali
  const totalCost = cart.reduce((total, item) => {
    const product = products.find((prod) => prod.documentId === item.documentId);
    const price = product ? product.prezzo_unitario : 0;
    return total + item.quantity * price;
  }, 0);

  const shippingCost = totalCost >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const discount = totalCost >= DISCOUNT_THRESHOLD ? totalCost * 0.1 : 0;

  // Funzione di pagamento con Stripe
  const handlePayment = async () => {
    if (cart.length === 0) {
      alert("Il carrello è vuoto. Aggiungi un prodotto per procedere.");
      return;
    }
    if (!formData.name || !formData.surname || !formData.address1 || !formData.postalCode || !formData.city) {
      alert("Per favore, compila tutti i campi di spedizione.");
      return;
    }
    
    const payload = {
      cartItems: cart.map(item => {
        const product = products.find(prod => prod.documentId === item.documentId);
        return {
          name: product ? product.nome_prodotto : "Prodotto sconosciuto",
          unit_amount: product ? Math.round(product.prezzo_unitario * 100) : 0,
          quantity: item.quantity,
        };
      }),
      shippingCost: shippingCost,
      discount: discount,
    };

    try {
      const response = await fetch('http://localhost:4242/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error("Errore nella risposta del backend", response);
        alert("Errore nella creazione della sessione di pagamento. Controlla la console per maggiori dettagli.");
        return;
      }

      const session = await response.json();
      if (session.error) {
        console.error("Errore nella sessione:", session.error);
        alert("Si è verificato un errore durante la creazione della sessione di pagamento.");
        return;
      }

      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId: session.id });
      if (error) {
        console.error("Stripe error:", error);
        alert(error.message);
      }
    } catch (error) {
      console.error("Errore nel processo di pagamento:", error);
      alert("Si è verificato un errore. Riprova.");
    }
  };

  // 1) Funzione per gestire l'invio del form e bloccare il comportamento predefinito
  const handleFormSubmit = (e) => {
    e.preventDefault(); // Evita il refresh della pagina e la query string
    handlePayment();    // Chiama la logica del pagamento
  };

  return (
    <>
      <Banner>Spedizione gratuita per ordini superiori a 50 euro</Banner>
      <Header>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <Title>Zencasa</Title>
          <nav style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <StyledButton to="/">HOME</StyledButton>
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
        <StyledButton to="/profile">👤 Profilo</StyledButton>
      </Header>
  
      <CartContainer style={{ display: "flex", alignItems: "flex-start" }}>
        <div style={{ flex: 2, marginRight: "20px" }}>
          {isCheckoutVisible && (
            <button
              onClick={() => setIsCheckoutVisible(false)}
              style={{
                backgroundColor: "gray",
                color: "white",
                border: "none",
                padding: "10px 15px",
                borderRadius: "5px",
                cursor: "pointer",
                marginBottom: "20px",
              }}
            >
              Torna al Carrello
            </button>
          )}
  
          {!isCheckoutVisible ? (
            <>
              <FreeShippingContainer style={{ marginBottom: "20px", width: "90%" }}>
                <p style={{ textAlign: "center", marginBottom: "5px", fontSize: "1rem" }}>
                  {totalCost >= FREE_SHIPPING_THRESHOLD
                    ? totalCost >= DISCOUNT_THRESHOLD
                      ? "Complimenti! Spedizione gratuita e sconto 10% applicato 🎉"
                      : "Complimenti! La spedizione è gratuita 🎉"
                    : `Mancano €${(FREE_SHIPPING_THRESHOLD - totalCost).toFixed(2)} per la spedizione gratuita!`}
                </p>
                <ProgressBarOuter style={{ height: "6px" }}>
                  <ProgressBarInner
                    style={{
                      backgroundColor: "#FFA500",
                      width: `${Math.min((totalCost / FREE_SHIPPING_THRESHOLD) * 100, 100)}%`,
                    }}
                  />
                </ProgressBarOuter>
                <ProgressLabels>
                  <HighlightText>Spedizione Gratuita</HighlightText>
                  <HighlightText>Sconto 10% (oltre 100€)</HighlightText>
                </ProgressLabels>
              </FreeShippingContainer>
  
              <ProductList>
                {cart.map((item) => {
                  const product = products.find((prod) => prod.documentId === item.documentId);
                  if (!product) {
                    return (
                      <ProductCard key={item.documentId}>
                        <p>Prodotto non trovato. Forse è stato rimosso.</p>
                        <button
                          onClick={() => removeFromCart(item.documentId)}
                          style={{
                            backgroundColor: "red",
                            color: "white",
                            border: "none",
                            padding: "10px 15px",
                            borderRadius: "5px",
                            cursor: "pointer",
                          }}
                        >
                          Rimuovi
                        </button>
                      </ProductCard>
                    );
                  }
  
                  return (
                    <ProductCard key={item.documentId} style={{ display: "flex" }}>
                      <div style={{ flex: 3 }}>
                        <ProductInfo>
                          <span
                            style={{
                              fontWeight: "bold",
                              fontSize: "1.2rem",
                              display: "block",
                            }}
                          >
                            📦 {product.nome_prodotto} 📦
                          </span>
                          <span style={{ color: "#555", fontSize: "1rem" }}>
                            💶 Prezzo unitario: €{product.prezzo_unitario.toFixed(2)}
                          </span>
                        </ProductInfo>
                      </div>
                      <div
                        style={{
                          flex: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <QuantityControls>
                          <button
                            onClick={() => decreaseQuantity(item.documentId)}
                            style={{
                              backgroundColor: "red",
                              color: "white",
                              border: "none",
                              padding: "5px 10px",
                              borderRadius: "5px",
                              cursor: "pointer",
                            }}
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => increaseQuantity(item.documentId)}
                            style={{
                              backgroundColor: "green",
                              color: "white",
                              border: "none",
                              padding: "5px 10px",
                              borderRadius: "5px",
                              cursor: "pointer",
                            }}
                          >
                            +
                          </button>
                        </QuantityControls>
                        <span style={{ fontWeight: "bold" }}>
                          €{(item.quantity * product.prezzo_unitario).toFixed(2)}
                        </span>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.documentId)}
                        style={{
                          backgroundColor: "red",
                          color: "white",
                          border: "none",
                          padding: "10px 15px",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                      >
                        Rimuovi
                      </button>
                    </ProductCard>
                  );
                })}
              </ProductList>
            </>
          ) : (
            // 2) Usiamo <CheckoutForm> come un <form> e gestiamo onSubmit
            <CheckoutForm onSubmit={handleFormSubmit}>
              <h2>Inserisci i dettagli di spedizione</h2>
              <FormField>
                <label>Nome:</label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Inserisci il tuo nome"
                  required
                />
              </FormField>
              <FormField>
                <label>Cognome:</label>
                <Input
                  type="text"
                  name="surname"
                  value={formData.surname}
                  onChange={handleInputChange}
                  placeholder="Inserisci il tuo cognome"
                  required
                />
              </FormField>
              <FormField>
                <label>Indirizzo:</label>
                <Input
                  type="text"
                  name="address1"
                  value={formData.address1}
                  onChange={handleInputChange}
                  placeholder="Inserisci il tuo indirizzo"
                  required
                />
              </FormField>
              <FormField>
                <label>CAP:</label>
                <Input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  placeholder="Inserisci il tuo CAP"
                  required
                />
              </FormField>
              <FormField>
                <label>Città:</label>
                <Input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Inserisci la tua città"
                  required
                />
              </FormField>

              {/* 3) Il pulsante è di tipo submit, quindi invoca onSubmit del form */}
              <ProceedButton
                type="submit"
                disabled={cart.length === 0}
                style={{
                  backgroundColor: cart.length === 0 ? "gray" : "#007BFF",
                  cursor: cart.length === 0 ? "not-allowed" : "pointer",
                }}
              >
                Procedi al pagamento
              </ProceedButton>
            </CheckoutForm>
          )}
        </div>
  
        <SummarySection>
          <h2>Riepilogo dell'ordine</h2>
          <SummaryItem>
            <span>Subtotale</span> <span>€{totalCost.toFixed(2)}</span>
          </SummaryItem>
          <SummaryItem>
            <span>Spedizione</span>{" "}
            <span>{shippingCost > 0 ? `€${shippingCost.toFixed(2)}` : "Gratuita 🎉"}</span>
          </SummaryItem>
          <SummaryItem>
            <span>Sconto</span>{" "}
            <span>{discount > 0 ? `-€${discount.toFixed(2)}` : "Nessuno"}</span>
          </SummaryItem>
          <TotalPrice>
            <span>Totale</span>{" "}
            <span>€{(totalCost + shippingCost - discount).toFixed(2)}</span>
          </TotalPrice>
          
          {totalCost > 0 && (
            <CheckoutButton
              onClick={handleProceedToCheckout}
              disabled={cart.length === 0}
              style={{
                backgroundColor: cart.length === 0 ? "gray" : "#007BFF",
                cursor: cart.length === 0 ? "not-allowed" : "pointer",
              }}
            >
              Inserisci dettagli spedizione
            </CheckoutButton>
          )}
        </SummarySection>
      </CartContainer>
    </>
  );
};

export default Cart;
