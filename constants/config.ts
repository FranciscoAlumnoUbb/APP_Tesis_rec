// Configuración de la aplicación
export const CONFIG = {
  // Backend API Configuration
  API: {
    // URL pública de ngrok
    HOST: 'ec50-181-163-132-87.ngrok-free.app',
    PORT: 443, // Puerto HTTPS
    get BASE_URL() {
      return `https://${this.HOST}`;
    }
  },
  
  // Endpoints
  ENDPOINTS: {
    PREDICT: '/predict',
    PREDICT_BASE64: '/predict_base64',
    HEALTH: '/health'
  },
  
  // Configuración de la cámara
  CAMERA: {
    QUALITY: 0.8,
    ASPECT_RATIO: [4, 3],
    ALLOW_EDITING: true
  },
  
  // Configuración de la aplicación
  APP: {
    NAME: 'RecyclAIDeep',
    VERSION: '1.0.0'
  }
};

// Para compatibilidad hacia atrás
export const API_URL = CONFIG.API.BASE_URL;
