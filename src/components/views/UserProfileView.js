import React, { useEffect, useState } from 'react';
import { getLikedBooks, LikeBook } from '../../services/LikedBooksService';
import { Link } from 'react-router-dom';
import { Toast } from '../utils/Toast';
import '../../styles/UserProfile.css';
import '../../styles/card.css';

const Profile = ({ token }) => {
  //Información del usuario
  const [userName, setUserName] = useState('');
  const [userLastname, setUserLastname] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userCountry, setUserCountry] = useState('');
  const [likedBooks, setLikedBooks] = useState([]);
  const [dislikedBooks, setDislikedBooks] = useState([]);
  //Estados para el manejo del pop up
  const [popUp, setPopUp] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  //Estados para el manejo del toast
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Obtenemos los datos del usuario desde localStorage y los guardamos en el estado
    const storedUserName = localStorage.getItem('userName');
    const storedUserLastname = localStorage.getItem('userLastname');
    const storedUserEmail = localStorage.getItem('userEmail');
    const storedUserCountry = localStorage.getItem('userCountry');
    setUserName(storedUserName);
    setUserLastname(storedUserLastname);
    setUserEmail(storedUserEmail);
    setUserCountry(storedUserCountry);

    //Función que hace una llamada al backend para obtener los libros que le gustan al ussuario.
    const fetchLikedBooks = async () => {
      try {
        const response = await getLikedBooks(token);
        setLikedBooks(response.data);
      } catch (error) {
        console.error('Error al obtener los libros:', error.message);
      }
    };
    fetchLikedBooks();
  }, [token]);

  //Funciones para manejar el popup que asigna el valor no me gusta a un libro
  const handleDeleteBook = (bookId) => {
    setSelectedBook(bookId);
    setPopUp(true);
  };
  const confirmDelete = () => {
    if (!deleteBook) return;
    deleteBook(selectedBook);
    setPopUp(false);
  };
  const cancelDelete = () => {
    setPopUp(false);
  };

  //Función que guarda el libro como no me gusta para ese usuario en la tabla de usuarios_libros en la base de datos.
  const deleteBook = async (bookId) => {
    try {
      await LikeBook(bookId, false, token);
      setDislikedBooks((prev) => {
        const updatedDislikedBooks = prev.filter(
          (book) => book.libro_id !== bookId
        );
        localStorage.setItem(
          'dislikedBooks',
          JSON.stringify(updatedDislikedBooks)
        );
        return updatedDislikedBooks;
      });
      setMessage('Libro archivado como NO me gusta');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error('Error al actualizar el libro en la base de datos:', error);
    }
  };

  return (
    <div className='profile-container'>
      <div className='profile-info'>
        <h2 className='profile-title'>Perfil de Usuario</h2>
        <p>
          <strong>Nombre:</strong>
          {userName} {userLastname}
        </p>
        <p>
          <strong>Email:</strong>
          {userEmail}
        </p>
        <p>
          <strong>País:</strong>
          {userCountry}
        </p>
      </div>
      <div className='profile-booksSection'>
        <h2>Libros que te gustan</h2>
        <div className='profile-books'>
          {likedBooks.map((book) => (
            <div key={book.libro_id} className='carousel-book'>
              <div
                className='book-card'
                style={{ backgroundImage: `url(${book.portada})` }}
              >
                <div className='card-overlay'>
                  <h5 className='card-title'>{book.titulo}</h5>
                  <p className='card-author'>{book.autor}</p>
                  <div className='info'>
                    <Link to={`/book/${book.libro_id}`} className='card-link'>
                      Más Información
                    </Link>
                  </div>
                </div>

                <div className='actions'>
                  <button
                    type='button'
                    class='btn btn-outline-danger btn-sm'
                    onClick={() => handleDeleteBook(book.libro_id)}
                  >
                    NO me gusta
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {popUp && (
        <div className='popup'>
          <div className='popup-content'>
            <h3>¿Estás seguro que deseas enviar este libro a no me gusta?</h3>
            <button className='confirm-button' onClick={confirmDelete}>
              Aceptar
            </button>
            <button className='cancel-button' onClick={cancelDelete}>
              Cancelar
            </button>
          </div>
        </div>
      )}
      {showToast && <Toast message={message} setShowToast={setShowToast} />}
    </div>
  );
};

export default Profile;
