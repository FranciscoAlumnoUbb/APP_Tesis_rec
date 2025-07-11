import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { router, useFocusEffect } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NetInfo from '@react-native-community/netinfo';
import { predictImage } from '@/services/api'; // predicción online
import { predictOffline } from '@/services/loadTFModel'; // predicción offline

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [isLoading, setIsLoading] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const cameraRef = useRef<any>(null);
  
  // Hook para obtener las dimensiones de las safe areas
  const insets = useSafeAreaInsets();

  useFocusEffect(
    React.useCallback(() => {
      setImageUri(null);
    }, [])
  );

  const toggleFacing = () => {
    setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
  };

  const sendToSmartModel = async (uri: string) => {
    try {
      const resized = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 640, height: 640 } }],
        { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
      );

      const net = await NetInfo.fetch();
      const isOnline = net.isConnected && net.isInternetReachable;

      let data;
      if (isOnline) {
        console.log('🌐 Modo ONLINE');
        data = await predictImage(resized.uri);
      } else {
        console.log('📴 Modo OFFLINE');
        data = await predictOffline(resized.uri);
      }

      console.log('✅ Resultado:', data);

      if (!data.detections || data.detections.length === 0) {
        Alert.alert('Sin detección', 'No se encontraron objetos.');
        return;
      }

      router.push({
        pathname: '/result',
        params: {
          clase: data.detections[0]?.label || 'desconocido',
          confianza: data.detections[0]?.confidence?.toString() || '0',
          boundingBoxes: JSON.stringify(data.detections),
          uri: resized.uri,
        },
      });
    } catch (error) {
      console.error('❌ Error en predicción:', error);
      Alert.alert('Error', 'No se pudo procesar la imagen.');
    } finally {
      setIsLoading(false);
    }
  };

  const captureAndSend = async () => {
    if (!cameraRef.current) return;
    try {
      setIsLoading(true);
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      setImageUri(photo.uri);
      await sendToSmartModel(photo.uri);
    } catch (error) {
      Alert.alert('Error', 'No se pudo capturar la imagen.');
      setIsLoading(false);
    }
  };

  const pickImageAndSend = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (result.canceled) return;

      const selected = result.assets[0];
      setIsLoading(true);
      setImageUri(selected.uri);
      await sendToSmartModel(selected.uri);
    } catch (error) {
      Alert.alert('Error al elegir imagen');
      setIsLoading(false);
    }
  };

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>Necesitamos permisos para la cámara</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.text}>Conceder permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing} />
      <View style={[styles.overlay, { bottom: Math.max(insets.bottom + 60, 100) }]}>
        <TouchableOpacity onPress={toggleFacing} style={styles.button}>
          <Text style={styles.text}>🔁 Cambiar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={captureAndSend} style={styles.button}>
          <Text style={styles.text}>📸 Capturar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={pickImageAndSend} style={styles.button}>
          <Text style={styles.text}>📁 Galería</Text>
        </TouchableOpacity>
      </View>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.preview} />}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007aff" />
          <Text style={styles.loadingText}>Procesando imagen...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1c1c1e' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1c1c1e' },
  camera: { flex: 1 },
  overlay: {
    position: 'absolute',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#2c2c2e',
    padding: 12,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  text: { color: '#fff', fontSize: 16, fontWeight: '600' },
  preview: {
    width: 200,
    height: 200,
    margin: 10,
    borderWidth: 1,
    borderColor: '#666',
    alignSelf: 'center',
    position: 'absolute',
    top: 50,
    right: 10,
    borderRadius: 8,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
  },
});
