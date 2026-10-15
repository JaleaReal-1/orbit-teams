const fields = [
  ['name', 'Nombre'],
  ['clientType', 'Tipo de cliente'],
  ['activity', 'Carrera, profesión o negocio'],

  ['solution', 'Solución'],
  ['problem', 'Problema'],
  ['features', 'Funciones necesarias'],
  ['users', 'Usuarios'],
  ['platform', 'Formato'],
  ['currentTools', 'Herramientas actuales'],
  ['budget', 'Presupuesto'],
  ['date', 'Fecha deseada'],
];
export function requestMessage(values) {
  return [
    'Hola, JaleaSec. Quisiera una cotización.',
    '',
    ...fields
      .filter(([key]) => String(values[key] ?? '').trim())
      .map(([key, label]) => `${label}: ${String(values[key]).trim()}`),
  ].join('\n');
}
