const test = require('node:test');
const assert = require('node:assert');
const { CANAL_POR_TIPO, canalDeAviso, etiquetasAlEscalar } = require('../lib/avisos');

test('N-01: cada aviso va solo a su canal', () => {
  assert.strictEqual(canalDeAviso('lead_caliente'), 'lead-caliente');
  assert.strictEqual(canalDeAviso('pide_persona'), 'lead-caliente');
  assert.strictEqual(canalDeAviso('ficha'), 'agenda');
  assert.strictEqual(canalDeAviso('prebriefing'), 'agenda');
  assert.strictEqual(canalDeAviso('no_es_lead'), 'otros-mensajes');
  assert.strictEqual(canalDeAviso('sin_tamano'), 'otros-mensajes');
  assert.strictEqual(canalDeAviso('fallo'), 'fallos');
  assert.strictEqual(canalDeAviso('reporte_semanal'), 'reporte');
});

test('N-01: solo existen los 5 canales acordados', () => {
  const canales = new Set(Object.values(CANAL_POR_TIPO));
  assert.deepStrictEqual([...canales].sort(), ['agenda', 'fallos', 'lead-caliente', 'otros-mensajes', 'reporte']);
});

test('N-01: un aviso sin canal es un error, no se manda a ciegas', () => {
  assert.throws(() => canalDeAviso('inventado'), /Aviso sin canal/);
});

test('Escalar a un humano no pone bot_off ni ninguna etiqueta que calle a Luna', () => {
  assert.deepStrictEqual(etiquetasAlEscalar(), []);
});
