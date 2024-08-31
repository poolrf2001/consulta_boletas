// utils/axiosConfig.ts
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Asegurarse de que jwtDecode esté importado correctamente
import { useRouter } from 'next/router';

const axiosInstance = axios.create({
  baseURL: 'https://boletadepago.munijauja.gob.pe/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Función para obtener el refresh token desde el localStorage
const getRefreshToken = () => {
  return localStorage.getItem('refresh_token');
};

// Función para almacenar tokens en localStorage
const storeTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
};

// Interceptor para agregar el token a las solicitudes
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      try {
        const decodedToken: any = jwtDecode(token); // Decodificar el token
        config.headers['trabajador_id'] = decodedToken.user_id; // Usar el ID del trabajador del token decodificado
      } catch (error) {
        console.error('Error decoding token', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar la expiración del token y refrescarlo
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const router = useRouter(); // Usar useRouter para manejar redirecciones

    // Si el error es 401 (Unauthorized) y no hemos reintentado aún
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Asegurar que solo intentamos una vez refrescar el token

      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          // Intentar refrescar el token de acceso
          const response = await axios.post('http://boletadepago.munijauja.gob.pe/api/token/refresh/', { refresh: refreshToken });
          
          // Almacenar el nuevo token de acceso y refresh
          storeTokens(response.data.access, response.data.refresh);
          
          // Actualizar el token en los encabezados para la solicitud original
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
          originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
          
          // Reintentar la solicitud original con el nuevo token
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error('Error refreshing token:', refreshError);

          // Si no se puede refrescar, redirigir al login y limpiar el localStorage
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          router.push('/login');
        }
      } else {
        // Si no hay refresh token, redirigir al login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        router.push('/login');
      }
    }

    return Promise.reject(error); // Rechazar otros errores
  }
);

export default axiosInstance;
