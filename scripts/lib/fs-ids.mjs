// One tree walk and one separator policy for every build script here.
//
// Module ids are POSIX on every platform: they are compared against the
// specifiers written into the built modules, which are always `/`. Three
// scripts grew their own conversion and five grew their own walk, each with its
// own policy -- so fixing the separators in one of them left check-dist.mjs
// keying a map by `\` while the set it compared against was built with
// `path.posix`, and 197 correctly emitted stylesheets were reported detached.

import fs from "node:fs";
import path from "node:path";

/**
 * A filesystem path as a POSIX id. Identity on a path that is already POSIX.
 *
 * It replaces `\` rather than `path.sep`, which is the same thing on the
 * platform that produced the path and not the same thing anywhere else: keyed
 * off `path.sep`, this was a no-op on a Windows-shaped id whenever it ran on
 * POSIX, so nothing could exercise the Windows branch of a caller except
 * Windows itself. A backslash is a legal filename character on POSIX, but not
 * in an id here -- `assertPosixIds` below rejects one outright.
 */
export const toPosix = (id) => id.replaceAll("\\", "/");

/**
 * Every entry under `root`, files and directories alike, as `{ id, name, full,
 * isDir }` with `id` a POSIX path relative to `root`.
 *
 * `sort` orders each directory by name, for output that does not depend on the
 * filesystem. `enterDir(entry, id)` returning false yields the directory
 * without descending into it.
 */
export function* walk(root, { sort = false, enterDir } = {}) {
  const step = function* (dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    if (sort) entries.sort((a, b) => a.name.localeCompare(b.name));

    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      const record = {
        id: toPosix(path.relative(root, full)),
        name: entry.name,
        full,
        isDir: entry.isDirectory(),
      };

      yield record;

      if (record.isDir && (!enterDir || enterDir(entry, record.id))) {
        yield* step(full);
      }
    }
  };

  yield* step(root);
}

/**
 * Guards the boundary where ids leave a walk. A `\` here means some caller
 * rebuilt an id with `path.*` instead of `path.posix.*`, and every comparison
 * downstream silently stops matching -- the failure that actually happens is a
 * confident, wrong report about the build output, so fail on the separator
 * instead.
 */
export const assertPosixIds = (ids, what) => {
  const bad = ids.find((id) => id.includes("\\"));

  if (bad !== undefined) {
    throw new Error(
      `${what}: id "${bad}" contains a Windows separator. Ids must be POSIX -- ` +
        "build them with `toPosix`/`path.posix.*`, never with `path.relative` " +
        "or `path.join` alone (scripts/lib/fs-ids.mjs).",
    );
  }

  return ids;
};
