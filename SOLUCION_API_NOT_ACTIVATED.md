# 🔧 Solución: ApiNotActivatedMapError

## ❌ Error Actual

```
Google Maps JavaScript API error: ApiNotActivatedMapError
```

Este error significa que **Maps JavaScript API no está habilitada** en tu proyecto de Google Cloud.

## ✅ Solución Paso a Paso

### Opción 1: Enlace Directo (Más Rápido) ⚡

**Paso 1: Ve a la biblioteca de APIs**
👉 **https://console.cloud.google.com/apis/library**

**Paso 2: Busca Maps JavaScript API**
- En el buscador, escribe: `Maps JavaScript API`
- Haz clic en el resultado
- Presiona **"ENABLE"**

**Alternativa - Enlace directo (requiere seleccionar proyecto primero):**
👉 **https://console.cloud.google.com/apis/library/maps-javascript-backend.googleapis.com**

### Opción 2: Manualmente

1. **Ve a Google Cloud Console**
   - https://console.cloud.google.com/
   - Asegúrate de estar en el proyecto correcto (ID: `484367494712`)

2. **Navega a la biblioteca de APIs**
   - En el menú lateral, ve a **APIs & Services** > **Library**

3. **Busca Maps JavaScript API**
   - En el buscador, escribe: `Maps JavaScript API`
   - Haz clic en el resultado

4. **Habilita la API**
   - Haz clic en el botón **"ENABLE"** (Habilitar)
   - Espera a que se habilite (puede tardar 1-2 minutos)

5. **Verifica que esté habilitada**
   - Deberías ver un botón verde "API ENABLED" o "API HABILITADA"
   - El estado debe cambiar de "DISABLED" a "ENABLED"

## 🔍 Verificar Restricciones de la API Key

Después de habilitar la API, verifica que tu API key tenga permisos:

1. **Ve a Credentials**
   - **APIs & Services** > **Credentials**

2. **Encuentra tu API key**
   - Busca la que empieza con `AIzaSyAa4MsbGWQcxalaTtI9TI52FuG5bFeqFbI`
   - Haz clic para editarla

3. **Verifica API restrictions**
   - En **API restrictions**, debe estar:
     - **"Restrict key"** seleccionado
     - Y debe incluir **"Maps JavaScript API"** en la lista
   - O puede estar en **"Don't restrict key"** (para desarrollo)

4. **Verifica Application restrictions**
   - Para desarrollo local, puede estar en **"None"**
   - O si está en **"HTTP referrers"**, debe incluir:
     - `localhost:5173/*`
     - `http://localhost:5173/*`

5. **Guarda los cambios**
   - Haz clic en **"SAVE"**
   - Espera 1-2 minutos para que se propaguen los cambios

## 💰 Verificar Facturación

Google Maps requiere facturación habilitada (aunque ofrece créditos gratuitos):

1. **Ve a Billing**
   - En el menú lateral: **Billing** (Facturación)

2. **Verifica cuenta de facturación**
   - Debe haber una cuenta vinculada
   - Google ofrece **$200 USD en créditos gratuitos mensuales**

3. **Si no hay facturación**
   - Haz clic en **"LINK A BILLING ACCOUNT"**
   - Sigue las instrucciones para vincular una cuenta

## ✅ Después de Habilitar

1. **Espera 1-2 minutos** para que los cambios se propaguen
2. **Recarga la página** en `http://localhost:5173`
3. **Limpia la caché del navegador** si es necesario:
   - Presiona `Ctrl+Shift+R` (Windows/Linux) o `Cmd+Shift+R` (Mac)
   - O en DevTools: Click derecho en recargar > "Empty Cache and Hard Reload"

## 🧪 Verificar que Funciona

Ejecuta este comando en la terminal para verificar:

```bash
curl -s "https://maps.googleapis.com/maps/api/js?key=AIzaSyAa4MsbGWQcxalaTtI9TI52FuG5bFeqFbI" | head -3
```

Si ves `window.google = window.google || {};`, la API está funcionando.

## 📋 Checklist Completo

- [ ] Maps JavaScript API está habilitada en Google Cloud Console
- [ ] La API key tiene permisos para Maps JavaScript API
- [ ] Las restricciones de la API key permiten `localhost:5173`
- [ ] Facturación está habilitada en Google Cloud
- [ ] Esperaste 1-2 minutos después de hacer cambios
- [ ] Recargaste la página con caché limpia

## 🆘 Si Sigue Sin Funcionar

1. **Verifica los logs en Google Cloud Console**
   - Ve a **APIs & Services** > **Dashboard**
   - Revisa si hay errores o advertencias

2. **Crea una nueva API key sin restricciones** (solo para desarrollo)
   - Ve a **Credentials** > **Create Credentials** > **API Key**
   - No agregues restricciones
   - Actualiza el archivo `.env` con la nueva key
   - Reinicia el servidor

3. **Verifica que el archivo `.env` esté correcto**
   ```bash
   cat .env
   ```
   Debe mostrar: `VITE_GOOGLE_MAPS_API_KEY=AIzaSy...`

4. **Reinicia el servidor de desarrollo**
   ```bash
   # Detén el servidor (Ctrl+C)
   npm run dev
   ```

## 🔗 Enlaces Útiles

- [Google Cloud Console](https://console.cloud.google.com/)
- [Maps JavaScript API - Habilitar](https://console.developers.google.com/apis/api/maps-javascript-backend.googleapis.com/overview?project=484367494712)
- [Documentación Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
- [Solución de Problemas de Google Maps](https://developers.google.com/maps/documentation/javascript/error-messages)

