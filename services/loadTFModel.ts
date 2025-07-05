// services/loadTFModel.ts
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import * as FileSystem from 'expo-file-system';
import * as jpeg from 'jpeg-js';

// Cargar solo una vez
let model: tf.GraphModel | null = null;

export const loadTFJSModel = async () => {
  if (!model) {
    console.log('📦 Inicializando TensorFlow...');
    await tf.ready();
    const modelJson = `${FileSystem.bundleDirectory}assets/raw_model/model.json`;
    console.log('📥 Cargando archivos del modelo desde bundle...');
    model = await tf.loadGraphModel(modelJson);
    console.log('✅ Modelo cargado exitosamente (offline)');
  } else {
    console.log('ℹ️ Modelo ya estaba cargado en caché');
  }
  return model;
};

const uriToTensor = async (uri: string): Promise<tf.Tensor4D> => {
  const imgB64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const rawImageData = Buffer.from(imgB64, 'base64');
  const { width, height, data } = jpeg.decode(rawImageData, { useTArray: true });

  const buffer = new Uint8Array(width * height * 3);
  let offset = 0;
  for (let i = 0; i < data.length; i += 4) {
    buffer[offset++] = data[i];     // R
    buffer[offset++] = data[i + 1]; // G
    buffer[offset++] = data[i + 2]; // B
  }

  const imgTensor = tf.tensor3d(buffer, [height, width, 3], 'int32');
  const resized = tf.image.resizeBilinear(imgTensor, [640, 640]).div(255);
  return resized.expandDims(0) as tf.Tensor4D; // [1, 640, 640, 3]
};

export const predictOffline = async (uri: string) => {
  try {
    console.log('🧠 Forzado: usando predicción OFFLINE');
    const model = await loadTFJSModel();
    const input = await uriToTensor(uri); // [1,640,640,3]

    const output = model.execute({ images: input }) as tf.Tensor;

    if (!output || !(output instanceof tf.Tensor)) {
      console.error('❌ Output del modelo no es tensor válido');
      return { detections: [] };
    }

    const raw = await output.array();
    const predictions = raw as number[][];

    const labels = ['carton', 'metal', 'papel', 'pila', 'plastico', 'vidrio'];

    const detections = predictions
      .filter((pred) => pred[4] > 0.5) // filtrar por confianza
      .map((pred) => ({
        box: pred.slice(0, 4), // [x1, y1, x2, y2]
        confidence: pred[4],
        label: labels[Math.round(pred[5])] || 'desconocido',
      }));

    return { detections };
  } catch (error) {
    console.error('❌ Error durante la predicción offline:', error);
    return { detections: [] };
  }
};

