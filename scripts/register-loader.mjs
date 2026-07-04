// Registers the dev-only resolver (scripts/dev-loader.mjs) so Node can run the
// project's TypeScript verification scripts directly:
//   node --import ./scripts/register-loader.mjs scripts/verify-math.ts
import { register } from 'node:module';

register('./dev-loader.mjs', import.meta.url);
