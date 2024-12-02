import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from 'react-router-dom';

//Views
import Home from './components/views/HomeView';
import BookProfile from './components/views/BookProfileView';
import UserProfile from './components/views/UserProfileView';
import BookSearcher from './components/views/BookSearcherView';
import Admin from './components/views/AdminView';
import Register from './components/views/RegisterView';
import Login from './components/views/LogInView';

//Utils
import Header from './components/utils/Header';
import Footer from './components/utils/Footer';

//Estructura de nuestra aplicación:
const App = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  //Con este hook controlamos que en login y registro d enuevo ususario se muestre un fondo distinto.
  useEffect(() => {
    const background = document.body.classList;
    if (
      window.location.pathname === '/login' ||
      window.location.pathname === '/register'
    ) {
      background.add('special-background');
    } else {
      background.remove('special-background');
    }
  }, [token]);

  //
  const Render = ({ children }) => {
    //obtenemos la localización de la página.
    const location = useLocation();
    //El menu se activa si el ususario no se encuentra en la ruta de login ni en la de registro. También es necesario tener un token activo.
    const isMenu =
      location.pathname !== '/login' &&
      location.pathname !== '/register' &&
      token;
    //El componente de pie de página se muestra siempre y cuando el ususaro no se encuentre en la sección d elogin o register.
    const isFooter =
      location.pathname !== '/login' && location.pathname !== '/register';
    //Si el ususario cierra sesión, eliminamos el token y el id del ususario.
    const handleLogout = () => {
      setToken(null);
      setUserId(null);
    };
    return (
      <>
        {isMenu && <Header onLogout={handleLogout} />} {children}
        {isFooter && <Footer />}
      </>
    );
  };

  //Rutas
  return (
    <Router>
      <Render>
        <Routes>
          <Route
            path='/'
            element={
              token ? (
                <Home token={token} userId={userId} />
              ) : (
                <Navigate to='/login' />
              )
            }
          />
          <Route
            path='/searcher'
            element={
              token ? (
                <BookSearcher token={token} userId={userId} />
              ) : (
                <Navigate to='/login' />
              )
            }
          />
          <Route
            path='/profile'
            element={
              token ? <UserProfile token={token} /> : <Navigate to='/login' />
            }
          />
          <Route
            path='/book/:bookId'
            element={
              token ? <BookProfile token={token} /> : <Navigate to='/login' />
            }
          />
          <Route
            path='/configAdmin'
            element={token ? <Admin token={token} /> : <Navigate to='/login' />}
          />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login setToken={setToken} />} />
        </Routes>
      </Render>
    </Router>
  );
};

export default App;
