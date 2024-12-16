import React from 'react';

const ManageProducts = ({ products }) => {
  return (
    <div>
      <h2>Gestisci Prodotti</h2>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>Prezzo: €{product.price}</p>
          <button>Modifica</button>
          <button>Elimina</button>
        </div>
      ))}
      <button>Aggiungi Nuovo Prodotto</button>
    </div>
  );
};

export default ManageProducts;
