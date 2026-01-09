// Servicio para interactuar con Google Maps API
import { calculateRouteDangerPercentage } from '../utils/riskCalculator'
import { riskZones } from '../data/riskIntelligence'

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

// Cargar script de Google Maps si no está cargado
export const loadGoogleMapsScript = () => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve(window.google.maps)
      return
    }

    const script = document.createElement('script')
    // DirectionsService está disponible directamente sin necesidad de librería separada
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`
    script.async = true
    script.defer = true
    script.onload = () => resolve(window.google.maps)
    script.onerror = () => reject(new Error('Error loading Google Maps'))
    document.head.appendChild(script)
  })
}

// Autocompletado usando Places API (New) - REST API
export const searchPlaces = async (input, location = { lat: 19.4122, lng: -99.1778 }) => {
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  
  try {
    const response = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': 'suggestions.placePrediction.placeId,suggestions.placePrediction.text'
      },
      body: JSON.stringify({
        input: input,
        locationBias: {
          circle: {
            center: {
              latitude: location.lat,
              longitude: location.lng
            },
            radius: 5000 // 5km
          }
        },
        includedRegionCodes: ['MX'], // Limitar a México
        languageCode: 'es'
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Error en Places API')
    }

    const data = await response.json()
    return data.suggestions || []
  } catch (error) {
    console.error('Error searching places:', error)
    return []
  }
}

// Obtener detalles de un lugar usando Places API (New)
export const getPlaceDetails = async (placeId) => {
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  
  try {
    const response = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': 'id,displayName,formattedAddress,location'
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Error obteniendo detalles del lugar')
    }

    const data = await response.json()
    
    return {
      lat: data.location?.latitude || 0,
      lng: data.location?.longitude || 0,
      address: data.formattedAddress || data.displayName?.text || '',
      name: data.displayName?.text || ''
    }
  } catch (error) {
    console.error('Error getting place details:', error)
    return null
  }
}

// Autocompletado de lugares (compatibilidad con componente existente)
export const initAutocomplete = async (inputElement, onPlaceSelect, currentLocation) => {
  let timeoutId = null
  let lastSearch = ''

  const handleInput = async (e) => {
    const query = e.target.value.trim()
    
    if (query.length < 3) {
      return
    }

    // Debounce: esperar 300ms después de que el usuario deje de escribir
    clearTimeout(timeoutId)
    timeoutId = setTimeout(async () => {
      if (query === lastSearch) return
      lastSearch = query

      const suggestions = await searchPlaces(query, currentLocation)
      
      // Crear lista de sugerencias (esto se puede mejorar con un componente de dropdown)
      if (suggestions.length > 0 && suggestions[0].placePrediction) {
        const placeId = suggestions[0].placePrediction.placeId
        const placeDetails = await getPlaceDetails(placeId)
        
        if (placeDetails) {
          onPlaceSelect(placeDetails)
        }
      }
    }, 300)
  }

  inputElement.addEventListener('input', handleInput)

  return {
    destroy: () => {
      clearTimeout(timeoutId)
      inputElement.removeEventListener('input', handleInput)
    }
  }
}

// Calcular rutas usando Directions API
export const calculateRoutes = async (origin, destination, userProfile, transportMode = 'WALKING') => {
  if (!window.google || !window.google.maps) {
    console.error('Google Maps not loaded')
    return []
  }

  const directionsService = new window.google.maps.DirectionsService()

  // Mapear transportMode a Google Maps TravelMode
  let travelMode = window.google.maps.TravelMode.WALKING
  if (transportMode === 'DRIVING') travelMode = window.google.maps.TravelMode.DRIVING
  if (transportMode === 'BICYCLING') travelMode = window.google.maps.TravelMode.BICYCLING
  if (transportMode === 'TRANSIT') travelMode = window.google.maps.TravelMode.TRANSIT

  return new Promise((resolve) => {
    directionsService.route(
      {
        origin: { lat: origin.lat, lng: origin.lng },
        destination: { lat: destination.lat, lng: destination.lng },
        travelMode: travelMode,
        provideRouteAlternatives: true // Obtener múltiples rutas
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK && result.routes && result.routes.length > 0) {
          // Procesar rutas y calcular peligrosidad
          const processedRoutes = result.routes.map((route, index) => {
            const leg = route.legs[0]
            const distance = leg.distance.value // en metros
            const duration = leg.duration.value // en segundos
            
            // Preparar datos de la ruta para el cálculo de riesgo
            const routeData = {
              origin: {
                lat: origin.lat,
                lng: origin.lng
              },
              destination: {
                lat: destination.lat,
                lng: destination.lng
              },
              route: route,
              distance: distance,
              duration: duration,
              steps: leg.steps
            }
            
            // Calcular peligrosidad usando el motor de riesgo inteligente
            const dangerPercentage = calculateRouteDangerPercentage(
              routeData,
              userProfile,
              riskZones
            )

            return {
              id: index + 1,
              name: getRouteName(index, dangerPercentage),
              route: result, // IMPORTANTE: Pasar el objeto result completo que contiene la propiedad routes
              routeIndex: index, // Índice de esta ruta específica dentro del resultado
              distance: distance,
              duration: duration,
              distanceText: leg.distance.text,
              durationText: leg.duration.text,
              dangerPercentage: dangerPercentage,
              securityLevel: getSecurityLevel(dangerPercentage),
              description: getRouteDescription(index, userProfile),
              icon: getRouteIcon(index),
              color: getRouteColor(dangerPercentage),
              details: `${leg.duration.text} · ${getRouteDetails(userProfile)}`
            }
          })

          resolve(processedRoutes)
        } else {
          console.error('Error calculating routes:', status)
          resolve([])
        }
      }
    )
  })
}

// La función calculateDangerPercentage ha sido reemplazada por calculateRouteDangerPercentage
// del módulo riskCalculator.js que implementa los Tres Pilares del Riesgo

const getRouteName = (index, dangerPercentage) => {
  if (index === 0) return 'Ruta Más Rápida'
  if (dangerPercentage < 15) return 'Ruta Más Segura'
  return 'Ruta Equilibrada'
}

const getSecurityLevel = (dangerPercentage) => {
  if (dangerPercentage <= 15) return 'Muy Alto'
  if (dangerPercentage <= 25) return 'Alto'
  if (dangerPercentage <= 35) return 'Moderado'
  return 'Bajo'
}

const getRouteDescription = (index, profile) => {
  if (index === 0) return 'Ruta optimizada para llegar rápido'
  if (profile.gender === 'Mujer') return 'Evita calles poco iluminadas'
  return 'Riesgo y tiempo compensados'
}

const getRouteIcon = (index) => {
  if (index === 0) return '⏱️'
  if (index === 1) return '🛡️'
  return '⚖️'
}

const getRouteColor = (dangerPercentage) => {
  if (dangerPercentage <= 15) return 'green'
  if (dangerPercentage <= 25) return 'orange'
  if (dangerPercentage <= 35) return 'yellow'
  return 'red'
}

const getRouteDetails = (profile) => {
  if (profile.gender === 'Mujer') return 'Mujer · Evita calles poco iluminadas'
  return `${profile.gender} · ${profile.nationality}`
}

