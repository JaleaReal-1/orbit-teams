import { readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';
import { solutions, offers } from '../apps/web/data/catalog.js';

const webRoot = fileURLToPath(new URL('../apps/web/', import.meta.url));
const pages = [
  'index.html',
  'negocios.html',
  'universitarios.html',
  'proyectos.html',
  'solucion.html',
  'privacidad.html',
];

test('commercial navigation, assets and anchors resolve from root and legacy subdirectory', async () => {
  for (const page of pages) {
    const html = await readFile(path.join(webRoot, page), 'utf8');
    for (const prefix of ['/', '/orbit-soft/']) {
      for (const [, relative] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
        const url = new URL(relative, `https://local.test${prefix}${page}`);
        if (url.origin !== 'https://local.test') continue;
        assert.ok(url.pathname.startsWith(prefix), `${page}: ${relative} escapes ${prefix}`);
        let target = decodeURIComponent(url.pathname.slice(prefix.length));
        if (!target || target.endsWith('/')) target += 'index.html';
        const file =
          target === 'demos/campus-planner/index.html'
            ? fileURLToPath(new URL('../apps/mobile/campus-planner/index.html', import.meta.url))
            : path.join(webRoot, target);
        await access(file);
        if (url.hash) {
          const destination = await readFile(file, 'utf8');
          assert.ok(
            destination.includes(`id="${url.hash.slice(1)}"`),
            `${page}: missing anchor ${relative}`,
          );
        }
        if (url.searchParams.has('id'))
          assert.ok(solutions.some((s) => s.id === url.searchParams.get('id')));
        if (url.searchParams.has('solution'))
          assert.ok(
            [...offers, ...solutions].some((s) => s.id === url.searchParams.get('solution')),
          );
      }
    }
  }
});

// Optional animation must never be a prerequisite for reading the page.
test('reveal enhancement tolerates missing observer and respects reduced motion', async () => {
  const { revealSections } = await import('../apps/web/lib/reveal.js');
  const originalWindow = globalThis.window;
  const originalMatchMedia = globalThis.matchMedia;
  const root = {
    querySelectorAll() {
      throw new Error('Fallback must leave content alone');
    },
  };
  try {
    globalThis.window = {};
    assert.doesNotThrow(() => revealSections(root));
    globalThis.window = {
      IntersectionObserver: class {
        constructor() {
          throw new Error('Motion disabled');
        }
      },
    };
    globalThis.matchMedia = () => ({ matches: true });
    assert.doesNotThrow(() => revealSections(root));
  } finally {
    if (originalWindow === undefined) delete globalThis.window;
    else globalThis.window = originalWindow;
    if (originalMatchMedia === undefined) delete globalThis.matchMedia;
    else globalThis.matchMedia = originalMatchMedia;
  }
});
