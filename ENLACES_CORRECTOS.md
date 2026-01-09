# 🔗 Enlaces Correctos para Habilitar APIs

## ⚠️ Importante

Los enlaces con project ID específico pueden fallar si no tienes acceso a ese proyecto. Usa estos enlaces genéricos que funcionan con cualquier proyecto.

## 🗺️ Maps JavaScript API

### Método 1: Biblioteca de APIs (Recomendado)
1. Ve a: **https://console.cloud.google.com/apis/library**
2. Asegúrate de estar en el proyecto correcto (el que tiene tu API key)
3. Busca: `Maps JavaScript API`
4. Haz clic en el resultado
5. Presiona **"ENABLE"**

### Método 2: Búsqueda Directa
1. Ve a: **https://console.cloud.google.com/apis/library/maps-javascript-backend.googleapis.com**
2. Si te pide seleccionar proyecto, elige el que tiene tu API key
3. Presiona **"ENABLE"**

## 📍 Places API (New)

1. Ve a: **https://console.cloud.google.com/apis/library/places.googleapis.com**
2. Selecciona tu proyecto
3. Presiona **"ENABLE"**

## 🧭 Directions API

1. Ve a: **https://console.cloud.google.com/apis/library/directions-backend.googleapis.com**
2. Selecciona tu proyecto
3. Presiona **"ENABLE"**

## 🔑 Cómo Encontrar tu Proyecto Correcto

Si no sabes cuál es tu proyecto:

1. Ve a: **https://console.cloud.google.com/apis/credentials**
2. Busca tu API key (la que empieza con `AIzaSyAa4MsbGWQcxalaTtI9TI52FuG5bFeqFbI`)
3. En la columna "Project", verás el nombre del proyecto
4. Haz clic en el nombre del proyecto para ir a ese proyecto
5. Luego ve a **APIs & Services** > **Library** y busca las APIs

## 📋 Pasos Completos (Sin Enlaces con Project ID)

1. **Abre Google Cloud Console**
   - https://console.cloud.google.com/

2. **Selecciona el Proyecto Correcto**
   - En el selector de proyectos (arriba), busca el proyecto que tiene tu API key
   - Si ves "SmartStreet", ese es probablemente el correcto

3. **Ve a la Biblioteca de APIs**
   - Menú lateral: **APIs & Services** > **Library**
   - O directamente: https://console.cloud.google.com/apis/library

4. **Habilita Maps JavaScript API**
   - Busca: `Maps JavaScript API`
   - Haz clic
   - Presiona **"ENABLE"**
   - Espera 1-2 minutos

5. **Habilita Places API (New)**
   - Busca: `Places API (New)` o `Places API`
   - Haz clic
   - Presiona **"ENABLE"**
   - Espera 1-2 minutos

6. **Habilita Directions API**
   - Busca: `Directions API`
   - Haz clic
   - Presiona **"ENABLE"**
   - Espera 1-2 minutos

## ✅ Verificación

Después de habilitar, espera 1-2 minutos y recarga tu aplicación.

Si sigue sin funcionar, verifica:
- Que estés en el proyecto correcto
- Que la API key pertenezca a ese proyecto
- Que hayas esperado suficiente tiempo

