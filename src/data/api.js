const API_URL = 'http://localhost:1337/api';
export const PRODUCTS_URL = `${API_URL}/prodottis?populate=*`;
export const ORDERS_URL = `${API_URL}/ordini?populate=*`;
export const USERS_URL = `${API_URL}/users?populate=*`;

// Funzione per ottenere gli ordini
/*
export const getOrders = async () => {
  try {
    const response = await fetch(`${API_URL}/ordini?populate=*`);
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Errore durante la richiesta Fetch:', error);
    return [];
  }
};
*/