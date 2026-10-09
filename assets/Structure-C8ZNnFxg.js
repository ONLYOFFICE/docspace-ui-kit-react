import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{h as t,l as n}from"./blocks-D1qLjfJS.js";import{t as r}from"./jsx-runtime-BdxMnOeJ.js";import{i,r as a}from"./react-qN2cStNd.js";function o(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,strong:`strong`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...i(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(n,{title:`Getting started/Structure`}),`
`,(0,c.jsx)(t.h1,{id:`structure`,children:`Structure`}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.code,{children:`@onlyoffice/apps-ui-kit`}),` is a standalone repository. It builds, tests and runs this
Storybook on its own. Applications consume the `,(0,c.jsx)(t.strong,{children:`published package`}),`, which resolves to
`,(0,c.jsx)(t.code,{children:`dist/`}),`, not to the source folders listed below.`]}),`
`,(0,c.jsx)(t.h2,{id:`public-modules`,children:`Public modules`}),`
`,(0,c.jsxs)(t.p,{children:[`General-purpose UI, re-exported from the root entry point (`,(0,c.jsx)(t.code,{children:`index.ts`}),`):`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{children:`./
├── components/       # 98 components, one folder each
├── hooks/            # 11 React hooks (useDebounce, useIsMobile, useUnmount, ...)
├── providers/        # ThemeProvider, TranslationProvider, ErrorBoundary
├── context/          # ThemeContext, InterfaceDirectionContext
├── errors/           # Error pages: 401, 403, 404, offline, invalid link, ...
├── constants/        # Shared constants
├── enums/            # Shared enumerations
├── types/            # Shared TypeScript types
├── utils/            # Helpers: cookie, date, device, email, i18n, ...
├── styles/           # Global SCSS: mixins and variables
├── locales/          # Translation resources (English is committed)
└── assets/           # SVG icons, imported as React components (*.react.svg)
`})}),`
`,(0,c.jsx)(t.h2,{id:`portal-coupled-modules`,children:`Portal-coupled modules`}),`
`,(0,c.jsxs)(t.p,{children:[`These ship in the package too, but they need a live ONLYOFFICE Apps portal, and some of
them need MobX stores. They are not public API. The tiering is described in
`,(0,c.jsx)(t.code,{children:`docs/public-api.md`}),`, which ships with the package. Even so, the root entry point
re-exports `,(0,c.jsx)(t.code,{children:`billing`}),` and `,(0,c.jsx)(t.code,{children:`uploader`}),`, which is why the optional `,(0,c.jsx)(t.code,{children:`axios`}),` peer ends up in
the resolution graph (see `,(0,c.jsx)(t.code,{children:`docs/getting-started.md`}),`).`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{children:`./
├── ai-agent/         # AI chat panel and AI settings (needs @onlyoffice/ai-chat)
├── billing/          # Tariff, payment and services flows
├── uploader/         # Upload UI
├── document-editor/  # Wrapper around @onlyoffice/document-editor-react
├── selectors/        # Pickers: AI agent, people, room, files, groups, MCP servers
├── providers/api/    # ApiProvider, imported by subpath only
└── api/              # Portal REST client
`})}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.code,{children:`providers/Providers.tsx`}),` combines the error boundary, translation, theme and API
providers, and loads portal settings when it mounts. That makes it portal-specific, so
it is imported by subpath and is not part of `,(0,c.jsx)(t.code,{children:`providers/index.ts`}),`.`]}),`
`,(0,c.jsx)(t.h2,{id:`where-each-folder-appears-in-storybook`,children:`Where each folder appears in Storybook`}),`
`,(0,c.jsxs)(t.p,{children:[`The sidebar is grouped by what a reader is looking for, not by folder. `,(0,c.jsx)(t.strong,{children:`UI`}),` holds the
general-purpose components, and `,(0,c.jsx)(t.strong,{children:`Components`}),` holds the larger portal-level pieces,
some of which are public (Providers, Errors) and some are not.`]}),`
`,(0,c.jsxs)(t.table,{children:[(0,c.jsx)(t.thead,{children:(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.th,{children:`Sidebar entry`}),(0,c.jsx)(t.th,{children:`Source`}),(0,c.jsx)(t.th,{children:`Tier`})]})}),(0,c.jsxs)(t.tbody,{children:[(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`Getting started`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`docs/*.mdx`})}),(0,c.jsx)(t.td,{children:`Documentation`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`UI / …`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`components/`})}),(0,c.jsx)(t.td,{children:`Public`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`Components / AI Chat`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`ai-agent/ai-chat-panel/`})}),(0,c.jsx)(t.td,{children:`Portal-only`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`Components / AI Settings`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`ai-agent/settings/`})}),(0,c.jsx)(t.td,{children:`Portal-only`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`Components / Files, Rooms, Forms`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`docs/sections/`})}),(0,c.jsx)(t.td,{children:`Demo only`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`Components / Billing`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`billing/`})}),(0,c.jsx)(t.td,{children:`Portal-only`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`Components / Uploader`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`uploader/`})}),(0,c.jsx)(t.td,{children:`Portal-only`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`Components / Document Editor`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`document-editor/`})}),(0,c.jsx)(t.td,{children:`Portal-only`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`Components / Selectors`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`selectors/`})}),(0,c.jsx)(t.td,{children:`Portal-only`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`Components / Providers`}),(0,c.jsxs)(t.td,{children:[(0,c.jsx)(t.code,{children:`providers/`}),` (theme, translation, error boundary, api)`]}),(0,c.jsxs)(t.td,{children:[`Public, except `,(0,c.jsx)(t.code,{children:`api`})]})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`Components / Errors`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`errors/`})}),(0,c.jsx)(t.td,{children:`Public`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`Samples`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`docs/samples/`})}),(0,c.jsx)(t.td,{children:`Demo only`})]})]})]}),`
`,(0,c.jsxs)(t.p,{children:[`There is no "AI Agent" entry: the `,(0,c.jsx)(t.code,{children:`ai-agent/`}),` folder appears as two. `,(0,c.jsx)(t.strong,{children:`AI Chat`}),` is the
chat panel, and the toolbar, intro and new-chat screen are parts of it that show up inside
that story. `,(0,c.jsx)(t.strong,{children:`AI Settings`}),` holds the settings screens from `,(0,c.jsx)(t.code,{children:`ai-agent/settings/`}),`: models,
model assignment, MCP servers and web search. The fifth, knowledge, is still a placeholder
and has no story, and neither has the standalone `,(0,c.jsx)(t.code,{children:`chat-info-block/`}),`. The AI agent picker
is a different thing: it is `,(0,c.jsx)(t.code,{children:`selectors/AIAgent`}),`, under `,(0,c.jsx)(t.strong,{children:`Selectors / AIAgentSelector`}),`.`]}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.strong,{children:`Files`}),`, `,(0,c.jsx)(t.strong,{children:`Rooms`}),` and `,(0,c.jsx)(t.strong,{children:`Forms`}),` are not modules. They are portal screens put together
from the kit's components and the portal API from `,(0,c.jsx)(t.code,{children:`providers/api`}),`, so they live in
`,(0,c.jsx)(t.code,{children:`docs/sections/`}),` and are not shipped. The same goes for the `,(0,c.jsx)(t.strong,{children:`Samples`}),`. `,(0,c.jsx)(t.code,{children:`api/`}),` has
no sidebar entry of its own: it is described on `,(0,c.jsx)(t.strong,{children:`Getting started / API`}),`. `,(0,c.jsx)(t.code,{children:`hooks/`}),`,
`,(0,c.jsx)(t.code,{children:`utils/`}),` and `,(0,c.jsx)(t.code,{children:`constants/`}),` likewise have pages under `,(0,c.jsx)(t.strong,{children:`Getting started`}),` instead of
stories.`]}),`
`,`
`,(0,c.jsx)(t.h2,{id:`component-folder`,children:`Component folder`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{children:`components/button/
├── index.tsx             # Barrel: the only file consumers import from
├── Button.tsx            # Component
├── Button.types.ts       # Props, with JSDoc
├── Button.enums.ts       # Enumerations (optional)
├── Button.module.scss    # SCSS module that uses theme tokens (optional)
├── Button.stories.tsx    # Story (required)
├── button.test.tsx       # Vitest + Testing Library (optional)
└── README.md             # Ships in the package
`})}),`
`,(0,c.jsxs)(t.p,{children:[`Every component has a story. Some keep it in a subfolder: `,(0,c.jsx)(t.code,{children:`table`}),`, `,(0,c.jsx)(t.code,{children:`rows`}),` and `,(0,c.jsx)(t.code,{children:`tiles`}),`
do.`]}),`
`,`
`,(0,c.jsx)(t.h2,{id:`published-package`,children:`Published package`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{children:`@onlyoffice/apps-ui-kit/
├── dist/
│   ├── esm/              # ES modules only, no CommonJS build
│   ├── types/            # .d.ts declarations
│   └── styles.css        # All CSS in one file, for bundlers that cannot import CSS
├── locales/              # Translation resources
├── styles/               # SCSS mixins and variables
├── docs/                 # getting-started.md, components.md, public-api.md
└── **/README.md          # One per component, provider, context and util
`})}),`
`,(0,c.jsxs)(t.p,{children:[`Entry points are `,(0,c.jsx)(t.code,{children:`@onlyoffice/apps-ui-kit`}),` (the root barrel),
`,(0,c.jsx)(t.code,{children:`@onlyoffice/apps-ui-kit/<module path>`}),` subpaths, `,(0,c.jsx)(t.code,{children:`/styles.css`}),`, `,(0,c.jsx)(t.code,{children:`/locales/*`}),` and
`,(0,c.jsx)(t.code,{children:`/styles/*`}),`. Each component imports its own CSS, so `,(0,c.jsx)(t.code,{children:`styles.css`}),` is only needed when a
bundler cannot do that.`]}),`
`,`
`,(0,c.jsx)(t.h2,{id:`repository-tooling`,children:`Repository tooling`}),`
`,(0,c.jsx)(t.p,{children:`Kept in the repository only, not shipped:`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{children:`./
├── .storybook/       # Configuration, decorators, portal switcher, demo portal (mocks/)
├── docs/             # These pages, the section samples and the sample apps
├── scripts/          # Build steps, locale and icon sync, package verification
├── test/             # Vitest setup, mocks and fixtures
├── __tests__/        # Playwright visual-regression specs, run against Storybook
├── biome-plugins/    # Vendored i18n lint rules
├── css/, fonts/      # Fonts for Storybook and the E2E image
└── index.ts          # Root entry point
`})}),`
`,`
`,`
`,(0,c.jsx)(t.h2,{id:`tech-stack`,children:`Tech stack`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`React 19`}),`: a peer dependency, along with React-DOM, i18next and react-i18next`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`TypeScript 5.9`}),`: strict mode`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`SCSS Modules + CSS custom properties`}),`: styling and theming, with no runtime CSS-in-JS`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`Rollup 4`}),`: the library build, ESM only`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`MobX 6`}),`: state in the portal-coupled stores`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`i18next 25 / react-i18next 15`}),`: internationalization`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`Storybook 10`}),`: component documentation`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`Vitest 4`}),`: unit and component tests; `,(0,c.jsx)(t.strong,{children:`Playwright`}),` for visual regression`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`Biome`}),`: linting only. `,(0,c.jsx)(t.strong,{children:`Prettier`}),` does the formatting`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`Lefthook`}),`: git hooks; `,(0,c.jsx)(t.strong,{children:`pnpm`}),` is the package manager`]}),`
`]}),`
`]})}function s(e={}){let{wrapper:t}={...i(),...e.components};return t?(0,c.jsx)(t,{...e,children:(0,c.jsx)(o,{...e})}):o(e)}var c;function l(){return(l=e((()=>{c=r(),a(),t()})))()}l();export{s as default};