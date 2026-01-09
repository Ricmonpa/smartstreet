# 🔧 Solución de Problemas - Error al Cargar el Mapa

## Problema: "Error al cargar el mapa"

Si ves este error, sigue estos pasos:

### 1. Reiniciar el servidor de desarrollo

Las variables de entorno solo se cargan cuando inicia Vite. Si agregaste o modificaste `.env`, necesitas reiniciar:

```bash
# Detén el servidor (Ctrl+C) y reinicia:
npm run dev
```

### 2. Verificar que la API key esté en .env

Asegúrate de que el archivo `.env` en la raíz del proyecto contenga:

```
VITE_GOOGLE_MAPS_API_KEY=AIzaSyAa4MsbGWQcxalaTtI9TI52FuG5bFeqFbI
```

**IMPORTANTE**: 
- El archivo debe llamarse `.env` (no `.env.local` ni otro nombre)
- Debe estar en la raíz del proyecto (mismo nivel que `package.json`)
- No debe tener espacios alrededor del `=`

### 3. Verificar en la consola del navegador

Abre la consola (F12) y busca:

- **Si ves**: `VITE_GOOGLE_MAPS_API_KEY no está configurada`
  → El archivo `.env` no se está cargando. Reinicia el servidor.

- **Si ves**: `Failed to load Google Maps script`
  → Puede ser un problema de:
    - API key inválida
    - Maps JavaScript API no habilitada
    - Restricciones de la API key

### 4. Verificar restricciones de la API key

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs & Services** > **Credentials**
3. Encuentra tu API key
4. Verifica:
   - **Application restrictions**: Si está en "HTTP referrers", agrega `localhost:5173`
   - **API restrictions**: Debe incluir "Maps JavaScript API"

### 5. Verificar que Maps JavaScript API esté habilitada

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs & Services** > **Library**
3. Busca "Maps JavaScript API"
4. Verifica que esté **ENABLED** (habilitada)

### 6. Probar la API key directamente

Ejecuta en la terminal:

```bash
curl "https://maps.googleapis.com/maps/api/js?key=AIzaSyAa4MsbGWQcxalaTtI9TI52FuG5bFeqFbI&libraries=directions" | head -5
```

Si ves `window.google = window.google || {};`, la API key funciona.

Si ves un error, la API key tiene problemas.

### 7. Limpiar caché del navegador

A veces el navegador cachea scripts fallidos:

1. Abre DevTools (F12)
2. Click derecho en el botón de recargar
3. Selecciona "Empty Cache and Hard Reload"

### 8. Verificar la consola de red

1. Abre DevTools (F12)
2. Ve a la pestaña **Network**
3. Recarga la página
4. Busca la petición a `maps.googleapis.com/maps/api/js`
5. Verifica:
   - **Status**: Debe ser 200 (OK)
   - Si es 403: API key sin permisos o API no habilitada
   - Si es 400: API key inválida

## Errores Comunes

### "Performance warning! LoadScript has been reloaded"
✅ **SOLUCIONADO**: Ya movimos el array de libraries fuera del componente.

### "Failed to load Google Maps script, retrying"
- Verifica que Maps JavaScript API esté habilitada
- Verifica restricciones de la API key
- Reinicia el servidor de desarrollo

### Variables de entorno no se cargan
- Asegúrate de que el archivo se llame `.env` (no `.env.local`)
- Reinicia el servidor de desarrollo
- Verifica que no haya espacios en el archivo `.env`

## Si nada funciona

1. Verifica que tengas facturación habilitada en Google Cloud
2. Verifica que la API key sea correcta
3. Intenta crear una nueva API key sin restricciones (solo para desarrollo)
4. Revisa los logs de Google Cloud Console para ver errores específicos

