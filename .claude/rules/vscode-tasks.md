---
paths:
  - ".vscode/**"
  - "ui-kit.code-workspace"
---

# VS Code tasks and the status-bar buttons

`ui-kit.code-workspace` drives six grouped status-bar buttons — Storybook, Check, Package,
Audit, E2E, Sync — through the **VsCodeTaskButtons** extension
(`spencerwmiles.vscode-task-buttons`, recommended in `.vscode/extensions.json`). Without the
extension the tasks still run from the command palette; only the buttons disappear.

The wiring is three layers, and **a change touches all three**:

1. **`package.json`** — the pnpm script, or a script under `.claude/scripts/`. This is the
   source of truth and the thing that also works from a terminal and from CI.
2. **`.vscode/tasks.json`** — a task whose `command` runs it, in the form
   `cd ${workspaceFolder} ; pnpm run <script>`. Its `label` is what a button references, and the
   labels are namespaced by group (`Check | Tsc`, `Audit | manifest invariants`).
3. **`ui-kit.code-workspace`** → `settings > VsCodeTaskButtons.tasks` — a button whose `task`
   field must match a `tasks.json` label **exactly**. A typo is silent: the button appears and
   does nothing.

Nothing checks the three agree. This does, in one line:

```bash
node -e 'const fs=require("fs");const t=JSON.parse(fs.readFileSync(".vscode/tasks.json","utf8"));const w=JSON.parse(fs.readFileSync("ui-kit.code-workspace","utf8").replace(/^\s*\/\/.*$/gm,""));const l=new Set(t.tasks.map(x=>x.label));for(const g of w.settings["VsCodeTaskButtons.tasks"])for(const b of g.tasks)if(!l.has(b.task))console.log("broken button ->",b.task)'
```

## Conventions worth keeping

- **Every file here is JSONC.** `.vscode/*.json` and the workspace file allow comments and
  trailing commas, so none of them parses as strict JSON — strip `//` lines before feeding any
  of them to `JSON.parse`.
- **Long-running tasks carry `isBackground: true` and a `dedicated` panel** — the Storybook
  server, `build:watch`, `test:watch`, the Vitest and Playwright UIs. Everything else uses a
  `new` panel so two runs do not overwrite each other's output.
- **A task that needs an argument uses an `inputs` prompt**, not a hardcoded value. `Audit |
scaffold a component` is the only one today.
- **The button tooltip is where a caveat goes.** Several tasks have one that is not obvious from
  the label: `verify:package` must pack with pnpm, the whole-package token audit reports a
  standing backlog rather than anything the current change caused, and the Docker E2E run is the
  only one whose screenshots match CI's rendering.

## Formatting bindings

Both the workspace file and `.vscode/settings.json` bind Prettier as the formatter — for
`json` and `jsonc` too — and set Biome's `codeActionsOnSave` entries to `never`. That is
deliberate, not a leftover: `biome.json` sets `formatter.enabled: false`, so Biome lints here
and Prettier formats. Turning Biome's formatter on in the editor would reformat files against
the repository's own configuration — and `pnpm format` is in no gate, so nothing would catch
it.

The JSON bindings pointed at VS Code's built-in formatter until `.prettierrc.yaml` was added.
That made format-on-save and `pnpm format` disagree on every `.json` file: VS Code keeps a
short object on one line, Prettier expands it once it passes 80 columns, so `.vscode/tasks.json`
flipped back and forth depending on which one ran last. Both now point at Prettier.
