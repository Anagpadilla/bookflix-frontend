import axios from 'axios';

const API_URL = 'http://localhost:5005/books';

// Servicio que nos devuelve todos los libros de la tabla libros de la BBDD.Esta función realiza la llamada al backend, concretamente a la rutas que se encuentran en la carpeta de routes: BookRoutes.js
export const getAllBooks = () => {
  try {
    return axios.get(`${API_URL}/getBooks`);
  } catch (error) {
    console.error('Error al obtener todos los libros desde getAllBooks', error);
    throw error;
  }
};

// Servicio que nos devuelve a ttravés del id del libro, información de un libro concreto.Esta función realiza la llamada al backend, concretamente a la rutas que se encuentran en la carpeta de routes: BookRoutes.js
export const getBookDetails = async (bookId) => {
  try {
    return axios.get(`${API_URL}/${bookId}`);
  } catch (error) {
    console.error(
      'Error al obtener información del libro' +
        bookId +
        'con el siguiente error:',
      error
    );
    throw error;
  }
};
