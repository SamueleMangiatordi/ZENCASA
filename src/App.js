import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import Register from './pages/Register';
import CompletaProfilo from './pages/CompletaProfilo';
import ProductsCatalog from './pages/Catalog';
import ProductDetails from './pages/ProductDetails'; // Import del componente pagina di dettaglio
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Catalog from './pages/Catalog';
import User from './pages/User';
import ServicePage from './pages/ServicePage';

import {AuthProvider} from "./data/authContext";


function App() {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]); // Stato per i prodotti
  const [loading, setLoading] = useState(true); // Stato di caricamento
  const [error, setError] = useState(null); // Stato per gli errori

  const addToCart = (product) => {
    setCartItems((prevCartItems) => {
      const itemExists = prevCartItems.find((item) => item.id === product.id);
      if (itemExists) {
        return prevCartItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCartItems, { ...product, quantity: 1 }];
      }
    });
  };

  return (
    <AuthProvider>
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/*" element={<AdminPage />} />
          <Route
            path="/products"
            element={
              <ProductsCatalog
                onAddToCart={addToCart}
                products={products}
                loading={loading}
                error={error}
              />
            }
          />
          <Route path="/products/:documentId" element={<ProductDetails />} />
          <Route path="/register" element={<Register />} />
          <Route path="/completa-profilo" element={<CompletaProfilo />} />
          <Route path="/cart" element={<Cart cartItems={cartItems || []} />} />
          <Route path="/checkout" element={<Checkout cartItems={cartItems || []} />} />
          <Route path="/user" element={<User/>} />
          <Route path="/service" element={<ServicePage />} />
        </Routes>
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;