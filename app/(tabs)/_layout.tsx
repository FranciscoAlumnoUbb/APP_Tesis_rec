import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme?.() || 'light';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0F172A',
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#38BDF8',
          shadowOpacity: 0.3,
          shadowRadius: 10,
        },
        tabBarInactiveTintColor: '#64748B',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Inicio',
          tabBarActiveTintColor: '#4ADE80', // Verde
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="camera" 
        options={{ 
          title: 'Detectar residuo',
          tabBarActiveTintColor: '#38BDF8', // Azul
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="camera" size={size} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="mapa" 
        options={{ 
          title: 'Puntos de reciclaje',
          tabBarActiveTintColor: '#F87171', // Rojo suave
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="location" size={size} color={color} />
          ),
        }} 
      />
    </Tabs>
  );
}
