// Refreshes nav-icons/ and nav-icons-readme.md: the icons the product's left
// navigation draws, for the Design System artifact's "Navigation icons" asset
// group.
//
//   node .design-sync/artifact/sync-nav-icons.mjs
//
// Run from the repository root, by hand, after the client changes its
// navigation icons. Needs a DocSpace client checkout (DOCSPACE_CLIENT_ROOT,
// default ../DocSpace/client from the repository root) and fails without it.
// The output is committed, so building the artifact never needs the client.
//
// Why a group of its own: the Icons group mirrors assets/icons/ of this kit,
// and the portal's navigation draws icons the kit does not ship (every
// Developer Tools entry, Integration, Data import, the Upgrade gift...). The
// client maps each navigation entry to its icon in
// packages/shared/utils/catalogIconHelper.ts; this script reads that map, so
// the group is exactly what the product draws. Article's own controls (back,
// hide and show menu, the Developer Tools arrow) come from this kit's assets/.
import fs from "node:fs";
import path from "node:path";

import * as prettier from "prettier";

const REPO = process.cwd();
const HERE = path.join(REPO, ".design-sync", "artifact");
const OUT = path.join(HERE, "nav-icons");
const CLIENT = path.resolve(
  REPO,
  process.env.DOCSPACE_CLIENT_ROOT || "../DocSpace/client",
);
const HELPER = path.join(
  CLIENT,
  "packages",
  "shared",
  "utils",
  "catalogIconHelper.ts",
);
const IMAGES = path.join(CLIENT, "public", "images");

if (!fs.existsSync(HELPER))
  throw new Error(
    `no DocSpace client at ${CLIENT} (set DOCSPACE_CLIENT_ROOT): ${HELPER} is missing`,
  );

// What each map key is called on screen. A key missing here is a new entry
// in the client: the script stops so that someone names it.
const LABELS = {
  "FolderType.USER": "Files (My documents)",
  "FolderType.Rooms": "Rooms",
  "FolderType.RoomTemplates": "Templates (rooms)",
  "FolderType.Templates": "Templates",
  "FolderType.FormRoom": "Forms",
  "FolderType.Archive": "Archive",
  "FolderType.SHARE": "Shared with me",
  "FolderType.COMMON": "Common",
  "FolderType.Favorites": "Favorite files",
  "FolderType.Recent": "Recent files",
  "FolderType.Privacy": "Private",
  "FolderType.TRASH": "Trash",
  "PageType.account": "People: Members",
  "PageType.groups": "People: Groups",
  "PageType.guests": "People: Guests",
  "PageType.customization": "Settings: Customization",
  "PageType.security": "Settings: Security",
  "PageType.backup": "Settings: Backup",
  "PageType.restore": "Settings: Restore",
  "PageType.integration": "Settings: Integration",
  "PageType.dataImport": "Settings: Data import",
  "PageType.developerTools": "Developer Tools (bar at the foot of the panel)",
  "PageType.devToolsOverview": "Developer Tools: Overview",
  "PageType.devToolsDocsConnect": "Developer Tools: Docs connect",
  "PageType.devToolsJavascriptSdk": "Developer Tools: Embed SDK",
  "PageType.devToolsPluginSdk": "Developer Tools: Plugin SDK",
  "PageType.devToolsWebhooks": "Developer Tools: Webhooks",
  "PageType.devToolsOAuth": "Developer Tools: OAuth 2.0",
  "PageType.devToolsApiKeys": "Developer Tools: API keys",
  "PageType.portalDeletion": "Settings: Deletion",
  "PageType.payments": "Settings: Payments",
  "PageType.services": "Settings: Services",
  "PageType.bonus": "Settings: Upgrade (Community edition)",
  "PageType.storageManagement": "Settings: Storage management",
  "PageType.aiSettings": "Settings: AI settings",
  "PageType.apps": "Settings: Apps",
};

// Article's own controls, from this kit.
const KIT = [
  [
    "arrow-left.react.svg",
    "Back (top of the People, Settings and Developer Tools trees)",
  ],
  ["article-hide-menu.react.svg", "Hide menu (beside the logo)"],
  ["article-show-menu.react.svg", "Show menu (collapsed panel)"],
  ["arrow.right.react.svg", "Developer Tools bar: arrow at its end"],
];

const src = fs.readFileSync(HELPER, "utf8");
const imports = {};
for (const m of src.matchAll(
  /import (\w+) from "PUBLIC_DIR\/images\/([^"?]+)\?url"/g,
))
  imports[m[1]] = m[2];
const start = src.indexOf("16: {");
const end = src.indexOf("20: {", start);
if (start < 0 || end < 0)
  throw new Error(`the 16px map is not where expected in ${HELPER}`);

const rows = [];
for (const m of src.slice(start, end).matchAll(/\[(\w+)\.(\w+)\]:\s*(\w+)/g)) {
  const key = `${m[1]}.${m[2]}`;
  const file = imports[m[3]];
  if (!file) throw new Error(`${key}: no import found for ${m[3]}`);
  if (!LABELS[key])
    throw new Error(`${key} is new in the client: add its label to LABELS`);
  rows.push({
    label: LABELS[key],
    file: path.posix.basename(file),
    from: path.join(IMAGES, file),
  });
}
for (const [file, label] of KIT)
  rows.push({ label, file, from: path.join(REPO, "assets", file) });

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
const copied = new Map();
for (const r of rows) {
  const prev = copied.get(r.file);
  const body = fs.readFileSync(r.from, "utf8").replace(/\r\n/g, "\n");
  if (prev !== undefined && prev !== body)
    throw new Error(`two different icons are both named ${r.file}`);
  copied.set(r.file, body);
  fs.writeFileSync(path.join(OUT, r.file), body);
}

const table = rows.map((r) => `| ${r.label} | \`${r.file}\` |`).join("\n");
// Formatted with the repository's Prettier settings, so the committed file
// passes `pnpm format` as it comes out of this script.
const readmePath = path.join(HERE, "nav-icons-readme.md");
const format = async (text) =>
  prettier.format(text, {
    ...(await prettier.resolveConfig(readmePath)),
    filepath: readmePath,
  });
fs.writeFileSync(
  readmePath,
  await format(`# Navigation icons

Every icon the ONLYOFFICE Apps left navigation draws, 16px, single ink. The
portal maps each navigation entry to its icon in the DocSpace client
(\`packages/shared/utils/catalogIconHelper.ts\`); this group is that map, plus
the panel's own controls from the kit. Several are not in the **Icons** group,
because the kit itself does not ship them - take navigation icons from here.

Generated by \`.design-sync/artifact/sync-nav-icons.mjs\`; do not edit by hand.

## Which icon goes where

| Entry | File |
| ----- | ---- |
${table}

## Using one

They are drawn in fixed greys, so an \`<img>\` cannot follow the theme or turn
accent blue on the active item. Use the icon as a mask on an element that takes
the text colour:
\`mask: url(<your url>) center / contain no-repeat; background-color: currentColor;\`
(with \`-webkit-mask\` too). On a Design canvas the \`url()\` belongs in a
\`<helmet><style>\` rule, not in an inline \`style\`.
`),
);
console.log(
  `${copied.size} files for ${rows.length} entries in ${path.relative(REPO, OUT)}`,
);
