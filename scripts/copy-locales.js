// Refreshes locales/ from a DocSpace client checkout. Run by hand via
// `pnpm sync-locales`, never as part of build, test or lint -- this package has
// to build standalone, and locales/en is committed for exactly that reason.
//
// It used to short-circuit under CI and write four empty {} stubs, exiting 0.
// That made every CI build silently produce a package with no translations
// while reporting success. Now the script simply is not in CI's path, and when
// it is run without a DocSpace checkout it fails loudly instead.
const fs = require("node:fs");
const path = require("node:path");

const DOCSPACE_CLIENT_ROOT = path.resolve(
  __dirname,
  process.env.DOCSPACE_CLIENT_ROOT || "../../DocSpace/client",
);
const SOURCE = path.join(DOCSPACE_CLIENT_ROOT, "public/locales");
const DEST = path.resolve(__dirname, "../locales");
const UI_KIT_ROOT = path.resolve(__dirname, "..");

// Scan ui-kit source files to collect translation keys actually in use
function collectUsedKeys() {
  const keys = new Set();

  const patterns = [
    // getCommonTranslation("Key") or getCommonTranslation('Key'), possibly multiline
    /getCommonTranslation\(\s*["']([^"']+)["']/g,
    // match t("Key"), t("Common:Key"), translate("Key"), etc.
    // \b handles standalone "t" and avoids "alert", "start", etc.
    /\b(?:translate|t)\(\s*["'](?:Common:)?([^"']+)["']/g,
    // CommonTrans i18nKey="Key" or i18nKey='Key'
    /i18nKey=["'](?:Common:)?([^"']+)["']/g,
  ];

  function scan(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (
        entry.name === "node_modules" ||
        entry.name === "locales" ||
        entry.name === "dist"
      )
        continue;

      const full = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        scan(full);
        continue;
      }

      if (!/\.[jt]sx?$/.test(entry.name)) continue;

      const content = fs.readFileSync(full, "utf-8");

      for (const re of patterns) {
        re.lastIndex = 0;
        let m;
        while ((m = re.exec(content)) !== null) {
          keys.add(m[1]);
        }
      }
    }
  }

  scan(UI_KIT_ROOT);
  return keys;
}

const USED_KEYS = collectUsedKeys();

// Keys that are not detected by regex but still required
for (const key of ["Done", "SaveButton", "Warning", "Alert", "Info"]) {
  USED_KEYS.add(key);
}

if (USED_KEYS.size === 0) {
  console.error("No translation keys found in ui-kit sources");
  process.exit(1);
}

if (!fs.existsSync(SOURCE)) {
  console.error(`Source locales not found: ${SOURCE}`);
  process.exit(1);
}

const langs = fs
  .readdirSync(SOURCE, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

for (const lang of langs) {
  const src = path.join(SOURCE, lang, "Common.json");
  if (!fs.existsSync(src)) continue;

  const all = JSON.parse(fs.readFileSync(src, "utf-8"));
  const filtered = {};

  for (const key of USED_KEYS) {
    if (key in all) {
      filtered[key] = all[key];
    }
  }

  const destDir = path.join(DEST, lang);
  fs.mkdirSync(destDir, { recursive: true });
  fs.writeFileSync(
    path.join(destDir, "Common.json"),
    `${JSON.stringify(filtered, null, 2)}\n`,
  );
}

console.log(
  `Copied Common.json (${USED_KEYS.size} keys) for ${langs.length} locales into locales/`,
);

// --- Copy Payments.json and Settings.json (full files, no key filtering) ---
// `Services` used to be listed here and never existed: no DocSpace locale ships
// a Services.json, and no `t("Services:...")` call exists in this package. The
// only thing keeping it alive was the CI stub writer above, which fabricated an
// empty one -- so outside CI the Storybook build failed on the missing import.
const CLIENT_LOCALES = path.join(
  DOCSPACE_CLIENT_ROOT,
  "packages/client/public/locales",
);
const EXTRA_NS = ["Payments", "Settings"];
for (const ns of EXTRA_NS) {
  let copiedCount = 0;
  for (const lang of langs) {
    const src = path.join(CLIENT_LOCALES, lang, `${ns}.json`);
    if (!fs.existsSync(src)) continue;

    const destDir = path.join(DEST, lang);
    fs.mkdirSync(destDir, { recursive: true });
    fs.copyFileSync(src, path.join(destDir, `${ns}.json`));
    copiedCount++;
  }
  console.log(`Copied ${ns}.json for ${copiedCount} locales into locales/`);
}
// --- Copy fonts ---
const FONTS_CSS_SRC = path.join(DOCSPACE_CLIENT_ROOT, "public/css/fonts.css");
const FONTS_CSS_DEST = path.resolve(__dirname, "../css");
const FONTS_DIR_SRC = path.join(DOCSPACE_CLIENT_ROOT, "public/fonts");
const FONTS_DIR_DEST = path.resolve(__dirname, "../fonts");

function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

if (fs.existsSync(FONTS_CSS_SRC)) {
  fs.mkdirSync(FONTS_CSS_DEST, { recursive: true });
  fs.copyFileSync(FONTS_CSS_SRC, path.join(FONTS_CSS_DEST, "fonts.css"));
  console.log("Copied css/fonts.css");
} else {
  console.error(`fonts.css not found: ${FONTS_CSS_SRC}`);
}

if (fs.existsSync(FONTS_DIR_SRC)) {
  copyDirSync(FONTS_DIR_SRC, FONTS_DIR_DEST);
  console.log("Copied fonts/ directory");
} else {
  console.error(`fonts directory not found: ${FONTS_DIR_SRC}`);
}

