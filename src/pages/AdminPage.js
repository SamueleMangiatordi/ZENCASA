import React, { useState } from 'react';
import AdminProfile from '../components/Admin/AdminProfile';
import ManageProducts from '../components/Admin/ManageProducts';
import { products } from '../data/users';

const AdminPage = () => {
  const [currentView, setCurrentView] = useState('profile');

  return (
    <div>
      <h1>Area Amministratore</h1>
      <nav>
        <button onClick={() => setCurrentView('profile')}>Profilo Admin</button>
        <button onClick={() => setCurrentView('manageProducts')}>Gestisci Prodotti</button>
      </nav>
      {currentView === 'profile' && <AdminProfile />}
      {currentView === 'manageProducts' && <ManageProducts products={products} />}
    </div>
  );
};

export default AdminPage;
