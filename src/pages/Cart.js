import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  AddToCartButton,
  ProductDetails,
  ProductName,
  ProductPrice,
  ControlButton,
  DropdownWrapper,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  CartContainer,
  ProductList,
  ProductCard,
  ProductInfo,
  QuantityControls,
  RemoveButton,
  SummarySection,
  SummaryItem,
  TotalPrice,
  CheckoutButton,
  FreeShippingContainer,
  ProgressBarOuter,
  ProgressBarInner,
  ProgressLabels,
  HighlightText,
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
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const SHIPPING_COST = 5.6;
  const FREE_SHIPPING_THRESHOLD = 50;
  const DISCOUNT_THRESHOLD = 100;

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
      item.documentId === documentId ? { ...item, quantity: item.quantity + 1 } : item
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
      </Header>

      <CartContainer style={{ display: "flex", justifyContent: "space-between" }}>
        {/* Colonna Sinistra */}
        <div style={{ flex: "2", paddingRight: "20px" }}>
          <FreeShippingContainer style={{ marginBottom: "20px" }}>
            <p style={{ textAlign: "center", marginBottom: "5px", fontSize: "1rem" }}>
              {totalCost >= FREE_SHIPPING_THRESHOLD
                ? totalCost >= DISCOUNT_THRESHOLD
                  ? "Complimenti! Spedizione gratuita e sconto 10% applicato 🎉"
                  : "Complimenti! La spedizione è gratuita 🎉"
                : `Mancano €${(FREE_SHIPPING_THRESHOLD - totalCost).toFixed(2)} per la spedizione gratuita!`}
            </p>
            <ProgressBarOuter style={{ height: "6px", backgroundColor: "#ddd" }}>
              <ProgressBarInner
                style={{
                  width: `${Math.min((totalCost / FREE_SHIPPING_THRESHOLD) * 100, 100)}%`,
                  backgroundColor: "#ff7f50",
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
              if (!product) return null;

              return (
                <ProductCard key={item.documentId}>
                  <ProductInfo>
                    <span
                      style={{
                        fontWeight: "bold",
                        fontSize: "1.2rem",
                        marginBottom: "5px",
                        display: "block",
                      }}
                    >
                      📦 {product.nome_prodotto} 📦
                    </span>
                    <span style={{ color: "#555", fontSize: "1rem", display: "block" }}>
                      💶 Prezzo unitario: €{product.prezzo_unitario.toFixed(2)}
                    </span>
                  </ProductInfo>
                  <QuantityControls style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button
                      onClick={() => decreaseQuantity(item.documentId)}
                      style={{
                        backgroundColor: "red",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        cursor: "pointer",
                        borderRadius: "5px",
                      }}
                    >
                      -
                    </button>
                    <span style={{ margin: "0 10px" }}>{item.quantity}</span>
                    <button
                      onClick={() => increaseQuantity(item.documentId)}
                      style={{
                        backgroundColor: "green",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        cursor: "pointer",
                        borderRadius: "5px",
                      }}
                    >
                      +
                    </button>
                  </QuantityControls>
                  <div style={{ marginTop: "15px" }}>
                    <span
                      style={{
                        fontWeight: "bold",
                        fontSize: "1.2rem",
                        color: "#000",
                        display: "block",
                        marginBottom: "15px",
                      }}
                    >
                      €{(item.quantity * product.prezzo_unitario).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.documentId)}
                      style={{
                        backgroundColor: "red",
                        color: "white",
                        border: "none",
                        padding: "10px 15px",
                        cursor: "pointer",
                        borderRadius: "5px",
                        marginTop: "30px",
                      }}
                    >
                      Rimuovi
                    </button>
                  </div>
                </ProductCard>
              );
            })}
          </ProductList>
        </div>

        {/* Colonna Destra: Riepilogo Ordine */}
        <SummarySection style={{ flex: "1" }}>
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
          <CheckoutButton
            to="/checkout"
            style={{
              backgroundColor: "#ccc",
              color: "black",
              fontWeight: "bold",
              fontSize: "1rem",
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#ff7f50")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#ccc")}
          >
            Procedi al pagamento
          </CheckoutButton>
        </SummarySection>
      </CartContainer>
    </>
  );
};

export default Cart;
