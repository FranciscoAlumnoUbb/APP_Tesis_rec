import { API_URL } from '@/constants/config';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

export async function predictImage(fileUri: string) {
  try {
    if (Platform.OS === 'web') {
      const base64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const response = await fetch(`${API_URL}/predict_base64`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64 }),
      });

      if (!response.ok) {
        throw new Error(`Error en /predict_base64: ${response.status}`);
      }

      return await response.json();
    } else {
      const formData = new FormData();
      formData.append('image', {
        uri: fileUri,
        name: 'test.jpg',
        type: 'image/jpeg',
      } as any);

      console.log('📸 Enviando imagen desde:', fileUri);

      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error en /predict: ${response.status}`);
      }

      return await response.json();
    }
  } catch (error) {
    console.error('❌ Error en predictImage():', error);
    throw error;
  }
}
