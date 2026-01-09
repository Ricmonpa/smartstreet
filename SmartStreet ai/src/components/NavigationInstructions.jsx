import { useState, useEffect } from 'react'

// Componente para mostrar instrucciones de navegación paso a paso
const NavigationInstructions = ({ route }) => {
  const [currentStep, setCurrentStep] = useState(0)

  if (!route || !route.route || !route.route.legs || !route.route.legs[0]) {
    return null
  }

  const steps = route.route.legs[0].steps || []
  const currentInstruction = steps[currentStep]

  useEffect(() => {
    // Simulación: avanzar automáticamente cada 10 segundos
    if (steps.length > 0) {
      const interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < steps.length - 1) {
            return prev + 1
          }
          return prev
        })
      }, 10000) // 10 segundos

      return () => clearInterval(interval)
    }
  }, [steps.length])

  if (steps.length === 0) return null

  return (
    <div className="absolute bottom-6 left-6 right-6 z-20 max-w-md mx-auto">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-2xl border border-white/20">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-700 rounded-full disabled:opacity-30 hover:bg-gray-200 transition-all shadow-sm"
            aria-label="Anterior"
          >
            <span className="text-lg">←</span>
          </button>

          <div className="flex-1 text-center">
            <div 
              className="text-base font-bold text-gray-900 leading-tight mb-1"
              dangerouslySetInnerHTML={{ __html: currentInstruction?.instructions || 'Sigue la ruta' }}
            />
            <div className="flex items-center justify-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
                Paso {currentStep + 1} / {steps.length}
              </span>
            </div>
          </div>

          <button
            onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
            disabled={currentStep === steps.length - 1}
            className="w-10 h-10 flex items-center justify-center bg-orange-500 text-white rounded-full disabled:opacity-30 hover:bg-orange-600 transition-all shadow-md"
            aria-label="Siguiente"
          >
            <span className="text-lg">→</span>
          </button>
        </div>

        {/* Barra de progreso sutil */}
        <div className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-orange-500 transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default NavigationInstructions

