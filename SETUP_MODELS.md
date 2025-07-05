# 🤖 Configuración de Modelos ML

Los modelos de Machine Learning no están incluidos en el repositorio debido a su tamaño. Sigue estos pasos para configurarlos:

## 📋 Modelos Necesarios

### 1. Modelo YOLOv5 (Backend)
**Archivo**: `api/backend/model/best.pt`
- Modelo entrenado para detección de residuos reciclables
- Tamaño: ~14MB
- Formato: PyTorch (.pt)

### 2. Modelo TensorFlow Lite (Frontend)
**Archivo**: `assets/model/best_float16.tflite`
- Modelo optimizado para dispositivos móviles
- Tamaño: ~7MB
- Formato: TensorFlow Lite (.tflite)

### 3. Modelo TFJS (Frontend Web)
**Archivo**: `assets/model/tfjs_model.zip`
- Modelo para ejecución en navegadores web
- Tamaño: ~25MB
- Formato: TensorFlow.js

## 🔧 Configuración

### Backend (YOLOv5)
```bash
cd api/backend/model

# 1. Clonar YOLOv5
git clone https://github.com/ultralytics/yolov5.git

# 2. Instalar dependencias
pip install -r requirements.txt

# 3. Colocar modelo best.pt en este directorio
# (descargar desde tu fuente de entrenamiento)

# 4. Verificar que funciona
python -c "import torch; print('PyTorch OK')"
```

### Frontend (TensorFlow Lite)
```bash
# 1. Crear directorio de modelos
mkdir -p assets/model

# 2. Colocar modelos:
# - best_float16.tflite
# - tfjs_model.zip (descomprimir en assets/raw_model/)

# 3. Verificar estructura:
assets/
├── model/
│   └── best_float16.tflite
└── raw_model/
    ├── model.json
    └── group1-shard*.bin
```

## 🎯 Entrenamiento (Opcional)

Si quieres entrenar tu propio modelo:

### 1. Preparar Dataset
```bash
# Estructura recomendada:
dataset/
├── images/
│   ├── train/
│   └── val/
└── labels/
    ├── train/
    └── val/
```

### 2. Entrenar YOLOv5
```bash
cd api/backend/model/yolov5

python train.py \
  --data ../dataset.yaml \
  --weights yolov5s.pt \
  --epochs 100 \
  --batch-size 16 \
  --img-size 640
```

### 3. Convertir a TensorFlow Lite
```bash
python export.py \
  --weights best.pt \
  --include tflite \
  --int8
```

## 🔍 Verificación

### Probar Backend
```bash
cd api/backend/model
uvicorn main:app --host 0.0.0.0 --port 5000

# En otra terminal:
curl -X GET http://localhost:5000/docs
```

### Probar Frontend
```bash
npm run dev

# La app debe mostrar:
# - Cámara funcional
# - Detección online/offline
# - Navegación a resultados
```

## 🚨 Troubleshooting

### Error: "best.pt not found"
- Verifica que el archivo esté en `api/backend/model/best.pt`
- Comprueba permisos de lectura

### Error: "Module not found: yolov5"
- Asegúrate de haber clonado YOLOv5 en `api/backend/model/yolov5/`
- Verifica que no esté en `.gitignore`

### Error: "TensorFlow model not loaded"
- Comprueba que `best_float16.tflite` esté en `assets/model/`
- Verifica compatibilidad con TensorFlow.js

## 📞 Soporte

Si tienes problemas con la configuración:
1. Revisa que todas las dependencias estén instaladas
2. Verifica las rutas de los archivos
3. Comprueba los logs de la aplicación
4. Abre un issue en GitHub con detalles del error

## 🎓 Referencias

- [YOLOv5 Documentation](https://github.com/ultralytics/yolov5)
- [TensorFlow Lite Guide](https://www.tensorflow.org/lite)
- [Expo ML Kit](https://docs.expo.dev/versions/latest/sdk/ml-kit/)
