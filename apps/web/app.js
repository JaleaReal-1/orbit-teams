import { solutions } from './data/catalog.js';
import { whatsappUrl } from './data/contact.js';
import { requestMessage } from './lib/request.js';
const menu = document.querySelector('.menu-toggle');
menu?.addEventListener('click', () => {
  const expanded = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(expanded));
  document.querySelector('#navigation').classList.toggle('open', expanded);
});
document.querySelectorAll('#navigation a').forEach((link) =>
  link.addEventListener('click', () => {
    menu?.setAttribute('aria-expanded', 'false');
    document.querySelector('#navigation')?.classList.remove('open');
  }),
);
document.querySelectorAll('.whatsapp-link').forEach((link) => {
  link.href = whatsappUrl('Hola, Orbit Soft. Me gustaría conversar sobre un proyecto.');
  link.target = '_blank';
  link.rel = 'noopener';
});
const catalog = document.querySelector('#catalog');
function renderCatalog(filter = 'Todas') {
  catalog.replaceChildren(
    ...solutions
      .filter((s) => filter === 'Todas' || s.category === filter)
      .map((s) => {
        const article = document.createElement('article');
        article.className = 'solution-card';
        // Catalog is trusted, versioned editorial data; never inject form input here.
        article.innerHTML = `<span class="solution-icon ${s.color}" aria-hidden="true">${s.icon}</span><span class="solution-category">${s.category}</span><h3>${s.name}</h3><p>${s.description}</p><div class="card-meta"><span>${s.price}</span><small>${s.time}</small></div><a class="card-link" href="./solucion.html?id=${s.id}">Ver solución <span aria-hidden="true">↗</span><span class="sr-only"> ${s.name}</span></a>`;
        return article;
      }),
  );
}
if (catalog) {
  renderCatalog();
  document.querySelectorAll('[data-filter]').forEach((button) =>
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-filter]').forEach((b) => {
        b.classList.toggle('active', b === button);
        b.setAttribute('aria-pressed', String(b === button));
      });
      renderCatalog(button.dataset.filter);
    }),
  );
}
const select = document.querySelector('#solution-select');
if (select) {
  for (const s of solutions) select.add(new Option(s.name, s.name));
  const selected = solutions.find(
    (s) => s.id === new URLSearchParams(location.search).get('solution'),
  );
  if (selected) {
    select.value = selected.name;
    document.querySelector('#platform-select').value = selected.id === 'custom' ? 'Necesito orientación' : 'App Android';
  }
}
document.querySelectorAll('[data-platform]').forEach((a) =>
  a.addEventListener('click', () => {
    document.querySelector('#platform-select').value = a.dataset.platform;
    select.value =
      a.dataset.platform === 'Web informativa'
        ? 'Web informativa'
        : a.dataset.platform === 'Ambas'
          ? 'Desarrollo personalizado'
          : 'Campus Planner';
  }),
);
const form = document.querySelector('#request-form');
const date = form?.elements.date;
if (date) {
  const now = new Date();
  date.min = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const message = requestMessage(Object.fromEntries(new FormData(form)));
  document.querySelector('#message-preview').value = message;
  document.querySelector('#send-whatsapp').href = whatsappUrl(message);
  document.querySelector('#request-result').hidden = false;
  document.querySelector('#request-result').scrollIntoView({ behavior: 'smooth', block: 'center' });
});
document.querySelector('#copy-request')?.addEventListener('click', async () => {
  const preview = document.querySelector('#message-preview');
  try {
    await navigator.clipboard.writeText(preview.value);
    document.querySelector('#copy-status').textContent = 'Mensaje copiado.';
  } catch {
    preview.focus();
    preview.select();
    document.querySelector('#copy-status').textContent =
      'Seleccionamos el mensaje. Usa la opción Copiar de tu dispositivo.';
  }
});
document.querySelector('#year')?.replaceChildren(String(new Date().getFullYear()));
