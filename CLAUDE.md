# CLAUDE.md

Guidance for AI assistants (Claude Code and others) working in this repository.

## Project overview

- **Name:** Balaebalao (Proposta Bala e Balão)
- **What it is:** A single-page commercial proposal (a website, not an app with
  a backend) for **Bala e Balão**, a party venue and children's buffet in
  Uberlândia, MG, Brazil.
- **Whose it is:** A personal proposal from **João**. It is a personal brand,
  never an agency. Do not add any agency name or branding.
- **The visual differentiator:** real 3D balloons in the hero (glossy material,
  specular reflections, strings) plus 3D confetti with simulated depth of field.

## Tech stack

- **Build:** Vite 5 + React 18 (`@vitejs/plugin-react`), plain JavaScript/JSX
  (no TypeScript, no router; it is one page).
- **3D:** `three`, `@react-three/fiber`, `@react-three/drei`. The 3D scene is
  loaded with `React.lazy` so it does not block first paint.
- **Styling:** hand-written CSS (no framework). Design tokens live in
  `src/styles/global.css`; component styles in `src/styles/app.css`.
- **Fonts:** Fredoka (display) and Plus Jakarta Sans (body), loaded from Google
  Fonts in `index.html`.

## Commands

```bash
npm install
npm run dev      # dev server (Vite)
npm run build    # production build to dist/
npm run preview  # serve the production build
```

There is **no test suite and no linter configured**. Verify changes by building
(`npm run build`) and by looking at the rendered page. There are no CI checks.

## Repository structure

```
index.html                 # entry, font links, meta
src/
  main.jsx                 # React root
  App.jsx                  # page layout: composes every section, hero scroll ref
  content.js               # ALL copy, prices, balloon colors (single source)
  components/
    Reveal.jsx             # IntersectionObserver reveal-on-scroll wrapper
    HeroFallback.jsx       # CSS-only balloons for devices without WebGL
  hooks/
    useReducedMotion.js    # tracks prefers-reduced-motion
    useDeviceCapability.js # tiers the device: 'high' | 'low' | 'none'
  three/
    BalloonScene.jsx       # Canvas, lights, Environment, cluster layout, parallax
    Balloon.jsx            # one glossy balloon + knot + string, float animation
    Confetti.jsx           # sprite confetti, near sharp / far soft (fake DOF)
  styles/
    global.css             # reset, CSS variables (:root), focus, skip-link
    app.css                # all section styling, animations, responsive, print
```

## Key conventions (follow these)

### Text rules (important, do not violate)
- **Never use a travessão** (em-dash `—` or en-dash `–`) in any user-visible
  text. Use a comma, a colon, or rewrite. There is none in the codebase now;
  keep it that way.
- Write correct Portuguese ("para", not "pra"), even in a light tone.
- Copy must not read like AI: no inflated adjectives, no marketing clichés.
- **All copy lives in `src/content.js`.** Edit text there, not inside JSX.

### Brand
- The brand is the name **"João"** (see `brand` in `content.js`). It must stay
  swappable for a logo: set `brand.logo` to an image path to replace the text
  mark. Never introduce an agency name.

### Color palette (defined in `src/styles/global.css` `:root`)
- Dark background gradient: `#2A0E3A` to `#4A1350`; text on dark: `#FFFFFF`.
- Light background: `#FFF6F0`; title `#241028`; body `#3B2440`; pink text
  `#C4185C`.
- Balloon/decoration colors (also in `content.js` `balloonColors`): rosa
  `#FF2E74`, amarelo `#FFC22E`, azul `#3FB9EC`, coral `#FF6060`, menta
  `#3ED6A6`.
- Avoid generic "AI aesthetic" defaults (cream + serif + terracotta; purple
  gradient on white). The look is high-contrast, premium, and playful.

### Typography
- Display: Fredoka (rounded). Body: Plus Jakarta Sans. Generous type scale via
  `clamp()`.

### Motion, performance, accessibility
- **Respect `prefers-reduced-motion`.** When reduced: no parallax, no balloon
  float, no reveal animation (handled in `useReducedMotion`, `Reveal`, the
  `three/` components, and a print/reduced-motion block in `app.css`).
- Target 60fps. `useDeviceCapability` tiers the device:
  - `high`: full scene.
  - `low`: fewer balloons, no confetti, lower DPR (`lowPower` prop).
  - `none`: no WebGL, render `HeroFallback` (CSS balloons) instead.
- The reflections come from drei `<Environment>` built with `<Lightformer>`s,
  **not** an external HDR file, so nothing is fetched from the network for the
  3D look. Keep it that way (the environment may be offline).
- Confetti depth of field is **faked** with two sprite layers (near sharp, far
  large/soft/transparent). There is no postprocessing dependency; do not add
  one lightly.

### PDF / print
- The page must print/export to PDF cleanly. `@media print` in `app.css` hides
  the 3D canvas, converts dark sections to light, and preserves hierarchy. If
  you add a section, add its print styles too.

### Accessibility details
- Keyboard focus must stay visible (`:focus-visible` in `global.css`).
- Keep the skip-link (`.skip-link`) and the `#conteudo-proposta` target.
- The 3D/decorative layers are `aria-hidden`.

## Adding or changing a section

1. Add/adjust its copy object in `src/content.js`.
2. Render it in `src/App.jsx` (reuse `SectionHeader` and `Reveal`).
3. Style it in `src/styles/app.css`, and add matching `@media print` rules.
4. `npm run build` and eyeball the result (desktop + mobile + reduced-motion).

## Git

- Development branch for this work: `claude/claude-md-docs-az73p3`.
- Do not commit `node_modules` or `dist` (see `.gitignore`).
- Write clear, descriptive commit messages. Do not commit secrets.
