/**
 * Motor de Cálculo de Riesgo - Smartstreet
 * 
 * Este módulo contiene la lógica central para calcular el porcentaje de peligrosidad
 * personalizado de una ruta basándose en los Tres Pilares del Riesgo:
 * 
 * PILAR 1: Riesgo Estático (base histórica)
 * PILAR 2: Riesgo Dinámico (modificadores en tiempo real)
 * PILAR 3: Riesgo Subjetivo (factores del perfil del usuario)
 */

/**
 * Determina si es horario nocturno (22:00 - 06:00)
 * @returns {boolean} true si es horario nocturno
 */
export function isNightTime() {
  const now = new Date()
  const hour = now.getHours()
  // Horario nocturno: 22:00 (22) a 06:00 (6)
  return hour >= 22 || hour < 6
}

/**
 * Determina el tipo de usuario basado en su perfil
 * @param {Object} userProfile - Perfil del usuario
 * @returns {string} Tipo de usuario: 'turista', 'local_residente', etc.
 */
function determineUserType(userProfile) {
  // Si es extranjero, se considera turista
  if (userProfile.nationality === 'Extranjera' || 
      userProfile.nationality === 'Extranjero' ||
      userProfile.nationality === 'Extranjera/Extranjero') {
    return 'turista'
  }
  // Si es mexicano, se considera residente local
  if (userProfile.nationality === 'Mexicana' || 
      userProfile.nationality === 'Mexicano') {
    return 'local_residente'
  }
  // Por defecto, considerar como turista si no está claro
  return 'turista'
}

/**
 * Identifica la zona principal que atraviesa una ruta
 * Por ahora, simula la identificación basándose en coordenadas del origen/destino
 * En producción, esto analizaría todos los waypoints de la ruta
 * 
 * @param {Object} routeData - Datos de la ruta (debe contener origen, destino, o coordenadas)
 * @param {Object} riskIntelligenceData - Base de datos completa de riskZones
 * @returns {string|null} Clave de la zona principal o null si no se encuentra
 */
function identifyMainZone(routeData, riskIntelligenceData) {
  // Si la ruta ya tiene una zona asignada, usarla
  if (routeData.mainZoneId) {
    return routeData.mainZoneId
  }

  // Intentar identificar por coordenadas del origen o destino
  const targetCoords = routeData.origin || routeData.destination || routeData.coordinates
  
  if (!targetCoords || !targetCoords.lat || !targetCoords.lng) {
    return null
  }

  // Por ahora, usar una lógica simple: encontrar la zona más cercana
  // En producción, esto sería más sofisticado (analizar waypoints, polígonos, etc.)
  let closestZone = null
  let minDistance = Infinity

  Object.entries(riskIntelligenceData).forEach(([zoneKey, zoneData]) => {
    if (zoneData.coordinates) {
      const distance = calculateDistance(
        targetCoords.lat,
        targetCoords.lng,
        zoneData.coordinates.lat,
        zoneData.coordinates.lng
      )
      
      if (distance < minDistance) {
        minDistance = distance
        closestZone = zoneKey
      }
    }
  })

  // Si la distancia es razonable (menos de 2km), usar esa zona
  // De lo contrario, usar una zona por defecto
  if (minDistance < 2) {
    return closestZone
  }

  // Escalabilidad Nacional: Si está fuera de las zonas hardcodeadas, devolver null para aplicar riesgo por defecto
  return null
}

/**
 * Calcula la distancia entre dos puntos en kilómetros (fórmula de Haversine)
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371 // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * Calcula el Porcentaje de Peligrosidad Personalizado para una ruta.
 * 
 * Esta es la función maestra que implementa la lógica de los Tres Pilares del Riesgo.
 * 
 * @param {Object} routeData - Datos de la ruta (debe contener qué zonas atraviesa, origen, destino, etc.)
 * @param {Object} userProfile - El perfil del usuario actual (edad, tipo, género, nacionalidad, etc.)
 * @param {Object} riskIntelligenceData - La base de datos completa de riskZones
 * @returns {Number} El porcentaje de peligrosidad final (0-100)
 */
export function calculateRouteDangerPercentage(routeData, userProfile, riskIntelligenceData) {
  // 1. Identificar las zonas que atraviesa la ruta
  const mainZoneId = identifyMainZone(routeData, riskIntelligenceData)
  
  if (!mainZoneId) {
    // Escalabilidad Nacional: Cálculo de riesgo por defecto basado en estadísticas generales
    console.log('Fuera de zona conocida. Aplicando riesgo base nacional por defecto.')
    let defaultRisk = 45 // Riesgo base nacional
    
    // Ajustes dinámicos básicos
    if (isNightTime()) defaultRisk += 15
    
    // Ajuste por perfil
    if (userProfile.gender === 'Mujer' && isNightTime()) defaultRisk += 10
    if (userProfile.hasValuableItems) defaultRisk += 5
    
    return Math.min(Math.max(defaultRisk, 0), 100)
  }

  const zoneData = riskIntelligenceData[mainZoneId]
  
  if (!zoneData) {
    console.warn(`Zona ${mainZoneId} no encontrada en riskIntelligenceData, usando valor por defecto`)
    return 50 // Valor por defecto si no hay datos
  }

  // 2. Calcular el Riesgo Base (PILAR 1: Estático + PILAR 2: Dinámico)
  let baseRisk = zoneData.staticRiskScore + zoneData.currentDynamicScore

  // 3. Aplicar el PILAR 3: RIESGO SUBJETIVO (El Perfil del Usuario)
  let profileMultiplier = 1.0

  // Determinar el tipo de usuario
  const userType = determineUserType(userProfile)
  
  // Aplicar multiplicador según el tipo de usuario
  if (zoneData.profileVulnerabilityFactors[userType]) {
    profileMultiplier *= zoneData.profileVulnerabilityFactors[userType]
  }

  // Aplicar multiplicador para mujer sola en horario nocturno
  if (userProfile.gender === 'Mujer' || userProfile.gender === 'mujer') {
    if (isNightTime()) {
      const factor = zoneData.profileVulnerabilityFactors['mujer_sola_noche']
      if (factor) {
        profileMultiplier *= factor
      }
    }
  }

  // Aplicar multiplicador para extranjeros
  if (userProfile.nationality === 'Extranjera' || 
      userProfile.nationality === 'Extranjero' ||
      userProfile.nationality === 'Extranjera/Extranjero') {
    const factor = zoneData.profileVulnerabilityFactors['extranjero']
    if (factor) {
      profileMultiplier *= factor
    }
  }

  // Aplicar multiplicador para objetos de valor
  if (userProfile.hasValuableItems) {
    const factor = zoneData.profileVulnerabilityFactors['objetos_valor']
    if (factor) {
      profileMultiplier *= factor
    }
  }

  // Calcular el riesgo final
  let finalRisk = baseRisk * profileMultiplier

  // Asegurar que el resultado esté entre 0 y 100
  finalRisk = Math.min(Math.max(Math.round(finalRisk), 0), 100)

  return finalRisk
}

/**
 * Función auxiliar para obtener información detallada del cálculo de riesgo
 * Útil para debugging o mostrar información al usuario
 * 
 * @param {Object} routeData - Datos de la ruta
 * @param {Object} userProfile - Perfil del usuario
 * @param {Object} riskIntelligenceData - Base de datos de zonas
 * @returns {Object} Objeto con desglose del cálculo
 */
export function getRiskCalculationBreakdown(routeData, userProfile, riskIntelligenceData) {
  const mainZoneId = identifyMainZone(routeData, riskIntelligenceData)
  const zoneData = riskIntelligenceData[mainZoneId]
  
  if (!zoneData) {
    return {
      zone: 'Desconocida',
      staticRisk: 50,
      dynamicRisk: 0,
      profileMultiplier: 1.0,
      finalRisk: 50,
      factors: []
    }
  }

  let profileMultiplier = 1.0
  const factors = []

  const userType = determineUserType(userProfile)
  
  if (zoneData.profileVulnerabilityFactors[userType]) {
    profileMultiplier *= zoneData.profileVulnerabilityFactors[userType]
    factors.push(`Tipo: ${userType} (x${zoneData.profileVulnerabilityFactors[userType]})`)
  }

  if ((userProfile.gender === 'Mujer' || userProfile.gender === 'mujer') && isNightTime()) {
    const factor = zoneData.profileVulnerabilityFactors['mujer_sola_noche']
    if (factor) {
      profileMultiplier *= factor
      factors.push(`Mujer en horario nocturno (x${factor})`)
    }
  }

  if (userProfile.nationality === 'Extranjera' || 
      userProfile.nationality === 'Extranjero' ||
      userProfile.nationality === 'Extranjera/Extranjero') {
    const factor = zoneData.profileVulnerabilityFactors['extranjero']
    if (factor) {
      profileMultiplier *= factor
      factors.push(`Extranjero (x${factor})`)
    }
  }

  if (userProfile.hasValuableItems) {
    const factor = zoneData.profileVulnerabilityFactors['objetos_valor']
    if (factor) {
      profileMultiplier *= factor
      factors.push(`Objetos de valor (x${factor})`)
    }
  }

  const staticRisk = zoneData.staticRiskScore
  const dynamicRisk = zoneData.currentDynamicScore
  const baseRisk = staticRisk + dynamicRisk
  const finalRisk = Math.min(Math.max(Math.round(baseRisk * profileMultiplier), 0), 100)

  return {
    zone: zoneData.name,
    zoneId: mainZoneId,
    staticRisk,
    dynamicRisk,
    baseRisk,
    profileMultiplier: Math.round(profileMultiplier * 100) / 100,
    finalRisk,
    factors,
    isNightTime: isNightTime()
  }
}

