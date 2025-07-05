import { API_URL } from '@/constants/config';
import { Platform } from 'react-native';

export async function predictImage(fileUri: string): Promise<{
  detections: {
    label: string;
    confidence: number;
    box: [number, number, number, number];
  }[];
}> {
  try {
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

      const res = await fetch(`${API_URL}/predict_base64`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64 }),
      });

      if (!res.ok) throw new Error(`Error en /predict_base64: ${res.status}`);
      return await res.json();
    }

    // 📱 Modo móvil
    const formData = new FormData();
    formData.append('image', {
      uri: fileUri,
      name: 'test.jpg',
      type: 'image/jpeg',
    } as any);

    const res = await fetch(`${API_URL}/predict`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) throw new Error(`Error en /predict: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error('❌ Error en predictImage():', error);
    throw error;
  }
}
