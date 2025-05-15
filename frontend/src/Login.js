import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/login', {
        username,
        password,
      });

      if (response.data.success) {
        navigate('/welcome', {
          state: { nickname: response.data.nickname },
        });
      } else {
        setMessage('Credenciales inválidas');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Error al conectar con el servidor');
      }
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleLogin}>
        <div className="avatar" />
        <h2>Iniciar Sesión</h2>
        <input
          type="text"
          placeholder="User"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="options">
          <label>
            <input type="checkbox" /> Remember me
          </label>
          <span className="forgot">¿Olvido la contraseña?</span>
        </div>
        <button type="submit">INGRESAR</button>
        {message && <p className="error">{message}</p>}

        <p className="register-link">
          ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;