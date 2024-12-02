import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Carousel from '../utils/Carousel';
import { getLikedBooks, LikeBook } from '../../services/LikedBooksService';
import { RenameGenres } from '../utils/RenameGenres';
import searchBook from '../../images/login.jpg';
import { Toast } from '../utils/Toast';
import '../../styles/home.css';

const Home = ({ token, userId }) => {
  const [userName, setUserName] = useState('');
  //Estados para el manejo de los géneros filtrados
  const [checkedGenre, setCheckedGenre] = useState('');
  const [genreCount, setGenreCount] = useState({});
  const [topGenres, setTopGenres] = useState([]);
  //Estados para guardar los libros archivados como me gusta o no me gusta
  const [likedBooks, setLikedBooks] = useState([]);
  const [dislikedBooks, setDislikedBooks] = useState([]);
  //Estados del toast
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState('');

  //Obtenemos el nombre del usuario y cargamos los libros que le gustan y los preferencias guardadas en el localStorage
  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    setUserName(storedUserName);
    loadLikedBooks();
    loadPersistedLikes();
  }, [token]);

  //Obtenemos los libros que le gustan al usuario y y los guardamos en likedBooks
  const loadLikedBooks = async () => {
    try {
      const booksResponse = await getLikedBooks(token);
      const books = booksResponse.data;
      setLikedBooks(books.map((book) => book.libro_id));
      setGenreCount(countBooksByGenre(books));
    } catch (error) {
      console.error('Error al cargar los libros favoritos:', error);
    }
  };
  //En esta función recorremos todos los libros, separándolos y contando cuántos libros hay por género
  const countBooksByGenre = (books) => {
    return books.reduce((acc, book) => {
      const genres = book.genero ? book.genero.split(' ') : [];
      genres.forEach((genre) => {
        acc[genre] = (acc[genre] || 0) + 1;
      });
      return acc;
    }, {});
  };

  // Después de contar lso gñeneros, buscamos los dos géneros con el númeero más alto
  useEffect(() => {
    if (Object.keys(genreCount).length) {
      setTopGenres(getTopGenres(genreCount, 2));
    }
  }, [genreCount]);

  //
  const getTopGenres = (genreCount, limit) => {
    //Ordenamos los géneros por el número de libros que tienen
    const sortedGenres = Object.keys(genreCount).sort(
      (a, b) => genreCount[b] - genreCount[a]
    );
    const topGenres = sortedGenres.slice(0, limit);
    const lastGenreCount = genreCount[topGenres[topGenres.length - 1]];
    //Si hay más de dos géneros con el mismo número de libros, seleccionamos uno aleatorio
    const tiedGenres = sortedGenres.filter(
      (genre) => genreCount[genre] === lastGenreCount
    );
    return tiedGenres.length > limit
      ? getRandomGenres(tiedGenres, limit)
      : topGenres;
  };
  const getRandomGenres = (tiedGenres, limit) => {
    const shuffledGenres = tiedGenres.sort(() => 0.5 - Math.random());
    return shuffledGenres.slice(0, limit);
  };

  // Cargar libros "me gusta" y "no me gusta" desde localStorage utilizando userId
  const loadPersistedLikes = () => {
    const storedLikedBooks = localStorage.getItem(`likedBooks_${userId}`);
    const storedDislikedBooks = localStorage.getItem(`dislikedBooks_${userId}`);

    if (storedLikedBooks) {
      setLikedBooks(JSON.parse(storedLikedBooks));
    }

    if (storedDislikedBooks) {
      setDislikedBooks(JSON.parse(storedDislikedBooks));
    }
  };
  const handleGenreChange = (event) => {
    const value = event.target.value;
    setCheckedGenre((prevCheckedGenre) => {
      if (prevCheckedGenre.includes(value)) {
        return prevCheckedGenre.filter((genre) => genre !== value);
      } else {
        return [...prevCheckedGenre, value];
      }
    });
  };

  const handleBookLike = async (bookId, liked) => {
    try {
      await LikeBook(bookId, liked, token);
      console.log(
        `Libro ${
          liked ? 'me gusta' : 'no me gusta'
        } actualizado en la base de datos`
      );
      if (liked) {
        setLikedBooks((prev) => {
          const updatedLiked = [...prev, bookId];
          localStorage.setItem(
            `likedBooks_${userId}`,
            JSON.stringify(updatedLiked)
          );
          return updatedLiked;
        });
        setMessage('Libro archivado como me gusta');
      } else {
        setDislikedBooks((prev) => {
          const updatedDisliked = [...prev, bookId];
          localStorage.setItem(
            `dislikedBooks_${userId}`,
            JSON.stringify(updatedDisliked)
          );
          return updatedDisliked;
        });
        setMessage('Libro archivado como NO me gusta');
      }
      // Guardar la preferencia en la base de datos
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (error) {
      console.error('Error al actualizar el libro en la base de datos:', error);
    }
  };
  console.log('genero selecionado', checkedGenre);
  return (
    <div className='home-container'>
      <section className='welcome-home'>
        <div className='home-background'>
          <h2>Hola, {userName}</h2>
          <h3>¿Qué libro te apetece leer hoy?</h3>
        </div>
      </section>

      <div className='book-carousel-container'>
        <section className='home-section'>
          <div className='home-carouselTitle'>
            <div className='home-genreFilter'>
              {Object.entries(RenameGenres).map(([key, value]) => (
                <div className='home-genreCheckbox' key={key}>
                  <input
                    type='checkbox'
                    id={key}
                    value={key}
                    checked={checkedGenre.includes(key)}
                    onChange={handleGenreChange}
                  />
                  <label htmlFor={key}>{value}</label>
                </div>
              ))}
            </div>
            <h3>
              {checkedGenre ? RenameGenres[checkedGenre] : 'Todos los Libros'}
            </h3>
          </div>
          {showToast && <Toast message={message} setShowToast={setShowToast} />}
          <div className='book-carousel'>
            <Carousel
              genre={checkedGenre}
              likedBooks={likedBooks}
              dislikedBooks={dislikedBooks}
              onBookLike={handleBookLike}
            />
          </div>
        </section>

        {topGenres.map((genre, index) => (
          <section className='home-section' key={index}>
            <h3>{RenameGenres[genre] || genre}</h3>
            <div className='book-carousel'>
              <Carousel
                genre={genre}
                likedBooks={likedBooks}
                dislikedBooks={dislikedBooks}
                onBookLike={handleBookLike}
              />
            </div>
          </section>
        ))}
      </div>
      <div className='book-search-container'>
        <aside className='image-aside'>
          <img src={searchBook} alt='Find Book' />
        </aside>

        <section className='search-book'>
          <h3>¿Estás buscando un libro concreto?</h3>
          <Link to='/searcher' className='search-link'>
            Haz clic aquí
          </Link>
        </section>
      </div>
    </div>
  );
};

export default Home;
