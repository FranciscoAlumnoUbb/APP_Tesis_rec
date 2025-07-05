import { useRouter } from 'expo-router';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();

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
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>
            
          </Text>
          <Text style={styles.title}>
            Recycl<Text style={styles.titleAccent}>AI</Text>Deep
          </Text>

          <Image source={require('../../assets/images/robot_recyclaideep.png')} style={styles.robot} />

          <Text style={styles.subtitle}>
            ⚡ Impulsado por <Text style={styles.titleAccent}>Inteligencia Artificial</Text>{'\n'}
            para un planeta más limpio 🌍♻️
          </Text>

          <View style={styles.grid}>
            {items.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.card,
                  {
                    backgroundColor: `${item.color}`, // Fondo translúcido
                    borderColor: item.color,
                    shadowColor: item.color,

                  },
                ]}
              >
                <MaterialCommunityIcons
                  name={item.icon as any}
                  size={36}
                  color="black"
                />
                <Text style={[styles.cardText, { color: item.textColor || '#000' }]}>
                  {item.name}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
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
  scrollContent: {
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 100,
    alignItems: 'center',
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  card: {
    width: 110,
    height: 110,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 6,
    borderWidth: 2,
    elevation: 10,
    shadowOpacity: 0.6,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  cardText: {
    marginTop: 6,
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
});
