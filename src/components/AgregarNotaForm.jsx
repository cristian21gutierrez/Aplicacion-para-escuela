// AgregarNotaForm.js
import React, { useState } from 'react';
import axios from 'axios';

function AgregarNotaForm({ users, materiasConInscritos, setCalificaciones, setLoading }) {
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedMateria, setSelectedMateria] = useState('');
  const [nota, setNota] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUserChange = (e) => {
    setSelectedUser(e.target.value);
  };

  const handleMateriaChange = (e) => {
    setSelectedMateria(e.target.value);
  };

  const handleNotaChange = (e) => {
    setNota(e.target.value);
  };

  const handleAgregarNota = async () => {
    try {
      setLoading(true);
      setError(null);

      await axios.post('http://localhost:5000/agregar-nota', {
        username: selectedUser,
        materia: selectedMateria,
        nota: nota
      }, {
        headers: {
          'x-admin': 'true'
        }
      });

      const updatedCalificaciones = { ...calificaciones };
      if (!updatedCalificaciones[selectedUser]) {
        updatedCalificaciones[selectedUser] = {};
      }
      updatedCalificaciones[selectedUser][selectedMateria] = nota;
      setCalificaciones(updatedCalificaciones);

      alert('Nota agregada exitosamente');
      // Limpia los campos después de agregar la nota
      setNota('');
      setSelectedUser('');
      setSelectedMateria('');
    } catch (error) {
      console.error('Error al agregar la nota:', error);
      setError('Error al agregar la nota. Por favor, intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Agregar Nota:</h3>
      {/* Implementa el formulario para agregar una nota */}
    </div>
  );
}

export default AgregarNotaForm;
