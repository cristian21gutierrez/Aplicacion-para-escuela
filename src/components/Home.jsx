import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/home.css'; // Importar el archivo CSS

function Home({ isAdmin }) {
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [inscripcionExitosa, setInscripcionExitosa] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);

  useEffect(() => {
    setCurrentUser('flor'); // Reemplazar con el nombre de usuario real del usuario actual
  }, []);

  const buscarMaterias = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/materias?search=${searchTerm}`);
      setMaterias(response.data);
      setSearchPerformed(true);
    } catch (error) {
      console.error('Error al obtener materias:', error);
      setError('Error al obtener materias. Por favor, intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const inscribirse = async (materiaId, materiaNombre) => {
    try {
      setError(null);
      setLoading(true);
      const response = await axios.post('http://localhost:5000/inscribir-materia', {
        username: currentUser,
        materia: materiaNombre
      });
      console.log(response.data);
      // Después de una inscripción exitosa, volvemos a buscar las materias para obtener la lista actualizada
      await buscarMaterias();
      setInscripcionExitosa(materiaNombre);
    } catch (error) {
      console.error('Error al inscribirse en la materia:', error);
      setError('Error al inscribirse en la materia. Por favor, intenta de nuevo más tarde.');
      console.log(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <h2 className="home-header">Bienvenido al Home</h2>
      <div className="search-form">
        <input
          type="text"
          placeholder="Buscar materia"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={loading}
          className="search-input"
        />
        <button onClick={buscarMaterias} disabled={loading} className="search-button">
          {loading ? 'Cargando...' : 'Buscar'}
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}
      {searchPerformed && materias.length > 0 && (
        <div>
          <h3>Materias Disponibles:</h3>
          <ul className="materias-list">
            {materias.map(materia => (
              <li className="materia-item" key={materia._id}>
                <strong className="materia-name">Nombre:</strong> {materia.nombre}<br />
                <strong className="materia-date">Fecha de Inscripción:</strong> {new Date(materia.fechaInscripcion).toLocaleDateString()}<br />
                {materia.inscrito ? (
                  <p className="materia-status">Inscrito</p>
                ) : (
                  <React.Fragment>
                    {inscripcionExitosa === materia.nombre ? (
                      <p className="materia-status">Inscripción exitosa</p>
                    ) : (
                      <button onClick={() => inscribirse(materia._id, materia.nombre)} disabled={loading}>Inscribirse</button>
                    )}
                  </React.Fragment>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Home;
