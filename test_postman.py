# test_postman.py

import requests

# ✅ Ruta a la imagen que quieres enviar
IMAGE_PATH = "test.jpg"

# ✅ URL pública o de red local
API_URL = "http://127.0.0.1:5000/predict"  # ⚠️ cambia a IP local si usas celular

# Enviar imagen
with open(IMAGE_PATH, "rb") as f:
    files = {"image": ("test.jpg", f, "image/jpeg")}
    print(f"📤 Enviando imagen a {API_URL}...")
    
    response = requests.post(API_URL, files=files)

# Mostrar respuesta
print("📥 Respuesta del servidor:")
try:
    print(response.json())
except Exception as e:
    print(f"❌ Error al parsear JSON: {e}")
    print(response.text)
