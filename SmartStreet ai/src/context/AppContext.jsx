import { createContext, useContext, useState, useEffect } from 'react'

// Contexto global de la aplicación
const AppContext = createContext()

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}

export const AppProvider = ({ children }) => {
  // Estado del perfil de usuario
  const [userProfile, setUserProfile] = useState(() => {
    // Cargar del localStorage si existe
    const saved = localStorage.getItem('smartstreet_profile')
    return saved ? JSON.parse(saved) : {
      age: 30,
      gender: 'Mujer',
      nationality: 'Extranjera',
      hasValuableItems: false
    }
  })

  // Estado de ubicación
  const [currentLocation, setCurrentLocation] = useState(null)
  const [destination, setDestination] = useState(null)

  // Estado de rutas
  const [routes, setRoutes] = useState([])
  const [selectedRoute, _setSelectedRoute] = useState(null)

  // Estado de incidencias reportadas
  const [incidents, setIncidents] = useState([])

  // Estado de modo de transporte
  const [transportMode, setTransportMode] = useState('WALKING') // 'DRIVING', 'WALKING', 'BICYCLING', 'TRANSIT'

  const setSelectedRoute = (route) => {
    console.log('Cambiando selectedRoute a:', route)
    _setSelectedRoute(route)
  }

  // Guardar perfil en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('smartstreet_profile', JSON.stringify(userProfile))
  }, [userProfile])

  // Obtener ubicación actual (simulada para demo)
  useEffect(() => {
    // Por defecto, ubicación en Condesa, CDMX
    if (!currentLocation) {
      setCurrentLocation({
        lat: 19.4122,
        lng: -99.1778,
        address: 'Condesa, Ciudad de México'
      })
    }
  }, [currentLocation])

  const updateProfile = (profile) => {
    setUserProfile(profile)
  }

  const addIncident = (incident) => {
    setIncidents([...incidents, {
      ...incident,
      id: Date.now(),
      timestamp: new Date().toISOString()
    }])
  }

  const value = {
    userProfile,
    updateProfile,
    currentLocation,
    setCurrentLocation,
    destination,
    setDestination,
    routes,
    setRoutes,
    selectedRoute,
    setSelectedRoute,
    incidents,
    addIncident,
    transportMode,
    setTransportMode
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

