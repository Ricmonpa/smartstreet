import { useEffect, useState } from 'react'
import { useJsApiLoader } from '@react-google-maps/api'

// Componente para probar qué APIs están habilitadas
const ApiTest = () => {
  const [testResults, setTestResults] = useState({
    mapsLoaded: false,
    placesAvailable: false,
    directionsAvailable: false,
    errors: []
  })

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ['places', 'directions']
  })

  useEffect(() => {
    if (isLoaded && window.google) {
      const results = {
        mapsLoaded: true,
        placesAvailable: false,
        directionsAvailable: false,
        errors: []
      }

      // Probar Places API
      try {
        if (window.google.maps && window.google.maps.places) {
          results.placesAvailable = true
        } else {
          results.errors.push('Places API no disponible')
        }
      } catch (error) {
        results.errors.push(`Error Places API: ${error.message}`)
      }

      // Probar Directions API
      try {
        if (window.google.maps && window.google.maps.DirectionsService) {
          results.directionsAvailable = true
        } else {
          results.errors.push('Directions API no disponible')
        }
      } catch (error) {
        results.errors.push(`Error Directions API: ${error.message}`)
      }

      setTestResults(results)
    }

    if (loadError) {
      setTestResults(prev => ({
        ...prev,
        errors: [...prev.errors, `Error cargando script: ${loadError.message || loadError}`]
      }))
    }
  }, [isLoaded, loadError])

  // Probar autocompletado de Places
  const testPlacesAutocomplete = () => {
    if (!window.google || !window.google.maps) {
      alert('Google Maps no está cargado')
      return
    }

    try {
      const input = document.createElement('input')
      const autocomplete = new window.google.maps.places.Autocomplete(input)
      alert('✅ Places Autocomplete funciona correctamente')
    } catch (error) {
      alert(`❌ Error en Places Autocomplete: ${error.message}`)
    }
  }

  // Probar Directions Service
  const testDirectionsService = () => {
    if (!window.google || !window.google.maps) {
      alert('Google Maps no está cargado')
      return
    }

    try {
      const service = new window.google.maps.DirectionsService()
      service.route(
        {
          origin: { lat: 19.4122, lng: -99.1778 },
          destination: { lat: 19.4326, lng: -99.1332 },
          travelMode: window.google.maps.TravelMode.WALKING
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            alert('✅ Directions Service funciona correctamente')
          } else {
            alert(`❌ Error en Directions Service: ${status}`)
          }
        }
      )
    } catch (error) {
      alert(`❌ Error en Directions Service: ${error.message}`)
    }
  }

  return (
    <div className="fixed top-20 left-4 right-4 bg-white rounded-lg shadow-lg p-6 z-50 max-w-md">
      <h2 className="text-xl font-bold mb-4">Prueba de APIs de Google Maps</h2>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-medium">Maps JavaScript API:</span>
          <span className={isLoaded ? 'text-green-600' : 'text-red-600'}>
            {isLoaded ? '✅ Habilitada' : '❌ No cargada'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-medium">Places API:</span>
          <span className={testResults.placesAvailable ? 'text-green-600' : 'text-red-600'}>
            {testResults.placesAvailable ? '✅ Disponible' : '❌ No disponible'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-medium">Directions API:</span>
          <span className={testResults.directionsAvailable ? 'text-green-600' : 'text-red-600'}>
            {testResults.directionsAvailable ? '✅ Disponible' : '❌ No disponible'}
          </span>
        </div>

        {testResults.errors.length > 0 && (
          <div className="mt-4 p-3 bg-red-50 rounded border border-red-200">
            <p className="text-sm font-medium text-red-800 mb-2">Errores:</p>
            <ul className="text-xs text-red-600 space-y-1">
              {testResults.errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <button
            onClick={testPlacesAutocomplete}
            className="flex-1 px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            Probar Places
          </button>
          <button
            onClick={testDirectionsService}
            className="flex-1 px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600"
          >
            Probar Directions
          </button>
        </div>
      </div>
    </div>
  )
}

export default ApiTest

