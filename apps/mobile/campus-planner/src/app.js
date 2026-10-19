import './styles.css';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { LocalPlannerRepository } from './data/repository.js';
import {
  emptyPlanner,
  removeCourse,
  plannerSummary,
  exportBackup,
  importBackup,
  validatePlanner,
} from '../../../../packages/core/planner.js';
import { tasksCsv } from '../../../../packages/core/modules.js';
import { template } from './config.js';
const repository = new LocalPlannerRepository();
let state,
  active = 'home',
  filter = 'all',
  busy = false;
const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
const createId = () =>
  [...crypto.getRandomValues(new Uint8Array(16))]
    .map((v) => v.toString(16).padStart(2, '0'))
    .join('');
const app = document.querySelector('#app');
app.innerHTML = `<div class="shell"><header class="top"><div class="brand"><span>◈</span> ${template.title}</div><span class="status">LOCAL · SIN CUENTA</span></header><div class="greeting"><small>TU ESPACIO ACADÉMICO</small><h1 id="space-name"></h1><p>${template.subtitle} Todo se guarda en este dispositivo.</p></div><nav class="tabs" aria-label="Vistas">${[
  ['home', 'Inicio'],
  ['courses', 'Cursos'],
  ['tasks', 'Tareas'],
  ['notes', 'Notas'],
  ['settings', 'Ajustes'],
]
  .map(([key, label]) => `<button data-tab="${key}" disabled>${label}</button>`)
  .join(
    '',
  )}</nav><main id="view" class="view" aria-busy="true"><p class="notice">Abriendo tu espacio…</p></main><footer class="footer">JaleaSec · Campus Planner<br>${Capacitor.isNativePlatform() ? 'Aplicación Android · Almacenamiento local' : 'Demo de navegador · No es una PWA'} · Sin sincronización</footer></div><dialog class="dialog" id="editor"></dialog><div id="toast" class="toast" role="status" hidden></div>`;
let storageFailed = false;
try {
  state = await repository.load();
} catch {
  storageFailed = true;
  state = emptyPlanner();
}
function toast(message) {
  const node = document.querySelector('#toast');
  node.textContent = message;
  node.hidden = false;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => (node.hidden = true), 6500);
}
async function commit(next) {
  if (busy) return false;
  busy = true;
  try {
    const clean = validatePlanner(next);
    await repository.save(clean);
    state = clean;
    render();
    return true;
  } catch (error) {
    render();
    toast(`No se pudo guardar. ${error.message}`);
    return false;
  } finally {
    busy = false;
  }
}
const empty = (title, message) => `<div class="empty"><strong>${title}</strong>${message}</div>`;
const courseName = (id) => state.courses.find((c) => c.id === id)?.name || 'Sin curso';
const taskItem = (t) =>
  `<article class="item ${t.done ? 'completed' : ''}"><input type="checkbox" data-toggle="${t.id}" ${t.done ? 'checked' : ''} aria-label="Marcar ${escape(t.title)} como ${t.done ? 'pendiente' : 'completada'}"><div class="item-content"><h3>${escape(t.title)}</h3><small>${t.kind} · ${t.date} · ${escape(courseName(t.courseId))}</small></div><div class="item-actions"><button class="icon-button" data-edit="tasks:${t.id}" aria-label="Editar ${escape(t.title)}">✎</button><button class="icon-button" data-delete="tasks:${t.id}" aria-label="Eliminar ${escape(t.title)}">×</button></div></article>`;
function render() {
  document.documentElement.style.setProperty('--accent', state.settings.color);
  document.querySelector('#space-name').textContent = state.settings.name;
  document.querySelectorAll('[data-tab]').forEach((b) => {
    b.disabled = false;
    b.classList.toggle('active', b.dataset.tab === active);
    b.setAttribute('aria-current', b.dataset.tab === active ? 'page' : 'false');
  });
  const view = document.querySelector('#view');
  view.setAttribute('aria-busy', 'false');
  if (storageFailed) {
    view.innerHTML =
      empty(
        'No pudimos leer tus datos',
        'No sobrescribiremos el almacenamiento. Revisa el espacio disponible o recupera tu copia antes de continuar.',
      ) +
      '<button class="button danger" id="reset" style="margin-top:20px">Reiniciar almacenamiento</button>';
    return;
  }
  if (active === 'home') {
    const summary = plannerSummary(state);
    const pending = state.tasks
      .filter((t) => !t.done)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 5);
    view.innerHTML = `<div class="stats"><div class="stat"><b>${summary.courses}</b><span>Cursos</span></div><div class="stat"><b>${summary.pending}</b><span>Pendientes</span></div><div class="stat"><b>${summary.completed}</b><span>Completadas</span></div></div><div class="view-header"><h2>Próximas actividades</h2><button class="button" data-new="tasks">+ Actividad</button></div>${pending.length ? pending.map(taskItem).join('') : empty('Un espacio para tus metas', 'Añade tus cursos y tu primera actividad para empezar.')}<h2 class="subheading">Tu horario semanal</h2>${
      state.courses.length
        ? days
            .filter((day) => state.courses.some((c) => c.day === day))
            .map(
              (day) =>
                `<h3 class="schedule-day">${day}</h3>${state.courses
                  .filter((c) => c.day === day)
                  .sort((a, b) => a.start.localeCompare(b.start))
                  .map(
                    (c) =>
                      `<article class="item"><div class="item-content"><h3>${escape(c.name)}</h3><small>${c.start} — ${c.end} · ${escape(c.room || 'Aula por definir')}</small></div></article>`,
                  )
                  .join('')}`,
            )
            .join('')
        : empty('Tu semana todavía está libre', 'Registra horarios desde la sección Cursos.')
    }<div class="notice">Los recordatorios de esta versión son la lista de pendientes. Las notificaciones del teléfono se incorporarán en una siguiente etapa.</div>`;
  }
  if (active === 'courses')
    view.innerHTML = `<div class="view-header"><h2>Mis cursos</h2><button class="button" data-new="courses">+ Curso</button></div>${state.courses.length ? state.courses.map((c) => `<article class="item"><div class="item-content"><h3>${escape(c.name)}</h3><small>${c.day} · ${c.start} — ${c.end}</small><p>${escape(c.teacher || 'Docente por definir')}<br>${escape(c.room || 'Aula por definir')}</p></div><div class="item-actions"><button class="icon-button" data-edit="courses:${c.id}" aria-label="Editar ${escape(c.name)}">✎</button><button class="icon-button" data-delete="courses:${c.id}" aria-label="Eliminar ${escape(c.name)}">×</button></div></article>`).join('') : empty('Tu semestre empieza aquí', 'Añade un curso con su horario y aula. Para otro bloque horario, crea una segunda entrada del curso.')}`;
  if (active === 'tasks') {
    const items = state.tasks
      .filter((t) => filter === 'all' || (filter === 'pending' ? !t.done : t.done))
      .sort((a, b) => a.date.localeCompare(b.date));
    view.innerHTML = `<div class="view-header"><h2>Tareas y exámenes</h2><button class="button" data-new="tasks">+ Actividad</button></div><label class="filter">Mostrar<select id="task-filter"><option value="all">Todas</option><option value="pending">Pendientes</option><option value="done">Completadas</option></select></label>${items.length ? items.map(taskItem).join('') : empty('Sin actividades en esta vista', 'Añade una tarea o examen, o cambia el filtro.')}`;
    document.querySelector('#task-filter').value = filter;
  }
  if (active === 'notes')
    view.innerHTML = `<div class="view-header"><h2>Mis notas</h2><button class="button" data-new="notes">+ Nota</button></div>${state.notes.length ? state.notes.map((n) => `<article class="item"><div class="item-content"><h3>${escape(n.title)}</h3><p>${escape(n.body)}</p></div><div class="item-actions"><button class="icon-button" data-edit="notes:${n.id}" aria-label="Editar ${escape(n.title)}">✎</button><button class="icon-button" data-delete="notes:${n.id}" aria-label="Eliminar ${escape(n.title)}">×</button></div></article>`).join('') : empty('Una idea merece su espacio', 'Guarda apuntes y notas privadas. Se quedan en este dispositivo.')}`;
  if (active === 'settings')
    view.innerHTML = `<div class="view-header"><h2>Tu espacio, a tu manera</h2></div><form id="settings-form"><label>Nombre de tu espacio<input name="name" value="${escape(state.settings.name)}" maxlength="80" required></label><label>Color de acento<input type="color" name="color" value="${state.settings.color}"></label><button class="button">Guardar configuración</button></form><h2 class="subheading">Copias y reportes</h2><p class="settings-text">Exporta una copia JSON y consérvala en un lugar privado. Al restaurarla, reemplazas los datos actuales. Los archivos no están cifrados.</p><div class="settings-actions"><button class="button secondary" id="backup">Exportar copia</button><button class="button secondary" id="csv">Reporte de tareas CSV</button></div><label>Restaurar una copia JSON<input id="restore" type="file" accept=".json,application/json"></label><div class="notice">Sin cuenta, servidor ni sincronización. Al desinstalar o borrar el almacenamiento puedes perder los datos. Haz una copia antes. Los roles y el acceso compartido pertenecen a una futura etapa.</div><div class="settings-actions"><button class="button secondary" id="sample">Cargar ejemplo ficticio</button><button class="button danger" id="reset">Borrar todos los datos</button></div>`;
}
function openEditor(collection, itemId) {
  const item = state[collection].find((i) => i.id === itemId) || {};
  const input = (label, name, value = '', type = 'text', attrs = '') =>
    `<label>${label}<input name="${name}" type="${type}" value="${escape(value)}" ${attrs}></label>`;
  const options = (name, values, selected) =>
    `<select name="${name}">${values.map(([value, label]) => `<option value="${escape(value)}" ${value === selected ? 'selected' : ''}>${escape(label)}</option>`).join('')}</select>`;
  let fields;
  if (collection === 'courses')
    fields = `${input('Nombre del curso', 'name', item.name, 'text', 'required maxlength="100"')}${input('Docente (opcional)', 'teacher', item.teacher, 'text', 'maxlength="100"')}${input('Aula (opcional)', 'room', item.room, 'text', 'maxlength="80"')}<label>Día${options(
      'day',
      days.map((d) => [d, d]),
      item.day,
    )}</label><div class="form-grid">${input('Desde', 'start', item.start || '09:00', 'time', 'required')}${input('Hasta', 'end', item.end || '10:30', 'time', 'required')}</div>`;
  if (collection === 'tasks')
    fields = `${input('Título de la actividad', 'title', item.title, 'text', 'required maxlength="200"')}<label>Curso${options('courseId', [['', 'Sin curso'], ...state.courses.map((c) => [c.id, c.name])], item.courseId)}</label><label>Tipo${options(
      'kind',
      [
        ['Tarea', 'Tarea'],
        ['Examen', 'Examen'],
      ],
      item.kind,
    )}</label>${input('Fecha', 'date', item.date, 'date', 'required')}`;
  if (collection === 'notes')
    fields = `${input('Título', 'title', item.title, 'text', 'required maxlength="200"')}<label>Tu nota<textarea name="body" rows="7" maxlength="5000">${escape(item.body || '')}</textarea></label>`;
  const dialog = document.querySelector('#editor');
  dialog.innerHTML = `<h2>${itemId ? 'Editar' : 'Añadir'} ${collection === 'courses' ? 'curso' : collection === 'tasks' ? 'actividad' : 'nota'}</h2><form id="item-form">${fields}<div class="dialog-actions"><button type="button" class="button secondary" id="cancel-editor">Cancelar</button><button class="button" type="submit">Guardar</button></div></form>`;
  dialog.showModal();
  dialog.querySelector('#cancel-editor').onclick = () => dialog.close();
  dialog.querySelector('form').onsubmit = async (event) => {
    event.preventDefault();
    if (busy) return;
    const values = Object.fromEntries(new FormData(event.target));
    Object.keys(values).forEach((key) => (values[key] = values[key].trim()));
    const nextItem = {
      ...values,
      id: itemId || createId(),
      ...(collection === 'tasks' ? { done: item.done ?? false } : {}),
    };
    const next = {
      ...state,
      [collection]: itemId
        ? state[collection].map((i) => (i.id === itemId ? nextItem : i))
        : [...state[collection], nextItem],
    };
    const button = event.submitter;
    button.disabled = true;
    if (await commit(next)) {
      dialog.close();
      toast('Guardado en este dispositivo.');
    } else button.disabled = false;
  };
}
async function download(contents, filename, type) {
  if (Capacitor.isNativePlatform()) {
    const result = await Filesystem.writeFile({
      path: filename,
      data: contents,
      directory: Directory.Cache,
      encoding: Encoding.UTF8,
    });
    await Share.share({
      title: 'Campus Planner · Exportación',
      files: [result.uri],
      dialogTitle: 'Guardar o compartir copia',
    });
  } else {
    const url = URL.createObjectURL(new Blob([contents], { type }));
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
app.addEventListener('click', async (event) => {
  const target = event.target.closest('button');
  if (!target || busy) return;
  if (target.dataset.tab) {
    active = target.dataset.tab;
    render();
  }
  if (target.dataset.new) openEditor(target.dataset.new);
  if (target.dataset.edit) openEditor(...target.dataset.edit.split(':'));
  if (target.dataset.delete) {
    const [collection, id] = target.dataset.delete.split(':');
    if (
      !confirm(
        collection === 'courses'
          ? '¿Eliminar el curso? Las tareas se conservarán sin curso asociado.'
          : '¿Eliminar este registro?',
      )
    )
      return;
    await commit(
      collection === 'courses'
        ? removeCourse(state, id)
        : { ...state, [collection]: state[collection].filter((i) => i.id !== id) },
    );
  }
  if (target.id === 'backup' || target.id === 'csv') {
    try {
      await download(
        target.id === 'backup' ? exportBackup(state) : '\ufeff' + tasksCsv(state),
        `campus-planner-${new Date().toISOString().slice(0, 10)}.${target.id === 'backup' ? 'json' : 'csv'}`,
        target.id === 'backup' ? 'application/json' : 'text/csv;charset=utf-8',
      );
    } catch (error) {
      toast(`Exportación cancelada o fallida. ${error.message}`);
    }
  }
  if (
    target.id === 'reset' &&
    confirm('¿Borrar todos los datos locales? Exporta una copia si necesitas conservarlos.')
  ) {
    if (await commit(emptyPlanner())) {
      storageFailed = false;
      render();
      toast('Datos borrados.');
    }
  }
  if (target.id === 'sample') {
    if (
      (state.courses.length || state.tasks.length || state.notes.length) &&
      !confirm('El ejemplo reemplazará tus registros. ¿Continuar?')
    )
      return;
    const next = emptyPlanner();
    next.settings.name = 'Semestre de ejemplo';
    next.courses = [
      {
        id: 'demo-course-1',
        name: 'Desarrollo de software',
        teacher: 'Docente de ejemplo',
        room: 'Aula B-204',
        day: 'Lunes',
        start: '09:00',
        end: '10:30',
      },
      {
        id: 'demo-course-2',
        name: 'Investigación aplicada',
        teacher: 'Docente de ejemplo',
        room: 'Aula A-101',
        day: 'Miércoles',
        start: '14:00',
        end: '15:30',
      },
    ];
    const now = new Date();
    const localDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    next.tasks = [
      {
        id: 'demo-task-1',
        title: 'Preparar avance de proyecto',
        kind: 'Tarea',
        date: localDate,
        courseId: 'demo-course-1',
        done: false,
      },
      {
        id: 'demo-task-2',
        title: 'Repasar metodología',
        kind: 'Examen',
        date: localDate,
        courseId: 'demo-course-2',
        done: false,
      },
    ];
    next.notes = [
      {
        id: 'demo-note-1',
        title: 'Idea para mi proyecto',
        body: 'Este es un ejemplo ficticio. Puedes editarlo o borrarlo.',
      },
    ];
    if (await commit(next)) toast('Ejemplo ficticio cargado.');
  }
});
app.addEventListener('change', async (event) => {
  const target = event.target;
  if (target.dataset.toggle)
    await commit({
      ...state,
      tasks: state.tasks.map((t) =>
        t.id === target.dataset.toggle ? { ...t, done: target.checked } : t,
      ),
    });
  if (target.id === 'task-filter') {
    filter = target.value;
    render();
  }
  if (target.id === 'restore' && target.files[0]) {
    try {
      if (target.files[0].size > 5_000_000) throw new Error('Máximo 5 MB.');
      const next = importBackup(await target.files[0].text());
      if (confirm('La copia es válida. ¿Reemplazar todos los datos actuales?')) {
        if (await commit(next)) toast('Copia restaurada.');
      }
    } catch (error) {
      toast(error.message);
    }
    target.value = '';
  }
});
app.addEventListener('submit', async (event) => {
  if (event.target.id !== 'settings-form') return;
  event.preventDefault();
  const values = Object.fromEntries(new FormData(event.target));
  values.name = values.name.trim();
  if (!values.name) {
    toast('Escribe un nombre para tu espacio.');
    return;
  }
  if (await commit({ ...state, settings: values })) toast('Configuración guardada.');
});
render();
