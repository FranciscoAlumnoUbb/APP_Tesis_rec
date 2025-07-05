# ♻️ RecyclAIDeep - Aplicación de Reciclaje Inteligente

Una aplicación móvil que utiliza inteligencia artificial para detectar y clasificar residuos reciclables mediante visión por computadora.

## � Características

- **Detección en tiempo real**: Usa la cámara para identificar residuos reciclables
- **Clasificación inteligente**: Detecta botellas, latas, cajas, papel, vidrio y más
- **Modo Online/Offline**: Funciona con API backend o modelo local
- **Mapa de puntos limpios**: Encuentra centros de reciclaje cercanos
- **Sistema de recompensas**: Gamificación para incentivar el reciclaje
- **Interfaz moderna**: UI/UX optimizada con React Native y Expo

## 🛠️ Tecnologías

### Frontend
- **React Native** con Expo Router
- **TypeScript** para tipado seguro
- **TensorFlow.js** para predicción offline
- **React Native Maps** para geolocalización
- **Expo Camera** para captura de imágenes

### Backend
- **FastAPI** (Python) para API REST
- **YOLOv5** para detección de objetos
- **PyTorch** para procesamiento de ML
- **OpenCV** para procesamiento de imágenes

## 📦 Instalación

### Prerequisitos
- Node.js (≥ 18)
- Python (≥ 3.8)
- Git

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/recyclaideep.git
cd recyclaideep
```

### 2. Configurar Frontend
```bash
# Instalar dependencias
npm install

# Actualizar IP automáticamente
npm run update-ip

# Iniciar aplicación
npm run dev
```

### 3. Configurar Backend
```bash
# Navegar al directorio del backend
cd api/backend/model

# Instalar dependencias Python
pip install -r requirements.txt

# Clonar YOLOv5 (requerido)
git clone https://github.com/ultralytics/yolov5.git

# Descargar modelo (necesario - no incluido en repo)
# Coloca tu archivo best.pt en este directorio

# Iniciar servidor
uvicorn main:app --host 0.0.0.0 --port 5000
```

## 🎯 Uso

1. **Inicia el backend**: `uvicorn main:app --host 0.0.0.0 --port 5000`
2. **Inicia la app**: `npm run dev`
3. **Abre en tu dispositivo**: Escanea el QR con Expo Go
4. **Toma fotos**: Usa la cámara para detectar residuos
5. **Ve resultados**: Recibe clasificación y sugerencias

## 📁 Estructura del Proyecto

```
recyclaideep/
├── app/                    # Pantallas principales
│   ├── (tabs)/            # Navegación por pestañas
│   ├── _layout.tsx        # Layout raíz
│   └── result.tsx         # Pantalla de resultados
├── api/                   # Backend API
│   └── backend/model/     # Servidor FastAPI + YOLOv5
├── assets/                # Recursos estáticos
│   ├── images/           # Imágenes de la app
│   └── model/            # Modelos ML (no incluidos)
├── components/            # Componentes reutilizables
├── constants/             # Configuraciones
├── services/              # Lógica de API y ML
└── utils/                 # Utilidades
```

## 🔧 Configuración

### Variables de entorno
El archivo `constants/config.ts` contiene:
```typescript
export const API_URL = 'http://TU_IP:5000';
```

### Modelos necesarios
- `best.pt` - Modelo YOLOv5 entrenado (no incluido)
- `best_float16.tflite` - Modelo TensorFlow Lite (no incluido)

## 🚀 Despliegue

### Frontend (Expo)
```bash
# Build para producción
npx expo build

# Publish to Expo
npx expo publish
```

### Backend
```bash
# Usando Docker
docker build -t recyclaideep-api .
docker run -p 5000:5000 recyclaideep-api

# O usando servicios cloud (AWS, GCP, etc.)
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Autores

- **Tu Nombre** - *Desarrollo inicial* - [tu-usuario](https://github.com/tu-usuario)

## 🙏 Agradecimientos

- YOLOv5 por el modelo base de detección
- Expo team por el framework móvil
- FastAPI por el framework backend
- Comunidad open source

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
