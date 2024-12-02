import axios from 'axios';

const API_URL = 'http://localhost:5000/users';

//Función que va a comunicar con la ruta users/login para loguear un usuario y comprobar que los datos introducios son correctos.

export const logInUser = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/login`, data);
    return response.data;
  } catch (error) {
    console.error(
      'Error al loguear el usuario:',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
