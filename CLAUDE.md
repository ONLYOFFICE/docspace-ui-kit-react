## Project Overview

`@docspace/ui-kit` — shared React component library used across all DocSpace frontend products (client, login, doceditor, management, sdk). Not published to npm; consumed as a local workspace dependency.

## Tech Stack

- **React 19** (peer dependency)
- **TypeScript 5** (strict mode, `tsconfig.json`)
- **Rollup** — library build (`rollup.config.mjs`), outputs ESM/CJS
- **Storybook 8** — component documentation and visual development
- **Vitest** — unit and component tests
- **Biome** — linting and formatting (replaces ESLint/Prettier)
- **styled-components** — CSS-in-JS theming
- **Lefthook** — git hooks (lint + tests on pre-push)
- **pnpm** — package manager

## Repository Structure

```
components/          — 80+ UI components, each in its own folder:
                        <name>/
                          index.ts
                          <Name>.tsx
                          <Name>.types.ts
                          <Name>.styled.ts (optional)
                          <Name>.stories.tsx
                          <Name>.test.tsx (optional)
constants/           — Shared constants
context/             — React contexts (ThemeContext, InterfaceDirectionContext)
document-editor/     — DocumentEditor wrapper component
enums/               — Shared enumerations
errors/              — Error page components (401, 403, 404, etc.)
hooks/               — Custom React hooks
providers/           — Root providers composition (Providers.tsx)
selectors/           — Reusable selector components (People, Room, Files, Groups)
styles/              — Global SCSS styles, mixins, variables
types/               — Shared TypeScript types
utils/               — Utility functions (cookie, date, device, email, i18n, etc.)
assets/icons/        — SVG icons as React components (*.react.svg)
.storybook/          — Storybook configuration
test/                — Test setup and mocks
index.ts             — Main library entry point
```

## Common Commands

```bash
# Install dependencies
pnpm install

# Library build
pnpm build

# Watch mode build
pnpm build:watch

# Storybook development server (port 6006)
pnpm storybook

# Build Storybook static
pnpm storybook-build

# Run tests
pnpm test

# Tests with UI
pnpm test:ui

# Tests with coverage
pnpm test:coverage

# Lint
pnpm lint
pnpm lint:fix

# Format
pnpm format
pnpm format:fix

# TypeScript check
pnpm tsc
```

## Coding Conventions

- **TypeScript**: strict mode; no `any`; explicit types on all exported symbols
- **Component file**: `ComponentName.tsx` + `ComponentName.types.ts` + `index.ts`
- **Theming**: styled-components with theme tokens from `ThemeContext`; no hardcoded colors or sizes
- **Icons**: SVG files in `assets/icons/` imported as React components (`*.react.svg`)
- **Exports**: all public API through `index.ts` at each folder level; tree-shaking must be preserved
- **Peer deps**: React and React-DOM are peer dependencies — never bundle them
- **`forwardRef`**: required on all interactive/input elements
- **Accessibility**: WCAG 2.1 AA — `aria-*` attributes, keyboard navigation, focus management
- **Biome**: 80-char line width, double quotes, trailing commas, CRLF line endings
- **Tests**: Vitest + React Testing Library, setup in `test/setup.ts`
- **Stories**: every component must have a `.stories.tsx` file

## Architecture Notes

- **Flat component model**: each component is self-contained in its folder; no deep nesting between components
- **Theme system**: light/dark themes defined in `.storybook/lightTheme.ts` / `darkTheme.ts`; consumed via `ThemeProvider` from `providers/`
- **Selectors**: complex data-driven selector UIs (People, Room, Files, Groups, MCPServers) live in `selectors/` — they depend on API and MobX stores
- **Providers**: `Providers.tsx` composes ThemeProvider, i18next, SocketProvider, etc.
- **API integration**: `utils/api/` and `utils/socket/` provide API client and WebSocket helpers used by selectors
- **Localization**: `scripts/copy-locales.js` must run before build/test to populate locale files; all commands include it automatically
