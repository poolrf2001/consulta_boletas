import React, { useState } from 'react';
import axiosInstance from '../utils/axiosConfig';  // Asegúrate de usar axiosInstance
import { useRouter } from 'next/router';
import './Login.css';
import Alert from '../components/Alert';  // Asegúrate de que la ruta sea correcta
import '../styles/Alert.css';  // Importa los estilos de la alerta

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [dni, setDni] = useState('');
  const [dniVisible, setDniVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Limpiar tokens viejos
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('trabajador_id');

    try {
      const response = await axiosInstance.post('login/', { email, dni });
      if (response.status === 200) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        localStorage.setItem('trabajador_id', response.data.trabajador_id);
        setAlertType('success');
        setAlertMessage('Inicio de sesión exitoso');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);  // Redireccionar después de 1.5 segundos
      }
    } catch (error: any) {
      if (error.response) {
        console.error('Error response:', error.response.data);
        setAlertType('error');
        setAlertMessage('Error al iniciar sesión. Por favor, verifica tus credenciales.');
      } else if (error.request) {
        console.error('Error request:', error.request);
        setAlertType('error');
        setAlertMessage('No se recibió respuesta del servidor.');
      } else {
        console.error('Error', error.message);
        setAlertType('error');
        setAlertMessage('Error desconocido.');
      }
    }
  };

  const handleCloseAlert = () => {
    setAlertMessage(null);
  };

  const toggleDniVisibility = () => {
    setDniVisible(!dniVisible);
  };

  return (
    <div className="container-login">
      {alertMessage && (
        <Alert message={alertMessage} type={alertType} onClose={handleCloseAlert} />
      )}
      <div className="heading">Consulta tus boletas</div>
      <form onSubmit={handleLogin} className="form">
        <input 
          required 
          className="input" 
          type="email" 
          placeholder="Correo electrónico" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <div className="input-container">
          <input 
            required 
            className="input" 
            type={dniVisible ? "text" : ""}  // Cambia "" por "password"
            placeholder="DNI"
            value={dni} 
            onChange={(e) => setDni(e.target.value)} 
          />
        </div>
        <input className="login-button" type="submit" value="Ingresar" />
      </form>
      <span className="agreement"><a href="#">Learn user licence agreement</a></span>
    </div>
  );
};

export default LoginPage;
