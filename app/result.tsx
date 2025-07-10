import { useLocalSearchParams, useRouter } from 'expo-router';
import NeuralNetworkBackground from '@/components/NeuralNetworkBackground';
import React, { useState } from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';

const classColors: Record<string, string> = {
  plastico: '#00ff00',
  carton: '#ff8800',
  vidrio: '#00ffff',
  metal: '#ff00ff',
  papel: '#ffffff',
  pila: '#ffff00',
  otro: '#ff0000',
};

const classIcons: Record<string, string> = {
  plastico: '🧴',
  carton: '📦',
  vidrio: '🫙',
  metal: '🔩',
  papel: '📄',
  pila: '🔋',
  otro: '❓',
};

export default function ResultScreen() {
  const { uri, boundingBoxes } = useLocalSearchParams();
  const router = useRouter();

  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  // Manejo seguro del parsing de boundingBoxes
  let boxes = [];
  try {
    const boundingBoxesParam = Array.isArray(boundingBoxes) ? boundingBoxes[0] : boundingBoxes;
    if (boundingBoxesParam && typeof boundingBoxesParam === 'string') {
      boxes = JSON.parse(boundingBoxesParam);
    }
  } catch (error) {
    console.error('Error parsing boundingBoxes:', error);
    boxes = [];
  }
  
  // Asegurar que boxes es un array
  if (!Array.isArray(boxes)) {
    boxes = [];
  }
  const imageUri = Array.isArray(uri) ? uri[0] : uri;

  const classCount: Record<string, number> = {};
  boxes.forEach((box: any) => {
    const label = box.label || box.clase || 'otro';
    classCount[label] = (classCount[label] || 0) + 1;
  });

  return (
    <View style={styles.container}>
      <NeuralNetworkBackground classes={Object.keys(classCount)} />

      <Text style={styles.title}>♻️ Material detectado</Text>
      <Text style={styles.subtitle}>🔍 Objetos encontrados: {boxes.length}</Text>

      <Text style={styles.classSummary}>
        {Object.entries(classCount)
          .map(([label, count]) => `${classIcons[label] || ''} ${label}: ${count}`)
          .join('   ')}
      </Text>

      {imageUri && (
        <View style={styles.imageWrapper}>
          <ImageBackground
            source={{ uri: imageUri }}
            resizeMode="contain"
            onLayout={(event) => {
              const { width, height } = event.nativeEvent.layout;
              setImageSize({ width, height });
            }}
            style={styles.imageBackground}
          >
            {boxes.map((box: any, idx: number) => {
              // Manejo seguro del bounding box
              const boxCoords = box.box || box.bbox || [0, 0, 100, 100];
              const [x1, y1, x2, y2] = Array.isArray(boxCoords) ? boxCoords : [0, 0, 100, 100];
              const label = box.label || box.clase || 'desconocido';
              const color = classColors[label] || '#00ffff';
              const confidence = box.confidence ?? box.confianza ?? 0;

              const left = (x1 / 640) * imageSize.width;
              const top = (y1 / 640) * imageSize.height;
              const width = ((x2 - x1) / 640) * imageSize.width;
              const height = ((y2 - y1) / 640) * imageSize.height;

              return (
                <View key={idx}>
                  <View
                    style={{
                      position: 'absolute',
                      left,
                      top,
                      width,
                      height,
                      borderWidth: 3,
                      borderColor: color,
                      borderRadius: 4,
                    }}
                  />
                  <View
                    style={{
                      position: 'absolute',
                      left,
                      top: Math.max(top - 24, 2),
                      backgroundColor: '#101010cc',
                      borderColor: color,
                      borderWidth: 1.5,
                      borderRadius: 6,
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                    }}
                  >
                    <Text
                      style={{
                        color: color,
                        fontWeight: 'bold',
                        fontSize: 13,
                        textShadowColor: '#000',
                        textShadowOffset: { width: 1, height: 1 },
                        textShadowRadius: 2,
                      }}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {classIcons[label] || ''} {label} ({(confidence * 100).toFixed(1)}%)
                    </Text>
                  </View>
                </View>
              );
            })}
          </ImageBackground>
        </View>
      )}

      <Pressable style={styles.button} onPress={() => router.replace('/')}>
        <Text style={styles.buttonText}>VOLVER</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f0d',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    position: 'relative',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00ff99',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#bbb',
    marginVertical: 4,
  },
  classSummary: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 12,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 1,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#000',
  },
  imageBackground: {
    flex: 1,
  },
  button: {
    backgroundColor: '#007bff',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
