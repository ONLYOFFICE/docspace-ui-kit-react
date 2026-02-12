const fs = require("node:fs");
const path = require("node:path");

const SOURCE = path.resolve(__dirname, "../../../public/locales");
const DEST = path.resolve(__dirname, "../locales");
const UI_KIT_ROOT = path.resolve(__dirname, "..");

// Scan ui-kit source files to collect translation keys actually in use
function collectUsedKeys() {
	const keys = new Set();

	const patterns = [
		// getCommonTranslation("Key") or getCommonTranslation('Key')
		/getCommonTranslation\(["']([^"']+)["']/g,
		// t("Common:Key") or translate("Common:Key")
		/(?:translate|\.t)\(["']Common:([^"']+)["']/g,
	];

	function scan(dir) {
		for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
			if (entry.name === "node_modules" || entry.name === "locales" || entry.name === "dist")
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
