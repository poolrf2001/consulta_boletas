import React from 'react';
import { useRouter } from 'next/router';
import './Navbar.css'; // Importa los estilos personalizados

const Navbar: React.FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    router.push('/login');
  };

  return (
    <nav className="navbar">
      {/* Título que redirige al Dashboard */}
      <h2 className="navbar-title" onClick={() => router.push('/dashboard')}>
        Consulta de Boletas
      </h2>

      {/* Botón Logout */}
      <button className="logout-button" onClick={handleLogout}>
        SALIR
      </button>
    </nav>
  );
};

export default Navbar;
