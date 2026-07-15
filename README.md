# Showcase

A responsive React landing page and design playground inspired by the editorial, technical energy of Greptile's marketing site. The implementation uses original branding, copy, graphics, and interaction patterns.

## Stack

- React 19
- TypeScript 6 in strict mode
- Vite 8
- CSS custom properties and native layout primitives
- ESLint with React Hooks rules

## Run locally

```bash
npm install
npm run dev
```

Production checks:

```bash
npm run check
```

## Structure

- `src/App.tsx` contains the top-level page composition.
- `src/components/` contains focused layout, section, and UI components.
- `src/data/siteContent.ts` contains reusable navigation, project, and capability data.
- `src/types/content.ts` contains shared content contracts.
- `src/styles.css` contains the visual system, responsive layouts, and motion.
- No component library or runtime styling dependency is required.

## First customization

The content is intentionally framed as a flexible showcase concept. Replace the example project narratives in `projectData` and the placeholder `hello@example.com` contact address before publishing publicly.
