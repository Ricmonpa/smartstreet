// Componente que visualiza el porcentaje de peligrosidad como un termómetro
const DangerThermometer = ({ percentage }) => {
  // Determinar el color basado en el porcentaje
  const getColorClass = (percent) => {
    if (percent <= 15) return 'bg-green-500'
    if (percent <= 25) return 'bg-yellow-500'
    if (percent <= 35) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const colorClass = getColorClass(percentage)

  return (
    <div className="flex flex-col items-center">
      {/* Termómetro circular con porcentaje */}
      <div className="relative w-16 h-16 flex items-center justify-center">
        {/* Círculo de fondo */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
        {/* Círculo de progreso */}
        <div 
          className={`absolute inset-0 rounded-full ${colorClass} opacity-80`}
          style={{ 
            clipPath: `inset(${100 - percentage}% 0 0 0)`
          }}
        ></div>
        {/* Porcentaje en el centro */}
        <span className="relative z-10 text-xs font-bold text-gray-800">
          {percentage}%
        </span>
      </div>
    </div>
  )
}

export default DangerThermometer

