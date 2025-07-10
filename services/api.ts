import { CONFIG } from '@/constants/config';
import { Platform } from 'react-native';

export async function predictImage(fileUri: string): Promise<any> {
  console.log('🔍 Iniciando predicción de imagen...');
  console.log('� URI de archivo:', fileUri);
  console.log('🌐 URL del backend:', CONFIG.API.BASE_URL);
  
  try {
    // Verificar si el backend está disponible
    console.log('🩺 Verificando salud del backend...');
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const healthResponse = await fetch(`${CONFIG.API.BASE_URL}/health`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Accept': 'application/json',
        },
      });
      
      clearTimeout(timeoutId);
      
      if (!healthResponse.ok) {
        console.error(`❌ Health check falló con status: ${healthResponse.status}`);
        throw new Error(`Backend health check falló: ${healthResponse.status}`);
      }
      
      const healthData = await healthResponse.json();
      console.log('✅ Backend disponible:', healthData);
    } catch (healthError) {
      console.error('❌ Error detallado al verificar backend:', healthError);
      const error = healthError as Error;
      if (error.name === 'AbortError') {
        throw new Error('Timeout al conectar con el backend. Verifica que esté ejecutándose en la IP correcta.');
      }
      throw new Error(`Backend no disponible: ${error.message || 'Error desconocido'}`);
    }

    if (Platform.OS === 'web') {
      console.log('🌐 Modo web: convirtiendo a base64');

      const response = await fetch(fileUri);
      const blob = await response.blob();

      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const result = reader.result as string;
          const base64Data = result.split(',')[1]; // remove "data:image/jpeg;base64,"
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      const res = await fetch(`${CONFIG.API.BASE_URL}${CONFIG.ENDPOINTS.PREDICT_BASE64}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ image: base64 }),
      });

      if (!res.ok) throw new Error(`Error en /predict_base64: ${res.status}`);
      
      const rawResponse = await res.json();
      console.log('🔍 Respuesta del backend (base64):', rawResponse);
      
      // Normalizar la respuesta del backend
      let normalizedResponse;
      
      if (rawResponse.detections && Array.isArray(rawResponse.detections)) {
        // El backend devuelve formato con detections array
        normalizedResponse = rawResponse;
      } else if (rawResponse.clase || rawResponse.confianza) {
        // El backend devuelve formato simple, convertir a formato con detections
        normalizedResponse = {
          detections: [{
            label: rawResponse.clase || 'desconocido',
            confidence: rawResponse.confianza || 0,
            box: rawResponse.bbox || [0, 0, 100, 100]
          }],
          ...rawResponse
        };
      } else {
        // Formato desconocido, crear estructura por defecto
        normalizedResponse = {
          detections: [],
          ...rawResponse
        };
      }
      
      return normalizedResponse;
    }

    // 📱 Modo móvil
    console.log('📱 Preparando FormData para móvil...');
    console.log('📷 URI de la imagen:', fileUri);
    
    const formData = new FormData();
    
    // Intentar diferentes formatos de datos
    const imageData = {
      uri: fileUri,
      name: 'image.jpg',
      type: 'image/jpeg',
    };
    
    console.log('📦 Datos de la imagen:', imageData);
    formData.append('image', imageData as any);
    
    // Log del FormData (solo para debug)
    console.log('� FormData preparado con campo "image"');
    
    console.log('�📤 Enviando imagen al backend...');
    console.log('🎯 Endpoint:', `${CONFIG.API.BASE_URL}${CONFIG.ENDPOINTS.PREDICT}`);
    
    const res = await fetch(`${CONFIG.API.BASE_URL}${CONFIG.ENDPOINTS.PREDICT}`, {
      method: 'POST',
      body: formData,
      headers: {
        'ngrok-skip-browser-warning': 'true',
      },
    });

    console.log('📥 Respuesta recibida, status:', res.status);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('❌ Error del servidor:', errorText);
      throw new Error(`Error ${res.status}: ${errorText || 'Error del servidor'}`);
    }
    
    const rawResponse = await res.json();
    console.log('🔍 Respuesta del backend:', rawResponse);
    
    // Normalizar la respuesta del backend
    let normalizedResponse;
    
    if (rawResponse.detections && Array.isArray(rawResponse.detections)) {
      // El backend devuelve formato con detections array
      normalizedResponse = rawResponse;
    } else if (rawResponse.clase || rawResponse.confianza) {
      // El backend devuelve formato simple, convertir a formato con detections
      normalizedResponse = {
        detections: [{
          label: rawResponse.clase || 'desconocido',
          confidence: rawResponse.confianza || 0,
          box: rawResponse.bbox || [0, 0, 100, 100]
        }],
        ...rawResponse
      };
    } else {
      // Formato desconocido, crear estructura por defecto
      normalizedResponse = {
        detections: [],
        ...rawResponse
      };
    }
    
    return normalizedResponse;
  } catch (error) {
    console.error('❌ Error completo en predictImage():', error);
    const err = error as Error;
    
    // Proporcionar mensajes de error más específicos
    if (err.message.includes('Failed to fetch') || err.message.includes('Network request failed')) {
      throw new Error('No se puede conectar al servidor. Verifica tu conexión de red y que el backend esté ejecutándose.');
    } else if (err.message.includes('Timeout') || err.message.includes('AbortError')) {
      throw new Error('Timeout al conectar con el backend. Verifica la IP y puerto del servidor.');
    } else if (err.message.includes('404')) {
      throw new Error('Endpoint no encontrado. Verifica que el backend esté actualizado.');
    } else if (err.message.includes('500')) {
      throw new Error('Error interno del servidor. Revisa los logs del backend.');
    }
    
    throw err;
  }
}

// Función alternativa para probar diferentes formatos
export async function testPredictFormats(fileUri: string): Promise<void> {
  console.log('🧪 Probando diferentes formatos de envío...');
  
  // Formato 1: FormData con 'image' como objeto
  try {
    console.log('📝 Prueba 1: FormData con objeto imagen');
    const formData1 = new FormData();
    formData1.append('image', {
      uri: fileUri,
      name: 'image.jpg',
      type: 'image/jpeg',
    } as any);
    
    const res1 = await fetch(`${CONFIG.API.BASE_URL}${CONFIG.ENDPOINTS.PREDICT}`, {
      method: 'POST',
      body: formData1,
      headers: {
        'ngrok-skip-browser-warning': 'true',
      },
    });
    
    console.log('✅ Formato 1 - Status:', res1.status);
    if (res1.status === 422) {
      const errorText = await res1.text();
      console.log('❌ Error formato 1:', errorText);
    }
  } catch (error) {
    console.log('❌ Error en formato 1:', error);
  }
  
  // Formato 2: FormData con 'file' como nombre del campo
  try {
    console.log('📝 Prueba 2: FormData con campo "file"');
    const formData2 = new FormData();
    formData2.append('file', {
      uri: fileUri,
      name: 'image.jpg',
      type: 'image/jpeg',
    } as any);
    
    const res2 = await fetch(`${CONFIG.API.BASE_URL}${CONFIG.ENDPOINTS.PREDICT}`, {
      method: 'POST',
      body: formData2,
      headers: {
        'ngrok-skip-browser-warning': 'true',
      },
    });
    
    console.log('✅ Formato 2 - Status:', res2.status);
    if (res2.status === 422) {
      const errorText = await res2.text();
      console.log('❌ Error formato 2:', errorText);
    }
  } catch (error) {
    console.log('❌ Error en formato 2:', error);
  }
}
