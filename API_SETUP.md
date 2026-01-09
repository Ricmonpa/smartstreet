# Configuración de APIs de Google Maps

## Cómo habilitar las APIs necesarias

### Paso 1: Acceder a Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Inicia sesión con tu cuenta de Google
3. Selecciona el proyecto donde está tu API key o crea uno nuevo

### Paso 2: Habilitar Maps JavaScript API

1. En el menú lateral, ve a **APIs & Services** > **Library**
2. Busca "**Maps JavaScript API**"
3. Haz clic en el resultado
4. Haz clic en el botón **"ENABLE"** (Habilitar)
5. Espera a que se habilite (puede tardar unos minutos)

### Paso 3: Habilitar Places API

1. En la misma página de **Library**, busca "**Places API**"
2. Haz clic en el resultado
3. Haz clic en el botón **"ENABLE"** (Habilitar)
4. Espera a que se habilite

### Paso 4: Habilitar Directions API

1. En la misma página de **Library**, busca "**Directions API**"
2. Haz clic en el resultado
3. Haz clic en el botón **"ENABLE"** (Habilitar)
4. Espera a que se habilite

### Paso 5: Verificar restricciones de la API Key

1. Ve a **APIs & Services** > **Credentials**
2. Encuentra tu API key (la que empieza con `AIzaSy...`)
3. Haz clic en ella para editarla
4. En **API restrictions**, asegúrate de que esté configurada como:
   - **Restrict key** (Restringir clave)
   - Y que las siguientes APIs estén seleccionadas:
     - Maps JavaScript API
     - Places API
     - Directions API
5. En **Application restrictions**, puedes dejarlo en "None" para desarrollo, o configurar restricciones según necesites
6. Guarda los cambios

### Paso 6: Verificar facturación

⚠️ **IMPORTANTE**: Google Maps requiere una cuenta de facturación habilitada, aunque ofrece créditos gratuitos:

1. Ve a **Billing** (Facturación) en el menú
2. Asegúrate de tener una cuenta de facturación vinculada
3. Google ofrece $200 USD en créditos gratuitos mensuales, que cubren:
   - Maps JavaScript API: ~28,000 cargas de mapa
   - Places API: ~17,000 solicitudes
   - Directions API: ~40,000 solicitudes

### Verificación rápida

Después de habilitar las APIs, espera 1-2 minutos y luego:

1. Recarga la página de la aplicación
2. El componente de prueba mostrará el estado de cada API
3. Si alguna muestra "❌ No disponible", verifica:
   - Que la API esté habilitada en Google Cloud Console
   - Que la API key tenga permisos para esa API
   - Que hayas esperado unos minutos después de habilitarla

### Errores comunes

**Error: "This API project is not authorized to use this API"**
- La API no está habilitada en tu proyecto
- Sigue los pasos 2-4 para habilitarla

**Error: "RefererNotAllowedMapError"**
- Tu API key tiene restricciones de dominio
- Ve a Credentials > tu API key > Application restrictions
- Agrega `localhost:5173` y tu dominio de producción

**Error: "BillingNotEnabledMapError"**
- No tienes facturación habilitada
- Ve a Billing y configura una cuenta de facturación

### Enlaces útiles

- [Google Cloud Console](https://console.cloud.google.com/)
- [Documentación Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
- [Documentación Places API](https://developers.google.com/maps/documentation/places/web-service)
- [Documentación Directions API](https://developers.google.com/maps/documentation/directions)
- [Precios y créditos gratuitos](https://developers.google.com/maps/billing-and-pricing/pricing)

