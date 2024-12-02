import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoutIcon from '../../images/icons/logout3.png';
import menuIcon from '../../images/icons/menu.png';
import house from '../../images/icons/home.png';
import '../../styles/Header.css';
import '../../styles/PopUp.css';

//Componente de la cabecera de la aplicación y el menú de navegación.
const Header = ({ onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [popup, setPopup] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  //Comprobamos si el ususario es administrador.
  useEffect(() => {
    const admin = localStorage.getItem('isAdmin');
    setIsAdmin(admin === 'true');
  }, []);

  //Función toggle que permite desplegar el menu de navegación.
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };
  //Pop up para cerrar sesión.
  const handleLogout = () => {
    setPopup(true);
  };
  const handleConfirm = () => {
    onLogout();
    localStorage.removeItem('isAdmin');
    setPopup(false);
  };

  const handleCancel = () => {
    setPopup(false);
  };

  return (
    <div className='container-header'>
      <header className='header'>
        <div className='menu-icon' onClick={toggleMenu}>
          <img src={menuIcon} alt='Menu' className='icon-img' />
        </div>

        <div className='header-logo'>
          <h1>
            <span className='book-title'>Book</span>
            <span className='flix-title'>flix</span>
          </h1>
        </div>
        <div className='header-home'>
          <Link className='nav-link' to='/'>
            <img src={house} alt='home' className='icon-img' />
          </Link>
        </div>
        <div className='header-logout'>
          <button className='nav-link' onClick={handleLogout}>
            <img src={logoutIcon} alt='Logout' className='icon-img' />
          </button>
        </div>
      </header>
      {/*Menú de navegación*/}
      {isMenuOpen && (
        <nav className='navbar'>
          <ul className='navbar-nav'>
            <li className='nav-item'>
              <Link className='nav-link' to='/profile'>
                Mi Perfil
              </Link>
            </li>
            <li className='nav-item'>
              <Link className='nav-link' to='/searcher'>
                Buscador de libros
              </Link>
            </li>
            {/* Sección del administrador */}
            {isAdmin && (
              <li className='nav-item'>
                <Link className='nav-link' to='/configAdmin'>
                  Configuración
                </Link>
              </li>
            )}
          </ul>
        </nav>
      )}
      {/*Pop up para cerrar sesión*/}
      {popup && (
        <div className='popup'>
          <div className='popup-content'>
            <h3>¿Estás seguro que deseas cerrar sesión?</h3>
            <button className='confirm-button' onClick={handleConfirm}>
              Aceptar
            </button>
            <button className='cancel-button' onClick={handleCancel}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
