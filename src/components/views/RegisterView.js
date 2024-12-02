import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../services/RegisterService';
import { RenameGenres } from '../utils/RenameGenres';
import '../../styles/UserRegister.css';

const UserRegister = () => {
  const [alert, setAlert] = useState('');
  const [type, setType] = useState('');
  //Los datoss rellenados en el formulario
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    lastname: '',
    favouriteGenres: [],
    country: '',
  });

  //Con esto vamos a manejarque cuando todo sea correcto y el ususario se registre, que le lleve a la ventana de inicio.
  const navigate = useNavigate();
  //Función para manejar elgénero selecionado en el select.
  const handleSelectedGenre = (e) => {
    const genre = e.target.value;
    //Controlamos que el género no este ya seleccionado, y si no lo está lo añadimos.
    if (!formData.favouriteGenres.includes(genre)) {
      setFormData((prevData) => ({
        ...prevData,
        favouriteGenres: [...prevData.favouriteGenres, genre],
      }));
    }
    e.target.value = ''; //Se limpia para que no nos de problemas
  };

  //Función que maneja el deseleccionar un género favorito
  const handleDeleteGenre = (deletedGenre) => {
    setFormData((prevData) => ({
      ...prevData,
      favouriteGenres: prevData.favouriteGenres.filter(
        (genre) => genre !== deletedGenre
      ),
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      favouriteGenres: formData.favouriteGenres.join(', '),
    };
    //A través de un método try/catch probamos el registro de usuario.
    try {
      await register(data);
      setAlert('¡Te has registarado correctamente!');
      setType('alert-success');
      navigate('/login');
    } catch (error) {
      setAlert(
        'Error al crear el ususario: compruebbe que los datos son correctos y que no te hayas registrado anteriormente.'
      );
      setType('alert-danger');
    }
  };

  return (
    <div className='container-register'>
      {alert && <div className={`alert ${type}`}>{alert}</div>}
      <form onSubmit={submit} className='form-register'>
        <h2>Registro</h2>
        <div className='input-form-register'>
          <input
            type='text'
            name='name'
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder='Nombre'
            required
          />
        </div>
        <div className='input-form-register'>
          <input
            type='text'
            name='lastname'
            onChange={(e) =>
              setFormData({ ...formData, lastname: e.target.value })
            }
            placeholder='Apellido'
            required
          />
        </div>
        <div className='input-form-register'>
          <input
            type='text'
            name='country'
            onChange={(e) =>
              setFormData({ ...formData, country: e.target.value })
            }
            placeholder='País'
            required
          />
        </div>

        <div className='input-form-register'>
          <select id='genreSelect' onChange={handleSelectedGenre}>
            <option value=''>Selecciona tus géneros favoritos</option>
            {Object.keys(RenameGenres).map((genre) => (
              <option key={genre} value={genre}>
                {RenameGenres[genre]}
              </option>
            ))}
          </select>
        </div>

        {/* Mostrar selecciones de géneros */}
        <div className='selected-genres'>
          {formData.favouriteGenres.map((genre) => (
            <div key={genre} className='selected-genre'>
              {RenameGenres[genre]}{' '}
              <button
                type='button'
                onClick={() => handleDeleteGenre(genre)}
                className='remove-genre'
              >
                &times; {/* Este es el símbolo "X" */}
              </button>
            </div>
          ))}
        </div>

        <div className='input-form-register'>
          <input
            type='email'
            name='email'
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder='Email'
            required
          />
        </div>
        <div className='input-form-register'>
          <input
            type='password'
            name='password'
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            placeholder='Contraseña'
            required
          />
        </div>
        <button type='submit' className='btn-register'>
          Registrar
        </button>
      </form>
    </div>
  );
};

export default UserRegister;
