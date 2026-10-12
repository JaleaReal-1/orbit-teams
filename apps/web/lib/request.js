const fields = [
  ['name', 'Nombre'],
  ['whatsapp', 'WhatsApp'],
  ['activity', 'Carrera, profesión o negocio'],
  ['projectType', 'Tipo de proyecto'],
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
    'Hola, Orbit Soft. Quisiera una cotización.',
    '',
    ...fields.map(([key, label]) => `${label}: ${String(values[key] || 'Por definir').trim()}`),
  ].join('\n');
}
