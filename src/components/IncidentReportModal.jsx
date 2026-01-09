import { useState } from 'react'
import { useApp } from '../context/AppContext'

// Tipos de incidencias con iconos y colores - Contexto México
const incidentTypes = [
  {
    id: 'assault',
    name: 'Asalto / Robo a Persona',
    icon: '🚨',
    color: 'bg-red-600',
    hoverColor: 'bg-red-700',
    urgent: true,
    description: 'Asaltos a transeúntes, robo de celular, cartera, etc.'
  },
  {
    id: 'vehicle_theft',
    name: 'Robo a Vehículo',
    icon: '🚗',
    color: 'bg-red-500',
    hoverColor: 'bg-red-600',
    urgent: true,
    description: 'Robos de autopartes, cristalazos o asaltos en vehículos'
  },
  {
    id: 'harassment',
    name: 'Acoso / Violencia de Género',
    icon: '♀️',
    color: 'bg-red-600',
    hoverColor: 'bg-red-700',
    urgent: true,
    description: 'Acoso callejero, tocamientos, persecuciones, agresiones'
  },
  {
    id: 'suspicious',
    name: 'Actividad Sospechosa',
    icon: '👁️',
    color: 'bg-yellow-500',
    hoverColor: 'bg-yellow-600',
    urgent: false,
    description: 'Personas merodeando, vehículos anómalos, situaciones sospechosas'
  },
  {
    id: 'drugs',
    name: 'Narcomenudeo / Venta Drogas',
    icon: '🧪',
    color: 'bg-orange-500',
    hoverColor: 'bg-orange-600',
    urgent: false,
    description: 'Puntos de venta o consumo en vía pública'
  },
  {
    id: 'illumination',
    name: 'Falta de Iluminación',
    icon: '💡',
    color: 'bg-yellow-400',
    hoverColor: 'bg-yellow-500',
    urgent: false,
    description: 'Calles oscuras, farolas rotas o inexistentes'
  },
  {
    id: 'infrastructure',
    name: 'Infraestructura de Riesgo',
    icon: '🚧',
    color: 'bg-orange-400',
    hoverColor: 'bg-orange-500',
    urgent: false,
    description: 'Lugares abandonados, baldíos, construcciones a medio terminar'
  },
  {
    id: 'other',
    name: 'Otro Incidente de Seguridad',
    icon: '📋',
    color: 'bg-gray-400',
    hoverColor: 'bg-gray-500',
    urgent: false,
    description: 'Cualquier otro evento relevante para la seguridad'
  }
]

// Modal para reportar una incidencia
const IncidentReportModal = ({ isOpen, onClose }) => {
  const { addIncident, currentLocation } = useApp()
  const [description, setDescription] = useState('')
  const [incidentType, setIncidentType] = useState(null)
  const [showDescription, setShowDescription] = useState(false)

  if (!isOpen) return null

  const handleTypeSelect = (type) => {
    setIncidentType(type)
    setShowDescription(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (currentLocation && incidentType) {
      addIncident({
        lat: currentLocation.lat,
        lng: currentLocation.lng,
        description: description || `Reporte de ${incidentType.name}`,
        type: incidentType.id,
        typeName: incidentType.name,
        urgent: incidentType.urgent || false
      })
      setDescription('')
      setIncidentType(null)
      setShowDescription(false)
      onClose()
      alert('✅ Incidencia reportada exitosamente. Gracias por ayudar a mantener las calles más seguras.')
    }
  }

  const handleBack = () => {
    setShowDescription(false)
    setIncidentType(null)
    setDescription('')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          {showDescription && (
            <button
              onClick={handleBack}
              className="text-gray-500 hover:text-gray-700 text-xl mr-2"
            >
              ←
            </button>
          )}
          <h2 className="text-xl font-bold flex-1">Reportar Incidencia</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {!showDescription ? (
          /* Grid de tipos de incidencia */
          <div className="p-6">
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">¿Qué tipo de incidencia quieres reportar?</p>
              <p className="text-xs text-gray-500">Los reportes pueden ser anónimos</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {incidentTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleTypeSelect(type)}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl ${type.color} ${type.hoverColor} transition-all transform hover:scale-105 active:scale-95 shadow-md ${
                    type.urgent ? 'ring-2 ring-red-300 ring-offset-2' : ''
                  }`}
                >
                  <span className="text-4xl mb-2">{type.icon}</span>
                  <span className="text-white text-xs font-semibold text-center leading-tight">
                    {type.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Formulario de descripción */
          <form onSubmit={handleSubmit} className="p-6">
            {/* Tipo seleccionado */}
            {incidentType && (
              <div className={`mb-4 p-4 rounded-lg flex items-center gap-3 ${
                incidentType.urgent ? 'bg-red-50 border-2 border-red-200' : 'bg-gray-50'
              }`}>
                <span className="text-4xl">{incidentType.icon}</span>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Tipo de incidencia</p>
                  <p className="font-bold text-gray-800 mb-1">{incidentType.name}</p>
                  {incidentType.description && (
                    <p className="text-xs text-gray-600">{incidentType.description}</p>
                  )}
                </div>
              </div>
            )}

            {/* Ubicación automática */}
            {currentLocation && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-600 mb-1">📍 Ubicación detectada automáticamente</p>
                <p className="text-sm text-blue-800 font-medium">{currentLocation.address}</p>
              </div>
            )}

            {/* Descripción - Opcional pero recomendada */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Añadir detalles <span className="text-gray-400 font-normal">(opcional pero recomendado)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe la incidencia con más detalle para ayudar a otros usuarios..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                autoFocus
              />
            </div>

            {/* Información de anonimato */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600">
                🔒 <span className="font-semibold">Reporte anónimo:</span> Tu identidad se mantendrá privada
              </p>
            </div>

            {/* Botones */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Atrás
              </button>
              <button
                type="submit"
                className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                  incidentType?.urgent 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-orange-500 text-white hover:bg-orange-600'
                }`}
              >
                Confirmar Reporte
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default IncidentReportModal


