# Repository Guidelines

## Project Structure & Module Organization
App Router pages and layouts live in `app/`, grouped by feature folders (e.g., `app/(marketing)/about/page.tsx`). Shared UI sits in `components/` with subfolders such as `components/sections/` for home-page slices and `components/ui/` for shadcn primitives defined in `components.json`. Data helpers, API wrappers, and configuration utilities belong in `lib/`. Static assets (logos, fonts, OG images) reside in `public/`; reference them through `/assets/...` paths. Create new tests or scripts alongside the source they exercise, mirroring the folder name for quick discovery.

## Build, Test, and Development Commands
- `npm run dev` — Launches the local Next.js server with hot reload at `http://localhost:3000`.
- `npm run build` — Produces the production bundle and validates the TypeScript graph.
- `npm start` — Serves the previously built bundle for smoke-testing deployments.
- `npm run lint` — Runs ESLint with the Next.js config; use `npm run lint -- --fix` before opening a PR.

## Coding Style & Naming Conventions
Use TypeScript with strict mode and the `@/*` path alias for imports. Follow 2-space indentation, trailing commas, and single quotes only when JSX requires them—run the repo’s configured formatter (VS Code default or Prettier extension) to stay consistent. Name React components in PascalCase (`HeroSection.tsx`), hooks in camelCase (`useNewsletterForm.ts`), and route segments in lowercase. Keep server-only code in the `app/api/` tree and client components annotated with `"use client"` when needed.

## Testing Guidelines
While no automated suite ships today, new work should ship with component tests using React Testing Library and Vitest (recommended stack) placed in `__tests__/ComponentName.test.tsx`. Snapshot coverage is acceptable for presentational sections; interactive logic needs behavioral assertions. Mock external services (e.g., Mailchimp) via helpers inside `lib/test/`. Run `npm run lint` as a pre-flight until a formal `npm test` script lands.

## Commit & Pull Request Guidelines
Commits follow the short imperative style seen in history (e.g., `Wire newsletter forms to Mailchimp via API route`). Keep messages under ~70 characters and focus on user-facing value. For PRs, include: context, before/after screenshots for UI tweaks, reproduction steps for bug fixes, linked Linear/GitHub issue IDs, and a checklist of tests run. Request review from an engineer familiar with the affected section and wait for CI (build + lint) to pass before merging.
