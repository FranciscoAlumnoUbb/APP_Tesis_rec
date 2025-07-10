// services/loadTFModel.ts
// TEMPORALMENTE DESHABILITADO - Falta instalar TensorFlow.js

export const loadTFJSModel = async () => {
  console.log('⚠️ TensorFlow.js no está configurado. Usando solo predicción online.');
  return null;
};

export const predictOffline = async (uri: string) => {
  console.log('⚠️ Predicción offline no disponible. Usando predicción online.');
  throw new Error('Predicción offline no disponible');
};
