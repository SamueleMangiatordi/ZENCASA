import React, { useState, useEffect } from "react";
import { fetchProducts, fetchProductById } from "../data/api";

const Cart = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Recupera i prodotti al montaggio del componente
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

  // Debug per verificare i dati del carrello
  useEffect(() => {
    console.log("Stato del carrello:", cart);
  }, [cart]);

  // Funzione per aggiungere un prodotto al carrello
  const addToCart = (product) => {
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
      const updatedCart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } else {
      const updatedCart = [...cart, { ...product, quantity: 1 }];
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  };

  // Funzione per rimuovere un prodotto dal carrello
  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "auto" }}>
      {/* Titolo */}
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>Il tuo carrello</h1>

      {/* Catalogo Prodotti */}
      <h2 style={{ fontSize: "20px", marginBottom: "20px" }}>Catalogo Prodotti</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "5px",
              padding: "15px",
              backgroundColor: "#fff",
            }}
          >
            <h3 style={{ fontSize: "18px", marginBottom: "10px" }}>
              {product.nome_prodotto}
            </h3>
            <p style={{ fontSize: "16px", marginBottom: "10px" }}>
              Prezzo:{" "}
              <strong>
                €
                {product.prezzo_unitario
                  ? product.prezzo_unitario.toFixed(2)
                  : "Prezzo non disponibile"}
              </strong>
            </p>
            <button
              onClick={() => addToCart(product)}
              style={{
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                padding: "10px 15px",
                borderRadius: "5px",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              Aggiungi al carrello
            </button>
            <button
              onClick={() => setSelectedProduct(product)}
              style={{
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                padding: "10px 15px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Dettagli
            </button>
          </div>
        ))}
      </div>

      {/* Dettagli Prodotto */}
      {selectedProduct && (
        <div
          style={{
            marginTop: "40px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            padding: "20px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>
            Dettagli Prodotto
          </h2>
          <h3>{selectedProduct.nome_prodotto}</h3>
          <p>{selectedProduct.descrizione}</p>
          <p>
            Prezzo:{" "}
            {selectedProduct.prezzo_unitario
              ? `€${selectedProduct.prezzo_unitario.toFixed(2)}`
              : "Prezzo non disponibile"}
          </p>
          <p>Quantità disponibili: {selectedProduct.quantita_disponibili}</p>
        </div>
      )}

      {/* Carrello */}
      <h2 style={{ fontSize: "20px", marginTop: "40px", marginBottom: "20px" }}>
        Il tuo carrello
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {cart.length === 0 ? (
          <p>Il carrello è vuoto</p>
        ) : (
          cart.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "5px",
                padding: "15px",
                backgroundColor: "#fff",
              }}
            >
              <h3 style={{ fontSize: "18px", marginBottom: "10px" }}>
                {item.nome_prodotto}
              </h3>
              <p style={{ fontSize: "16px", marginBottom: "10px" }}>
                Prezzo:{" "}
                <strong>
                  €
                  {item.prezzo_unitario
                    ? item.prezzo_unitario.toFixed(2)
                    : "Prezzo non disponibile"}
                </strong>
              </p>
              <p style={{ fontSize: "16px", marginBottom: "10px" }}>
                Quantità: <strong>{item.quantity}</strong>
              </p>
              <button
                onClick={() => removeFromCart(item.id)}
                style={{
                  backgroundColor: "#f44336",
                  color: "white",
                  border: "none",
                  padding: "10px 15px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Rimuovi
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Cart;
