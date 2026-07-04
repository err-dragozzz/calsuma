// Dev-only Node module resolver used by scripts/verify-math.ts so the project's
// extensionless / path-aliased TypeScript imports run directly under Node's
// built-in type stripping. Not used by the app or the production build.
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const SRC = new URL('../src/', import.meta.url);

export async function resolve(specifier, context, next) {
  // Resolve the "@/..." path alias to ./src/...
  if (specifier.startsWith('@/')) {
    const base = new URL(specifier.slice(2), SRC).href;
    for (const candidate of [`${base}.ts`, `${base}.tsx`, `${base}/index.ts`]) {
      if (existsSync(fileURLToPath(candidate))) {
        return { url: candidate, shortCircuit: true };
      }
    }
  }
  // Add a .ts extension to extensionless relative imports.
  if (specifier.startsWith('.') && !/\.[a-zA-Z]+$/.test(specifier)) {
    const candidate = new URL(`${specifier}.ts`, context.parentURL);
    if (existsSync(fileURLToPath(candidate))) {
      return { url: candidate.href, shortCircuit: true };
    }
  }
  return next(specifier, context);
}
