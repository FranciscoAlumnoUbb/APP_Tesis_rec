import requests
import os
import json
from pathlib import Path

# Configuración
BACKEND_URL = "http://192.168.1.92:8000"
HEALTH_ENDPOINT = f"{BACKEND_URL}/health"
PREDICT_ENDPOINT = f"{BACKEND_URL}/predict"
PREDICT_BASE64_ENDPOINT = f"{BACKEND_URL}/predict_base64"

def test_health():
    """Prueba el endpoint de salud"""
    print("🩺 Probando endpoint de salud...")
    try:
        response = requests.get(HEALTH_ENDPOINT, timeout=5)
        print(f"✅ Status: {response.status_code}")
        print(f"📊 Response: {response.json()}")
        return True
    except requests.exceptions.RequestException as e:
        print(f"❌ Error: {e}")
        return False

def test_predict_empty():
    """Prueba el endpoint predict con datos vacíos"""
    print("\n🎯 Probando endpoint predict con datos vacíos...")
    try:
        response = requests.post(PREDICT_ENDPOINT, json={}, timeout=10)
        print(f"📊 Status: {response.status_code}")
        print(f"📊 Response: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Error: {e}")

def test_predict_formdata_empty():
    """Prueba el endpoint predict con FormData vacío"""
    print("\n📋 Probando endpoint predict con FormData vacío...")
    try:
        response = requests.post(PREDICT_ENDPOINT, files={}, timeout=10)
        print(f"📊 Status: {response.status_code}")
        print(f"📊 Response: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Error: {e}")

def test_predict_with_image_field():
    """Prueba el endpoint predict con campo 'image'"""
    print("\n🖼️ Probando endpoint predict con campo 'image'...")
    try:
        # Crear un archivo de imagen falso
        fake_image_content = b"fake image content"
        files = {'image': ('test.jpg', fake_image_content, 'image/jpeg')}
        
        response = requests.post(PREDICT_ENDPOINT, files=files, timeout=10)
        print(f"📊 Status: {response.status_code}")
        print(f"📊 Response: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Error: {e}")

def test_predict_with_file_field():
    """Prueba el endpoint predict con campo 'file'"""
    print("\n📄 Probando endpoint predict con campo 'file'...")
    try:
        # Crear un archivo de imagen falso
        fake_image_content = b"fake image content"
        files = {'file': ('test.jpg', fake_image_content, 'image/jpeg')}
        
        response = requests.post(PREDICT_ENDPOINT, files=files, timeout=10)
        print(f"📊 Status: {response.status_code}")
        print(f"📊 Response: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Error: {e}")

def test_predict_base64_empty():
    """Prueba el endpoint predict_base64 con datos vacíos"""
    print("\n🔤 Probando endpoint predict_base64 con datos vacíos...")
    try:
        response = requests.post(PREDICT_BASE64_ENDPOINT, json={}, timeout=10)
        print(f"📊 Status: {response.status_code}")
        print(f"📊 Response: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Error: {e}")

def test_predict_base64_with_image():
    """Prueba el endpoint predict_base64 con campo 'image'"""
    print("\n🖼️🔤 Probando endpoint predict_base64 con campo 'image'...")
    try:
        # Crear base64 falso
        fake_base64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
        data = {"image": fake_base64}
        
        response = requests.post(PREDICT_BASE64_ENDPOINT, json=data, timeout=10)
        print(f"📊 Status: {response.status_code}")
        print(f"📊 Response: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Error: {e}")

def main():
    print("🧪 Iniciando pruebas del backend...")
    print(f"🌐 Backend URL: {BACKEND_URL}")
    print("=" * 50)
    
    # Prueba básica de salud
    if not test_health():
        print("❌ El backend no está disponible. Verifica que esté ejecutándose.")
        return
    
    # Pruebas de endpoints
    test_predict_empty()
    test_predict_formdata_empty()
    test_predict_with_image_field()
    test_predict_with_file_field()
    test_predict_base64_empty()
    test_predict_base64_with_image()
    
    print("\n🎉 Pruebas completadas!")
    print("📝 Revisa los resultados arriba para identificar qué formato funciona.")

if __name__ == "__main__":
    main()
