import styled from 'styled-components';

export const ProductDetailsContainer = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  background-color: #f9f9f9; /* Sfondo chiaro */
  border-radius: 10px; /* Angoli arrotondati */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Ombra */
  font-family: Arial, sans-serif;
`;

export const ProductTitle = styled.h1`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 15px;
  text-align: center;
`;

export const ProductImage = styled.img`
  width: 100%; /* L'immagine occupa tutta la larghezza */
  max-width: 400px; /* Dimensione massima */
  height: auto; /* Mantiene le proporzioni */
  object-fit: contain; /* Mostra tutta l'immagine senza tagli */
  border-radius: 10px; /* Bordi arrotondati */
  display: block;
  margin: 0 auto 20px; /* Centra l'immagine e aggiunge un margine sotto */
`;

export const ProductDescription = styled.p`
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 20px;
  text-align: justify;
`;

export const ProductPrice = styled.p`
  font-size: 22px;
  font-weight: bold;
  color: #e67e22; /* Colore arancione */
  margin-bottom: 25px;
  text-align: center;
`;

export const BackButton = styled.button`
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  background-color: #3498db; /* Colore blu */
  color: white;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  width: 100%;
  max-width: 200px;

  &:hover {
    background-color: #217dbb; /* Blu più scuro al passaggio del mouse */
  }
`;
