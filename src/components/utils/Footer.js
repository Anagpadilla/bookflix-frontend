import React from 'react';
import '../../styles/footer.css';
//Pie de página de la aplicación
const Footer = () => {
  return (
    <footer className='footer-container'>
      <p>
        &copy; {new Date().getFullYear()} BookFlix. Todos los derechos
        reservados.
      </p>
    </footer>
  );
};

export default Footer;
