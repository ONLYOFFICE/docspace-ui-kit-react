// The build's own code: files and directories the build reads as code rather
// than as input. A push touching one of them is built and packed by the
// pre-push gate (scripts/build-untouched.mjs); any other push leaves that to
// CI's `package` job.
//
// tsconfig.json is among them: rollup's TypeScript plugin compiles with it,
// while tsconfig.build.json only drives the declaration pass.

const BUILD_FILES = new Set([
  "rollup.config.mjs",
  "package.json",
  "pnpm-lock.yaml",
  "tsconfig.json",
  "tsconfig.build.json",
]);

const BUILD_DIRS = ["scripts/"];

/** Whether a repository-relative POSIX path is part of the build's code. */
export const touchesBuild = (file) =>
  BUILD_FILES.has(file) || BUILD_DIRS.some((dir) => file.startsWith(dir));
