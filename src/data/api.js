import axios from "axios";

export const API_URL = 'http://localhost:1337/api';
export const PRODUCTS_URL = `${API_URL}/prodottis`;
export const ORDERS_URL = `${API_URL}/ordini?populate=*`;
export const USERS_URL = `${API_URL}/users?populate=*`;
export const CLIENTS_URL = `${API_URL}/clientes`;

export const ORDER_PRODUCTS_URL = `${API_URL}/ordine-prodottos`;

export const fetchProducts = async () => {
    try {
      const response = await axios.get(`${PRODUCTS_URL}?populate=*`);
      return response.data.data.map((item) => ({
        id: item.id,
        documentId: item.documentId,
        nome_prodotto: item.nome_prodotto,
        descrizione: item.descrizione,
        prezzo_unitario: item.prezzo_unitario,
        quantita_disponibili: item.quantita_disponibili,
      }));
    } catch (error) {
      console.error("Errore nel recupero dei prodotti:", error);
      throw error;
    }
  };
  
  // Funzione per ottenere i dettagli di un singolo prodotto tramite documentId
  export const fetchProductById = async (documentId) => {
    try {
      const response = await axios.get(`${PRODUCTS_URL}/${documentId}?populate=*`);
      return response.data;
    } catch (error) {
      console.error(`Errore nel recupero del prodotto con documentId ${documentId}:`, error);
      throw error;
    }
  };