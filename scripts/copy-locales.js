const fs = require("node:fs");
const path = require("node:path");

const SOURCE = path.resolve(__dirname, "../../../public/locales");
const DEST = path.resolve(__dirname, "../locales");

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

	const destDir = path.join(DEST, lang);
	fs.mkdirSync(destDir, { recursive: true });
	fs.copyFileSync(src, path.join(destDir, "Common.json"));
}

console.log(`Copied Common.json for ${langs.length} locales into locales/`);
