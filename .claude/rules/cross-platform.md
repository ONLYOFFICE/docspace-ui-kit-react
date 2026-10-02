---
paths:
  - "package.json"
  - "lefthook.yml"
  - "scripts/**"
  - ".claude/scripts/**"
  - "rollup.config.mjs"
  - ".vscode/**"
  - "ui-kit.code-workspace"
  - ".github/workflows/**"
---

# Every command has to run on Windows too

The gate does not cover this. CI is two `ubuntu-latest` jobs, so a command that only works on a
POSIX shell goes green in the pull request and breaks on the first Windows machine that runs it.
`lefthook.yml` is where a Windows developer's gate actually runs -- format, lint, tsc, test,
build and `verify:package` on pre-push -- so that is the surface that has to be portable.

## Scripts in `package.json`

They run under whatever shell npm hands them: `sh` on macOS and Linux, `cmd.exe` on Windows.
Nothing below is available in both.

| Do not write            | Write instead                                                                   |
| ----------------------- | ------------------------------------------------------------------------------- |
| `rm -rf dist`           | `node -e "require('node:fs').rmSync('dist', { recursive: true, force: true })"` |
| `cp`, `mv`, `mkdir -p`  | `node:fs` in a script under `scripts/`                                          |
| `VAR=value cmd`         | read `process.env.VAR` in the script, with a default                            |
| `cmd \| grep …`, `$(…)` | do the filtering in the script                                                  |
| `a ; b`                 | `a && b`                                                                        |

`pnpm clean` is the worked example: it deletes `dist` through `node -e`, not `rm -rf`.

## Scripts must not shell out to a Unix tool

`scripts/verify-package.mjs` is the model, and its comments say why. It reads a file out of the
`.tgz` with node's own gzip and a walk over the tar headers rather than calling `tar`, because
`tar` resolves to bsdtar under PowerShell and to GNU tar under Git Bash, and GNU tar reads
`C:\…` as a remote host. It also passes `shell: process.platform === "win32"` to `execFileSync`,
which is what makes a `.cmd` shim resolve there.

No build script shells out today. Keep it that way: node has `fs`, `zlib` and `child_process`.

## Ids are POSIX, and `path.sep` will not make them so

Use `toPosix` from `scripts/lib/fs-ids.mjs`; `assertPosixIds` beside it rejects an id that still
carries a `\`.

Do not hand-roll `.split(path.sep).join("/")`. `path.sep` is the _running_ platform's separator,
so that expression is a no-op on a path shaped by another one -- which is not hypothetical:
`toPosix` itself was written that way, the per-module CSS plugin keyed its map by a
still-backslashed id, `JSON.stringify` doubled the backslashes into the chunk, and the build
failed on the first stylesheet with "imports a stylesheet that was never compiled". The Windows
branch of any caller could not be exercised anywhere but Windows until that was fixed.

## VS Code tasks

`.vscode/tasks.json` sets `"options": { "cwd": "${workspaceFolder}" }` once, at the top level.
Do not prefix a command with `cd ${workspaceFolder} ; …`: `;` separates statements in `sh` and
in PowerShell but not in `cmd.exe`, so the prefix makes every button depend on which shell the
editor picked.

## What is exempt

`Dockerfile`, `compose.yaml` and the `test:e2e:docker:*` scripts target a Linux image, and the
steps inside `.github/workflows/ci.yml` target the Ubuntu runner. Shell syntax there is fine.

Prose is not exempt in spirit but is in practice: `grep`/`find` snippets in `.claude/rules/` and
`.claude/skills/` are instructions to run by hand, and they are POSIX. If you add one, prefer
pointing at a script under `.claude/scripts/` -- those are node and run everywhere.
