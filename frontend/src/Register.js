import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';

function Register() {
  const [formData, setFormData] = useState({
    nick_name: '',
    nombre: '',
    contrasena: '',
    email: '',
    grupo: ''
  });
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsSuccess(false);

    const grupoNum = parseInt(formData.grupo);
    if (isNaN(grupoNum) || grupoNum <= 0) {
      setMessage('El grupo debe ser un número válido y positivo.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5001/api/register', {
        ...formData,
        grupo: grupoNum
      });

      if (response.data.success) {
        setMessage('¡Usuario registrado correctamente!');
        setIsSuccess(true);
        setTimeout(() => navigate('/'), 2000);
      } else {
        setMessage(response.data.message || 'Error en el registro. Intenta de nuevo.');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else if (error.request) {
        setMessage('Error al conectar con el servidor. Verifica tu conexión.');
      } else {
        setMessage('Ocurrió un error inesperado durante el registro.');
      }
    }
  };

  return (
    <div className="register-container">
      <form className="register-box" onSubmit={handleSubmit}>
        <h2>Registro de Usuario</h2>
        <input
          type="text"
          name="nick_name"
          placeholder="Nombre de usuario (nick)"
          value={formData.nick_name}
          onChange={handleChange}
          required
          minLength="3"
        />
        <input
          type="text"
          name="nombre"
          placeholder="Nombre completo"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="contrasena"
          placeholder="Contraseña"
          value={formData.contrasena}
          onChange={handleChange}
          required
          minLength="8"
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="grupo"
          placeholder="ID del Grupo"
          value={formData.grupo}
          onChange={handleChange}
          required
        />
        <button type="submit">REGISTRAR</button>
        {message && (
          <p className={isSuccess ? "success-message" : "error-message"}>
            {message}
          </p>
        )}
        <p className="login-link">
          ¿Ya tienes una cuenta? <Link to="/">Inicia sesión aquí</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
