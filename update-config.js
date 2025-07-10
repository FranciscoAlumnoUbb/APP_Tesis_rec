// update-config.js
const { writeFileSync, mkdirSync } = require('fs');
const { join } = require('path');

// Usar URL pública de ngrok
const ngrokUrl = 'https://ec50-181-163-132-87.ngrok-free.app';

// Ruta absoluta al archivo config.ts
const outputPath = join(__dirname, 'constants', 'config.ts');

// Asegurar que el directorio exista
mkdirSync(join(__dirname, 'constants'), { recursive: true });

// Contenido del archivo actualizado
const content = `// Configuración de la aplicación
export const CONFIG = {
  // Backend API Configuration
  API: {
    // URL pública de ngrok
    HOST: 'ec50-181-163-132-87.ngrok-free.app',
    PORT: 443, // Puerto HTTPS
    get BASE_URL() {
      return 'https://\${this.HOST}';
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
`;

try {
  writeFileSync(outputPath, content);
  console.log(`✅ config.ts actualizado con URL de ngrok: ${ngrokUrl}`);
  console.log(`📡 URL del backend: ${ngrokUrl}`);
} catch (err) {
  console.error('❌ Error al escribir config.ts:', err);
}
