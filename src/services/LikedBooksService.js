import axios from 'axios';

const API_URL = 'http://localhost:5005/likedBooks';

//Funcón que obtiene los libros que le gustan al usuario y hace una llamada a la ruta de likedBooks/getLikedBooks
export const getLikedBooks = (token) => {
  try {
    console.log('estoy en services de getLikedBooks');
    //Para obtener el id de ususario enviamos el token que se obtiene al loguearse y será comprobado en el middleware de autenticación.
    return axios.get(`${API_URL}/getLikedBooks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error(
      'Error al obtener los libros:',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
//Función que le da me gusta o no me gusta a un libro y hace una llamada a la ruta de likedBooks/likeBook
export const LikeBook = (bookId, liked, token) => {
  try {
    return axios.post(
      `${API_URL}/likeBook`,
      { bookId, liked },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (error) {
    console.error(
      'Error al dar like al libro:',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
