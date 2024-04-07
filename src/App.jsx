import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import axios from 'axios';

import Home from './components/Home';
import AdminPanel from './components/AdminPanel';

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
    }
  }, [token]);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/login', { username, password });
      const { token, isAdmin } = response.data;
      setToken(token);
      localStorage.setItem('token', token);
      setIsAdmin(isAdmin); // Almacenar el rol del usuario en el estado
      setUsername('');
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
  };

  return (
    <Router>
      <div>
        <h1>Aplicación de Login</h1>
        {!token && (
          <>
            <input type="text" placeholder="Usuario" value={username} onChange={e => setUsername(e.target.value)} />
            <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Iniciar sesión</button>
            <button onClick={handleRegistration}>Registrarse</button>
            {registrationMessage && <p>{registrationMessage}</p>}
            {loginError && <p>{loginError}</p>}
          </>
        )}
        {token && (
          <>
            <p>¡Hola, {username}!</p>
            <button onClick={handleLogout}>Cerrar sesión</button>
            {isAdmin && <Link to="/admin"><button>Ir al Panel de Administración</button></Link>}
          </>
        )}
        <Routes>
          {token ? (
            <>
              <Route path="/" element={<Home isAdmin={isAdmin} />} />
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
