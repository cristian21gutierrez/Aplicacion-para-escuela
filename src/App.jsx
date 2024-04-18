import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import axios from 'axios';

import Home from './components/Home';
import AdminPanel from './components/AdminPanel';

import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [registrationMessage, setRegistrationMessage] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (token) {
      const decodeToken = JSON.parse(atob(token.split('.')[1]));
      setIsAdmin(decodeToken.isAdmin);
      setUsername(decodeToken.username);
    }
  }, [token]);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/login', { username, password });
      const { token, isAdmin } = response.data;
      setToken(token);
      localStorage.setItem('token', token);
      setIsAdmin(isAdmin);
      setUsername(username);
      setPassword('');
      setLoginError('');
    } catch (error) {
      console.error(error);
      setLoginError('Credenciales inválidas');
    }
  };

  const handleRegistration = async () => {
    try {
      const response = await axios.post('http://localhost:5000/register', { username, password });
      setRegistrationMessage('Usuario registrado exitosamente');
    } catch (error) {
      console.error(error);
      setRegistrationMessage('Error al registrar usuario');
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
    setUsername('');
  };

  return (
    <Router>
      <div className="app-container">
        <h1 className="app-title">Aplicación de Login</h1>
        {!token && (
          <div className="login-container">
            <input type="text" placeholder="Usuario" value={username} onChange={e => setUsername(e.target.value)} />
            <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Iniciar sesión</button>
            <button onClick={handleRegistration}>Registrarse</button>
            {registrationMessage && <p className="success-message">{registrationMessage}</p>}
            {loginError && <p className="error-message">{loginError}</p>}
          </div>
        )}
        {token && (
          <div className="user-container">
            <p>¡Hola, {username}!</p>
            <button onClick={handleLogout}>Cerrar sesión</button>
            {isAdmin && <Link to="/admin"><button>Ir al Panel de Administración</button></Link>}
          </div>
        )}
        <Routes>
          {token ? (
            <>
              <Route path="/" element={<Home isAdmin={isAdmin} username={username} />} />
              {isAdmin && <Route path="/admin" element={<AdminPanel />} />}
              <Route path="/*" element={<Navigate to="/" />} />
            </>
          ) : (
            <Route path="/" element={<Navigate to="/" />} />
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
