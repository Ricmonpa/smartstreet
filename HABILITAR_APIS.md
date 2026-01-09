# 🚀 Cómo Habilitar Places API (New) y Directions API

## ✅ Estado Actual

- **Maps JavaScript API**: ✅ Ya habilitada
- **Places API (New)**: ❌ Necesita habilitarse
- **Directions API**: ❌ Necesita habilitarse

## 📋 Pasos para Habilitar

### Opción 1: Enlaces Directos (Más Rápido) ⚡

Haz clic en estos enlaces y presiona el botón **"ENABLE"**:

1. **Places API (New)**:
   👉 https://console.developers.google.com/apis/api/places.googleapis.com/overview?project=484367494712
   
2. **Directions API**:
   👉 https://console.developers.google.com/apis/api/directions-backend.googleapis.com/overview?project=484367494712

### Opción 2: Manualmente

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Asegúrate de estar en el proyecto correcto (ID: `484367494712`)
3. Ve a **APIs & Services** > **Library** (en el menú lateral)
4. Busca y habilita:

   **a) Places API (New)**
   - Busca: `Places API (New)`
   - Haz clic en el resultado
   - Presiona el botón **"ENABLE"**
   - ⏱️ Espera 1-2 minutos

   **b) Directions API**
   - Busca: `Directions API`
   - Haz clic en el resultado
   - Presiona el botón **"ENABLE"**
   - ⏱️ Espera 1-2 minutos

## ✅ Verificación

Después de habilitar las APIs, espera 1-2 minutos y luego:

1. Recarga la aplicación en `http://localhost:5173`
2. Intenta buscar un lugar en el campo de búsqueda
3. Si funciona, verás sugerencias mientras escribes
4. Si no funciona, verifica en la consola del navegador (F12) si hay errores

## 🔍 Verificar Estado de las APIs

Puedes verificar el estado ejecutando estos comandos en la terminal:

```bash
# Verificar Places API (New)
curl -s "https://places.googleapis.com/v1/places:autocomplete" \
  -H "Content-Type: application/json" \
  -H "X-Goog-Api-Key: AIzaSyAa4MsbGWQcxalaTtI9TI52FuG5bFeqFbI" \
  -d '{"input":"roma","locationBias":{"circle":{"center":{"latitude":19.4122,"longitude":-99.1778},"radius":5000}}}' | grep -i "error\|status"

# Verificar Directions API
curl -s "https://maps.googleapis.com/maps/api/directions/json?origin=19.4122,-99.1778&destination=19.4326,-99.1332&key=AIzaSyAa4MsbGWQcxalaTtI9TI52FuG5bFeqFbI" | grep -i "error\|status"
```

## 💰 Facturación

**IMPORTANTE**: Google Maps requiere una cuenta de facturación habilitada, pero ofrece créditos gratuitos:

- **$200 USD en créditos gratuitos mensuales**
- Esto cubre aproximadamente:
  - Maps JavaScript API: ~28,000 cargas de mapa
  - Places API (New): ~17,000 solicitudes
  - Directions API: ~40,000 solicitudes

Para un demo/desarrollo, estos créditos son más que suficientes.

## 🐛 Solución de Problemas

### Error: "SERVICE_DISABLED"
- La API no está habilitada
- Sigue los pasos de arriba para habilitarla
- Espera 1-2 minutos después de habilitarla

### Error: "PERMISSION_DENIED"
- Verifica que la API key tenga permisos
- Ve a **APIs & Services** > **Credentials**
- Edita tu API key y verifica que las APIs estén en la lista de restricciones

### Error: "BILLING_NOT_ENABLED"
- Necesitas habilitar facturación
- Ve a **Billing** en el menú
- Configura una cuenta de facturación (los créditos gratuitos se aplican automáticamente)

## 📚 Documentación

- [Places API (New) Documentation](https://developers.google.com/maps/documentation/places/web-service)
- [Directions API Documentation](https://developers.google.com/maps/documentation/directions)
- [Pricing Information](https://developers.google.com/maps/billing-and-pricing/pricing)

