import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MateriasInscritos = ({ materias }) => {
  const [materiasConInscritos, setMateriasConInscritos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMateriasConInscritos = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get('/materias-con-inscritos');
        console.log('Respuesta del servidor:', response); // Agregamos esta línea para depurar

        // Intentamos configurar el estado
        setMateriasConInscritos(response.data);
      } catch (error) {
        console.error('Error al obtener materias con inscritos:', error);
        setError('Error al obtener materias con inscritos. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchMateriasConInscritos();
  }, []);

  return (
    <div>
      <h2>Materias Inscritas</h2>
      {loading && <p>Cargando...</p>}
      {error && <p>{error}</p>}
      <ul>
        {/* Verificamos si materiasConInscritos es un array antes de intentar mapearlo */}
        {Array.isArray(materiasConInscritos) && materiasConInscritos.map(materiaConInscritos => (
          <li key={materiaConInscritos.materia._id}>
            <span>{materiaConInscritos.materia.nombre}</span>
            <ul>
              {materiaConInscritos.usuariosInscritos.length > 0 ? (
                materiaConInscritos.usuariosInscritos.map(usuario => (
                  <li key={usuario._id}>{usuario.username}</li>
                ))
              ) : (
                <li>No hay usuarios inscritos</li>
              )}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MateriasInscritos;
