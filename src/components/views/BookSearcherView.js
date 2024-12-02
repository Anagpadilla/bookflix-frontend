import React, { useState, useEffect } from 'react';
import { getAllBooks } from '../../services/BookService';
import { LikeBook } from '../../services/LikedBooksService';
import { Link } from 'react-router-dom';
import '../../styles/BookSearch.css';
import '../../styles/card.css';
import { Toast } from '../utils/Toast';

const BookSearch = ({ userId, token }) => {
  //Estado para manejar la carga de libros
  const [isLoading, setIsLoading] = useState(false);
  //Estados para manejar los libros y su búsqueda
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState([]);
  // Estados para actualizar los libros que le gusan o no al ususario
  const [likedBooks, setLikedBooks] = useState([]);
  const [dislikedBooks, setDislikedBooks] = useState([]);
  //Estados para el toast
  const [message, setMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  //Estados para el popup
  const [popUp, setPopUp] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  //Función para obtener los librosn de la base de datos, solo se renderiza una vez al cargar la página
  const fetchSearcherBooks = async () => {
    try {
      setIsLoading(true);
      const response = await getAllBooks();
      setBooks(response.data || []);
      setFiltered(response.data || []);
      setIsLoading(false);
    } catch (error) {
      setMessage('No se han podido obtener los libros');
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchSearcherBooks();
  }, []);

  //Función del buscador de libros que filtra los libros por su título y los muestra en pantalla
  const handleBookSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setQuery(query);
    //Tienen que coincidir el título (convertido a minúsculas) con la búsqueda del ussuario
    const filtered = books.filter(
      (book) => book.titulo && book.titulo.toLowerCase().includes(query)
    );
    setFiltered(filtered);
  };

  // Controlamos cuantos libros queremos que le aparezcan al ususario como máximo y así adaptamos la aplicación a diferentes tipos de pantalla.
  const maxNumBooks = () => {
    if (window.innerWidth >= 1024) {
      return 30;
    } else {
      return 20;
    }
  };
  //Manejamos el popup de confirmación para mandar un libro a no me gusta.
  const handleDeleteBook = (bookId) => {
    setSelectedBook(bookId);
    setPopUp(true);
  };
  const confirmDelete = () => {
    if (!handleLike) return;
    handleLike(selectedBook, false);
    setPopUp(false);
  };

  const cancelDelete = () => {
    setPopUp(false);
  };

  //Actualizamos la tabla de ususario_libro de la base de datos con la nueva preferencia.
  const handleLike = async (bookId, liked) => {
    try {
      await LikeBook(bookId, liked, token);
      //Si el usuario le ha dado a me gusta se gusrada en likedBooks, para que no le aparezca de nuevo en el carrousel.
      if (liked) {
        setLikedBooks((prev) => {
          const updatedLiked = [...prev, bookId];
          localStorage.setItem(
            `likedBooks_${userId}`,
            JSON.stringify(updatedLiked)
          );
          return updatedLiked;
        });
        setMessage('Libro archivado como me gusta'); //Toast
      } else {
        //Si el usuario le ha dado a no me gusta:
        setDislikedBooks((prev) => {
          const updatedDisliked = [...prev, bookId];
          localStorage.setItem(
            `dislikedBooks_${userId}`,
            JSON.stringify(updatedDisliked)
          );
          return updatedDisliked;
        });
        setMessage('Libro archivado como NO me gusta'); //Toast
      }
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error('Error al actualizar el libro en la base de datos:', error);
    }
  };

  return (
    <div className='search-container'>
      <h1 className='search-title'>Encuentra tu libro</h1>
      {/* Barra de búsqueda*/}
      <div className='search-bar'>
        <span className='search-icon'>
          <i className='bi bi-search'></i>
        </span>
        <input
          type='text'
          placeholder='Buscar libros...'
          value={query}
          onChange={handleBookSearch}
          className='search-input'
        />
      </div>

      {isLoading && <p className='loading-message'>Cargando libros...</p>}

      {/* Libros filtrados*/}
      <div className='search-books'>
        {filtered.length > 0 ? (
          filtered.slice(0, maxNumBooks()).map((filtered) => (
            <div key={filtered.libro_id} className='carousel-book'>
              <div
                className='book-card'
                style={{ backgroundImage: `url(${filtered.portada})` }}
              >
                <div className='card-overlay'>
                  <h5 className='card-title'>{filtered.titulo}</h5>
                  <p className='card-author'>{filtered.autor}</p>
                  <div className='info'>
                    <Link
                      to={`/book/${filtered.libro_id}`}
                      className='card-link'
                    >
                      Más Información
                    </Link>
                  </div>
                </div>
                <div className='actions'>
                  <button
                    type='button'
                    class='btn btn-outline-success btn-sm'
                    onClick={() => handleLike(filtered.libro_id, true)}
                  >
                    Me gusta
                  </button>
                  <button
                    type='button'
                    class='btn btn-outline-danger btn-sm'
                    onClick={() => handleDeleteBook(filtered.libro_id)}
                  >
                    NO gusta
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No se encontraron libros.</p>
        )}
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
      {/* Toast de Bootstrap */}
      {showToast && <Toast message={message} setShowToast={setShowToast} />}
    </div>
  );
};

export default BookSearch;
