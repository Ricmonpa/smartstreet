/**
 * Base de datos de inteligencia de riesgo para Smartstreet
 * 
 * Este archivo contiene la "inteligencia central" del sistema, representando
 * zonas geográficas con sus tres pilares de riesgo:
 * 
 * PILAR 1: RIESGO ESTÁTICO - Base histórica y estructural (0-100)
 * PILAR 2: RIESGO DINÁMICO - Modificadores en tiempo real
 * PILAR 3: RIESGO SUBJETIVO - Factores que interactúan con el perfil del usuario
 */

// Función auxiliar para generar timestamps futuros (simulación)
const getFutureTimestamp = (hoursFromNow) => {
  return new Date(Date.now() + hoursFromNow * 60 * 60 * 1000).toISOString()
}

/**
 * Base de datos de zonas de riesgo
 * Cada zona representa una colonia o cuadrante geográfico con su perfil de riesgo completo
 */
export const riskZones = {
  "zona_roma_norte": {
    id: "rom-nte-01",
    name: "Roma Norte",
    coordinates: {
      lat: 19.4170,
      lng: -99.1618
    },
    
    // PILAR 1: RIESGO ESTÁTICO (Base, histórico, 0-100)
    staticRiskScore: 45,
    staticRiskFactors: [
      "Alta densidad comercial",
      "Iluminación regular",
      "Presencia policial media",
      "Tráfico vehicular moderado",
      "Zona turística con movimiento constante"
    ],

    // PILAR 2: RIESGO DINÁMICO (Tiempo real, modificadores)
    dynamicRiskModifiers: [
      {
        type: "REPORT_SPIKE",
        value: 15,
        description: "Pico de reportes de asalto en las últimas 2h",
        activeUntil: getFutureTimestamp(2)
      },
      {
        type: "EVENT",
        value: 5,
        description: "Concierto masivo cercano",
        activeUntil: getFutureTimestamp(4)
      }
    ],
    // Este valor se calcularía en backend, pero simulémoslo:
    currentDynamicScore: 20,

    // PILAR 3: RIESGO SUBJETIVO (Factores que interactúan con el perfil)
    profileVulnerabilityFactors: {
      "turista": 1.5, // Multiplicador de riesgo para turistas en esta zona
      "mujer_sola_noche": 1.3,
      "vehiculo_lujo": 1.8,
      "local_residente": 0.7, // Reductor de riesgo
      "extranjero": 1.4,
      "objetos_valor": 1.6
    }
  },

  "zona_condesa": {
    id: "cond-01",
    name: "Condesa",
    coordinates: {
      lat: 19.4122,
      lng: -99.1778
    },
    
    // PILAR 1: RIESGO ESTÁTICO
    staticRiskScore: 30,
    staticRiskFactors: [
      "Zona residencial de clase media-alta",
      "Buena iluminación en calles principales",
      "Presencia policial regular",
      "Bajo índice histórico de delitos",
      "Áreas verdes bien mantenidas"
    ],

    // PILAR 2: RIESGO DINÁMICO
    dynamicRiskModifiers: [
      {
        type: "WEATHER",
        value: -5,
        description: "Condiciones climáticas favorables",
        activeUntil: getFutureTimestamp(6)
      }
    ],
    currentDynamicScore: -5,

    // PILAR 3: RIESGO SUBJETIVO
    profileVulnerabilityFactors: {
      "turista": 1.2,
      "mujer_sola_noche": 1.1,
      "vehiculo_lujo": 1.3,
      "local_residente": 0.6,
      "extranjero": 1.1,
      "objetos_valor": 1.2
    }
  },

  "zona_del_valle": {
    id: "valle-01",
    name: "Del Valle",
    coordinates: {
      lat: 19.3867,
      lng: -99.1633
    },
    
    // PILAR 1: RIESGO ESTÁTICO
    staticRiskScore: 40,
    staticRiskFactors: [
      "Zona residencial y comercial mixta",
      "Iluminación variable según la calle",
      "Presencia policial moderada",
      "Tráfico moderado",
      "Algunas calles con poca actividad nocturna"
    ],

    // PILAR 2: RIESGO DINÁMICO
    dynamicRiskModifiers: [
      {
        type: "TIME_OF_DAY",
        value: 10,
        description: "Horario nocturno (22:00-06:00)",
        activeUntil: getFutureTimestamp(8)
      }
    ],
    currentDynamicScore: 10,

    // PILAR 3: RIESGO SUBJETIVO
    profileVulnerabilityFactors: {
      "turista": 1.3,
      "mujer_sola_noche": 1.4,
      "vehiculo_lujo": 1.5,
      "local_residente": 0.8,
      "extranjero": 1.2,
      "objetos_valor": 1.4
    }
  },

  "zona_doctores": {
    id: "doct-01",
    name: "Doctores",
    coordinates: {
      lat: 19.4250,
      lng: -99.1433
    },
    
    // PILAR 1: RIESGO ESTÁTICO
    staticRiskScore: 65,
    staticRiskFactors: [
      "Zona de alta densidad comercial",
      "Iluminación insuficiente en varias calles",
      "Presencia policial limitada",
      "Historial de delitos reportados",
      "Tráfico intenso y caótico",
      "Zona de transición con actividad mixta"
    ],

    // PILAR 2: RIESGO DINÁMICO
    dynamicRiskModifiers: [
      {
        type: "REPORT_SPIKE",
        value: 20,
        description: "Aumento significativo de reportes de robo",
        activeUntil: getFutureTimestamp(3)
      },
      {
        type: "TIME_OF_DAY",
        value: 15,
        description: "Horario de alta actividad delictiva",
        activeUntil: getFutureTimestamp(5)
      },
      {
        type: "CROWD_DENSITY",
        value: 8,
        description: "Alta densidad de personas (factor de riesgo)",
        activeUntil: getFutureTimestamp(2)
      }
    ],
    currentDynamicScore: 43,

    // PILAR 3: RIESGO SUBJETIVO
    profileVulnerabilityFactors: {
      "turista": 2.0, // Muy alto riesgo para turistas
      "mujer_sola_noche": 1.8,
      "vehiculo_lujo": 2.2,
      "local_residente": 0.9, // Aún es riesgoso incluso para locales
      "extranjero": 1.9,
      "objetos_valor": 2.0
    }
  },

  "zona_polanco": {
    id: "polan-01",
    name: "Polanco",
    coordinates: {
      lat: 19.4326,
      lng: -99.1992
    },
    
    // PILAR 1: RIESGO ESTÁTICO
    staticRiskScore: 25,
    staticRiskFactors: [
      "Zona de alto nivel socioeconómico",
      "Excelente iluminación",
      "Presencia policial constante",
      "Bajo índice histórico de delitos",
      "Infraestructura urbana de calidad"
    ],

    // PILAR 2: RIESGO DINÁMICO
    dynamicRiskModifiers: [
      {
        type: "EVENT",
        value: 3,
        description: "Evento social en la zona",
        activeUntil: getFutureTimestamp(3)
      }
    ],
    currentDynamicScore: 3,

    // PILAR 3: RIESGO SUBJETIVO
    profileVulnerabilityFactors: {
      "turista": 1.1,
      "mujer_sola_noche": 1.0,
      "vehiculo_lujo": 1.4, // Aún hay riesgo por vehículos de lujo
      "local_residente": 0.5,
      "extranjero": 1.0,
      "objetos_valor": 1.3
    }
  },

  "zona_centro_historico": {
    id: "centro-01",
    name: "Centro Histórico",
    coordinates: {
      lat: 19.4326,
      lng: -99.1332
    },
    
    // PILAR 1: RIESGO ESTÁTICO
    staticRiskScore: 55,
    staticRiskFactors: [
      "Alta densidad de personas",
      "Iluminación variable",
      "Presencia policial durante el día",
      "Zona turística con riesgo de carterismo",
      "Calles estrechas y laberínticas",
      "Actividad comercial intensa"
    ],

    // PILAR 2: RIESGO DINÁMICO
    dynamicRiskModifiers: [
      {
        type: "CROWD_DENSITY",
        value: 12,
        description: "Alta concentración de personas (riesgo de carterismo)",
        activeUntil: getFutureTimestamp(4)
      },
      {
        type: "TIME_OF_DAY",
        value: -10,
        description: "Horario diurno con mayor seguridad",
        activeUntil: getFutureTimestamp(6)
      }
    ],
    currentDynamicScore: 2,

    // PILAR 3: RIESGO SUBJETIVO
    profileVulnerabilityFactors: {
      "turista": 1.7,
      "mujer_sola_noche": 1.6,
      "vehiculo_lujo": 1.5,
      "local_residente": 0.8,
      "extranjero": 1.6,
      "objetos_valor": 1.8
    }
  }
}

/**
 * Función auxiliar para obtener una zona por ID
 */
export const getZoneById = (zoneId) => {
  return Object.values(riskZones).find(zone => zone.id === zoneId)
}

/**
 * Función auxiliar para obtener una zona por nombre
 */
export const getZoneByName = (name) => {
  return Object.values(riskZones).find(zone => 
    zone.name.toLowerCase().includes(name.toLowerCase())
  )
}

/**
 * Función auxiliar para encontrar la zona más cercana a unas coordenadas
 * (Simulación - en producción se usaría un algoritmo de geolocalización)
 */
export const findNearestZone = (lat, lng) => {
  // Por ahora retorna la primera zona como ejemplo
  // En producción, esto calcularía la distancia real
  return Object.values(riskZones)[0]
}

/**
 * Función para calcular el riesgo total de una zona considerando el perfil del usuario
 * 
 * @param {string} zoneKey - Clave de la zona (ej: "zona_roma_norte")
 * @param {Object} userProfile - Perfil del usuario
 * @returns {Object} Objeto con el riesgo calculado y desglose
 */
export const calculateTotalRisk = (zoneKey, userProfile = {}) => {
  const zone = riskZones[zoneKey]
  if (!zone) {
    return null
  }

  // Calcular multiplicador basado en el perfil del usuario
  let profileMultiplier = 1.0
  const factors = []

  if (userProfile.nationality === 'Extranjera' || userProfile.nationality === 'Extranjero') {
    profileMultiplier *= zone.profileVulnerabilityFactors.extranjero || 1.0
    factors.push('Extranjero')
  }

  if (userProfile.gender === 'Mujer') {
    profileMultiplier *= zone.profileVulnerabilityFactors.mujer_sola_noche || 1.0
    factors.push('Mujer')
  }

  if (userProfile.hasValuableItems) {
    profileMultiplier *= zone.profileVulnerabilityFactors.objetos_valor || 1.0
    factors.push('Objetos de valor')
  }

  // Calcular riesgo total
  const staticRisk = zone.staticRiskScore
  const dynamicRisk = zone.currentDynamicScore
  const baseRisk = staticRisk + dynamicRisk
  
  // Aplicar multiplicador del perfil
  const totalRisk = Math.min(100, Math.max(0, baseRisk * profileMultiplier))

  return {
    zone: zone.name,
    staticRisk,
    dynamicRisk,
    profileMultiplier,
    totalRisk: Math.round(totalRisk),
    factors,
    riskLevel: getRiskLevel(totalRisk)
  }
}

/**
 * Función auxiliar para obtener el nivel de riesgo en texto
 */
const getRiskLevel = (riskScore) => {
  if (riskScore <= 25) return 'Muy Bajo'
  if (riskScore <= 40) return 'Bajo'
  if (riskScore <= 60) return 'Moderado'
  if (riskScore <= 75) return 'Alto'
  return 'Muy Alto'
}

/**
 * Exportar todas las zonas como array para facilitar iteración
 */
export const getAllZones = () => {
  return Object.values(riskZones)
}

/**
 * Exportar las claves de las zonas
 */
export const getZoneKeys = () => {
  return Object.keys(riskZones)
}

