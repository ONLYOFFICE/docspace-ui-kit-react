// `pnpm docs:screenshots`: a picture of every published component for its
// API-site page -- the first story of its Storybook file, photographed in
// the light and the dark theme on a transparent canvas, so the site shows
// the one that matches the reader's theme and nothing else.
//
//   node scripts/docs/screenshots.mjs [--only <slug>...] [--storybook <dir|url>]
//
// Reads the static Storybook (`pnpm storybook-build`, or STORYBOOK_URL for a
// served one): its index.json says which story is first and which carries
// the `picture` tag, so nothing here guesses an id. Writes <category>/<page>-{light,dark}.png under
// SHOTS_DIR, which `pnpm docs` then copies beside the pages that have one.
// Pages without a picture are reported, never failed: CI runs no browser.
//
// Needs Playwright's Chromium: `pnpm exec playwright install chromium`.

import fs from "node:fs";
import http from "node:http";
import path from "node:path";

import { collect } from "./collect.mjs";
import {
  PICTURE_RECIPES,
  PUBLISHED_STATUSES,
  ROOT,
  SHOTS_DIR,
  SHOT_SCALE,
} from "./config.mjs";

const args = process.argv.slice(2);
const only = [];
let storybook = process.env.STORYBOOK_URL || "storybook-static";
for (let index = 0; index < args.length; index += 1) {
  if (args[index] === "--only") {
    while (args[index + 1] && !args[index + 1].startsWith("--")) {
      only.push(args[(index += 1)]);
    }
  } else if (args[index] === "--storybook") {
    storybook = args[(index += 1)];
  } else {
    console.error(`unknown option ${args[index]}`);
    process.exit(2);
  }
}

/** Light and dark, as the site's colour modes. */
const THEMES = {
  light: { colorScheme: "light", current: "light" },
  dark: { colorScheme: "dark", current: "dark" },
};
/** About the site's reading column, so a full-width component fits the page. */
const VIEWPORT = { width: 800, height: 600 };
/** Transparent margin kept around the painted area. */
const MARGIN = 8;
/** The dark-mode addon's store; `current` is what `useDarkMode()` boots from. */
const DARK_MODE_STORE_KEY = "sb-addon-themes-3";

const MIME = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".wasm": "application/wasm",
};

/**
 * Serves a directory on a free port. Node's own `http`, not `serve`: a child
 * process would need a shell on Windows, and the files are plain.
 */
const serveStatic = (dir) =>
  new Promise((resolve) => {
    const server = http.createServer((request, response) => {
      const url = new URL(request.url, "http://localhost");
      const file = path.join(
        dir,
        path.normalize(decodeURIComponent(url.pathname)),
      );
      if (
        !file.startsWith(dir) ||
        !fs.existsSync(file) ||
        fs.statSync(file).isDirectory()
      ) {
        response.writeHead(404).end();
        return;
      }
      response.writeHead(200, {
        "Content-Type": MIME[path.extname(file)] ?? "application/octet-stream",
        "Cache-Control": "no-store",
      });
      fs.createReadStream(file).pipe(response);
    });
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({ url: `http://127.0.0.1:${port}`, close: () => server.close() });
    });
  });

const fetchIndex = async (base) => {
  const response = await fetch(`${base}/index.json`);
  if (!response.ok)
    throw new Error(`${base}/index.json: HTTP ${response.status}`);
  return response.json();
};

/** A story tagged this is the one photographed, over the file's first. */
const PICTURE_TAG = "picture";

/**
 * The story to photograph per CSF file, keyed by the file's repository path:
 * the one tagged `picture`, else the first. The first story of a dialog or
 * a toast is a button that opens it; the tag points at the open state.
 */
const pictureStories = (index) => {
  const byFile = new Map();
  for (const entry of Object.values(index.entries)) {
    if (entry.type !== "story") continue;
    const file = entry.importPath.replace(/^\.\//, "");
    const tagged = entry.tags?.includes(PICTURE_TAG);
    const known = byFile.get(file);
    if (!known || (tagged && !known.tags?.includes(PICTURE_TAG))) {
      byFile.set(file, entry);
    }
  }
  return byFile;
};

const storyFileOf = (page) => {
  const folder = path.posix.dirname(page.source);
  return fs
    .readdirSync(path.join(ROOT, folder))
    .filter((name) => /\.stories\.(js|jsx|ts|tsx)$/.test(name))
    .map((name) => path.posix.join(folder, name))[0];
};

const shoot = async (browser, base, story, theme, file, recipe) => {
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: SHOT_SCALE,
    colorScheme: theme.colorScheme,
    reducedMotion: "reduce",
  });
  await context.addInitScript(
    ([key, value]) => window.localStorage.setItem(key, value),
    [DARK_MODE_STORE_KEY, JSON.stringify({ current: theme.current })],
  );
  const page = await context.newPage();
  try {
    await page.goto(
      `${base}/iframe.html?id=${story.id}&viewMode=story&globals=canvas:transparent`,
      { waitUntil: "networkidle" },
    );
    // "attached", not "visible": a component that positions itself fixed --
    // the app loader, the mobile main button -- leaves the root at zero
    // height, which Playwright does not count as visible. Rendered means the
    // root has children.
    const root = page.locator("#storybook-root");
    await root.waitFor({ state: "attached", timeout: 20_000 });
    await page.waitForFunction(
      () =>
        (document.querySelector("#storybook-root")?.childElementCount ?? 0) > 0,
      undefined,
      { timeout: 20_000 },
    );
    if ((await page.locator("text=Story not found").count()) > 0) {
      throw new Error("story not found");
    }
    await page.addStyleTag({
      content:
        "html, body, .sb-show-main { background: transparent !important; }",
    });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);

    if (recipe) {
      const [gesture, target] =
        Object.entries(recipe).find(([key]) =>
          ["click", "rightClick", "hover"].includes(key),
        ) ?? [];
      if (gesture) {
        const element = page.locator(target).first();
        if (gesture === "click") await element.click();
        if (gesture === "rightClick") await element.click({ button: "right" });
        if (gesture === "hover") await element.hover();
      }
      await page.waitForTimeout(recipe.wait ?? 400);
      if (recipe.hideRoot) {
        await page.addStyleTag({
          content: "#storybook-root { visibility: hidden !important; }",
        });
      }
      if (recipe.hide) {
        await page.locator(recipe.hide).evaluateAll((elements) => {
          // A text selector matches the label inside the button; hide the
          // control, or its painted box stays in the picture.
          for (const el of elements) {
            const control = el.closest("button, a, [role=button]") ?? el;
            control.style.visibility = "hidden";
          }
        });
      }
    }

    // The root and the decorator's wrapper are full-width blocks, so their
    // box is the page, not the component. The picture is the union of what
    // actually paints -- a background, a border, a shadow, an image, text --
    // anywhere in the body, which also covers what a dialog or a toast
    // renders through a portal.
    const union = await page.evaluate(() => {
      const PAINTED_TAGS = new Set([
        "IMG",
        "SVG",
        "INPUT",
        "TEXTAREA",
        "SELECT",
        "CANVAS",
        "VIDEO",
        "HR",
      ]);
      const transparent = (color) =>
        color === "transparent" ||
        /rgba\(\s*\d+,\s*\d+,\s*\d+,\s*0\)/.test(color);
      const paints = (el, style) =>
        PAINTED_TAGS.has(el.tagName.toUpperCase()) ||
        !transparent(style.backgroundColor) ||
        style.backgroundImage !== "none" ||
        style.boxShadow !== "none" ||
        (style.borderStyle !== "none" && parseFloat(style.borderWidth) > 0) ||
        (style.outlineStyle !== "none" && parseFloat(style.outlineWidth) > 0) ||
        [...el.childNodes].some(
          (node) =>
            node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== "",
        );
      let box = null;
      const visit = (el) => {
        const style = getComputedStyle(el);
        if (
          style.display === "none" ||
          style.visibility === "hidden" ||
          style.opacity === "0"
        ) {
          return;
        }
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0 && paints(el, style)) {
          box = box
            ? {
                left: Math.min(box.left, rect.left),
                top: Math.min(box.top, rect.top),
                right: Math.max(box.right, rect.right),
                bottom: Math.max(box.bottom, rect.bottom),
              }
            : {
                left: rect.left,
                top: rect.top,
                right: rect.right,
                bottom: rect.bottom,
              };
        }
        if (el.tagName.toUpperCase() !== "SVG") {
          for (const child of el.children) visit(child);
        }
      };
      for (const child of document.body.children) {
        if (child.tagName === "SCRIPT" || child.tagName === "STYLE") continue;
        visit(child);
      }
      return box;
    });
    if (!union) throw new Error("nothing painted");

    const clip = {
      x: Math.max(0, union.left - MARGIN),
      y: Math.max(0, union.top - MARGIN),
    };
    // Clamped to the viewport: a list that scrolls is photographed as the
    // reader first sees it, not unrolled to its full height.
    clip.width = Math.min(VIEWPORT.width, union.right + MARGIN) - clip.x;
    clip.height = Math.min(VIEWPORT.height, union.bottom + MARGIN) - clip.y;
    if (clip.width < 1 || clip.height < 1) throw new Error("nothing in view");
    // No `animations: "disabled"`: Playwright fast-forwards every animation
    // to its end, and for a toast the end is gone -- it photographed blank.
    // Motion is already reduced on the context, and the recipe waited.
    await page.screenshot({ path: file, clip, omitBackground: true });
  } finally {
    await context.close();
  }
};

const { chromium } = await import("@playwright/test");

const { categories } = collect(ROOT, {
  statuses: PUBLISHED_STATUSES,
  warn: () => {},
});
const pages = categories.flatMap((category) =>
  category.pages
    .filter((page) => page.kind === "readme" && page.title)
    .filter((page) => only.length === 0 || only.includes(page.slug))
    .map((page) => ({ page, category })),
);

const served = /^https?:/.test(storybook)
  ? { url: storybook.replace(/\/+$/, ""), close: () => {} }
  : await serveStatic(path.resolve(ROOT, storybook));

if (
  !/^https?:/.test(storybook) &&
  !fs.existsSync(path.resolve(ROOT, storybook, "index.json"))
) {
  console.error(
    `${storybook}/index.json not found -- run \`pnpm storybook-build\` first`,
  );
  served.close();
  process.exit(1);
}

const index = pictureStories(await fetchIndex(served.url));
const outDir = path.join(ROOT, SHOTS_DIR);
let browser;
try {
  browser = await chromium.launch();
} catch (error) {
  console.error(
    `Chromium is not available (${error.message.split("\n")[0]}). Run \`pnpm exec playwright install chromium\`.`,
  );
  served.close();
  process.exit(1);
}

let done = 0;
const skipped = [];
const failed = [];
const started = Date.now();

for (const { page, category } of pages) {
  const storyFile = storyFileOf(page);
  const story = storyFile && index.get(storyFile);
  if (!story) {
    skipped.push(`${page.source}: no story in index.json`);
    continue;
  }
  const dir = path.join(outDir, category.slug);
  fs.mkdirSync(dir, { recursive: true });
  try {
    for (const [name, theme] of Object.entries(THEMES)) {
      await shoot(
        browser,
        served.url,
        story,
        theme,
        path.join(dir, `${page.slug}-${name}.png`),
        PICTURE_RECIPES[path.posix.dirname(page.source)],
      );
    }
    done += 1;
    process.stdout.write(`${page.slug} (${story.id})\n`);
  } catch (error) {
    failed.push(`${page.source}: ${story.id}: ${error.message.split("\n")[0]}`);
  }
}

await browser.close();
served.close();

console.log(
  `\n${done} component(s) photographed in ${Math.round((Date.now() - started) / 1000)}s -> ${SHOTS_DIR}/`,
);
for (const line of skipped) console.log(`[skip] ${line}`);
for (const line of failed) console.error(`[fail] ${line}`);
if (failed.length > 0) process.exit(1);
