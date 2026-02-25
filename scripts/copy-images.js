const fs = require("node:fs");
const path = require("node:path");

const SOURCE = path.resolve(__dirname, "../../../public/images/icons");
const DEST = path.resolve(__dirname, "../assets/icons");
const SIZES = [24, 32, 64, 96];
const SUBFOLDERS = ["room", "template"];

if (!fs.existsSync(SOURCE)) {
  console.error(`Source not found: ${SOURCE}`);
  process.exit(1);
}

// Icon names are taken from size 96 as the source of truth
const baseIcons = fs
  .readdirSync(path.join(SOURCE, "96"))
  .filter((f) => f.endsWith(".svg"));

let copied = 0;
let missing = 0;

function copyFile(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`  Missing: ${src}`);
    missing++;
    return;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  copied++;
}

for (const size of SIZES) {
  // Copy base icons
  for (const name of baseIcons) {
    copyFile(path.join(SOURCE, `${size}`, name), path.join(DEST, `${size}`, name));
  }

  // Copy room/ and template/ subfolders if they exist in this size
  for (const sub of SUBFOLDERS) {
    const subSrc = path.join(SOURCE, `${size}`, sub);
    if (!fs.existsSync(subSrc)) continue;

    for (const name of fs.readdirSync(subSrc).filter((f) => f.endsWith(".svg"))) {
      copyFile(
        path.join(subSrc, name),
        path.join(DEST, `${size}`, sub, name),
      );
    }
  }
}

console.log(
  `Copied ${copied} icons into assets/images/icons/${missing > 0 ? ` (${missing} missing in some sizes)` : ""}`,
);
