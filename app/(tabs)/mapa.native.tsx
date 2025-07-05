import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Alert,
  Button,
  Text,
  Linking
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import puntosLimpios from '../../data/puntos_limpios.json';

export default function MapaNativo() {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [region, setRegion] = useState<Region | null>(null);
  const [nearestPoint, setNearestPoint] = useState<typeof puntosLimpios[0] | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Se necesita acceso a la ubicación para usar el mapa.');
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync({});
      setLocation(coords);
      setRegion({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });

      // Calcular el punto más cercano
      let masCercano = null;
      let minDistancia = Infinity;

      for (const punto of puntosLimpios) {
        const distancia = getDistanceKm(
          coords.latitude,
          coords.longitude,
          punto.lat,
          punto.lng
        );
        if (distancia < minDistancia) {
          minDistancia = distancia;
          masCercano = punto;
        }
      }

      setNearestPoint(masCercano);
    })();
  }, []);

  function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  if (!region || !location) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#007aff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        showsUserLocation={true}
      >
        {puntosLimpios.map((punto, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: punto.lat, longitude: punto.lng }}
            title={punto.nombre}
            description={punto.direccion}
          />
        ))}
      </MapView>

      {nearestPoint && (
        <View style={styles.card}>
          <Text style={styles.title}>📍 Punto más cercano</Text>
          <Text>{nearestPoint.nombre}</Text>
          <Text style={styles.subtitle}>{nearestPoint.direccion}</Text>
          <Button
            title="Ir con Google Maps"
            onPress={() =>
              Linking.openURL(
                `https://www.google.com/maps/dir/?api=1&destination=${nearestPoint.lat},${nearestPoint.lng}`
              )
            }
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: { flex: 1 },
  card: {
    backgroundColor: '#fff',
    padding: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  title: { fontWeight: 'bold', fontSize: 16 },
  subtitle: { fontSize: 13, color: '#666', marginBottom: 6 },
});
