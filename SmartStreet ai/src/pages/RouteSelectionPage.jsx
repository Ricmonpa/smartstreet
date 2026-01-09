import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { calculateRoutes } from '../services/mapsService'
import DangerThermometer from '../components/DangerThermometer'

// Página de selección de ruta con termómetro de peligrosidad
const RouteSelectionPage = () => {
  const { currentLocation, destination, userProfile, routes, setRoutes, selectedRoute, setSelectedRoute } = useApp()
  const [searchQuery, setSearchQuery] = useState(destination?.address || 'Paveges')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Calcular rutas cuando hay destino
  useEffect(() => {
    const loadRoutes = async () => {
      if (currentLocation && destination && window.google && window.google.maps) {
        setLoading(true)
        try {
          const calculatedRoutes = await calculateRoutes(currentLocation, destination, userProfile)
          setRoutes(calculatedRoutes)
        } catch (error) {
          console.error('Error calculating routes:', error)
        } finally {
          setLoading(false)
        }
      }
    }

    loadRoutes()
  }, [currentLocation, destination, userProfile, setRoutes])

  const handleRouteSelect = (route) => {
    setSelectedRoute(route)
  }

  const handleStartRoute = () => {
    if (selectedRoute) {
      navigate('/navigation')
    } else {
      alert('Por favor selecciona una ruta primero')
    }
  }

  // Función para obtener el color del borde según el tipo de ruta
  const getBorderColor = (route) => {
    if (selectedRoute && selectedRoute.id === route.id) {
      return 'border-orange-500 border-2'
    }
    return 'border-gray-200'
  }

  // Función para obtener el color de fondo del icono
  const getIconBgColor = (color) => {
    const colors = {
      blue: 'bg-blue-100',
      orange: 'bg-orange-100',
      yellow: 'bg-yellow-100',
      green: 'bg-green-100'
    }
    return colors[color] || 'bg-gray-100'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="flex items-center gap-4 p-4">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-800 text-xl"
          >
            ←
          </button>
          <img 
            src="/logo.png" 
            alt="Smartstreet Logo" 
            className="h-16 w-auto object-contain"
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
          <h1 className="text-xl font-bold flex-1">Elige tu ruta</h1>
        </div>

        {/* Campo de navegación */}
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-lg">
            <span>←</span>
            <span className="text-gray-600">{currentLocation?.address || 'Tu ubicación'}</span>
          </div>
        </div>

        {/* Botones de filtro */}
        <div className="px-4 pb-4 flex gap-2">
          <button className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            ☰
          </button>
          <button className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            1
          </button>
        </div>

        {/* Barra de búsqueda */}
        <div className="px-4 pb-4">
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Paveges"
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs text-white">
              i
            </span>
          </div>
        </div>
      </div>

      {/* Lista de rutas */}
      <div className="p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Calculando rutas...</p>
            </div>
          </div>
        ) : routes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No hay rutas disponibles. Por favor selecciona un destino en la página principal.</p>
          </div>
        ) : (
          routes.map((route) => (
          <div
            key={route.id}
            onClick={() => handleRouteSelect(route)}
            className={`bg-white rounded-lg p-4 shadow-sm cursor-pointer transition-all ${getBorderColor(route)}`}
          >
            <div className="flex items-start gap-4">
              {/* Icono */}
              <div className={`w-12 h-12 ${getIconBgColor(route.color)} rounded-full flex items-center justify-center text-xl`}>
                {route.icon}
              </div>

              {/* Información de la ruta */}
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">{route.name}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  {route.durationText} · {route.distanceText} · {route.securityLevel}
                </p>
                {route.description && (
                  <p className="text-xs text-gray-500">{route.description}</p>
                )}
              </div>

              {/* Termómetro de peligrosidad */}
              <DangerThermometer percentage={route.dangerPercentage} />
            </div>
          </div>
          ))
        )}
      </div>

      {/* Botón flotante para iniciar ruta */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
        <button
          onClick={handleStartRoute}
          className="w-full bg-orange-500 text-white py-4 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
        >
          Iniciar Ruta Seleccionada
        </button>
      </div>

      {/* Espacio para el botón fijo */}
      <div className="h-20"></div>
    </div>
  )
}

export default RouteSelectionPage

