import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import MapContainer from '../components/Map/MapContainer'
import SearchBar from '../components/SearchBar'
import ProfileConfigModal from '../components/ProfileConfigModal'
import IncidentReportModal from '../components/IncidentReportModal'

// Página principal con mapa interactivo
const HomePage = () => {
  const { updateProfile } = useApp()
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false)
  const navigate = useNavigate()

  const handleProfileClick = () => {
    setIsProfileModalOpen(true)
  }

  const handlePlaceSelect = async (place) => {
    // Cuando se selecciona un destino, calcular rutas y navegar
    if (place) {
      navigate('/routes')
    }
  }

  const handleReportIncident = () => {
    setIsIncidentModalOpen(true)
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-100">
      {/* Mapa interactivo de Google Maps */}
      <MapContainer>
        {/* Barra superior con búsqueda */}
        <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-white/90 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            {/* Barra de búsqueda con autocompletado */}
            <SearchBar 
              placeholder="A dónde vas?" 
              onPlaceSelect={handlePlaceSelect}
            />
            
            {/* Icono de perfil */}
            <button
              onClick={handleProfileClick}
              className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-2xl hover:bg-gray-300 transition-colors"
            >
              👤
            </button>
          </div>
        </div>
      </MapContainer>

      {/* Botón flotante "Reportar Incidencia" - Círculo con icono */}
      <button
        onClick={handleReportIncident}
        className="absolute top-1/2 right-4 -translate-y-1/2 w-16 h-16 bg-black rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.5)] flex items-center justify-center hover:bg-gray-800 transition-colors z-20"
        title="Reportar Incidencia"
      >
        <img 
          src="/Warn.png" 
          alt="Reportar Incidencia" 
          className="h-14 w-14 object-contain -translate-y-1"
          onError={(e) => {
            // Fallback si el icono no existe
            e.target.style.display = 'none'
          }}
        />
      </button>

      {/* Logotipo Smartstreet en la parte inferior central */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <img 
          src="/logo.png" 
          alt="Smartstreet Logo" 
          className="h-40 w-auto drop-shadow-lg"
        />
      </div>

      {/* Modal de configuración de perfil */}
      <ProfileConfigModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* Modal de reportar incidencia */}
      <IncidentReportModal
        isOpen={isIncidentModalOpen}
        onClose={() => setIsIncidentModalOpen(false)}
      />
    </div>
  )
}

export default HomePage

