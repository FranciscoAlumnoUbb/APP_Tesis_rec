import { CONFIG } from '../constants/config';

export interface TestConnectionResult {
  success: boolean;
  error?: string;
  healthCheck?: any;
  predictionTest?: any;
  duration?: number;
}

export async function testBackendConnection(): Promise<TestConnectionResult> {
  const startTime = Date.now();
  
  try {
    console.log('🔍 Iniciando prueba de conexión con backend...');
    console.log('📡 URL base:', CONFIG.API.BASE_URL);
    
    // Prueba 1: Health check
    console.log('🩺 Probando health check...');
    const healthResponse = await fetch(`${CONFIG.API.BASE_URL}${CONFIG.ENDPOINTS.HEALTH}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!healthResponse.ok) {
      throw new Error(`Health check falló: ${healthResponse.status} ${healthResponse.statusText}`);
    }
    
    const healthData = await healthResponse.json();
    console.log('✅ Health check exitoso:', healthData);
    
    // Prueba 2: Prediction test con imagen de prueba
    console.log('🔮 Probando endpoint de predicción...');
    
    // Crear FormData para enviar imagen de prueba
    const formData = new FormData();
    
    // Crear un blob simple para la prueba (1x1 pixel PNG)
    const testImageBlob = new Blob([
      new Uint8Array([
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
        0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
        0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
        0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00,
        0xFF, 0xFF, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, 0xE2, 0x21, 0xBC, 0x33,
        0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
      ])
    ], { type: 'image/png' });
    
    formData.append('file', testImageBlob, 'test.png');
    
    const predictionResponse = await fetch(`${CONFIG.API.BASE_URL}${CONFIG.ENDPOINTS.PREDICT}`, {
      method: 'POST',
      body: formData,
    });
    
    if (!predictionResponse.ok) {
      throw new Error(`Predicción falló: ${predictionResponse.status} ${predictionResponse.statusText}`);
    }
    
    const predictionData = await predictionResponse.json();
    console.log('✅ Predicción exitosa:', predictionData);
    
    const duration = Date.now() - startTime;
    
    return {
      success: true,
      healthCheck: healthData,
      predictionTest: predictionData,
      duration
    };
    
  } catch (error) {
    console.error('❌ Error en prueba de conexión:', error);
    const duration = Date.now() - startTime;
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      duration
    };
  }
}
