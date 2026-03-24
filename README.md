# @docspace/ui-kit

> React UI component library extracted from the [ONLYOFFICE DocSpace client](https://github.com/ONLYOFFICE/DocSpace-client) codebase.

[![React](https://img.shields.io/badge/react-%3E%3D18.0.0-blue)](https://react.dev)

## About This Library

`@docspace/ui-kit` provides React components and a color system extracted from the [DocSpace-client monorepo](https://github.com/ONLYOFFICE/DocSpace-client) (`libs/ui-kit`).

<p align="center">
  <a href="https://github.com/ONLYOFFICE/DocSpace">
    <img width="800" src="https://static-blog.onlyoffice.com/wp-content/uploads/2025/05/12164704/DocSpace-API-roadmap.png" alt="ONLYOFFICE DocSpace">
  </a>
</p>

> **Note:** This library is currently in early development (`v0.0.1`). The API may change before a stable release.

## Features ✨

- **TypeScript-first** - Full type definitions included out of the box
- **Color system** - Built-in `globalColors` palette with named color tokens for light and dark UI states
- **Interactive docs** - Every component is documented with [Storybook](https://storybook.js.org/) stories and controls
- **Tree-shakeable** - Ships both ESM and CJS builds; import only what you use
- **Well-tested** - Components are tested with [Vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- **Modern tooling** - Built with Rollup, linted and formatted with [Biome](https://biomejs.dev/)

## Installation

```bash
# pnpm
pnpm add @docspace/ui-kit

# npm
npm install @docspace/ui-kit

# yarn
yarn add @docspace/ui-kit
```

**Peer dependencies:** `react` and `react-dom` ≥ 18.0.0

## Quick Start

### Using a Component

```tsx
import { Text } from "@docspace/ui-kit";

function App() {
  return (
    <Text fontSize="14px" isBold>
      Hello World
    </Text>
  );
}
```

### Using the Color Palette

```tsx
import { globalColors } from "@docspace/ui-kit/themes/globalColors";

const primaryBlue = globalColors.lightBlueMain;
const errorRed = globalColors.mainRed;
```

## Components

| Component | Description | Docs |
|-----------|-------------|------|
| `Text` | Flexible, customizable text rendering with typography control | [README](./components/text/README.md) |

## Theming

The library ships with `globalColors` - 100+ named color tokens. It can be imported directly or via the themes entry point:

```tsx
import { globalColors } from "@docspace/ui-kit/themes/globalColors";
// or
import { globalColors } from "@docspace/ui-kit/themes";

// Base
const white = globalColors.white; // "#ffffff"
const black = globalColors.black; // "#333333"

const primary = globalColors.lightBlueMain;
const success = globalColors.mainGreen;
const error = globalColors.mainRed;
const warning = globalColors.mainOrange;
```

## Development

Clone this repository or work within the [DocSpace-client monorepo](https://github.com/ONLYOFFICE/DocSpace-client) and run:

### Storybook - interactive component explorer

```bash
pnpm storybook
```

Opens at `http://localhost:6006` - browse components, tweak props with the controls panel, and see live previews.

### Tests

```bash
pnpm test           # run all tests once
pnpm test:watch     # watch mode
pnpm test:coverage  # with coverage report
pnpm test:ui        # Vitest UI dashboard
```

### Build

```bash
pnpm build          # production build (ESM + CJS + type declarations)
pnpm build:watch    # rebuild on file changes
```

### Lint & Format

```bash
pnpm lint           # check for lint issues
pnpm lint:fix       # auto-fix lint issues
pnpm format         # check lint and formatting
pnpm format:fix     # auto-fix lint and formatting
```

## Useful Links

| Resource | URL |
|----------|-----|
| 🌐 ONLYOFFICE Website | [onlyoffice.com](https://www.onlyoffice.com) |
| 🐙 DocSpace-client Monorepo | [github.com/ONLYOFFICE/DocSpace-client](https://github.com/ONLYOFFICE/DocSpace-client) |
| 📖 ONLYOFFICE API | [api.onlyoffice.com](https://api.onlyoffice.com) |
| 💬 Community Forum | [community.onlyoffice.com](https://community.onlyoffice.com) |
| 🆘 Help Center | [helpcenter.onlyoffice.com](https://helpcenter.onlyoffice.com) |
| 📣 Feedback | [feedback.onlyoffice.com](https://feedback.onlyoffice.com/forums/966080-your-voice-matters) |

## Contributing

Issues and feature requests are tracked in the [DocSpace-client repository](https://github.com/ONLYOFFICE/DocSpace-client/issues). Contributions are welcome - please open an issue or PR there, or start a discussion on the [community forum](https://community.onlyoffice.com).

## License

This library is distributed under the [GNU AGPL v3](http://www.gnu.org/licenses/agpl-3.0.html) license. See the source files for the full license text.