import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  const getUsers = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/usuarios`, {
        headers: {
          'x-admin': 'true'
        }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      setError('Error al obtener usuarios. Por favor, intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId, username) => {
    const confirmDelete = window.confirm(`¿Estás seguro de que deseas eliminar al usuario ${username}?`);
    if (!confirmDelete) return;

    try {
      setError(null);
      setLoading(true);
      await axios.delete(`http://localhost:5000/usuarios/${userId}`, {
        headers: {
          'x-admin': 'true'
        }
      });
      getUsers();
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      setError('Error al eliminar usuario. Por favor, intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Panel de Administración</h2>
      <div>
        <input
          type="text"
          placeholder="Buscar usuario"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={loading}
        />
        <button onClick={getUsers} disabled={loading}>
          {loading ? 'Cargando...' : 'Buscar'}
        </button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <h3>Lista de Usuarios:</h3>
      <ul>
        {users.map(user => (
          <li key={user._id}>
            {user.username}
            <button onClick={() => deleteUser(user._id, user.username)} disabled={loading}>
              {loading ? 'Eliminando...' : 'Eliminar'}
            </button>
          </li>
        ))}
      </ul>
      <Link to="/">
        <button>Ir al Home</button>
      </Link>
    </div>
  );
}

export default AdminPanel;
