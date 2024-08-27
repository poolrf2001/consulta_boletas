// src/pages/update-email.tsx

import React, { useState } from 'react';
import axios from '../utils/axiosConfig';
import Navbar from '../components/Navbar';
import './UpdateEmail.css'; // Asegúrate de crear este archivo CSS

const UpdateEmailPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const trabajadorId = localStorage.getItem('trabajador_id');
    try {
      const response = await axios.post(`trabajadores/${trabajadorId}/actualizar_correo/`, { email });
      if (response.status === 200) {
        setEmailSuccess('Email actualizado con éxito');
        setEmailError('');
      }
    } catch (error) {
      console.error('Error actualizando el email', error);
      setEmailError('Error actualizando el email');
      setEmailSuccess('');
    }
  };

  return (
    <div className="update-email-container">
      <Navbar />
      <div className="update-email-content">
        <h2 className="email-update-title">Actualizar Correo Electrónico</h2>
        <form onSubmit={handleEmailUpdate} className="email-update-form">
          <input 
            type="email" 
            placeholder="Nuevo correo electrónico" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="form-input"
          />
          <button type="submit" className="form-button">Actualizar Email</button>
        </form>
        {emailError && <p className="error-message">{emailError}</p>}
        {emailSuccess && <p className="success-message">{emailSuccess}</p>}
      </div>
    </div>
  );
};

export default UpdateEmailPage;
