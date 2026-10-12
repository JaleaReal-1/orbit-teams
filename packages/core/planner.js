export function emptyPlanner() {
  return {
    version: 1,
    courses: [],
    tasks: [],
    notes: [],
    settings: { name: 'Mi espacio', color: '#a4ee7f' },
  };
}
const text = (value, max = 200) => typeof value === 'string' && value.length <= max;
const date = (value) =>
  typeof value === 'string' &&
  /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  !Number.isNaN(Date.parse(value)) &&
  new Date(value).toISOString().slice(0, 10) === value;
const id = (value) => typeof value === 'string' && /^[a-zA-Z0-9-]{1,100}$/.test(value);
const time = (value) => typeof value === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
export function validatePlanner(value) {
  if (
    !value ||
    value.version !== 1 ||
    !['courses', 'tasks', 'notes'].every(
      (key) => Array.isArray(value[key]) && value[key].length <= 500,
    )
  )
    throw new Error('Copia incompatible o demasiado grande (máximo 500 registros por módulo).');
  if (
    !value.settings ||
    !text(value.settings.name, 80) ||
    !/^#[a-f0-9]{6}$/i.test(value.settings.color)
  )
    throw new Error('Configuración inválida.');
  const ids = new Set();
  for (const item of [...value.courses, ...value.tasks, ...value.notes]) {
    if (!item || !id(item.id) || ids.has(item.id))
      throw new Error('Identificadores inválidos o duplicados.');
    ids.add(item.id);
  }
  for (const c of value.courses) {
    if (
      !text(c.name, 100) ||
      !c.name.trim() ||
      !text(c.teacher, 100) ||
      !text(c.room, 80) ||
      !['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].includes(c.day) ||
      !time(c.start) ||
      !time(c.end) ||
      c.end <= c.start
    )
      throw new Error('Curso u horario inválido.');
  }
  const courseIds = new Set(value.courses.map((c) => c.id));
  for (const t of value.tasks) {
    if (
      !text(t.title, 200) ||
      !t.title.trim() ||
      !date(t.date) ||
      !['Tarea', 'Examen'].includes(t.kind) ||
      typeof t.done !== 'boolean' ||
      !(t.courseId === '' || courseIds.has(t.courseId))
    )
      throw new Error('Tarea inválida o curso desconocido.');
  }
  for (const n of value.notes)
    if (!text(n.title, 200) || !n.title.trim() || !text(n.body, 5000))
      throw new Error('Nota inválida.');
  // Only documented fields survive restore: ignore extra keys from external files.
  return {
    version: 1,
    courses: value.courses.map(({ id, name, teacher, room, day, start, end }) => ({
      id,
      name,
      teacher,
      room,
      day,
      start,
      end,
    })),
    tasks: value.tasks.map(({ id, title, date, kind, done, courseId }) => ({
      id,
      title,
      date,
      kind,
      done,
      courseId,
    })),
    notes: value.notes.map(({ id, title, body }) => ({ id, title, body })),
    settings: { name: value.settings.name, color: value.settings.color },
  };
}
export function removeCourse(state, courseId) {
  return {
    ...state,
    courses: state.courses.filter((c) => c.id !== courseId),
    tasks: state.tasks.map((t) => (t.courseId === courseId ? { ...t, courseId: '' } : t)),
  };
}
export function plannerSummary(state) {
  return {
    courses: state.courses.length,
    pending: state.tasks.filter((t) => !t.done).length,
    completed: state.tasks.filter((t) => t.done).length,
    exams: state.tasks.filter((t) => t.kind === 'Examen' && !t.done).length,
  };
}
export function exportBackup(state) {
  return JSON.stringify(validatePlanner(state), null, 2);
}
export function importBackup(raw) {
  if (typeof raw !== 'string' || raw.length > 5_000_000) throw new Error('La copia supera 5 MB.');
  try {
    return validatePlanner(JSON.parse(raw));
  } catch (error) {
    throw new Error(`No se pudo restaurar: ${error.message}`);
  }
}
