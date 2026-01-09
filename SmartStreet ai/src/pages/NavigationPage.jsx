import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import MapContainer from '../components/Map/MapContainer'
import NavigationInstructions from '../components/NavigationInstructions'

// Página de navegación con mapa y ruta
const NavigationPage = () => {
  const { selectedRoute, destination } = useApp()
  const navigate = useNavigate()

  if (!selectedRoute) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No hay ruta seleccionada</p>
          <button
            onClick={() => navigate('/routes')}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
          >
            Seleccionar ruta
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-100 flex flex-col">
      {/* Header Flotante */}
      <div className="absolute top-6 left-6 right-6 z-30 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/20 flex items-center gap-4 pointer-events-auto max-w-2xl mx-auto">
          <button
            onClick={() => navigate('/routes')}
            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <span className="text-2xl">←</span>
          </button>
          
          <div className="flex items-center gap-3 flex-1">
            <div className={`p-2 rounded-xl shadow-inner ${
              selectedRoute.securityLevel === 'Alta' || selectedRoute.securityLevel === 'Baja' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
            }`}>
              <span className="text-xl">🛡️</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Ruta Más Segura</h1>
              <div className="flex items-center gap-3 text-xs font-medium text-gray-500">
                <span className="flex items-center gap-1">⏱️ {selectedRoute.durationText}</span>
                <span className="flex items-center gap-1">📏 {selectedRoute.distanceText}</span>
              </div>
            </div>
          </div>

          <div className="hidden sm:block">
            <img 
              src="/logo.png" 
              alt="Smartstreet" 
              className="h-8 w-auto opacity-80"
              onError={(e) => e.target.style.display = 'none'}
            />
          </div>
        </div>
      </div>

      {/* Mapa con ruta */}
      <div className="flex-1 relative">
        <MapContainer showDirections={true}>
          {/* Instrucciones de navegación */}
          <NavigationInstructions route={selectedRoute} />
        </MapContainer>
      </div>
    </div>
  )
}

export default NavigationPage

