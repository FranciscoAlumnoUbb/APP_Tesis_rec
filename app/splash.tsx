// app/splash.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function SplashScreen() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const setup = async () => {
      try {
        console.log('⏳ Preparando aplicación...');
      } catch (e) {
        console.error('❌ Error durante inicialización:', e);
      } finally {
        setLoading(false);
        router.replace('/');
      }
    };
    setup();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>♻️ Cargando modelo IA...</Text>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1c1c1e' },
  text: { color: '#fff', marginBottom: 20, fontSize: 18 },
});
