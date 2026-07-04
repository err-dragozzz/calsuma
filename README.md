# Calsuma

A premium, tactile **3D retro calculator** for the web — engineered to feel like a real physical instrument sitting on your desk. Built with Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion and Zustand.

Inspired by Braun ET66/ET44, vintage Casio and Sharp calculators, and classic electronic lab equipment. Realism comes from lighting, depth, materials, shadows, proportions and motion — not gimmicks.

---

## Features

- **Classic + Scientific modes** — arithmetic, modulo, percentage, ± , decimals; plus `sin cos tan log ln √ x² x³ xʸ n! π e mod rand` and parentheses.
- **Safe math engine** — a hand-written tokenizer → shunting-yard parser → RPN evaluator. **No `eval`, no `Function`**, so expressions can never execute code. Degrees/radians supported.
- **Memory register** — MC / MR / MS / M+ / M-.
- **Unlimited history** — searchable, with copy, pin, recall and delete. Persists across sessions.
- **Full keyboard support** — digits, `+ − × ÷ ^ ( ) % !`, `Enter` = equals, `Esc` = all-clear, `Delete` = clear entry, `Backspace` = delete.
- **Physical interactions** — keys compress with spring physics; the whole body tilts up to 8° toward the pointer and breathes subtly when idle; LCD boot sequence.
- **Two themes** — warm Ivory and dark Graphite — plus high-contrast mode, adjustable font size and result precision.
- **Audio** — optional synthesised mechanical click and power-on chime (Web Audio, no audio files).
- **Accessibility** — WCAG-minded: semantic landmarks, ARIA roles (switch/radiogroup/dialog), focus trapping in panels, visible focus rings, screen-reader announcements, and full `prefers-reduced-motion` support.
- **PWA** — installable, offline-capable service worker, web manifest, maskable icons.
- **SEO** — metadata, Open Graph, Twitter cards, JSON-LD structured data, sitemap and robots.
- **Resilient** — graceful handling of divide-by-zero, overflow, NaN and invalid input, with route-level error boundaries so the app never white-screens.

---

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Production build:

```bash
npm run build
npm run start
```

Other scripts:

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # next lint
npm run format      # prettier --write .
```

> Requires Node.js 18.18+.

---

## Project structure

```
src/
  app/                 App Router: layout, page, manifest, robots, sitemap, error boundaries
  components/
    calculator/        Calculator body, LCD Display, Key, Keypad
    history/           HistoryPanel, HistoryItem
    settings/          SettingsPanel
    layout/            Toolbar
    ui/                Reusable atoms: IconButton, Toggle, Segmented, Slider, Sheet
    icons/             Inline SVG icon set
    CalsumaApp.tsx     Client root orchestrator (boot, keyboard, sound, panels)
    ServiceWorkerRegister.tsx
  constants/           Key layouts + default settings
  context/             ThemeManager (syncs settings to <html> data-attributes)
  hooks/               useTilt, useKeyboard, useSound, useMediaQuery, useMounted, useAnimationsEnabled
  lib/math/            tokenizer, parser, evaluator, format, public evaluate() API
  store/               Zustand stores (calculator + settings), persisted to localStorage
  types/               Shared TypeScript types
  utils/               cn, id, clipboard, storage, time, expression helpers
public/                Icons, OG image, service worker, favicon
scripts/               Icon generation + math verification (dev only)
```

### Architecture notes

- **State** lives in two Zustand stores. `settingsStore` persists appearance/behaviour; `calculatorStore` persists history and the memory register (the volatile working expression is intentionally not persisted). Both use an SSR-safe storage adapter and a `hydrated` flag to avoid hydration mismatches.
- **Theming** is driven entirely by CSS custom properties keyed off `data-theme`, `data-contrast`, `data-font-size` and `data-animations` on `<html>`. A tiny blocking script applies the saved theme before first paint to prevent flashes.
- **3D** is pure CSS transforms and layered box-shadows (no Three.js), keeping it lightweight and 60fps. Framer Motion drives the springy key presses, pointer tilt, panel transitions and LCD digit animation.
- **Presentational vs stateful** — components stay presentational; `CalsumaApp` is the single stateful orchestrator.

---

## Verifying the math engine

The math engine has an executable spec that runs the real TypeScript source under Node's built-in type stripping:

```bash
node --import ./scripts/register-loader.mjs scripts/verify-math.ts
```

It covers precedence, associativity, unary minus, functions (deg/rad), factorial, percentage, modulo, constants, error handling and number formatting (58 assertions).

## Regenerating assets

```bash
python3 scripts/generate-icons.py   # requires Pillow
```

---

## License

MIT © Uv
