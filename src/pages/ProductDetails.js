import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Importa useParams per ottenere l'id dalla URL
import { PRODUCTS_URL } from '../data/api';
import {
  ProductDetailsContainer,
  ProductTitle,
  ProductImage,
  ProductDescription,
  ProductPrice,
  BackButton
} from '../styles/StyledProductDetails';


const ProductDetails = () => {
  const { documentId } = useParams(); // Ottieni l'id del prodotto dalla rotta
  console.log('ID del documento:', documentId);
  const navigate = useNavigate(); // Per tornare indietro
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`${PRODUCTS_URL}?populate=*`);
        //const response = await fetch(`${PRODUCTS_URL}?filters[documentId][$eq]=${documentId}&populate=*`); //istruzione originale
        //l'ho modificata io, in teoria va uguale
        
        if (!response.ok) {
          throw new Error(`Errore HTTP: ${response.status}`);
        }
        const data = await response.json();
        console.log('Dettagli ricevuti:', data)
        setProduct(data.data[0]);
        setLoading(false);
      } catch (err) {
        setError('Impossibile recuperare i dettagli del prodotto');
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [documentId]);

  
  if (loading) return <p>Caricamento dettagli...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>Prodotto non trovato</p>;


  const { nome_prodotto, descrizione, prezzo_unitario, immagine_prodotto } = product;
  const imageUrl =
  product?.immagine_prodotto?.[0]?.formats?.medium?.url
    ? `http://localhost:1337${product.immagine_prodotto[0].formats.medium.url}`
    : product?.immagine_prodotto?.[0]?.formats?.small?.url
    ? `http://localhost:1337${product.immagine_prodotto[0].formats.small.url}`
    : product?.immagine_prodotto?.[0]?.formats?.large?.url
    ? `http://localhost:1337${product.immagine_prodotto[0].formats.large.url}`
    : `http://localhost:1337${product?.immagine_prodotto?.[0]?.url || '/default-image.jpg'}`;

  
  return (
    <div style={{ padding: '20px' }}>
      <button onClick={() => navigate(-1)}>Torna indietro</button> {/* Bottone per tornare alla pagina precedente */}
      <h1>{nome_prodotto || 'Nome non disponibile'}</h1>
      <img src={imageUrl} alt={nome_prodotto} style={{ width: '300px', height: '300px', objectFit: 'cover' }} /> 
      <p>{descrizione || 'descrizione non disponibile'}</p>
      <p><strong>Prezzo:</strong> €{prezzo_unitario?.toFixed(2)}</p>
    </div>
  );
};

export default ProductDetails;
