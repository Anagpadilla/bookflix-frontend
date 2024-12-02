import axios from 'axios';

const API_URL = 'http://localhost:5005/users';

//Función que va a comunicar con la ruta users/register para registrar un usuario.
export const register = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/register`, data);
    return response.data;
  } catch (error) {
    console.error(
      'Error al crear el usuario:',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
