import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import "../styles/panel.css"

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [materiasConInscritos, setMateriasConInscritos] = useState([]);
  const [calificaciones, setCalificaciones] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTermUsers, setSearchTermUsers] = useState('');
  const [searchingUsers, setSearchingUsers] = useState(false);
  const [searchTermMaterias, setSearchTermMaterias] = useState('');
  const [searchingMaterias, setSearchingMaterias] = useState(false);
  const [materiaFilter, setMateriaFilter] = useState('');
  const [nota, setNota] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedMateria, setSelectedMateria] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const usersResponse = await axios.get(`http://localhost:5000/usuarios`, {
          headers: {
            'x-admin': 'true'
          }
        });

        const materiasResponse = await axios.get('http://localhost:5000/materias-con-inscritos');
        
        // Obtener calificaciones por materia de los alumnos
        const calificacionesResponse = await axios.get('http://localhost:5000/notas', {
          headers: {
            'x-admin': 'true'
          }
        });

        setUsers(usersResponse.data);
        setMateriasConInscritos(materiasResponse.data);
        setCalificaciones(calificacionesResponse.data.reduce((acc, curr) => {
          if (!acc[curr.usuario]) {
            acc[curr.usuario] = {};
          }
          acc[curr.usuario][curr.materia] = curr.nota;
          return acc;
        }, {}));
      } catch (error) {
        console.error('Error al obtener datos:', error);
        setError('Error al obtener datos. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    if (searchingUsers) {
      fetchData();
      setSearchingUsers(false);
    }
  }, [searchingUsers]);

  useEffect(() => {
    if (searchingMaterias) {
      // Aquí puedes hacer la lógica para buscar materias si lo necesitas
      setSearchingMaterias(false);
    }
  }, [searchingMaterias]);

  // Función para manejar la búsqueda de usuarios
  const handleSearchUsers = () => {
    setSearchingUsers(true);
  };

  // Función para manejar la búsqueda de materias
  const handleSearchMaterias = () => {
    setSearchingMaterias(true);
  };

  // Función para manejar el cambio en el filtro de materias
  const handleMateriaFilterChange = (e) => {
    setMateriaFilter(e.target.value);
  };

  // Función para manejar el cambio en la calificación
  const handleNotaChange = (e) => {
    setNota(e.target.value);
  };

  // Función para manejar el cambio en el usuario seleccionado
  const handleUserChange = (e) => {
    setSelectedUser(e.target.value);
  };

  // Función para manejar el cambio en la materia seleccionada
  const handleMateriaChange = (e) => {
    setSelectedMateria(e.target.value);
  };

  // Función para filtrar materias por nombre
  const filteredMaterias = materiasConInscritos.filter(item => {
    return item.materia.nombre.toLowerCase().includes(materiaFilter.toLowerCase());
  });

  // Función para manejar el estado de visibilidad de los usuarios inscritos de cada materia
  const toggleUsersVisibility = (materiaId) => {
    setMateriasConInscritos(prevMaterias => 
      prevMaterias.map(materia => {
        if (materia.materia._id === materiaId) {
          return { ...materia, showUsers: !materia.showUsers };
        } else {
          return materia;
        }
      })
    );
  };

  // Función para manejar el envío de la calificación
  const handleAgregarNota = async () => {
    try {
      await axios.post('http://localhost:5000/agregar-nota', {
        username: selectedUser,
        materia: selectedMateria,
        nota: nota
      }, {
        headers: {
          'x-admin': 'true'
        }
      });
      alert('Nota agregada exitosamente');
      // Limpia los campos después de agregar la nota
      setNota('');
      setSelectedUser('');
      setSelectedMateria('');
    } catch (error) {
      console.error('Error al agregar la nota:', error);
      alert('Error al agregar la nota. Por favor, intenta de nuevo más tarde.');
    }
  };

  return (
    <div className="admin-panel-container">
      <h2 className="admin-panel-header">Panel de Administración</h2>
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar usuario"
          value={searchTermUsers}
          onChange={(e) => setSearchTermUsers(e.target.value)}
          disabled={loading || searchingUsers}
          className="search-input"
        />
        <button onClick={handleSearchUsers} disabled={loading || searchingUsers} className="search-button">
          {loading ? 'Cargando...' : 'Buscar Alumnos'}
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}
      <h3>Lista de Usuarios:</h3>
      <ul className="user-list">
        {users.map(user => (
          <li key={user._id} className="user-item">
            <span className="user-name">{user.username}</span>
          </li>
        ))}
      </ul>
      <div className="search-container">
        <input
          type="text"
          placeholder="Filtrar materias"
          value={materiaFilter}
          onChange={handleMateriaFilterChange}
          disabled={loading}
          className="search-input"
        />
        <button onClick={handleSearchMaterias} disabled={loading || searchingMaterias} className="search-button">
          {loading ? 'Cargando...' : 'Buscar Materias'}
        </button>
      </div>
      <h3>Materias Inscritas:</h3>
      <ul className="materias-inscritos-list">
        {filteredMaterias.map(item => (
          <li key={item.materia._id}>
            <span onClick={() => toggleUsersVisibility(item.materia._id)} className="materia-name">
              {item.materia.nombre} 
              {item.showUsers ? " - Ocultar inscritos" : " - Ver inscritos"}
            </span>
            {item.showUsers && (
              <ul>
                {item.usuariosInscritos.map(u => (
                  <li key={u._id}>
                    {u.username}
                    {calificaciones[u.username] && calificaciones[u.username][item.materia.nombre] && (
                      <span> - Nota: {calificaciones[u.username][item.materia.nombre]}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      <h3>Agregar Nota:</h3>
      <div className="agregar-nota-container">
        <select value={selectedUser} onChange={handleUserChange} className="select-user">
          <option value="">Selecciona un usuario</option>
          {users.map(user => (
            <option key={user._id} value={user.username}>{user.username}</option>
          ))}
        </select>
        <select value={selectedMateria} onChange={handleMateriaChange} className="select-materia">
          <option value="">Selecciona una materia</option>
          {materiasConInscritos.map(item => (
            <option key={item.materia._id} value={item.materia.nombre}>{item.materia.nombre}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Nota"
          value={nota}
          onChange={handleNotaChange}
          disabled={!selectedUser || !selectedMateria}
          className="nota-input"
        />
        <button onClick={handleAgregarNota} disabled={!selectedUser || !selectedMateria || loading} className="agregar-nota-button">
          {loading ? 'Agregando...' : 'Agregar Nota'}
        </button>
      </div>
      <Link to="/" className="link-button">
        <button>Ir al Home</button>
      </Link>
    </div>
  );
}

export default AdminPanel;
