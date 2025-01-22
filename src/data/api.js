import axios from "axios";

// Base URL dell'API
export const API_URL = 'http://localhost:1337/api';
export const PRODUCTS_URL = `${API_URL}/prodottis`;
export const ORDERS_URL = `${API_URL}/ordini?populate=*`;
export const USERS_URL = `${API_URL}/users?populate=*`;
export const CLIENTS_URL = `${API_URL}/clientes`;
export const ORDER_PRODUCTS_URL = `${API_URL}/ordine-prodottos`;

// Funzione per ottenere tutti i prodotti
export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${PRODUCTS_URL}?populate=*`);
    return response.data.data.map((item) => ({
      id: item.id,
      documentId: item.documentId || null, // Controllo per documentId
      nome_prodotto: item.nome_prodotto || "Nome non disponibile",
      descrizione: item.descrizione || "Descrizione non disponibile",
      prezzo_unitario: item.prezzo_unitario || 0, // Imposta il prezzo a 0 se non disponibile
      quantita_disponibili: item.quantita_disponibili || 0, // Quantità disponibile fallback a 0
      immagine_prodotto: null, // Immagine non presente nell'API condivisa, usa un segnaposto
    }));
  } catch (error) {
    console.error("Errore nel recupero dei prodotti:", error);
    throw error;
  }
};

// Funzione per ottenere i dettagli di un prodotto specifico tramite documentId
export const fetchProductById = async (documentId) => {
  try {
    // Verifica che il documentId sia valido
    if (!documentId) {
      throw new Error("documentId non fornito");
    }

    const response = await axios.get(`${PRODUCTS_URL}?filters[documentId][$eq]=${documentId}&populate=*`);
    const item = response.data.data[0];

    if (!item) {
      throw new Error(`Prodotto con documentId ${documentId} non trovato`);
    }

    // Mappa il prodotto
    return {
      id: item.id,
      documentId: item.documentId || null,
      nome_prodotto: item.nome_prodotto || "Nome non disponibile",
      descrizione: item.descrizione || "Descrizione non disponibile",
      prezzo_unitario: item.prezzo_unitario || 0,
      quantita_disponibili: item.quantita_disponibili || 0,
      immagine_prodotto: null, // Aggiungi il supporto per l'immagine quando disponibile
    };
  } catch (error) {
    console.error(`Errore nel recupero del prodotto con documentId ${documentId}:`, error);
    throw error;
  }
};
