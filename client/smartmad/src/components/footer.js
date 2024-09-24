import React from 'react';

export const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#333',
        color: '#fff',
        padding: '20px',
        textAlign: 'center',
        position: 'fixed',
        bottom: 0,
        width: '100%',
      }}
    >
      <p>&copy; SmartMad</p>
      <p>
        <a href="www.smartmad.dk/blabla" style={{ color: '#fff', textDecoration: 'none' }}>
          blabla
        </a>
        {' | '}
        <a href="www.smartmad.dk/blabla1" style={{ color: '#fff', textDecoration: 'none' }}>
          blabla1
        </a>
      </p>
      <p>
        <a href="www.smartmad.dk/socials" style={{ color: '#fff', textDecoration: 'none' }}>
          Follow us on social media:
        </a>
        {' '}
        <a href="www.smartmad.dk/facebook" style={{ color: '#fff', textDecoration: 'none' }}>
          <i className="fa fa-facebook" />
        </a>
        {' '}
        <a href="www.smartmad.dk/instagram" style={{ color: '#fff', textDecoration: 'none' }}>
          <i className="fa fa-instagram" />
        </a>
      </p>
    </footer>
  );
};
