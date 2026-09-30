// Runs scan.mjs inside the ui-kit-tests image, against the working tree as it
// is on disk: the image is rebuilt first (only its last `COPY . .` layer, once
// the dependencies are cached), so an edit made a minute ago is what gets
// scanned. The report lands in audits/story-console/ on the host through the
// `stories-console` service's volume in compose.yaml.
//
//   node .claude/scripts/story-console/docker.mjs                 # every story
//   node .claude/scripts/story-console/docker.mjs --filter button
//   node .claude/scripts/story-console/docker.mjs --changed [--base master]
//   node .claude/scripts/story-console/docker.mjs --no-build ...  # reuse the image as is
//
// Every other flag is scan.mjs's and is passed through. `--changed` is
// resolved here, because the image has no .git.

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import { changedModuleDirs } from "./changed.mjs";

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);

const argv = process.argv.slice(2);
const forward = [];
let build = true;
let changed = false;
let base = "HEAD";
for (let i = 0; i < argv.length; i += 1) {
  if (argv[i] === "--no-build") build = false;
  else if (argv[i] === "--changed") changed = true;
  else if (argv[i] === "--base") base = argv[++i];
  else forward.push(argv[i]);
}

if (changed) {
  const { modules, shared } = changedModuleDirs(ROOT, base);
  if (shared.length) {
    console.log(
      `story-console: shared code changed (${shared.join(", ")}); --changed ` +
        "only covers the stories under the changed modules",
    );
  }
  if (!modules.length) {
    console.log("story-console: no changed module has stories");
    process.exit(0);
  }
  forward.push("--paths", modules.join(","));
}

const docker = (args) => {
  const result = spawnSync("docker", ["compose", ...args], {
    cwd: ROOT,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.error) {
    console.error(
      `story-console: cannot run docker -- ${result.error.message}`,
    );
    process.exit(2);
  }
  return result.status ?? 2;
};

// Created here, not by docker: a bind-mount source docker creates is root-owned
// on Linux.
fs.mkdirSync(path.join(ROOT, "audits"), { recursive: true });

if (build && docker(["build", "stories-console"]) !== 0) process.exit(2);

process.exit(
  docker([
    "run",
    "--rm",
    "stories-console",
    "node",
    ".claude/scripts/story-console/scan.mjs",
    "--start",
    ...forward,
  ]),
);
