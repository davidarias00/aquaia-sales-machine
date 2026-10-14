// A qué canal de Discord va cada aviso (N-01). Función pura, para un nodo Code de n8n.
//
// «Escalar a un humano» = avisar en Discord. NO pone la etiqueta bot_off / humano:
// Luna sigue disponible y solo se calla si una persona escribe en la conversación (C-08).

const CANAL_POR_TIPO = {
  lead_caliente: 'lead-caliente',         // H-01
  pide_persona: 'lead-caliente',          // C-09
  ficha: 'agenda',                        // S-02
  prebriefing: 'agenda',                  // S-16
  reprogramada: 'agenda',                 // A-14
  cancelada: 'agenda',                    // A-14
  max_reprogramaciones: 'agenda',         // A-15
  sin_confirmar: 'agenda',                // S-06
  no_llego: 'agenda',                     // S-09
  david_borro_reunion: 'agenda',          // S-15
  baja_con_reunion: 'agenda',             // B-04
  no_es_lead: 'otros-mensajes',           // G-01
  ya_tuvo_reunion: 'otros-mensajes',      // G-03
  pregunta_sin_respuesta: 'otros-mensajes', // C-07
  sin_tamano: 'otros-mensajes',           // Q-06a
  c_insiste: 'otros-mensajes',            // Q-08
  formulario_sin_whatsapp: 'otros-mensajes', // E-05
  fallo: 'fallos',                        // A-10, y cualquier error
  reporte_semanal: 'reporte',             // N-02
};

// Devuelve el canal o lanza error: un aviso sin canal es un fallo, no se manda a ciegas.
function canalDeAviso(tipo) {
  const canal = CANAL_POR_TIPO[tipo];
  if (!canal) throw new Error(`Aviso sin canal: ${tipo}`);
  return canal;
}

// Ninguna acción de aviso puede callar a Luna.
function etiquetasAlEscalar() {
  return [];
}

module.exports = { CANAL_POR_TIPO, canalDeAviso, etiquetasAlEscalar };
