import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Para obtener el parámetro de la URL
import { getBookDetails } from '../../services/BookService';
import { LikeBook } from '../../services/LikedBooksService';
import { getBookReviews, addReview } from '../../services/ReviewsService';
import { Toast } from '../utils/Toast';
import '../../styles/BookProfile.css';

const BookProfile = (token) => {
  // obtenemos el id del libro que se ha selecionado en la vista de libros
  const { bookId } = useParams();
  //Información del libro
  const [book, setBook] = useState(null);
  //Estados para las reseñas
  const [AllReviews, setAllReviews] = useState('');
  const [newComment, setNewComment] = useState('');
  //Estados para el loading y el error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  //Estados para los libros que le gustan al usuario
  const [likedBooks, setLikedBooks] = useState([]);
  //Estados para el toast
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState('');

  //Hook que cargara los datos del libro cada vez que se cambie el id del libro
  useEffect(() => {
    // Función para obtener los detalles del libro realizando una petición al backend
    const fetchBookDetails = async () => {
      try {
        //Obtenemos los detalles del libro
        const responseBooks = await getBookDetails(bookId);
        setBook(responseBooks.data);
        //Obtenemos las reseñas del libro
        const responseReviews = await getBookReviews(bookId);
        setAllReviews(responseReviews.data || []);

        setLoading(false);
      } catch (error) {
        setError('No se pudieron obtener los detalles del libro.');
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  //Función para crear una nueva reseña
  const handleNewReview = async () => {
    try {
      const response = await addReview(bookId, newComment, token);
      setAllReviews([...AllReviews, response.data]);
      setNewComment('');
    } catch (error) {
      console.error('Error al crear la reseña:', error);
    }
  };
  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  //Función para añadir un libro a la lista de libros que le gustan al usuario
  const handleAddLike = async (bookId) => {
    try {
      await LikeBook(bookId, true, token.token);
      //Guardamos el cambio en el local storage y actualizamos el estado
      setLikedBooks((prev) => {
        const updatedLikedBooks = prev.filter(
          (book) => book.libro_id !== bookId
        );
        localStorage.setItem('likedBooks', JSON.stringify(updatedLikedBooks));
        return updatedLikedBooks;
      });
      setMessage('Libro archivado como me gusta');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error('Error al actualizar el libro en la base de datos:', error);
    }
  };

  return (
    <div className='book-profile-container'>
      {book && (
        <div className='book-profile'>
          <h2>{book.titulo}</h2>
          <p>
            <strong>Autor:</strong> {book.autor}
          </p>
          <p>
            <strong>Descripción:</strong> {book.descripcion}
          </p>
          <p>
            <strong>Género:</strong> {book.genero}
          </p>
          <p>
            <strong>Fecha de publicación:</strong> {book.fecha_publicacion}
          </p>

          <div className='book-cover'>
            <img src={book.portada} alt={book.titulo} />
          </div>
          <div className='book-reviews'>
            <div className='previus-reviews'>
              <h3>Reseñas</h3>
              {AllReviews == undefined || AllReviews.length == 0 ? (
                <p>
                  No hay reseñas para este libro, sé el primero en publicar tu
                  opinión.
                </p>
              ) : (
                AllReviews.map((review) => (
                  <div key={review.reseña_id}>
                    <p>{review.comentarios}</p>
                  </div>
                ))
              )}
            </div>
            <div className='new-review'>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              ></textarea>
              <button onClick={handleNewReview}>Enviar reseña</button>
            </div>
          </div>

          <div className='book-actions'>
            <button
              className='btn btn-secondary'
              onClick={() => handleAddLike(book.libro_id)}
            >
              Añadir a mi biblioteca
            </button>
          </div>
        </div>
      )}
      {showToast && <Toast message={message} setShowToast={setShowToast} />}
    </div>
  );
};

export default BookProfile;
