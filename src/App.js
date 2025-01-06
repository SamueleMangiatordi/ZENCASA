import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import Register from './pages/Register';
import ProductsCatalog from './pages/Catalog';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

function App() {
  const [cartItems, setCartItems] = useState([]);

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
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/*" element={<AdminPage />} />
          <Route path="/products" element={<ProductsCatalog onAddToCart={addToCart} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart cartItems={cartItems || []} />} />
          <Route path="/checkout" element={<Checkout cartItems={cartItems || []} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
