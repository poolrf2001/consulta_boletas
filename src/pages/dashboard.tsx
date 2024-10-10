import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosConfig';  // Cambiado axios por axiosInstance
import { Boleta } from '../types';
import Navbar from '../components/Navbar';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [boletas, setBoletas] = useState<Boleta[]>([]);
  const [boletaReciente, setBoletaReciente] = useState<Boleta | null>(null);
  const [mostrarBoletasAnteriores, setMostrarBoletasAnteriores] = useState(false);
  const [trabajador, setTrabajador] = useState<string>('Cargando nombre...');

// Función para extraer el mes textual
const obtenerMesTexto = (fecha: string) => {
  const mesTexto = fecha.split('-')[0]; // Extraer el mes como 'Julio'
  return mesTexto.toUpperCase(); // Opcional: convertir a mayúsculas si lo deseas
};


  useEffect(() => {
    const fetchBoletas = async () => {
      const trabajadorId = localStorage.getItem('trabajador_id');
      try {
        // Cambiado axios por axiosInstance
        const response = await axiosInstance.get<Boleta[]>(`trabajadores/${trabajadorId}/boletas/`);
        setBoletas(response.data);

        // Obtener la boleta más reciente
        if (response.data.length > 0) {
          const boletaMasReciente = response.data.reduce((prev, curr) =>
            new Date(prev.mes) > new Date(curr.mes) ? prev : curr
          );
          setBoletaReciente(boletaMasReciente);
        }

        // Obtener el nombre del trabajador
        const trabajadorResponse = await axiosInstance.get(`trabajadores/${trabajadorId}/`);
        setTrabajador(trabajadorResponse.data.nombre_completo);
      } catch (error) {
        console.error('Error fetching boletas', error);
      }
    };

    fetchBoletas();
  }, []);

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <div className="column-container">
          {/* Columna izquierda: Nombre del trabajador */}
          <div className="left-column">
            <div className="container noselect">
              <div className="canvas">
                <div className="tracker tr-1"></div>
                <div className="tracker tr-2"></div>
                <div className="tracker tr-3"></div>
                <div className="tracker tr-4"></div>
                <div className="tracker tr-5"></div>
                <div className="tracker tr-6"></div>
                <div className="tracker tr-7"></div>
                <div className="tracker tr-8"></div>
                <div className="tracker tr-9"></div>
                <div className="tracker tr-10"></div>
                <div className="tracker tr-11"></div>
                <div className="tracker tr-12"></div>
                <div className="tracker tr-13"></div>
                <div className="tracker tr-14"></div>
                <div className="tracker tr-15"></div>
                <div className="tracker tr-16"></div>
                <div className="tracker tr-17"></div>
                <div className="tracker tr-18"></div>
                <div className="tracker tr-19"></div>
                <div className="tracker tr-20"></div>
                <div className="tracker tr-21"></div>
                <div className="tracker tr-22"></div>
                <div className="tracker tr-23"></div>
                <div className="tracker tr-24"></div>
                <div className="tracker tr-25"></div>
                <div id="card">
                  <p id="prompt">BIENVENIDO</p>
                  <div className="title">{trabajador}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Columna central: Boleta más reciente */}
          <div className="center-column">
            {!mostrarBoletasAnteriores ? (
              <div className="boleta-reciente-card">
                <div className="card">
                  <div className="image">
                  </div>
                  <div className="card-info">
                    <span>BOLETA DEL MES DE </span>
                    <h2 className='mes'>{boletaReciente ? obtenerMesTexto(boletaReciente.mes) : 'Cargando...'}</h2>
                    <p>Fecha: {boletaReciente ? boletaReciente.mes : 'Sin boleta disponible'}</p>
                  </div>
                  {boletaReciente && (
                    <a href={`https://boletadepago.munijauja.gob.pe${boletaReciente.pdf}`} download className="button">
                      DESCARGAR
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <>
                <h2>BOLETAS DE MESES ANTERIORES</h2>
                <table className="tabla-boletas">
                  <thead>
                    <tr>
                      <th>NOMBRE DEL ARCHIVO</th>
                      <th>MES</th>
                      <th>OPCIÓN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {boletas.map((boleta) => (
                      <tr key={boleta.id}>
                        <td data-label="NOMBRE DEL ARCHIVO">{boleta.pdf.split('/').pop()}</td> {/* Mostrar el nombre del archivo PDF */}
                        <td data-label="MES">{boleta.mes}</td> {/* Mostrando el valor del campo mes tal cual */}
                        <td data-label="OPCIÓN">
                          <a href={`https://boletadepago.munijauja.gob.pe${boleta.pdf}`} download>
                            <button className="download-button" type="button">
                              <span className="download-button__text">Descargar</span>
                              <span className="download-button__icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 35" className="download-svg">
                                  <path d="M17.5,22.131a1.249,1.249,0,0,1-1.25-1.25V2.187a1.25,1.25,0,0,1,2.5,0V20.881A1.25,1.25,0,0,1,17.5,22.131Z"></path>
                                  <path d="M17.5,22.693a3.189,3.189,0,0,1-2.262-.936L8.487,15.006a1.249,1.249,0,0,1,1.767-1.767l6.751,6.751a.7.7,0,0,0,.99,0l6.751-6.751a1.25,1.25,0,0,1,1.768,1.767l-6.752,6.751A3.191,3.191,0,0,1,17.5,22.693Z"></path>
                                  <path d="M31.436,34.063H3.564A3.318,3.318,0,0,1,.25,30.749V22.011a1.25,1.25,0,0,1,2.5,0v8.738a.815.815,0,0,0,.814.814H31.436a.815.815,0,0,0,.814-.814V22.011a1.25,1.25,0,1,1,2.5,0v8.738A3.318,3.318,0,0,1,31.436,34.063Z"></path>
                                </svg>
                              </span>
                            </button>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </>
            )}
          </div>

          {/* Columna derecha: Botón para mostrar/ocultar boletas anteriores */}
          <div className="right-column">
            <button onClick={() => setMostrarBoletasAnteriores(!mostrarBoletasAnteriores)}>
              {mostrarBoletasAnteriores ? 'Ocultar boletas de meses anteriores' : 'Ver boletas de meses anteriores'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
