import axios from 'axios';

const API_URL = 'http://localhost:5000/admin';

//Estos son los sevicios que van a hacer peticiones relacionadas con las acciones de administrador

//Obtenemos todos los ususarios con un get
export const getAllUsers = async () => {
  try {
    return await axios.get(`${API_URL}/users`);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    throw error;
  }
};

//Creamos un nuevo usuario con un post
export const createNewBook = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/newBook`, data);
  } catch (error) {
    console.error('Error al crear un nuevo libro:', error);
    throw error;
  }
};

//Editamos un libro con un put
export const updateBook = async (data) => {
  const bookId = data.bookId;
  try {
    return await axios.put(`${API_URL}/updateBook/${bookId}`, data);
  } catch (error) {
    console.error('Error al actualizar un libro:', error);
    throw error;
  }
};

//Eliminamos un libro con un delete
export const deleteBook = async (bookId) => {
  try {
    return await axios.delete(`${API_URL}/deleteBook/${bookId}`);
  } catch (error) {
    console.error('Error al eliminar un libro:', error);
    throw error;
  }
};
//Eliminamos un usuario con un delete
export const deleteUser = async (userId) => {
  try {
    return await axios.delete(`${API_URL}/deleteUser/${userId}`);
  } catch (error) {
    console.error('Error al eliminar un usuario:', error);
    throw error;
  }
};
