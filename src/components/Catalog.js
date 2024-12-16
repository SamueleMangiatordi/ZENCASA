import React from 'react';

const Catalog = ({ products }) => {
  return (
    <div>
      <h2>Catalogo Prodotti</h2>
      <div className="products-list">
        {products.map(product => (
          <div className="product" key={product.id}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>Prezzo: €{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Catalog;
