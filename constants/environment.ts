import { Platform } from 'react-native';

// Configuración por ambiente
export const ENVIRONMENT = {
  // Detectar si estamos en desarrollo o producción
  isDevelopment: __DEV__,
  isProduction: !__DEV__,
  
  // Configuración de la API según el ambiente
  API: {
    // En desarrollo, usa localhost o IP local
    development: {
      HOST: Platform.select({
        ios: 'localhost',
        android: '10.0.2.2', // Android emulator
        web: 'localhost',
        default: '192.168.1.92' // IP local para dispositivos físicos
      }),
      PORT: 8000 // Puerto actualizado según el backend
    },
    
    // En producción, usa el servidor real
    production: {
      HOST: 'tu-servidor-produccion.com', // Cambia por tu servidor de producción
      PORT: 443 // Puerto HTTPS
    }
  },
  
  // Obtener la configuración actual
  getCurrentConfig() {
    return this.isDevelopment ? this.API.development : this.API.production;
  },
  
  // Obtener la URL base de la API
  getAPIBaseURL() {
    const config = this.getCurrentConfig();
    const protocol = this.isProduction ? 'https' : 'http';
    return `${protocol}://${config.HOST}:${config.PORT}`;
  }
};

// Función para detectar si el backend está disponible
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const baseURL = ENVIRONMENT.getAPIBaseURL();
    const healthURL = `${baseURL}/health`;
    
    console.log('🔍 Verificando backend en:', healthURL);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(healthURL, {
      method: 'GET',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    console.log('📡 Respuesta del backend:', {
      status: response.status,
      ok: response.ok,
      url: response.url
    });
    
    return response.ok;
  } catch (error) {
    console.error('❌ Backend no disponible:', error);
    return false;
  }
}
