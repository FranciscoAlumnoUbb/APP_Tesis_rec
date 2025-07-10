import { useRouter } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();
  const { width: screenWidth } = Dimensions.get('window');
  
  // Calcular el tamaño de las tarjetas basado en el ancho de pantalla
  const cardSize = Math.min((screenWidth - 60) / 3, 120); // 60px para padding y gaps, máximo 120px

  const items = [
    { name: 'Lata', icon: 'trash-can', color: '#0CE3AC' },
    { name: 'Botella', icon: 'bottle-soda', color: '#1BB4FF' },
    { name: 'Vidrio', icon: 'glass-fragile', color: '#14B8A6' },
    { name: 'Pila', icon: 'battery', color: '#8B5CF6' },
    { name: 'Papel', icon: 'file-document-outline', color: '#FDE047', textColor: '#000' },
    { name: 'Cartón', icon: 'package-variant', color: '#F59E0B' },
  ];

  return (
    <ImageBackground
      source={require('../../assets/images/background_ai.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header fijo con título y robot */}
        <View style={styles.header}>
          <Text style={styles.title}>
            Recycl<Text style={styles.titleAccent}>AI</Text>Deep
          </Text>

          <Image source={require('../../assets/images/robot_recyclaideep.png')} style={styles.robot} />

          <Text style={styles.subtitle}>
            ⚡ Impulsado por <Text style={styles.titleAccent}>Inteligencia Artificial</Text>{'\n'}
            para un planeta más limpio 🌍♻️
          </Text>
        </View>

        {/* Cuadrícula estática 2x3 (sin scroll) */}
        <View style={styles.gridContainer}>
          {/* Fila 1 */}
          <View style={styles.row}>
            {items.slice(0, 3).map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.card,
                  {
                    backgroundColor: item.color,
                    borderColor: item.color,
                    shadowColor: item.color,
                    width: cardSize,
                    height: cardSize,
                  },
                ]}
                onPress={() => router.push('/camera')}
              >
                <MaterialCommunityIcons
                  name={item.icon as any}
                  size={cardSize * 0.32} // Icono proporcional al tamaño de la tarjeta
                  color="black"
                />
                <Text style={[
                  styles.cardText, 
                  { 
                    color: item.textColor || '#000',
                    fontSize: cardSize * 0.12, // Texto proporcional al tamaño de la tarjeta
                  }
                ]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {/* Fila 2 */}
          <View style={styles.row}>
            {items.slice(3, 6).map((item, index) => (
              <TouchableOpacity
                key={index + 3}
                style={[
                  styles.card,
                  {
                    backgroundColor: item.color,
                    borderColor: item.color,
                    shadowColor: item.color,
                    width: cardSize,
                    height: cardSize,
                  },
                ]}
                onPress={() => router.push('/camera')}
              >
                <MaterialCommunityIcons
                  name={item.icon as any}
                  size={cardSize * 0.32} // Icono proporcional al tamaño de la tarjeta
                  color="black"
                />
                <Text style={[
                  styles.cardText, 
                  { 
                    color: item.textColor || '#000',
                    fontSize: cardSize * 0.12, // Texto proporcional al tamaño de la tarjeta
                  }
                ]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // Fondo semi-transparente para destacar el header
  },
  gridContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 100, // Espacio para la barra de tabs
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#84F997',
    marginBottom: 10,
  },
  titleAccent: {
    color: '#38BDF8',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#D1FAE5',
    marginBottom: 20,
  },
  robot: {
    width: 200,
    height: 280,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  card: {
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    elevation: 10,
    shadowOpacity: 0.6,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    marginHorizontal: 5,
  },
  cardText: {
    marginTop: 6,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
