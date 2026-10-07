import { cp, mkdir, rm, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');
const target = path.join(root, 'android', 'app', 'src', 'main', 'assets', 'www');

try {
  const info = await stat(dist);
  if (!info.isDirectory()) throw new Error();
} catch {
  throw new Error('dist/ does not exist. Run "bun run build" first.');
}

await rm(target, { recursive: true, force: true });
await mkdir(target, { recursive: true });
await cp(dist, target, { recursive: true });
console.log(`Copied ${dist} -> ${target}`);
