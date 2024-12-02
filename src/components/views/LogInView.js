import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logInUser } from '../../services/LogInService';
import '../../styles/LogIn.css';

//Componente que permite al usuario iniciar sesión en la aplicación
const LogIn = ({ setToken }) => {
  //Iniciamos con un estado vacío
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  //Función para actualizar los datos con la información introducida por el usuario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
 //Función para enviar el formulario de inicio de sesión
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!formData.email || !formData.password) {
      setErrorMessage('Por favor, necesitas completar todos los campos');
      return;
    }
    try {
      const response = await logInUser(formData);
		//Si la respuesta es correcta, guardamos la información del usuario en el local storage y redirigimos a la página principal
      if (response.token) {
        setToken(response.token);
        localStorage.setItem('isAdmin', response.user.es_admin);
        localStorage.setItem('userName', response.user.nombre);
        localStorage.setItem('userLastname', response.user.apellido);
        localStorage.setItem('userEmail', response.user.email);
        localStorage.setItem('userCountry', response.user.pais);
        localStorage.setItem('likedGenres', response.user.genero_favorito);
        navigate('/');
      } else {
        setErrorMessage('Usuario o contraseña incorrectos. Prueba de nuevo.');
      }
    } catch (error) {
      console.error('Error de inicio de sesión', error);
      setErrorMessage(
        'Credenciales incorrectas. Por favor, inténtalo de nuevo.'
      );
    }
  };
 //El ususario puede registrarse si no tiene una cuenta
  const navigate = useNavigate();
  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div className='container-logIn'>
      <form className='form-logIn' onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>
        <div className='input-form-logIn'>
          <input
            type='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            required
          />
          <label>Introduce tu email</label>
        </div>
        <div className='input-form-logIn'>
          <input
            type='password'
            name='password'
            value={formData.password}
            onChange={handleChange}
            required
          />
          <label>Introduce tu contraseña</label>
        </div>
        <button className='btn-logIn' type='submit'>
          Iniciar Sesión
        </button>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <div className='register-form-logIn'>
          <p>
            ¿No tienes cuenta?{' '}
            <a type='button' onClick={handleRegisterClick}>
              Regístrate
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LogIn;
