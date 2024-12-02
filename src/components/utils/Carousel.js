import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
//Service
import { getAllBooks } from '../../services/BookService';
//utils
import { RenameGenres } from './RenameGenres';
//Styles
import '../../styles/bookCarousel.css';
import '../../styles/card.css';

//Función que devuelve un carrousel de libros. Si se ha seleccionado un género o si selecciona varios libros del mismo género se le mostrarán en el carrousel en Home.
const Carousel = ({ genre, likedBooks, dislikedBooks, onBookLike }) => {
  const [books, setBooks] = useState([]);
  const [UserIndex, setUserIndex] = useState(0);
  const [booksToShow, setBooksToShow] = useState(5);
  const [popUp, setPopUp] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  // Cargar libros que provienen del backend
  useEffect(() => {
    const fetchBooks = async () => {
      const response = await getAllBooks();
      setBooks(response.data);
    };
    fetchBooks();
  }, []);

  // Ajustar el número de libros a mostrar según el tamaño ddel dispositivo
  useEffect(() => {
    const size = () => {
      setBooksToShow(
        window.innerWidth < 600 ? 2 : window.innerWidth < 900 ? 3 : 5
      );
    };
    size();
    window.addEventListener('resize', size);
    return () => window.removeEventListener('resize', size);
  }, []);

  //Comprobamos desde el localStorage si el usuario ya se ha metido anteriormente en la aplicación y obtenemos la posición en la que se quedó utilizando el índice del libro en el que se encuentra.
  useEffect(() => {
    //Comprobamos si el ussuario ya tiene un índice guardado
    const savedIndex = localStorage.getItem('UserIndex');
    if (savedIndex) {
      setUserIndex(parseInt(savedIndex, 10));
    }
  }, []);
  //Aquí guardamos el índice
  useEffect(() => {
    localStorage.setItem('UserIndex', UserIndex);
  }, [UserIndex]);

  //Filtramos los libros que ya le gustaron al usuario y los que no le gustaron para que no se muestren en el carrousel
  const filteredBooks = books.filter((book) => {
    const bookGenres = book.genero ? book.genero.toLowerCase().split(' ') : [];
    genre = RenameGenres[genre];
    return (
      !likedBooks.includes(book.libro_id) &&
      !dislikedBooks.includes(book.libro_id) &&
      (!genre || bookGenres.includes(genre))
    );
  });
  //Manekjamos el popup para archivar un libro en no me gusta
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
  const handleLike = (book, liked) => {
    onBookLike(book.libro_id, liked);
  };

  //Aplicamos un swipe para moverse por el carrousel sin tener que pulsar las flechas, sino con delizar el dedo ya sea en el móvil o en el ordenador funciona.
  const moveLeft = () => {
    setUserIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const moveRight = () => {
    setUserIndex((prevIndex) =>
      Math.min(prevIndex + 1, filteredBooks.length - booksToShow)
    );
  };

  const handlers = useSwipeable({
    onSwipedLeft: moveRight,
    onSwipedRight: moveLeft,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <div className='container-carousel' {...handlers}>
      <div className='carousel'>
        <div onClick={moveLeft} className='left-arrow'>
          {'<'}
        </div>
        <div className='carousel-row'>
          {filteredBooks
            .slice(UserIndex, UserIndex + booksToShow)
            .map((book) => (
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
                      class='btn btn-outline-success btn-sm'
                      onClick={() => handleLike(book, true)}
                    >
                      Me gusta
                    </button>
                    <button
                      type='button'
                      class='btn btn-outline-danger btn-sm'
                      onClick={() => handleDeleteBook(book)}
                    >
                      NO me gusta
                    </button>
                  </div>
                </div>
              </div>
            ))}
          {popUp && (
            <div className='popup'>
              <div className='popup-content'>
                <h3>
                  ¿Estás seguro que deseas enviar este libro a no me gusta?
                </h3>
                <button className='confirm-button' onClick={confirmDelete}>
                  Aceptar
                </button>
                <button className='cancel-button' onClick={cancelDelete}>
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
        <div onClick={moveRight} className='right-arrow'>
          {'>'}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
