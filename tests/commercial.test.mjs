import test from 'node:test';
import assert from 'node:assert/strict';
import { solutions, offers, filterSolutions } from '../apps/web/data/catalog.js';
import { requestMessage } from '../apps/web/lib/request.js';
import { whatsappUrl } from '../apps/web/data/contact.js';
test('every product has a complete unique commercial record', () => {
  assert.equal(solutions.length, 8);
  assert.equal(new Set(solutions.map((s) => s.id)).size, 8);
  for (const s of solutions) {
    for (const key of ['name', 'description', 'problem', 'audience', 'price', 'time'])
      assert.ok(s[key]);
    assert.ok(s.features.length);
    assert.ok(s.customization.length);
  }
});
test('request keeps every business field and encodes user text as a WhatsApp message', () => {
  const values = {
    name: 'Alex & Sol',
    clientType: 'Universitario',
    activity: 'Docente',
    solution: 'Course Manager',
    problem: 'Organizar & evaluar?',
    features: 'Asistencia\nReportes',
    users: '20',
    platform: 'App Android',
    currentTools: 'Excel',
    budget: '500',
    date: '2026-11-30',
  };
  const message = requestMessage(values);
  for (const value of Object.values(values)) assert.ok(message.includes(value));
  const url = new URL(whatsappUrl(message));
  assert.equal(url.hostname, 'wa.me');
  assert.equal(url.searchParams.get('text'), message);
});

test('first contact omits empty optional fields and preserves accents and newlines', () => {
  const message = requestMessage({
    name: ' Lucía ',
    clientType: 'Negocio',
    problem: 'Página & catálogo?\nJuliaca',
    budget: '   ',
    consent: 'on',
  });
  assert.equal(
    message,
    'Hola, JaleaSec. Quisiera una cotización.\n\nNombre: Lucía\nTipo de cliente: Negocio\nProblema: Página & catálogo?\nJuliaca',
  );
  assert.equal(new URL(whatsappUrl(message)).searchParams.get('text'), message);
  assert.ok(!message.includes('Por definir'));
});
test('editorial filters preserve categories and distinguish demo from proposals', () => {
  assert.equal(filterSolutions('Todas').length, solutions.length);
  assert.deepEqual(
    filterSolutions('Universitarios').map((s) => s.id),
    ['campus-planner', 'custom'],
  );
  assert.ok(filterSolutions('Negocios').every((s) => s.segments.includes('Negocios')));
  assert.ok(filterSolutions('Otras').every((s) => s.segments.length === 0));
  assert.ok(filterSolutions().every((s) => s.featured));
  assert.equal(solutions.filter((s) => s.status === 'Demo disponible').length, 1);
  assert.equal(solutions.find((s) => s.id === 'campus-planner').category, 'Estudiantes');
  assert.equal(offers.find((s) => s.id === 'web-negocio').price, 'Desde S/ 300');
  assert.equal(
    offers.find((s) => s.id === 'portafolio-universitario').price,
    'Solicitar cotización',
  );
});
