import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

  const handleProceedToCheckout = () => {
    if (cart.length > 0) {
      setIsCheckoutVisible(true);
    }
  };

  const totalCost = cart.reduce((total, item) => {
    const product = products.find((prod) => prod.documentId === item.documentId);
    const price = product ? product.prezzo_unitario : 0;
    return total + item.quantity * price;
  }, 0);

  const shippingCost = totalCost >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const discount = totalCost >= DISCOUNT_THRESHOLD ? totalCost * 0.1 : 0;

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
          {/* Aggiungi il pulsante "Torna indietro" */}
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
            // Mostra il carrello
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
                      width: `${Math.min(
                        (totalCost / FREE_SHIPPING_THRESHOLD) * 100,
                        100
                      )}%`,
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
                  const product = products.find(
                    (prod) => prod.documentId === item.documentId
                  );
                  if (!product) return null;
  
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
            // Mostra i dettagli di spedizione
            <CheckoutForm>
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
              <ProceedButton
                onClick={() => {
                  console.log("Dati di spedizione:", formData);
                  alert("Ordine completato con successo!");
                  setIsCheckoutVisible(false);
                }}
              >
                Completa Ordine
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
            <span>
              {shippingCost > 0 ? `€${shippingCost.toFixed(2)}` : "Gratuita 🎉"}
            </span>
          </SummaryItem>
          <SummaryItem>
            <span>Sconto</span>{" "}
            <span>{discount > 0 ? `-€${discount.toFixed(2)}` : "Nessuno"}</span>
          </SummaryItem>
          <TotalPrice>
            <span>Totale</span>{" "}
            <span>€{(totalCost + shippingCost - discount).toFixed(2)}</span>
          </TotalPrice>
          <CheckoutButton
            onClick={handleProceedToCheckout}
            disabled={cart.length === 0}
          >
            Inserisci dettagli spedizione
          </CheckoutButton>
        </SummarySection>
      </CartContainer>
    </>
  );
  
};

export default Cart;
