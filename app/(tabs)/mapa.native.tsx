import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Alert,
  Button,
  Text,
  Linking,
  ScrollView,
  TouchableOpacity,
  Modal
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import puntosLimpios from '../../data/puntos_limpios.json';

// Tipos de materiales disponibles
const TIPOS_MATERIALES = [
  'Mostrar todos',
  'Cartón',
  'Papel',
  'Plástico',
  'Vidrio',
  'Metal',
  'Pilas'
];

export default function MapaNativo() {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [region, setRegion] = useState<Region | null>(null);
  const [nearestPoint, setNearestPoint] = useState<typeof puntosLimpios[0] | null>(null);
  const [filtroMaterial, setFiltroMaterial] = useState<string>('Mostrar todos');
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);

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

      // Calcular el punto más cercano inicial
      const puntosFiltrados = puntosLimpios; // Mostrar todos inicialmente
      const masCercano = calcularPuntoMasCercano(puntosFiltrados);
      setNearestPoint(masCercano);
    })();
  }, []);

  // Función para filtrar puntos según el material seleccionado
  function filtrarPuntos() {
    if (filtroMaterial === 'Mostrar todos') {
      return puntosLimpios;
    }
    
    // Mapear los nombres de filtros a los nombres en los datos
    const materialesMap: { [key: string]: string[] } = {
      'Cartón': ['Cartón'],
      'Papel': ['Papel'],
      'Plástico': ['PET', 'Plástico'],
      'Vidrio': ['Vidrio'],
      'Metal': ['Latas', 'Metal'],
      'Pilas': ['Pilas']
    };
    
    const materialesBusqueda = materialesMap[filtroMaterial] || [filtroMaterial];
    
    return puntosLimpios.filter(punto => 
      materialesBusqueda.some(material => punto.materiales.includes(material))
    );
  }

  // Función para calcular el punto más cercano del filtro actual
  function calcularPuntoMasCercano(puntosFiltrados: typeof puntosLimpios) {
    if (!location || puntosFiltrados.length === 0) return null;

    let masCercano = null;
    let minDistancia = Infinity;

    for (const punto of puntosFiltrados) {
      const distancia = getDistanceKm(
        location.latitude,
        location.longitude,
        punto.lat,
        punto.lng
      );
      if (distancia < minDistancia) {
        minDistancia = distancia;
        masCercano = punto;
      }
    }
    return masCercano;
  }

  // Efecto para actualizar el punto más cercano cuando cambia el filtro
  useEffect(() => {
    if (location) {
      const puntosFiltrados = filtrarPuntos();
      setNearestPoint(calcularPuntoMasCercano(puntosFiltrados));
    }
  }, [filtroMaterial, location]);

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
      {/* Filtro desplegable */}
      <View style={styles.filtroContainer}>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => {
            console.log('Dropdown clicked, current state:', dropdownVisible);
            setDropdownVisible(!dropdownVisible);
          }}
        >
          <Text style={styles.dropdownButtonText}>{filtroMaterial}</Text>
          <Text style={styles.dropdownArrow}>{dropdownVisible ? '▲' : '▼'}</Text>
        </TouchableOpacity>
      </View>

      {/* Modal para el dropdown */}
      <Modal
        visible={dropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setDropdownVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.dropdownList}>
              <Text style={styles.dropdownTitle}>Seleccionar Material:</Text>
              {TIPOS_MATERIALES.map((material, index) => (
                <TouchableOpacity
                  key={material}
                  style={[
                    styles.dropdownItem,
                    filtroMaterial === material && styles.dropdownItemActive,
                    index === TIPOS_MATERIALES.length - 1 && styles.dropdownItemLast
                  ]}
                  onPress={() => {
                    console.log('Material selected:', material);
                    setFiltroMaterial(material);
                    setDropdownVisible(false);
                  }}
                >
                  <Text style={[
                    styles.dropdownItemText,
                    filtroMaterial === material && styles.dropdownItemTextActive
                  ]}>
                    {material}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        showsUserLocation={true}
      >
        {filtrarPuntos().map((punto, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: punto.lat, longitude: punto.lng }}
            title={punto.nombre}
            description={`${punto.direccion} - Materiales: ${punto.materiales.join(', ')}`}
          />
        ))}
      </MapView>

      {nearestPoint && (
        <View style={styles.card}>
          <Text style={styles.title}>📍 Punto más cercano</Text>
          <Text style={styles.nombrePunto}>{nearestPoint.nombre}</Text>
          <Text style={styles.subtitle}>{nearestPoint.direccion}</Text>
          <Text style={styles.materialesTexto}>
            Materiales: {nearestPoint.materiales.join(', ')}
          </Text>
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
    padding: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  title: { 
    fontWeight: 'bold', 
    fontSize: 16,
    marginBottom: 8
  },
  subtitle: { 
    fontSize: 13, 
    color: '#666', 
    marginBottom: 6 
  },
  nombrePunto: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333'
  },
  materialesTexto: {
    fontSize: 12,
    color: '#007aff',
    marginBottom: 10,
    fontStyle: 'italic'
  },
  filtroContainer: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
  },
  dropdownButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d0d0d0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
  },
  dropdownButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  modalContainer: {
    marginTop: 70, // Posicionar debajo del botón
    width: '90%',
    maxWidth: 400,
  },
  dropdownList: {
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    maxHeight: 300,
  },
  dropdownTitle: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemLast: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  dropdownItemActive: {
    backgroundColor: '#007aff',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  dropdownItemTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
});
