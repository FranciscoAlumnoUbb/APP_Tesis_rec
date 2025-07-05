import os
import torch
import pathlib
import base64

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, HTMLResponse
from pydantic import BaseModel
from PIL import Image
from io import BytesIO
from datetime import datetime

# Compatibilidad con rutas en Windows
pathlib.PosixPath = pathlib.WindowsPath

# Directorios y rutas
UPLOAD_DIR = "uploads"
RESULT_DIR = "results"
MODEL_PATH = "best.pt"
import os
YOLO_REPO_PATH = os.path.join(os.path.dirname(__file__), "yolov5")

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(RESULT_DIR, exist_ok=True)

# Verificar si el modelo existe
if not os.path.isfile(MODEL_PATH):
    raise FileNotFoundError(f"⚠️ Modelo no encontrado en: {MODEL_PATH}")

# Cargar modelo YOLOv5
print("🔄 Cargando modelo YOLOv5...")
model = torch.hub.load(YOLO_REPO_PATH, "custom", path=MODEL_PATH, source="local")
model.conf = 0.2  # Umbral de confianza ajustado
print("✅ Modelo cargado correctamente.")

# Inicializar FastAPI
app = FastAPI()

# Permitir CORS para desarrollo local
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelo para JSON con base64
class Base64Image(BaseModel):
    image: str  # Imagen codificada en base64

@app.get("/")
def root():
    return HTMLResponse("""
        <html>
            <head><title>RecyclAIDeep API</title></head>
            <body style='font-family:sans-serif'>
                <h1>♻️ RecyclAIDeep API Activa</h1>
                <p>POST /predict para archivos o /predict_base64 para imágenes base64.</p>
            </body>
        </html>
    """)

@app.post("/predict")
async def predict(image: UploadFile = File(...)):
    try:
        print(f"📥 Imagen recibida desde móvil: {image.filename}")
        contents = await image.read()

        pil_image = Image.open(BytesIO(contents)).convert("RGB")
        pil_image = pil_image.resize((640, 640))

        filename = datetime.now().strftime("%Y%m%d_%H%M%S_") + image.filename
        image_path = os.path.join(UPLOAD_DIR, filename)
        pil_image.save(image_path)

        results = model(image_path)

        detections = []
        for *box, conf, cls in results.xyxy[0]:
            x1, y1, x2, y2 = map(int, box)
            detections.append({
                "label": model.names[int(cls)],
                "confidence": float(conf),
                "box": [x1, y1, x2, y2],
            })

        print(f"✅ Detecciones (móvil): {len(detections)}")
        return JSONResponse(content={"detections": detections})
    except Exception as e:
        print(f"❌ Error en /predict: {e}")
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.post("/predict_base64")
async def predict_base64(payload: Base64Image):
    try:
        print("📡 Imagen base64 recibida desde web.")
        image_data = base64.b64decode(payload.image)
        pil_image = Image.open(BytesIO(image_data)).convert("RGB")

        # Opcional: redimensionar (comenta para pruebas)
        # pil_image = pil_image.resize((640, 640))

        # Guardar imagen recibida para análisis visual
        debug_path = os.path.join(UPLOAD_DIR, "debug_web.jpg")
        pil_image.save(debug_path)
        print(f"💾 Imagen guardada en: {debug_path}")

        # Ejecutar detección
        results = model(pil_image)

        detections = []
        for *box, conf, cls in results.xyxy[0]:
            x1, y1, x2, y2 = map(int, box)
            detections.append({
                "label": model.names[int(cls)],
                "confidence": float(conf),
                "box": [x1, y1, x2, y2],
            })

        print(f"✅ Detecciones (web): {len(detections)}")
        return JSONResponse(content={"detections": detections})
    except Exception as e:
        print(f"❌ Error en /predict_base64: {e}")
        return JSONResponse(content={"error": str(e)}, status_code=500)
