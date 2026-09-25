// Publish order: every vendored package has to be on npm before this one is.
//
// Some packages reach this repository as a tarball committed beside
// package.json -- `@onlyoffice/ai-chat` today -- because they are not on the
// registry yet. The dev copy is then a `file:` spec, which is fine: consumers
// never see devDependencies. The peer range is what they see, and it can only
// be satisfied from a registry. Publishing this package while its peer exists
// nowhere on npm ships a manifest no consumer can install cleanly.
//
// So, before a publish (not before a merge -- until then the peer range is a
// placeholder, fixed at publish time):
//
//   1. A `file:` spec in dependencies or peerDependencies is a hard failure:
//      it resolves against the consumer's directory, not this one.
//   2. For every peer whose dev copy is a `file:` tarball, the registry must
//      hold a version the peer range accepts. The range is resolved by npm
//      itself, prerelease rules included.
//
//   node .claude/scripts/release-check/registry.mjs
//
// Exit 1 on any finding, 2 when the registry could not be asked. Needs the
// network; reads no build.

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);

const pkg = JSON.parse(
  fs.readFileSync(path.join(ROOT, "package.json"), "utf8"),
);
const deps = pkg.dependencies ?? {};
const peers = pkg.peerDependencies ?? {};
const devs = pkg.devDependencies ?? {};

const findings = [];
const add = (title, detail) => findings.push({ title, detail });
let unreachable = false;

// --- 1. file: specs a consumer would see --------------------------------------

for (const [field, specs] of [
  ["dependencies", deps],
  ["peerDependencies", peers],
]) {
  for (const [name, spec] of Object.entries(specs)) {
    if (spec.startsWith("file:"))
      add(
        `file: spec in ${field}`,
        `${name}: ${spec}\n    Resolves against the consumer's directory, where no such tarball exists.`,
      );
  }
}

// --- 2. vendored peers must be on the registry ---------------------------------

// `npm` is a .cmd shim on Windows, which execFile cannot start without a shell.
const npmView = (spec) => {
  try {
    const out = execFileSync("npm", ["view", spec, "version", "--json"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      shell: process.platform === "win32",
    }).trim();
    if (!out) return { versions: [] };
    const parsed = JSON.parse(out);
    return { versions: Array.isArray(parsed) ? parsed : [parsed] };
  } catch (error) {
    const text = `${error.stdout ?? ""}${error.stderr ?? ""}`;
    if (/E404|Not Found/.test(text)) return { missing: true };
    return { error: text.trim().split("\n")[0] || String(error) };
  }
};

const vendored = Object.keys(peers)
  .filter((name) => devs[name]?.startsWith("file:"))
  .sort();

for (const name of vendored) {
  const range = peers[name];
  let result = npmView(`${name}@${range}`);
  // npm answers E404 both for an unknown package and for a range nothing
  // matches; asking for the bare name tells the two apart.
  if (result.missing && !npmView(name).missing) result = { versions: [] };
  if (result.error) {
    unreachable = true;
    add("registry not reachable", `${name}: ${result.error}`);
  } else if (result.missing)
    add(
      "vendored peer is not on npm",
      `${name} (dev copy ${devs[name]})\n    Publish it first, then set the peer range to the version published there.`,
    );
  else if (result.versions.length === 0)
    add(
      "no published version satisfies the peer range",
      `${name}: peer ${range}, dev copy ${devs[name]}\n    The package is on npm, but nothing there matches the range consumers will be held to.`,
    );
}

// --- report -------------------------------------------------------------------

if (findings.length === 0) {
  console.log(
    `registry: clean -- ${vendored.length} vendored peer(s) resolvable on npm` +
      (vendored.length ? ` (${vendored.join(", ")})` : ""),
  );
  process.exit(0);
}

for (const { title, detail } of findings)
  console.log(`- ${title}\n    ${detail}`);
process.exit(unreachable ? 2 : 1);
