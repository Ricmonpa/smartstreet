import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'

// Modal de configuración de perfil de seguridad
const ProfileConfigModal = ({ isOpen, onClose }) => {
  const { userProfile, updateProfile } = useApp()
  const [age, setAge] = useState(userProfile.age || 30)
  const [gender, setGender] = useState(userProfile.gender || 'Mujer')
  const [nationality, setNationality] = useState(userProfile.nationality || 'Extranjera')
  const [hasValuableItems, setHasValuableItems] = useState(userProfile.hasValuableItems || false)

  // Actualizar estado cuando cambia el perfil
  useEffect(() => {
    setAge(userProfile.age || 30)
    setGender(userProfile.gender || 'Mujer')
    setNationality(userProfile.nationality || 'Extranjera')
    setHasValuableItems(userProfile.hasValuableItems || false)
  }, [userProfile, isOpen])

  if (!isOpen) return null

  const handleConfirm = () => {
    const profile = {
      age,
      gender,
      nationality,
      hasValuableItems
    }
    updateProfile(profile)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Configuración de Perfil</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Campo Edad */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Edad
          </label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(parseInt(e.target.value) || 0)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            min="1"
            max="120"
          />
        </div>

        {/* Campo Género */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Género
          </label>
          <div className="flex gap-2">
            {['Mujer', 'Hombre', 'Otro'].map((option) => (
              <button
                key={option}
                onClick={() => setGender(option)}
                className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${
                  gender === option
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-orange-300'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Campo Nacionalidad */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nacionalidad
          </label>
          <select
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="Extranjera">Extranjera</option>
            <option value="Mexicana">Mexicana</option>
          </select>
        </div>

        {/* Checkbox Apariencia */}
        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={hasValuableItems}
              onChange={(e) => setHasValuableItems(e.target.checked)}
              className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
            />
            <span className="ml-2 text-sm text-gray-700">
              Lleva objetos de valor a la vista
            </span>
          </label>
        </div>

        {/* Botón Confirmar */}
        <button
          onClick={handleConfirm}
          className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
        >
          Confirmar Perfil
        </button>
      </div>
    </div>
  )
}

export default ProfileConfigModal

