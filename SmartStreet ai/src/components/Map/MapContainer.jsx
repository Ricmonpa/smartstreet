import { useEffect, useRef, useState } from 'react'
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer } from '@react-google-maps/api'
import { useApp } from '../../context/AppContext'

// Configuración del mapa
const mapContainerStyle = {
  width: '100%',
  height: '100%'
}

const center = {
  lat: 19.4122, // Condesa, CDMX
  lng: -99.1778
}

const mapOptions = {
  zoom: 15,
  center: center,
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    }
  ]
}

// Constante fuera del componente para evitar recreación en cada render
// Nota: directions ya no es una librería separada en la nueva API, se usa directamente
const libraries = []

// Componente principal del mapa
const MapContainer = ({ children, showDirections = false }) => {
  const { 
    currentLocation, 
    destination, 
    selectedRoute, 
    incidents, 
    setCurrentLocation,
    transportMode 
  } = useApp()
  const [map, setMap] = useState(null)
  const [mapError, setMapError] = useState(null)
  const mapRef = useRef(null)

  // Implementación de Geolocalización Dinámica
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Ubicación detectada:", latitude, longitude);
          if (setCurrentLocation) {
            setCurrentLocation({ lat: latitude, lng: longitude });
          }
        },
        (error) => {
          console.error("Error obteniendo ubicación:", error);
        }
      );
    }
  }, [setCurrentLocation]);

  const getTransportIcon = (mode) => {
    switch(mode) {
      case 'DRIVING': return '🚗';
      case 'BICYCLING': return '🚲';
      case 'TRANSIT': return '🚌';
      default: return '🚶';
    }
  };

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  // Verificar que la API key esté configurada
  useEffect(() => {
    if (!apiKey) {
      console.error('VITE_GOOGLE_MAPS_API_KEY no está configurada en las variables de entorno')
      setMapError({
        type: 'NO_API_KEY',
        message: 'API Key no configurada'
      })
    }
  }, [apiKey])

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey || '',
    libraries: libraries // Usar constante para evitar recreación
  })

  // Detectar errores del mapa después de cargar
  useEffect(() => {
    if (isLoaded && window.google) {
      // Escuchar errores del mapa
      const errorListener = window.google.maps.event.addListener(
        window.google.maps,
        'error',
        (error) => {
          console.error('Google Maps error:', error)
          if (error && error.message) {
            if (error.message.includes('ApiNotActivatedMapError') || 
                error.message.includes('ApiNotActivated')) {
              setMapError({
                type: 'API_NOT_ACTIVATED',
                message: 'Maps JavaScript API no está habilitada'
              })
            } else if (error.message.includes('RefererNotAllowedMapError')) {
              setMapError({
                type: 'REFERER_NOT_ALLOWED',
                message: 'La API key tiene restricciones que bloquean este dominio'
              })
            } else if (error.message.includes('BillingNotEnabledMapError')) {
              setMapError({
                type: 'BILLING_NOT_ENABLED',
                message: 'Facturación no habilitada en Google Cloud'
              })
            } else {
              setMapError({
                type: 'UNKNOWN',
                message: error.message || 'Error desconocido'
              })
            }
          }
        }
      )

      return () => {
        if (errorListener) {
          window.google.maps.event.removeListener(errorListener)
        }
      }
    }
  }, [isLoaded])

  // Ajustar vista del mapa cuando cambian las ubicaciones
  useEffect(() => {
    if (map && (currentLocation || destination)) {
      const bounds = new window.google.maps.LatLngBounds()
      
      if (currentLocation) {
        bounds.extend(new window.google.maps.LatLng(currentLocation.lat, currentLocation.lng))
      }
      if (destination) {
        bounds.extend(new window.google.maps.LatLng(destination.lat, destination.lng))
      }

      if (bounds.isEmpty() === false) {
        map.fitBounds(bounds)
        // Ajustar zoom máximo
        const listener = window.google.maps.event.addListener(map, 'bounds_changed', () => {
          if (map.getZoom() > 16) map.setZoom(16)
          window.google.maps.event.removeListener(listener)
        })
      }
    }
  }, [map, currentLocation, destination])

  // Función para renderizar mensaje de error detallado
  const renderError = (error) => {
    let errorDetails = {
      title: 'Error al cargar el mapa',
      message: 'Verifica la configuración de Google Maps',
      solutions: []
    }

    if (error?.type === 'API_NOT_ACTIVATED' || 
        (loadError && (loadError.message?.includes('ApiNotActivated') || loadError.message?.includes('not activated')))) {
      errorDetails = {
        title: 'Maps JavaScript API no está habilitada',
        message: 'Necesitas habilitar Maps JavaScript API en Google Cloud Console',
        solutions: [
          '1. Ve a Google Cloud Console',
          '2. Selecciona el proyecto donde está tu API key',
          '3. Ve a APIs & Services > Library',
          '4. Busca "Maps JavaScript API"',
          '5. Haz clic en "ENABLE"',
          '6. Espera 1-2 minutos y recarga esta página'
        ],
        link: 'https://console.cloud.google.com/apis/library/maps-javascript-backend.googleapis.com'
      }
    } else if (error?.type === 'REFERER_NOT_ALLOWED' || 
               (loadError && loadError.message?.includes('RefererNotAllowed'))) {
      errorDetails = {
        title: 'Restricciones de la API Key',
        message: 'La API key tiene restricciones que bloquean este dominio',
        solutions: [
          '1. Ve a Google Cloud Console > APIs & Services > Credentials',
          '2. Edita tu API key',
          '3. En "Application restrictions", agrega:',
          '   - localhost:5173/*',
          '   - http://localhost:5173/*',
          '4. Guarda los cambios y espera 1-2 minutos'
        ],
        link: 'https://console.cloud.google.com/apis/credentials'
      }
    } else if (error?.type === 'BILLING_NOT_ENABLED' || 
               (loadError && loadError.message?.includes('BillingNotEnabled'))) {
      errorDetails = {
        title: 'Facturación no habilitada',
        message: 'Google Maps requiere facturación habilitada (aunque ofrece créditos gratuitos)',
        solutions: [
          '1. Ve a Google Cloud Console > Billing',
          '2. Vincula una cuenta de facturación',
          '3. Google ofrece $200 USD en créditos gratuitos mensuales',
          '4. Recarga esta página después de configurar'
        ],
        link: 'https://console.cloud.google.com/billing'
      }
    } else if (error?.type === 'NO_API_KEY' || !apiKey) {
      errorDetails = {
        title: 'API Key no configurada',
        message: 'La variable de entorno VITE_GOOGLE_MAPS_API_KEY no está configurada',
        solutions: [
          '1. Crea un archivo .env en la raíz del proyecto',
          '2. Agrega: VITE_GOOGLE_MAPS_API_KEY=tu_api_key',
          '3. Reinicia el servidor de desarrollo (npm run dev)'
        ]
      }
    } else if (loadError) {
      errorDetails.message = loadError.message || errorDetails.message
    }

    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-200 p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
          <div className="text-center mb-4">
            <div className="text-4xl mb-2">🗺️</div>
            <h3 className="text-xl font-bold text-red-600 mb-2">{errorDetails.title}</h3>
            <p className="text-sm text-gray-600">{errorDetails.message}</p>
          </div>

          {errorDetails.solutions.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">Solución:</p>
              <ul className="text-xs text-gray-600 space-y-1 text-left">
                {errorDetails.solutions.map((solution, index) => (
                  <li key={index}>{solution}</li>
                ))}
              </ul>
            </div>
          )}

          {errorDetails.link && (
            <a
              href={errorDetails.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-orange-500 text-white text-center py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors text-sm font-semibold mb-2"
            >
              Abrir Google Cloud Console
            </a>
          )}

          <div className="text-xs text-gray-500 text-center mt-4">
            <p>API Key: {apiKey ? '✅ Configurada' : '❌ No configurada'}</p>
            {apiKey && <p className="mt-1 font-mono text-xs break-all">{apiKey.substring(0, 20)}...</p>}
          </div>
        </div>
      </div>
    )
  }

  if (loadError || mapError) {
    console.error('Error loading Google Maps:', loadError || mapError)
    return renderError(mapError || loadError)
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando mapa...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        options={mapOptions}
        onLoad={(map) => {
          setMap(map)
          mapRef.current = map
          setMapError(null) // Limpiar errores si el mapa carga correctamente
        }}
        onError={(error) => {
          console.error('GoogleMap onError:', error)
          if (error && typeof error === 'string') {
            if (error.includes('ApiNotActivated')) {
              setMapError({ type: 'API_NOT_ACTIVATED', message: error })
            } else if (error.includes('RefererNotAllowed')) {
              setMapError({ type: 'REFERER_NOT_ALLOWED', message: error })
            } else if (error.includes('BillingNotEnabled')) {
              setMapError({ type: 'BILLING_NOT_ENABLED', message: error })
            } else {
              setMapError({ type: 'UNKNOWN', message: error })
            }
          }
        }}
        onUnmount={() => {
          setMap(null)
        }}
      >
        {/* Marcador de ubicación actual */}
        {currentLocation && (
          <Marker
            position={{ lat: currentLocation.lat, lng: currentLocation.lng }}
            label={{
              text: getTransportIcon(transportMode),
              fontSize: '24px'
            }}
            icon={{
              path: window.google?.maps?.SymbolPath?.CIRCLE,
              scale: 0, // Ocultar el círculo base para ver el emoji
            }}
            title="Tu ubicación"
          />
        )}

        {/* Marcador de destino */}
        {destination && (
          <Marker
            position={{ lat: destination.lat, lng: destination.lng }}
            icon={{
              url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
            }}
            title={destination.address || 'Destino'}
          />
        )}

        {/* Renderizar ruta seleccionada */}
        {selectedRoute && selectedRoute.route && (
          <DirectionsRenderer
            directions={selectedRoute.route}
            options={{
              polylineOptions: {
                strokeColor: selectedRoute.securityLevel === 'Alta' || selectedRoute.securityLevel === 'Segura' || selectedRoute.securityLevel === 'Baja' ? '#10b981' : '#f97316',
                strokeWeight: 6,
                strokeOpacity: 0.9
              },
              suppressMarkers: false
            }}
          />
        )}

        {/* Marcadores de incidencias */}
        {incidents.map((incident) => (
          <Marker
            key={incident.id}
            position={{ lat: incident.lat, lng: incident.lng }}
            icon={{
              url: 'http://maps.google.com/mapfiles/ms/icons/warning.png',
              scaledSize: new window.google.maps.Size(32, 32)
            }}
            title={incident.description || 'Incidencia reportada'}
          />
        ))}
      </GoogleMap>
      {children}
    </div>
  )
}

export default MapContainer

