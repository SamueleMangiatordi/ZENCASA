import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Importa useParams per ottenere l'id dalla URL
import { AddToCartButton } from '../styles/StyledCatalog'; // Import del bottone stile catalogo


const ProductDetails = ({ selectedProduct }) => {
  if (!selectedProduct) return <p>Prodotto non trovato</p>;

  const baseUrl = "http://localhost:1337";
  const imageFormats = selectedProduct?.imageFormats || {};
  const imageUrl =
    (selectedProduct?.image && `${baseUrl}${selectedProduct.image}`) ||
    (imageFormats.medium?.url && `${baseUrl}${imageFormats.medium.url}`) ||
    (imageFormats.small?.url && `${baseUrl}${imageFormats.small.url}`) ||
    (imageFormats.large?.url && `${baseUrl}${imageFormats.large.url}`) ||
    '/default-image.jpg';


  const { name, image, description, price } = selectedProduct;

  return (
    <div style={{ padding: '20px' }}>
      <h1>{name || 'Nome non disponibile'}</h1>
       {/* Immagine mostrata interamente */}
       <img
        src={imageUrl}
        alt={name}
        style={{
          width: '100%',
          maxHeight: '500px',
          objectFit: 'contain', // Mostra interamente l'immagine senza tagliarla
          marginBottom: '20px',
          backgroundColor: '#f0f0f0', // Per evidenziare lo sfondo se l'immagine è più piccola
        }}
      />

      <p><strong>Prezzo:</strong> €{price?.toFixed(2)}</p>
      <p style={{ lineHeight: '1.6' }}>
        <strong>Descrizione:</strong> {description || 'Descrizione non disponibile'}
      </p>
      
       {/* Bottone Aggiungi al Carrello */}
       <AddToCartButton style={{ width: '100%', marginTop: '20px' }}>
        Aggiungi al carrello 🛒
      </AddToCartButton>      

    </div>
  );
};

export default ProductDetails;
