const test = require('node:test');
const assert = require('node:assert');
const { clasificar, puedeAgendarSinCalificar, esCaliente } = require('../lib/clasificacion');

const config = {
  corte_a_ventas: { COP: 1e9, USD: 250000 },
  corte_a_personas: 20,
  corte_c_ventas: { COP: 5e8, USD: 125000 },
  corte_c_personas: 5,
};
const ventas = {
  menos500: { ventas_moneda: 'COP', ventas_min: 0, ventas_max: 5e8 },
  de500a1000: { ventas_moneda: 'COP', ventas_min: 5e8, ventas_max: 1e9 },
  de1000a5000: { ventas_moneda: 'COP', ventas_min: 1e9, ventas_max: 5e9 },
  mas5000: { ventas_moneda: 'COP', ventas_min: 5e9, ventas_max: null },
};

test('Q-04: A por ventas ≥ $1.000M', () => {
  assert.strictEqual(clasificar({ ...ventas.de1000a5000, personas_rango: '1-5' }, config), 'A');
  assert.strictEqual(clasificar({ ...ventas.mas5000 }, config), 'A');
});

test('Q-04: A por más de 20 personas, aunque venda poco', () => {
  assert.strictEqual(clasificar({ ...ventas.menos500, personas_rango: '21-50' }, config), 'A');
  assert.strictEqual(clasificar({ personas_rango: '50+' }, config), 'A');
});

test('Q-04: C solo con ventas < $500M y 5 personas o menos', () => {
  assert.strictEqual(clasificar({ ...ventas.menos500, personas_rango: '1-5' }, config), 'C');
});

test('Q-04: C si no está constituida, sin importar el tamaño', () => {
  assert.strictEqual(clasificar({ ...ventas.mas5000, constituida: false }, config), 'C');
});

test('Q-04: B en el medio', () => {
  assert.strictEqual(clasificar({ ...ventas.de500a1000, personas_rango: '6-20' }, config), 'B');
  assert.strictEqual(clasificar({ ...ventas.menos500, personas_rango: '6-20' }, config), 'B');
});

test('Q-04: «prefiero no decir» en ventas con personas → se clasifica por personas', () => {
  assert.strictEqual(clasificar({ ventas_no_dice: true, personas_rango: '6-20' }, config), 'B');
  assert.strictEqual(clasificar({ ventas_no_dice: true, personas_rango: '1-5' }, config), 'B');
  assert.strictEqual(clasificar({ ventas_no_dice: true, personas_rango: '21-50' }, config), 'A');
});

test('Q-06: sin personas ni ventas no hay clase', () => {
  assert.strictEqual(clasificar({}, config), null);
  assert.strictEqual(clasificar({ ventas_no_dice: true }, config), null);
});

test('Q-04: fuera de Colombia los cortes van en dólares', () => {
  assert.strictEqual(clasificar({ ventas_moneda: 'USD', ventas_min: 250000, ventas_max: 1250000 }, config), 'A');
  assert.strictEqual(clasificar({ ventas_moneda: 'USD', ventas_min: 0, ventas_max: 125000, personas_rango: '1-5' }, config), 'C');
});

test('Q-05: agenda sin calificar solo con dolor y personas o ventas', () => {
  assert.strictEqual(puedeAgendarSinCalificar({ dolor: 'cartera', personas_rango: '6-20' }), true);
  assert.strictEqual(puedeAgendarSinCalificar({ dolor: 'cartera', ...ventas.menos500 }), true);
  assert.strictEqual(puedeAgendarSinCalificar({ dolor: 'cartera' }), false);
  assert.strictEqual(puedeAgendarSinCalificar({ personas_rango: '6-20' }), false);
});

test('H-01: caliente = A, con prisa y con poder de decisión', () => {
  assert.strictEqual(esCaliente({ para_cuando: 'lo_antes_posible', decide: 'decide' }, 'A'), true);
  assert.strictEqual(esCaliente({ para_cuando: 'tres_meses', decide: 'participa' }, 'A'), true);
  assert.strictEqual(esCaliente({ para_cuando: 'explorando', decide: 'decide' }, 'A'), false);
  assert.strictEqual(esCaliente({ para_cuando: 'lo_antes_posible', decide: 'no_decide' }, 'A'), false);
  assert.strictEqual(esCaliente({ para_cuando: 'lo_antes_posible', decide: 'decide' }, 'B'), false);
});
