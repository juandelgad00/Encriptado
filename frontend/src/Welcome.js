import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Welcome.css';

function Welcome() {
  const location = useLocation();
  const navigate = useNavigate();
  const { nickname } = location.state || {};

  const handleLogout = () => {

    navigate('/'); // Redirigir a la página de Login (ruta raíz)
  };

  return (
    <div className="welcome-container">
      <div className="welcome-card">
        <h1>¡Bienvenido!</h1>
        <p className="welcome-message"> {/* Añadida clase para posible estilo específico */}
          {nickname ? `Hola, ${nickname}` : 'No hay datos disponibles'}
        </p>
        <button onClick={handleLogout} className="logout-button">
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}

export default Welcome;