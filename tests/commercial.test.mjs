import test from 'node:test';
import assert from 'node:assert/strict';
import { solutions } from '../apps/web/data/catalog.js';
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
    whatsapp: '+51 999 999 999',
    activity: 'Docente',
    projectType: 'Profesional',
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
