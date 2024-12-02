import React, { useState, useEffect } from 'react';

//Componente que muestra el popup para crear o editar un libro
const BookPopup = ({ book, isOpen, onClose, onSave }) => {
  //Iniciamos el estado del libro con los valores por defecto
  const [bookData, setBookData] = useState({
    libro_id: '',
    titulo: '',
    portada: '',
    autor: '',
    editorial: '',
    genero: '',
    amazon_link: '',
    descripcion: '',
    fecha_publicacion: '',
  });
  //Buscamos si ese libro ya tiene informacion
  useEffect(() => {
    if (book && isOpen) {
      setBookData({
        libro_id: book.libro_id || '',
        titulo: book.titulo || '',
        portada: book.portada || '',
        autor: book.autor || '',
        editorial: book.editorial || '',
        genero: book.genero || '',
        amazon_link: book.amazon_link || '',
        descripcion: book.descripcion || '',
        fecha_publicacion: book.fecha_publicacion || '',
      });
    }
  }, [book, isOpen]);

  //Controlamos el cambio de estado de las secciones que edite el ususario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  //guardamos los datos del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(bookData);
  };

  if (!isOpen) return null;

  return (
    <div className='popup'>
      <div className='popup-content'>
        <h2>{book ? 'Editar Libro' : 'Crear Nuevo Libro'}</h2>
        <form className='popup-form' onSubmit={handleSubmit}>
          <div className='popup-row1'>
            <div className='popup-column1'>
              <label>Título:</label>
              <input
                type='text'
                name='titulo'
                value={bookData.titulo}
                onChange={handleChange}
                placeholder='Título'
                required
              />
            </div>
            <div className='popup-column2'>
              <label>Link Portada;</label>
              <input
                type='text'
                name='portada'
                value={bookData.portada}
                onChange={handleChange}
                placeholder='Introduce la URL de la portada'
                required
              />
            </div>
          </div>
          <div className='popup-row2'>
            <div className='popup-column1'>
              <label>Autor:</label>
              <input
                type='text'
                name='autor'
                value={bookData.autor}
                onChange={handleChange}
                placeholder='Autor'
                required
              />
            </div>
            <div className='popup-column2'>
              <label>Editorial:</label>
              <input
                type='text'
                name='editorial'
                value={bookData.editorial}
                onChange={handleChange}
                placeholder='Editorial'
                required
              />
            </div>
          </div>
          <div className='popup-row3'>
            <div className='popup-column1'>
              <label>Género/s:</label>
              <input
                type='text'
                name='genero'
                value={bookData.genero}
                onChange={handleChange}
                placeholder='Género'
                required
              />
            </div>
            <div className='popup-column2'>
              <label>Año de Publicación:</label>
              <input
                type='number'
                name='fecha_publicacion'
                value={bookData.fecha_publicacion}
                onChange={handleChange}
                placeholder='Año de Publicación'
                required
              />
            </div>
          </div>
          <div className='popup-row4'>
            <label>Descripción:</label>
            <input
              type='text'
              name='descripcion'
              value={bookData.descripcion}
              onChange={handleChange}
              placeholder='Descripción'
              required
            />
          </div>
          <div className='popup-row5'>
            <label>Link Amazon:</label>
            <input
              type='text'
              name='amazon_link'
              value={bookData.amazon_link}
              onChange={handleChange}
              placeholder='Introduce la URL de Amazon'
              required
            />
          </div>
          <div className='popup-buttonsGroup'>
            <button className='confirm-button' type='submit'>
              Guardar
            </button>
            <button className='cancel-button' type='button' onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookPopup;
