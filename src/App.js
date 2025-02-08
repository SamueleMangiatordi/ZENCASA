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
import Cart from './pages/Cart';
import Catalog from './pages/Catalog';
import User from './pages/User';
import ServicePage from './pages/ServicePage';

import {AuthProvider} from "./data/authContext";


function App() {
  const [cartItems, setCartItems] = useState([]);
  //const [products, setProducts] = useState([]); // Stato per i prodotti
  //const [loading, setLoading] = useState(true); // Stato di caricamento
  //const [error, setError] = useState(null); // Stato per gli errori

  return (
    <AuthProvider>
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/*" element={<AdminPage />} />
          <Route path="/products" element={<ProductsCatalog/>}/>
          <Route path="/products/:documentId" element={<Catalog />} />
          <Route path="/register" element={<Register />} />
          <Route path="/completa-profilo" element={<CompletaProfilo />} />
          <Route path="/cart" element={<Cart cartItems={cartItems || []} />} />
          <Route path="/cart?session_id={CHECKOUT_SESSION_ID}" element={<Cart />} />
          <Route path="/user" element={<User/>} />
          <Route path="/service" element={<ServicePage />} />
        </Routes>
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;