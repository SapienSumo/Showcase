# Running and Understanding Showcase

This guide explains how to run Showcase on localhost and how the React, TypeScript, Vite, and CSS layers work together to produce the page users see.

## Quick start

### Requirements

- Node.js `20.19+` or `22.12+` (Vite 8's supported range)
- npm, which is installed with Node.js

The project was most recently verified with Node `24.18.0` and npm `11.16.0`.

### Start the development site

Open Terminal and run:

```bash
cd /Users/paul.aliu/MyProjects/Showcase
npm install
npm run dev
```

Vite prints a local URL, normally:

```text
http://127.0.0.1:5173/
```

Open that URL in a browser. Keep the terminal process running while developing. Press `Ctrl+C` to stop it.

`npm install` is only required the first time, after pulling dependency changes, or after editing `package.json`.

### If port 5173 is already occupied

Vite automatically tries the next available port, such as `5174`. Use the exact URL printed in the terminal.

## npm commands

The `scripts` object in `package.json` is the command interface for the project.

| Command | Underlying command | Purpose |
| --- | --- | --- |
| `npm run dev` | `vite` | Starts the development server with hot module replacement. |
| `npm run lint` | `eslint .` | Checks source files for lint and React Hooks problems. |
| `npm run build` | `tsc -b && vite build` | Type-checks first, then creates the production bundle. |
| `npm run preview` | `vite preview` | Serves the generated `dist/` bundle locally for a production-like check. |

The `&&` in the build script is a command pipeline gate: Vite only bundles the application if TypeScript succeeds. A type error stops the build early.

Recommended pre-review check:

```bash
npm run lint
npm run build
```

## How a request becomes the page

The browser-facing flow is:

```text
Browser request
    ↓
index.html
    ↓ loads /src/main.tsx
React createRoot(...)
    ↓ renders
App.tsx and its section components
    ↓ styled by
styles.css
    ↓ transformed and served by
Vite
```

During development, Vite serves the modules directly and replaces changed modules without reloading the entire application. During a production build, Vite compiles and optimizes them into hashed files inside `dist/assets/`.

## Technology responsibilities

### React

React describes the page as reusable components rather than one large HTML document.

`App.tsx` composes the site in page order:

```tsx
<Header />
<Hero />
<Marquee />
<Work />
<Approach />
<Principles />
<Contact />
```

Smaller visual components such as `Arrow`, `Spark`, `Mark`, `HeroVisual`, and `ProjectVisual` are reused inside those sections. This keeps repeated SVG and visual logic in one place.

### TypeScript

TypeScript checks the shape of props and data before the browser receives the code.

For example, `ProjectVisual` derives its accepted project type directly from `projectData`:

```tsx
function ProjectVisual({ project }: {
  project: (typeof projectData)[number]
})
```

This means the visual component stays synchronized with the project objects without maintaining a second handwritten type. The `as const` declarations also preserve exact project IDs, labels, and color names.

The compiler runs in strict mode and rejects unused variables and parameters. It performs checks only; Vite handles the final browser bundle.

### Vite

Vite is the development server and build tool. The React plugin transforms JSX and enables React Fast Refresh.

Its configuration is intentionally small:

```ts
export default defineConfig({
  plugins: [react()],
})
```

### CSS

The project uses one global stylesheet with a small design system. It does not depend on a component library or CSS-in-JS runtime.

CSS is responsible for:

- colors, typography, borders, and spacing;
- grid and flexbox page structure;
- responsive layout changes;
- project illustration shapes;
- hover, reveal, orbit, marquee, and status animations;
- reduced-motion behavior for users who request it.

## Shared CSS system

### Design tokens

Reusable visual values live as custom properties in `:root`:

```css
:root {
  --paper: #ecece6;
  --ink: #29293a;
  --acid: #21e6a4;
  --lilac: #d8c8ff;
  --coral: #ff785f;
  --mono: "SFMono-Regular", Consolas, monospace;
}
```

Changing a token updates every class that references it. This is the CSS equivalent of a shared constant.

### Shared classes

The most important reusable classes are:

| Class | Responsibility |
| --- | --- |
| `.section-grid` | Provides the repeated label/content column structure. |
| `.eyebrow` | Styles section numbers and small uppercase labels. |
| `.cut-button` | Supplies the clipped button silhouette and shared alignment. |
| `.cut-button-dark` / `.cut-button-acid` | Modify the base button for a specific context. |
| `.text-link` | Supplies the underlined text action and arrow movement. |
| `.brand` / `.brand-mark` | Keeps logo treatment consistent in header and footer. |
| `.project-visual` | Provides the shared frame for all three project illustrations. |
| `.is-active`, `.is-open`, `.is-scrolled` | Represent UI state added by React. |
| `.sr-only` | Keeps accessible text available to screen readers without displaying it. |

This uses a base-plus-modifier pattern. For example, every clipped button receives `.cut-button`, while color or sizing differences come from an additional modifier class.

## Responsive design

The page starts with the full desktop layout and progressively changes at two breakpoints.

### Desktop: above 1100px

- Full navigation is visible.
- The hero is a multi-column grid.
- The animated system illustration occupies the right side.
- Projects use side-by-side copy and visuals.
- Principle cards appear in four columns.

### Compact desktop and tablet: 1100px and below

Defined by `@media (max-width: 1100px)`:

- The navigation becomes a menu button and expandable panel.
- Hero proportions tighten while retaining the split layout.
- Two-column content areas simplify.
- Principle cards move from four columns to two.

### Mobile: 760px and below

Defined by `@media (max-width: 760px)`:

- Shared grids collapse to one column.
- The hero visual moves below the text.
- Project tabs stack vertically.
- Project copy and artwork stack instead of sitting side by side.
- Principle cards become a single list.
- Footer columns become a vertical layout.
- Padding, type sizes, and visual heights reduce for the narrower screen.

Fluid values such as `clamp(54px, 17vw, 84px)` scale typography between fixed minimum and maximum sizes. Grid and flexbox handle most intermediate widths, reducing the number of breakpoint-specific overrides.

The final `prefers-reduced-motion` media query effectively disables animations and smooth scrolling for users who have reduced motion enabled in their operating system.

## Data and interaction flow

There is no backend or global state manager in the current site. State stays close to the interface that owns it.

### Navigation state

`Header` owns:

- `open`, which adds or removes `.is-open` on the responsive navigation;
- `scrolled`, which adds `.is-scrolled` after the page moves more than 24 pixels.

The scroll listener is registered in `useEffect` and removed when the component unmounts.

### Project state

`Work` owns:

- `activeProject`, the selected project index;
- `notesOpen`, whether the selected project's case note is expanded.

The flow is:

```text
User selects a tab
    ↓
setActiveProject(index)
    ↓
projectData[activeProject]
    ↓
copy, metric, tags, colors, and ProjectVisual update together
```

The project tab buttons expose `role="tab"` and `aria-selected`. The case-note button exposes `aria-expanded`, so assistive technology receives the same state change as visual users.

### Data-driven rendering

Repeated content is stored in arrays and rendered with `map()`:

- `projectData` produces project tabs and the active project panel;
- `capabilities` produces the three approach rows;
- marquee items are duplicated and mapped to create a seamless animation;
- tag and chart arrays create small repeated visual elements.

This is the application's main data pipeline: structured objects flow through React components into semantic HTML, while CSS classes determine presentation.

## Visual effects without image assets

Most of the visible artwork is produced locally from HTML, SVG, and CSS:

- inline SVG supplies the arrows, spark icon, and brand mark;
- gradients and dotted backgrounds create texture;
- borders, transforms, and `clip-path` create cards and cut-corner buttons;
- absolutely positioned elements create dashboards, boards, orbits, and archive cards;
- keyframes animate movement without JavaScript animation loops.

This keeps the landing page self-contained and makes its visuals responsive and themeable.

## File map

| File | Role |
| --- | --- |
| `index.html` | Browser document shell and page metadata. |
| `src/main.tsx` | React entry point; mounts `App` and imports global CSS. |
| `src/App.tsx` | Content data, components, state, and semantic page structure. |
| `src/styles.css` | Tokens, shared classes, layout, responsive rules, and animation. |
| `vite.config.ts` | Vite and React plugin configuration. |
| `tsconfig.app.json` | Strict TypeScript rules for browser source. |
| `eslint.config.js` | JavaScript, TypeScript, React Hooks, and Fast Refresh lint rules. |
| `package.json` | Dependencies and npm command definitions. |
| `dist/` | Generated production build; ignored by Git. |

## Common development loop

1. Start the site with `npm run dev`.
2. Edit `src/App.tsx` for structure, content, or React behavior.
3. Edit `src/styles.css` for layout or visual behavior.
4. Check desktop and mobile widths in the browser.
5. Run `npm run lint`.
6. Run `npm run build`.
7. Review the unstaged Git diff before staging or committing.

## Current content placeholder

Before public deployment, replace `hello@example.com` in `src/App.tsx` with the intended contact address. The three project stories are also starter content designed to demonstrate the component and visual system.
