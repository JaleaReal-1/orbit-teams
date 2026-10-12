import { solutions } from './data/catalog.js';
const solution = solutions.find((s) => s.id === new URLSearchParams(location.search).get('id'));
const root = document.querySelector('#detail');
if (!solution) {
  root.innerHTML =
    '<div class="detail-hero"><h1>Solución no encontrada.</h1><p>Explora las opciones disponibles en nuestro catálogo.</p><a class="button" href="./#soluciones">Volver al catálogo ↗</a></div>';
} else {
  const s = solution;
  document.title = `${s.name} · Orbit Soft`;
  document.querySelector('meta[name="description"]').content = s.description;
  root.innerHTML = `<section class="detail-hero"><a class="back-link" href="./#soluciones">← Volver al catálogo</a><span class="solution-icon ${s.color}">${s.icon}</span><p class="eyebrow">${s.category.toUpperCase()} / ${s.status.toUpperCase()}</p><h1>${s.name}</h1><p>${s.description}</p></section><section class="detail-body"><div><h2>${s.tagline}</h2><p>${s.problem}</p><h2>¿Para quién?</h2><p>${s.audience}</p><h2>Funciones principales</h2><ul>${s.features.map((f) => `<li>${f}</li>`).join('')}</ul><h2>Lo adaptamos a ti</h2><ul>${s.customization.map((f) => `<li>${f}</li>`).join('')}</ul><h2>Un alcance acordado</h2><p>Las funciones se delimitan en la propuesta. El uso inicial es local e individual; compartir información entre dispositivos requiere una etapa adicional. La entrega incluye orientación de uso y condiciones de soporte por escrito.</p>${s.id === 'clinic-pocket' ? '<p>La gestión de datos de salud requiere definir privacidad, control de acceso y respaldos antes de una entrega real. Esta propuesta no sustituye un sistema clínico certificado.</p>' : ''}</div><aside class="detail-aside"><span class="badge">${s.status}</span><strong>${s.price}</strong><p>Plazo orientativo: ${s.time}</p><a class="button" href="./?solution=${s.id}#solicitud">Solicitar información ↗</a>${s.id === 'campus-planner' ? '<a class="text-link" style="margin-top:20px" href="./demos/campus-planner/" target="_blank" rel="noopener">Probar demo ↗</a>' : ''}<p class="demo-disclaimer">Valores referenciales, sujetos al alcance. Dominio, hosting, publicación en tiendas y servicios externos se evalúan por separado.</p></aside></section>`;
}
