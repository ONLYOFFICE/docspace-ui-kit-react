// Which module folders a change touches, for `--changed`. Shared by scan.mjs
// (run on the host) and docker.mjs, which resolves it on the host and passes
// `--paths` in, because the image is built without .git.

import { execFileSync } from "node:child_process";

// Folders whose stories live under one module each: components/button,
// selectors/Files. A change there is scanned through that module's stories.
const MODULE_ROOTS = new Set([
  "components",
  "selectors",
  "billing",
  "ai-agent",
  "errors",
  "providers",
  "document-editor",
  "uploader",
  "docs",
]);

// Folders every story reaches. A change here can surface anywhere, which
// `--changed` cannot narrow down; the caller says so instead of guessing.
const SHARED_ROOTS = new Set([
  "styles",
  "hooks",
  "utils",
  "context",
  "constants",
  "enums",
  "types",
  "assets",
  "api",
  "locales",
  ".storybook",
]);

const git = (root, args) =>
  execFileSync("git", args, { cwd: root, encoding: "utf8" })
    .split("\n")
    .filter(Boolean);

export const changedModuleDirs = (root, base = "HEAD") => {
  const files = [
    ...git(root, ["diff", "--name-only", "--diff-filter=d", base]),
    ...git(root, ["ls-files", "--others", "--exclude-standard"]),
  ];
  const modules = new Set();
  const shared = new Set();
  for (const file of files) {
    const [top, second] = file.split("/");
    if (MODULE_ROOTS.has(top) && second) {
      modules.add(second.includes(".") ? top : `${top}/${second}`);
    } else if (SHARED_ROOTS.has(top)) {
      shared.add(top);
    }
  }
  return { modules: [...modules].sort(), shared: [...shared].sort() };
};
