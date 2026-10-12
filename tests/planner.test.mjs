import test from 'node:test';
import assert from 'node:assert/strict';
import {
  emptyPlanner,
  importBackup,
  exportBackup,
  removeCourse,
  plannerSummary,
} from '../packages/core/planner.js';
import { tasksCsv, hasPermission, createSessionService } from '../packages/core/modules.js';
const fixture = () => ({
  ...emptyPlanner(),
  courses: [
    {
      id: 'course-1',
      name: 'Software',
      teacher: 'Docente',
      room: 'A1',
      day: 'Lunes',
      start: '09:00',
      end: '10:30',
    },
  ],
  tasks: [
    {
      id: 'task-1',
      title: 'Avance',
      courseId: 'course-1',
      kind: 'Tarea',
      date: '2026-10-12',
      done: false,
    },
  ],
});
test('backup round trip preserves offline data and deletes unrelated extra properties', () => {
  const state = fixture();
  state.notes.push({ id: 'note-1', title: 'Privada', body: 'Contenido <b>texto</b>' });
  assert.deepEqual(importBackup(exportBackup(state)), state);
  const raw = JSON.stringify({ ...state, token: 'must-not-survive' });
  assert.equal(importBackup(raw).token, undefined);
});
test('restore rejects broken copies, duplicate IDs, invalid dates, schedules and dangling courses', () => {
  for (const value of ['{', 'null', '{"version":2}', 'x'.repeat(5_000_001)])
    assert.throws(() => importBackup(value));
  const mutate = (fn) => {
    const state = fixture();
    fn(state);
    assert.throws(() => importBackup(JSON.stringify(state)));
  };
  mutate((s) => (s.tasks[0].id = 'course-1'));
  mutate((s) => (s.tasks[0].courseId = 'unknown'));
  mutate((s) => (s.tasks[0].date = '2026-02-30'));
  mutate((s) => (s.courses[0].end = '08:00'));
  mutate((s) => (s.courses[0].start = '99:00'));
  mutate((s) => (s.settings.color = 'url(evil)'));
  mutate((s) => (s.tasks[0].done = 'yes'));
});
test('deleting a course preserves tasks and detaches their association', () => {
  const state = removeCourse(fixture(), 'course-1');
  assert.equal(state.courses.length, 0);
  assert.equal(state.tasks.length, 1);
  assert.equal(state.tasks[0].courseId, '');
  assert.deepEqual(importBackup(exportBackup(state)), state);
});
test('summary separates pending and completed tasks', () => {
  const state = fixture();
  state.tasks.push({ ...state.tasks[0], id: 'task-2', kind: 'Examen', done: true });
  assert.deepEqual(plannerSummary(state), { courses: 1, pending: 1, completed: 1, exams: 0 });
});
test('CSV quotes content and neutralizes spreadsheet formulas', () => {
  const state = fixture();
  state.tasks[0].title = '=HYPERLINK("bad")';
  assert.match(tasksCsv(state), /"'=HYPERLINK\(""bad""\)"/);
});
test('future session stays disabled and role policy defaults to denied', async () => {
  assert.equal(hasPermission('viewer', 'write'), false);
  assert.equal(hasPermission('unknown', 'read'), false);
  assert.equal(hasPermission('owner', 'export'), true);
  const service = createSessionService();
  assert.equal(await service.currentUser(), null);
  await assert.rejects(service.signIn({}), /no habilitada/);
});
