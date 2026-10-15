import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
await rm('dist/web', { recursive: true, force: true });
await mkdir('dist/web', { recursive: true });
await cp('apps/web', 'dist/web', { recursive: true });
await cp('apps/mobile/campus-planner/dist', 'dist/web/demos/campus-planner', { recursive: true });
let commit = 'local';
try {
  commit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
} catch {}
await writeFile(
  'dist/web/health.json',
  JSON.stringify({ status: 'ok', product: 'JaleaSec', commit }),
);
console.log('Web comercial lista en dist/web');
