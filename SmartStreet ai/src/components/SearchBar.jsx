import { useEffect, useRef, useState } from 'react'
import { useApp } from '../context/AppContext'
import { initAutocomplete, searchPlaces, getPlaceDetails } from '../services/mapsService'

// Componente de búsqueda con autocompletado usando Places API (New)
const SearchBar = ({ placeholder = "A dónde vas?", onPlaceSelect }) => {
  const { 
    currentLocation, 
    setDestination, 
    setRoutes, 
    userProfile,
    transportMode,
    setTransportMode 
  } = useApp()
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef(null)
  const suggestionsRef = useRef(null)
  const timeoutRef = useRef(null)

  const transportOptions = [
    { id: 'DRIVING', icon: '🚗', label: 'Auto' },
    { id: 'WALKING', icon: '🚶', label: 'Pie' },
    { id: 'BICYCLING', icon: '🚲', label: 'Bici' },
    { id: 'TRANSIT', icon: '🚌', label: 'Bus' }
  ]

  // Buscar lugares cuando el usuario escribe
  useEffect(() => {
    if (searchQuery.length < 3) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    // Debounce: esperar 300ms después de que el usuario deje de escribir
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(async () => {
      const results = await searchPlaces(searchQuery, currentLocation || { lat: 19.4122, lng: -99.1778 })
      setSuggestions(results)
      setShowSuggestions(true)
      setSelectedIndex(-1)
    }, 300)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [searchQuery, currentLocation])

  // Manejar selección de un lugar
  const handlePlaceSelect = async (suggestion) => {
    if (suggestion.placePrediction?.placeId) {
      const placeDetails = await getPlaceDetails(suggestion.placePrediction.placeId)
      if (placeDetails) {
        setDestination(placeDetails)
        setSearchQuery(placeDetails.address || placeDetails.name)
        setShowSuggestions(false)
        
        // Calcular rutas con el modo de transporte seleccionado
        const calculatedRoutes = await calculateRoutes(currentLocation, placeDetails, userProfile, transportMode)
        setRoutes(calculatedRoutes)
        
        if (onPlaceSelect) {
          onPlaceSelect(placeDetails)
        }
      }
    }
  }

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      handlePlaceSelect(suggestions[selectedIndex])
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (suggestions.length > 0 && selectedIndex >= 0) {
      handlePlaceSelect(suggestions[selectedIndex])
    }
  }

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) && 
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="flex-1 relative">
      <div className="flex flex-col gap-2 mb-2">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1">Modo de Transporte</p>
        <div className="flex gap-2">
          {transportOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setTransportMode(opt.id)}
              className={`flex-1 flex flex-col items-center justify-center p-2 rounded-xl transition-all border ${
                transportMode === opt.id 
                ? 'bg-orange-500 border-orange-600 text-white shadow-md transform scale-105' 
                : 'bg-white border-gray-100 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="text-xl mb-1">{opt.icon}</span>
              <span className="text-[10px] font-bold">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => searchQuery.length >= 3 && setShowSuggestions(true)}
          className="w-full px-4 py-4 rounded-xl border-none bg-white shadow-lg focus:ring-2 focus:ring-orange-500 text-gray-900"
        />
      </form>

      {/* Lista de sugerencias */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => {
            const prediction = suggestion.placePrediction
            if (!prediction) return null

            return (
              <button
                key={index}
                type="button"
                onClick={() => handlePlaceSelect(suggestion)}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                  index === selectedIndex ? 'bg-orange-50' : ''
                } ${index !== suggestions.length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                <div className="font-medium text-gray-900">
                  {prediction.text?.text || 'Lugar'}
                </div>
                {prediction.structuredFormat?.secondaryText && (
                  <div className="text-sm text-gray-500 mt-1">
                    {prediction.structuredFormat.secondaryText.text}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default SearchBar

