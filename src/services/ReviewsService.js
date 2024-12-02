import axios from 'axios';
// Ruta de la API
const API_URL = 'http://localhost:5000/reviews';

// Obtener reseñas de un libro
export const getBookReviews = (bookId) => {
  try {
    return axios.get(`${API_URL}/${bookId}`);
  } catch (error) {
    console.error('Error al obtener las reseñas:', error);
    throw error;
  }
};

// Añadir una nueva reseña
export const addReview = (bookId, comment, token) => {
  try {
    token = token.token;
    return axios.post(
      `${API_URL}/newReview`,
      { bookId, comment },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (error) {
    console.error('Error al añadir la reseña:', error);
    throw error;
  }
};
