import { Button, Linking, StyleSheet, Text, View } from 'react-native';

export default function MapaWeb() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        🌐 El mapa no está disponible en navegador.
      </Text>
      <Button
        title="Abrir Google Maps"
        onPress={() => Linking.openURL('https://www.google.com/maps/search/punto+limpio')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  text: { fontSize: 16, marginBottom: 12, textAlign: 'center' },
});
