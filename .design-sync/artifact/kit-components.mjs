// Lists the kit's components with their props, as the design system's cards
// declare them (ds-bundle/components/<group>/<Name>/<Name>.d.ts, generated
// from the package's own declarations), and every component folder under
// components/, so a component without a card is still found.
//
//   kitComponents(repo) -> [{ name, folder, group?, props: [{ name, type,
//                            values?, doc }] }]
//
// `values` is filled for a prop whose type is a union of string literals or
// enum members (`ButtonSize.small | ButtonSize.normal` -> ["small", "normal"]),
// and is ["true", "false"] for a boolean.
import fs from "node:fs";
import path from "node:path";

const pascal = (kebab) =>
  kebab.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());

function parseProps(dts) {
  const props = [];
  const body = /export interface \w+Props[^{]*\{([\s\S]*?)\n\}/.exec(dts);
  if (!body) return props;
  let doc = "";
  for (const line of body[1].split("\n")) {
    const d = /^\s*\/\*\*\s*(.*?)\s*\*\/\s*$/.exec(line);
    if (d) {
      doc = d[1];
      continue;
    }
    const m = /^\s*"?([\w-]+)"?\??:\s*(.+?);\s*$/.exec(line);
    if (!m) continue;
    const type = m[2];
    let values;
    if (/^boolean$/.test(type)) values = ["true", "false"];
    else {
      const parts = type.split("|").map((s) => s.trim());
      const lit = parts.map(
        (p) => /^"([^"]*)"$/.exec(p)?.[1] ?? /^\w+\.(\w+)$/.exec(p)?.[1],
      );
      // A union of literals, or a single literal (Badge's type?: "high").
      if (
        lit.every((x) => x !== undefined) &&
        (parts.length > 1 || /^"/.test(type))
      )
        values = lit;
    }
    props.push({ name: m[1], type, ...(values ? { values } : {}), doc });
    doc = "";
  }
  return props;
}

export function kitComponents(repo) {
  const out = new Map();
  const ds = path.join(repo, "ds-bundle", "components");
  if (fs.existsSync(ds))
    for (const group of fs.readdirSync(ds))
      for (const name of fs.readdirSync(path.join(ds, group))) {
        const f = path.join(ds, group, name, `${name}.d.ts`);
        if (!fs.existsSync(f)) continue;
        out.set(name, {
          name,
          group,
          props: parseProps(fs.readFileSync(f, "utf8")),
        });
      }
  // Folders with no card (portal-only, no story): name only, props from the
  // folder's own types file when it has one.
  for (const folder of fs.readdirSync(path.join(repo, "components"))) {
    const dir = path.join(repo, "components", folder);
    if (!fs.statSync(dir).isDirectory()) continue;
    const name = pascal(folder);
    const known = [...out.values()].find(
      (c) => c.name.toLowerCase() === name.toLowerCase(),
    );
    if (known) {
      known.folder = `components/${folder}`;
      continue;
    }
    const types = fs
      .readdirSync(dir)
      .find((f) => /\.types\.ts$/.test(f) && !f.startsWith("index"));
    out.set(name, {
      name,
      folder: `components/${folder}`,
      props: types
        ? parseProps(fs.readFileSync(path.join(dir, types), "utf8"))
        : [],
    });
  }
  // Cards whose folder is nested (tiles/file-tile, table/table-header) or
  // named otherwise: find the folder holding <Name>.tsx or <Name>.module.scss.
  const files = [];
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else files.push(p);
    }
  };
  walk(path.join(repo, "components"));
  // Exports renamed by the barrel (Filter -> FilterInput): the design-sync
  // config's titleMap names them, story title -> export.
  const cfg = path.join(repo, ".design-sync", "config.json");
  const titleMap = fs.existsSync(cfg)
    ? (JSON.parse(fs.readFileSync(cfg, "utf8")).titleMap ?? {})
    : {};
  for (const [title, exp] of Object.entries(titleMap)) {
    const c = exp && out.get(exp);
    const dir = `components/${title.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}`;
    if (c && !c.folder && fs.existsSync(path.join(repo, dir))) c.folder = dir;
  }
  for (const c of out.values()) {
    if (c.folder) continue;
    const hit =
      files.find((f) => path.basename(f) === `${c.name}.module.scss`) ??
      files.find((f) => path.basename(f) === `${c.name}.tsx`);
    if (hit)
      c.folder = path
        .relative(repo, path.dirname(hit))
        .split(path.sep)
        .join("/");
  }
  return [...out.values()].sort((a, b) => a.name.localeCompare(b.name));
}
