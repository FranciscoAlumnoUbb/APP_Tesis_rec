import { Platform } from 'react-native';

// ✅ Carga segura con require para que Metro no analice el archivo equivocado
const Mapa =
  Platform.OS === 'web'
    ? require('./mapa.web').default
    : require('./mapa.native').default;

export default Mapa;
