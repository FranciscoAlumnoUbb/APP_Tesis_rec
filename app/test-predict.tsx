import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { testPredictFormats } from '@/services/api';

export default function TestPredictScreen() {
  const [testing, setTesting] = useState(false);

  const testPrediction = async () => {
    try {
      setTesting(true);
      
      // Solicitar permisos para acceder a la galería
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Error', 'Se necesitan permisos para acceder a la galería');
        return;
      }

      // Seleccionar una imagen
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        console.log('📸 Imagen seleccionada:', imageUri);
        
        // Probar diferentes formatos
        await testPredictFormats(imageUri);
        
        Alert.alert('Prueba completada', 'Revisa los logs de la consola para ver los resultados');
      }
    } catch (error) {
      console.error('Error en prueba:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      Alert.alert('Error', 'Error durante la prueba: ' + errorMessage);
    } finally {
      setTesting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prueba de Formatos de Predicción</Text>
      <Text style={styles.subtitle}>
        Esta pantalla prueba diferentes formatos de envío de imágenes al backend
      </Text>
      
      <Button
        title={testing ? "Probando..." : "Probar Formatos"}
        onPress={testPrediction}
        disabled={testing}
      />
      
      <Text style={styles.instructions}>
        1. Selecciona una imagen de la galería{'\n'}
        2. La app probará diferentes formatos{'\n'}
        3. Revisa los logs en la consola para ver los resultados
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  instructions: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 30,
    color: '#666',
    lineHeight: 20,
  },
});
