import React, { useState, useEffect } from 'react';
import {
  deleteUser,
  deleteBook,
  getAllUsers,
  createNewBook,
  updateBook,
} from '../../services/AdminService';
import { getAllBooks } from '../../services/BookService';
import BookPopup from '../utils/BookPopUp';
import '../../styles/Admin.css';
import { Toast } from '../utils/Toast';

// Componenete que muestra el panel del administrador y dond eva  apoder eliminar usuarios y libros. También puede editar y crear libros.
function AdminDashboard() {
  const [loading, setLoading] = useState(false);
  //Estados para manejar los usuarios
  const [users, setUsers] = useState([]);
  const [queryUsers, setQueryUsers] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  //Estados para manejar los libros
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [queryBooks, setQueryBooks] = useState('');
  //Estados para manejar los popups de editar y crear libros
  const [isEditBook, setIsEditBook] = useState(null);
  const [isCreateBook, setIsCreateBook] = useState(false);
  const [bookToEdit, setBookToEdit] = useState(null);
  // Estados para los mensajes de Toast
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState('');

  //Obtenemos toda la información de los libros y usuarios
  const fetchData = async () => {
    try {
      setLoading(true);

      const booksResponse = await getAllBooks();
      setBooks(booksResponse.data || []);
      setFilteredBooks(booksResponse.data || []);

      const usersResponse = await getAllUsers();
      setUsers(usersResponse.data || []);
      setFilteredUsers(usersResponse.data || []);

      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  ///Función que maneja la búsqueda de ususarios
  const handleUsersSearch = (event) => {
    const queryUsers = event.target.value.toLowerCase();
    setQueryUsers(queryUsers);
    const filteredUser = users.filter(
      (user) => user.nombre && user.nombre.toLowerCase().includes(queryUsers)
    );
    setFilteredUsers(filteredUser);
  };

  //Función que maneja la búsqueda de libros
  const handleBookSearch = (event) => {
    const queryBooks = event.target.value.toLowerCase();
    setQueryBooks(queryBooks);
    const filteredBooks = books.filter(
      (book) => book.titulo && book.titulo.toLowerCase().includes(queryBooks)
    );
    setFilteredBooks(filteredBooks);
  };
  //A continuación las funciones handle que manejan la eliminacón de libros y usuarios de la base de datos.
  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.usuario_id !== userId)
      );
      setFilteredUsers((prevFilteredUsers) =>
        prevFilteredUsers.filter((user) => user.usuario_id !== userId)
      );
      setMessage('Usuario eliminado con éxito');
      setShowToast(true);
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
    }
  };
  const handleDeleteBook = async (bookId) => {
    try {
      await deleteBook(bookId);
      setBooks((prevBooks) =>
        prevBooks.filter((book) => book.libro_id !== bookId)
      );
      setFilteredBooks((prevFilteredBooks) =>
        prevFilteredBooks.filter((book) => book.libro_id !== bookId)
      );
      setMessage('Libro eliminado con éxito');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error('Error al eliminar el libro:', error);
    }
  };

  //Funciones para manejar los popups de editar y crear libros
  //Popup de editar libro
  const openEditBook = (book) => {
    setBookToEdit(book);
    setIsEditBook(true);
  };
  //Popup de crear libro
  const openCreateBook = () => {
    setBookToEdit(null);
    setIsCreateBook(true);
  };
  //Cerrar el popup
  const closePopup = () => {
    setIsEditBook(false);
    setIsCreateBook(false);
  };
  //Función por la que vamos a enviar la información del libro a la base de datos
  const handleNewInfo = async (data) => {
    try {
      //Si en el estado de bookToEdit hay un libro, hacemos la llamada a updateBook
      if (bookToEdit) {
        if (
          data.titulo === '' ||
          data.autor === '' ||
          data.editorial === '' ||
          data.genero === '' ||
          data.amazon_link === '' ||
          data.descripcion === '' ||
          data.fecha_publicacion === ''
        ) {
          alert('Por favor, complete todos los campos para editar este libro');
          return;
        }
        //Nos aseguramos que la fecha de publicación sea un número
        if (typeof data.fecha_publicacion === 'string') {
          data.fecha_publicacion = parseInt(data.fecha_publicacion, 10);
        }

        await updateBook(data);
        setBooks(
          books.map((book) =>
            book.libro_id === bookToEdit.libro_id ? data : book
          )
        );
        setMessage('Libro actualizado con éxito');
      } else {
        const newBook = await createNewBook(data);
        setBooks([...books, newBook]);
        setMessage('Libro nuevo creado con éxito');
      }
      closePopup();
    } catch (error) {
      setMessage('Error al guardar el libro');
      console.error('Error al guardar el libro:', error);
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className='admin-container'>
      <h1 className='admin-title'>Panel de Administración</h1>
      {/* Tabla Usuarios */}
      <div className='admin-header'>
        <h2 className='admin-headerTitle'>Buscar Usuarios por Nombre</h2>
        <div className='admin-searcher'>
          <span className='admin-searchIcon'>
            <i className='bi bi-search'></i>
          </span>
          <input
            type='text'
            placeholder='Escribe el nombre del usuario...'
            value={queryUsers}
            onChange={handleUsersSearch}
          />
        </div>
      </div>
      {loading && <p>Cargando usuarios...</p>}
      <table className='table'>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(filteredUsers) && filteredUsers.length > 0 ? (
            filteredUsers.slice(0, 5).map((user) => (
              <tr key={user.usuario_id}>
                <td>
                  {user.nombre} {user.apellido}
                </td>
                <td>{user.email}</td>
                <td>
                  <button
                    onClick={() => handleDeleteUser(user.usuario_id)}
                    className='btn btn-danger btn-sm'
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan='3'>No hay usuarios disponibles</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Tabla de Libros */}
      <div className='admin-header'>
        <h2 className='admin-headerTitle'>Buscar Libros por Título</h2>
        <div className='admin-searcher'>
          <span className='admin-searchIcon'>
            <i className='bi bi-search'></i>
          </span>
          <input
            type='text'
            placeholder='Escribe el título del libro...'
            value={queryBooks}
            onChange={handleBookSearch}
          />
        </div>
      </div>
      {loading && <p>Cargando libros...</p>}
      <div className='admin-newBook'>
        <span className='admin-PlusIcon'>
          <i className='bi bi-plus'></i>
        </span>
        <button onClick={openCreateBook}>Crear Nuevo Libro</button>
      </div>
      <table className='table'>
        <thead>
          <tr>
            <th>Título</th>
            <th>Autor</th>
            <th>Editorial</th>
            <th>Género</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(filteredBooks) && filteredBooks.length > 0 ? (
            filteredBooks.slice(0, 5).map((book) => (
              <tr key={book.libro_id}>
                <td>{book.titulo}</td>
                <td>{book.autor}</td>
                <td>{book.editorial}</td>
                <td>{book.genero}</td>
                <td>
                  <button
                    onClick={() => handleDeleteBook(book.libro_id)}
                    className='btn btn-danger btn-sm'
                  >
                    Eliminar
                  </button>
                  <button
                    onClick={() => openEditBook(book)}
                    className='btn btn-info btn-sm ml-2'
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan='5'>No hay libros disponibles</td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Popup  */}
      <BookPopup
        book={bookToEdit}
        isOpen={isEditBook || isCreateBook}
        onClose={closePopup}
        onSave={handleNewInfo}
      />
      {showToast && <Toast message={message} setShowToast={setShowToast} />}
    </div>
  );
}

export default AdminDashboard;
