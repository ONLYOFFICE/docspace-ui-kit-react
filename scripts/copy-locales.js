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

// --- Copy fonts ---
const FONTS_CSS_SRC = path.resolve(__dirname, "../../../public/css/fonts.css");
const FONTS_CSS_DEST = path.resolve(__dirname, "../css");
const FONTS_DIR_SRC = path.resolve(__dirname, "../../../public/fonts");
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
