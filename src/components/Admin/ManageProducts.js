import React from 'react';
import {
  AdminContainer,
  DashboardContent,
  ProductCard,
  ProductActions,
  ActionButton,
  AddProductButton,
} from '../../styles/StyledAdminProfile';

const ManageProducts = ({ products }) => {
  return (
    <AdminContainer>
      <DashboardContent>
        <h2>Gestione Prodotti</h2>
        {products.map((product) => (
          <ProductCard key={product.id}>
            <div>
              <h3>{product.name}</h3>
              <p>Prezzo: €{product.price.toFixed(2)}</p>
            </div>
            <ProductActions>
              <ActionButton primary>Modifica</ActionButton>
              <ActionButton>Elimina</ActionButton>
            </ProductActions>
          </ProductCard>
        ))}
        <AddProductButton>Aggiungi Nuovo Prodotto</AddProductButton>
      </DashboardContent>
    </AdminContainer>
  );
};

export default ManageProducts;
