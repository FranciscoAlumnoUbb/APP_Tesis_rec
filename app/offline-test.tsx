import { useEffect, useState } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { loadTFJSModel } from '../services/loadTFModel';

export default function OfflineTest() {
  const [status, setStatus] = useState('Cargando modelo...');

  useEffect(() => {
    const init = async () => {
      try {
        const model = await loadTFJSModel();
        if (model) setStatus('✅ Modelo cargado correctamente');
        else setStatus('❌ Falló la carga del modelo');
      } catch (e) {
        console.error(e);
        setStatus('❌ Error general al iniciar');
      }
    };
    init();
  }, []);

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 18 }}>{status}</Text>
    </ScrollView>
  );
}
