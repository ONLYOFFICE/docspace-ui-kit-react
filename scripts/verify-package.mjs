// Runs the two packaging validators against a real tarball.
//
// Both are invoked through `npx --yes` rather than added as devDependencies:
// the repository's dependencies test detects usage by scanning for
// import/require/from literals, and a CLI-only tool has none, so declaring
// them would be reported as an unused dependency and fail the push. Adding
// them properly means an allowlist entry on the client side -- tracked as debt.
//
// The tarball MUST be produced by pnpm. `publishConfig` field overrides are a
// pnpm feature; `npm pack` leaves them unapplied, so an npm-packed tarball has
// no `exports` and no `main` and every check reports total failure for the
// wrong reason. That is debt B-8, and it is why `attw --pack .` is useless here.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import zlib from "node:zlib";

const PKG_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

// shell on win32: pnpm and npx are .CMD shims there, and Node will not spawn
// one directly -- without this the script fails with ENOENT before it checks
// anything, on the platform where nobody would think to look.
const run = (cmd, args, opts = {}) =>
  execFileSync(cmd, args, {
    encoding: "utf8",
    shell: process.platform === "win32",
    ...opts,
  });

// Reads one file out of a .tgz with node's own gzip and a walk over the tar
// headers, never the `tar` binary. `tar` resolves to bsdtar in PowerShell and
// to the GNU tar from Git Bash under lefthook, and GNU tar reads `C:\...` as a
// remote `host:path` spec: "Cannot connect to C: resolve failed". So this
// passed when run by hand and failed in the pre-push gate, on Windows only.
const readFromTarball = (file, entry) => {
  const buf = zlib.gunzipSync(fs.readFileSync(file));

  for (let off = 0; off + 512 <= buf.length;) {
    const name = buf.toString("utf8", off, off + 100).replace(/\0.*/, "");

    if (!name) {
      off += 512;
      continue;
    }

    const size = Number.parseInt(
      buf
        .toString("utf8", off + 124, off + 136)
        .replace(/\0.*/, "")
        .trim() || "0",
      8,
    );

    if (name === entry) {
      return buf.toString("utf8", off + 512, off + 512 + size);
    }

    off += 512 + Math.ceil(size / 512) * 512;
  }

  throw new Error(`${entry} is not in ${path.basename(file)}`);
};

// Without dist/ this still packs, and publint then reports six missing entry
// points -- which reads as a broken `exports`/`publishConfig` rather than as
// "the build never ran". Say which it is.
const DIST_DIR = path.join(PKG_DIR, "dist");

if (!fs.existsSync(DIST_DIR)) {
  console.error(
    `${path.relative(PKG_DIR, DIST_DIR) || "dist"} does not exist, so there is ` +
      "nothing to verify. Run `pnpm build` first.",
  );
  process.exit(1);
}

const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "ui-kit-verify-"));

try {
  console.log("Packing with pnpm (publishConfig applied)...");
  run("pnpm", ["pack", "--pack-destination", outDir], { cwd: PKG_DIR });

  const tarball = fs
    .readdirSync(outDir)
    .filter((f) => f.endsWith(".tgz"))
    .map((f) => path.join(outDir, f))[0];

  if (!tarball) throw new Error("pnpm pack produced no tarball");

  // A packed package with no entry points is the failure mode B-8 describes;
  // catch it here rather than discovering it after publishing.
  const packed = JSON.parse(readFromTarball(tarball, "package/package.json"));

  for (const field of ["main", "exports"]) {
    if (!packed[field]) {
      console.error(
        `The packed package.json has no "${field}". publishConfig was not ` +
          "applied -- do not publish this tarball.",
      );
      process.exitCode = 1;
    }
  }

  console.log(`\n=== publint ===`);
  try {
    console.log(run("npx", ["--yes", "publint", tarball]));
  } catch (error) {
    console.log(error.stdout ?? String(error));
    process.exitCode = 1;
  }

  console.log(`=== attw ===`);
  try {
    // styles.css is excluded, not ignored globally: a CSS entry point has
    // neither types nor JavaScript, so attw reports NoResolution for it in all
    // four resolution modes. Verified to be a tool limitation rather than a
    // defect here -- react-toastify, correctly published and widely used, gets
    // the identical result for its own CSS exports. Excluding the entry keeps
    // `no-resolution` active for every other export, which `--ignore-rules`
    // would not.
    console.log(
      // The tarball goes first: --exclude-entrypoints is variadic and would
      // otherwise swallow the path as another entry point name.
      run("npx", [
        "--yes",
        "@arethetypeswrong/cli",
        tarball,
        "--exclude-entrypoints",
        "styles.css",
        // cjs-resolves-to-esm states a fact about this package rather than a
        // defect: it ships ESM only (see rollup.config.mjs for why -- the
        // ai-chat peer has no CommonJS build), so a `require()` of it does
        // resolve to ESM and a CommonJS consumer does need a dynamic import.
        // The rule cannot be satisfied without shipping CJS again, and leaving
        // it active would mean this step can never become blocking.
        "--ignore-rules",
        "cjs-resolves-to-esm",
      ]),
    );
  } catch (error) {
    console.log(error.stdout ?? String(error));
    process.exitCode = 1;
  }
} finally {
  fs.rmSync(outDir, { recursive: true, force: true });
}
