// Calificación del lead: la decide el código, no el modelo (Q-04).
// Funciones puras, sin dependencias, para copiarlas tal cual a un nodo Code de n8n.

// Límites de cada rango de personas (Q-03). max null = «más de».
const PERSONAS = {
  '1-5': { min: 1, max: 5 },
  '6-20': { min: 6, max: 20 },
  '21-50': { min: 21, max: 50 },
  '50+': { min: 51, max: null },
};

// Q-04. Devuelve 'A', 'B', 'C', o null si todavía no hay con qué clasificar (Q-06).
//   lead: { personas_rango, ventas_moneda, ventas_min, ventas_max, ventas_no_dice, constituida }
//   config: { corte_a_ventas: {COP, USD}, corte_a_personas, corte_c_ventas: {COP, USD}, corte_c_personas }
function clasificar(lead, config) {
  if (lead.constituida === false) return 'C';

  const personas = PERSONAS[lead.personas_rango] || null;
  const tieneVentas = !lead.ventas_no_dice && (lead.ventas_min != null || lead.ventas_max != null);
  if (!personas && !tieneVentas) return null;

  const moneda = lead.ventas_moneda || 'COP';
  const corteA = config.corte_a_ventas[moneda];
  const corteC = config.corte_c_ventas[moneda];

  const ventasA = tieneVentas && lead.ventas_min != null && lead.ventas_min >= corteA;
  const personasA = personas && personas.min > config.corte_a_personas;
  if (ventasA || personasA) return 'A';

  // C exige las dos cosas: ventas por debajo del corte y pocas personas.
  const ventasC = tieneVentas && lead.ventas_max != null && lead.ventas_max <= corteC;
  const personasC = personas && personas.max != null && personas.max <= config.corte_c_personas;
  if (ventasC && personasC) return 'C';

  return 'B';
}

// Q-05 / Q-06: ¿se puede agendar a alguien que pide saltarse las preguntas?
function puedeAgendarSinCalificar(lead) {
  const tieneDolor = Boolean(lead.dolor && lead.dolor.trim());
  const tienePersonas = Boolean(PERSONAS[lead.personas_rango]);
  const tieneVentas = !lead.ventas_no_dice && (lead.ventas_min != null || lead.ventas_max != null);
  return tieneDolor && (tienePersonas || tieneVentas);
}

// H-01: lead caliente.
function esCaliente(lead, clase) {
  return clase === 'A'
    && (lead.para_cuando === 'lo_antes_posible' || lead.para_cuando === 'tres_meses')
    && (lead.decide === 'decide' || lead.decide === 'participa');
}

module.exports = { PERSONAS, clasificar, puedeAgendarSinCalificar, esCaliente };
