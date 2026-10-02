// `pnpm docs:screenshots`: the pictures the API-site pages show in place of
// what only Storybook can render -- every story, in story view, and every
// React element of a Docs page, on that page -- in the light and the dark
// theme on a transparent canvas, so the site shows the one that matches the
// reader's theme.
//
//   node scripts/docs/screenshots.mjs [--only <slug>...] [--missing] [--storybook <dir|url>]
//
// --only     only these pages (by slug)
// --missing  only the pictures that are not on disk yet
//
// Reads the static Storybook (`pnpm storybook-build`, or STORYBOOK_URL for a
// served one): its index.json names the stories and the docs pages. Writes
// <category>/<page>--<name>-{light,dark}.png under SHOTS_DIR, which
// `pnpm run docs` copies beside the pages that have them; a picture not taken is
// reported there, not failed, since CI runs no browser.
//
// Needs Playwright's Chromium: `pnpm exec playwright install chromium`.

import fs from "node:fs";
import http from "node:http";
import path from "node:path";

import { collect } from "./collect.mjs";
import {
  PICTURE_RECIPES,
  ROOT,
  SHOTS_DIR,
  SHOT_SCALE,
  SHOT_WORKERS,
  STORY_CHROME,
} from "./config.mjs";
import {
  NO_PICTURE_TAG,
  pictureFiles,
  shotsOf,
  storyKey,
} from "./pictures.mjs";
import { storyId } from "./story-tree.mjs";

const args = process.argv.slice(2);
const only = [];
let storybook = process.env.STORYBOOK_URL || "storybook-static";
let missingOnly = false;
for (let index = 0; index < args.length; index += 1) {
  if (args[index] === "--only") {
    while (args[index + 1] && !args[index + 1].startsWith("--")) {
      only.push(args[(index += 1)]);
    }
  } else if (args[index] === "--storybook") {
    storybook = args[(index += 1)];
  } else if (args[index] === "--missing") {
    missingOnly = true;
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
/**
 * About the site's reading column wide, so a full-width component fits the
 * page, and tall enough for a panel: the AI chat is 860px.
 */
const VIEWPORT = { width: 1024, height: 1000 };
/** Wider for a Docs page, whose tables and figures scroll in a narrow one. */
const DOCS_VIEWPORT = { width: 1100, height: 800 };
/** Transparent margin kept around the painted area. */
const MARGIN = 8;
/** How often a run reports where it is, whatever its progress. */
const HEARTBEAT_MS = 60_000;
/** The dark-mode addon's store; `current` is what `useDarkMode()` boots from. */
const DARK_MODE_STORE_KEY = "sb-addon-themes-3";
/** A story tagged this is the page's primary picture, over the file's first. */
const PICTURE_TAG = "picture";
/** What Markdown renders at the top level of a Docs page; the rest is React. */
const MARKDOWN_TAGS = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "ul",
  "ol",
  "pre",
  "table",
  "blockquote",
  "hr",
  "dl",
];

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
      resolve({
        url: `http://127.0.0.1:${port}`,
        close: () => server.close(),
      });
    });
  });

const fetchIndex = async (base) => {
  const response = await fetch(`${base}/index.json`);
  if (!response.ok) {
    throw new Error(`${base}/index.json: HTTP ${response.status}`);
  }
  return response.json();
};

/** Storybook's entries, grouped by the file they come from. */
const entriesByFile = (index) => {
  const byFile = new Map();
  for (const entry of Object.values(index.entries)) {
    const file = entry.importPath.replace(/^\.\//, "");
    if (!byFile.has(file)) byFile.set(file, []);
    byFile.get(file).push(entry);
  }
  return byFile;
};

const newContext = async (browser, theme) => {
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
  return context;
};

// The page goes transparent, and the "Demo data" banner Storybook puts above
// a story that reads no portal goes away: the picture is the component.
const TRANSPARENT =
  "html, body, .sb-show-main, #storybook-docs, .sbdocs, .sbdocs-wrapper, .sbdocs-content { background: transparent !important; }" +
  ' [data-testid="demo-banner"] { display: none !important; }' +
  STORY_CHROME.map(
    (name) =>
      ` [class*="_${name}_"] { border: none !important; padding: 0 !important; }`,
  ).join("");

/** A story in story view, cropped to what it paints. */
const shootStory = async (page, base, id, recipe, file) => {
  await page.goto(
    `${base}/iframe.html?id=${id}&viewMode=story&globals=canvas:transparent`,
    { waitUntil: "networkidle" },
  );
  // "attached", not "visible": a component that positions itself fixed
  // leaves the root at zero height, which Playwright does not count as
  // visible. Rendered means the root has children.
  await page
    .locator("#storybook-root")
    .waitFor({ state: "attached", timeout: 20_000 });
  await page.waitForFunction(
    () =>
      (document.querySelector("#storybook-root")?.childElementCount ?? 0) > 0,
    undefined,
    { timeout: 20_000 },
  );
  if ((await page.locator("text=Story not found").count()) > 0) {
    throw new Error("story not found");
  }
  await page.addStyleTag({ content: TRANSPARENT });
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
  // anywhere in the body, which also covers what a portal renders.
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

  // Clamped to the viewport: a list that scrolls is photographed as the
  // reader first sees it, not unrolled to its full height.
  const clip = {
    x: Math.max(0, union.left - MARGIN),
    y: Math.max(0, union.top - MARGIN),
  };
  clip.width = Math.min(VIEWPORT.width, union.right + MARGIN) - clip.x;
  clip.height = Math.min(VIEWPORT.height, union.bottom + MARGIN) - clip.y;
  if (clip.width < 1 || clip.height < 1) throw new Error("nothing in view");
  // No `animations: "disabled"`: Playwright fast-forwards every animation
  // to its end, and for a toast the end is gone -- it photographed blank.
  await page.screenshot({ path: file, clip, omitBackground: true });
};

/** A Docs page, ready: its content rendered and settled. */
const openDocs = async (page, base, docsId) => {
  await page.setViewportSize(DOCS_VIEWPORT);
  // Not `networkidle`: a page with the AI chat on it polls, and the network
  // never goes quiet. Rendered content is the signal.
  await page.goto(
    `${base}/iframe.html?id=${docsId}&viewMode=docs&globals=canvas:transparent`,
    { waitUntil: "domcontentloaded" },
  );
  await page.waitForFunction(
    () => document.querySelector(".sbdocs-content > div > *") !== null,
    undefined,
    { timeout: 30_000 },
  );
  await page.addStyleTag({ content: TRANSPARENT });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(800);
};

/**
 * The n-th React element of a Docs page: of the page's top-level blocks,
 * those that Markdown did not render and that are not a story.
 */
const shootBlock = async (page, base, docsId, index, file) => {
  await openDocs(page, base, docsId);
  const at = await page.evaluate(
    ([tags, wanted]) => {
      const root = document.querySelector(".sbdocs-content > div");
      let seen = -1;
      for (let i = 0; i < root.children.length; i += 1) {
        const el = root.children[i];
        const custom =
          (!tags.includes(el.tagName.toLowerCase()) ||
            el.classList.contains("sb-unstyled")) &&
          !el.classList.contains("sb-anchor") &&
          !el.classList.contains("sb-story") &&
          el.querySelector(".docblock-argstable") === null;
        if (custom) seen += 1;
        if (seen === wanted) return i;
      }
      return -1;
    },
    [MARKDOWN_TAGS, index],
  );
  if (at === -1) throw new Error(`no React element #${index} on the Docs page`);
  const block = page.locator(".sbdocs-content > div > *").nth(at);
  await block.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await block.screenshot({ path: file, omitBackground: true });
};

/**
 * The args table of a Docs page, as data: one row per prop with its name,
 * whether it is required, its description, its type and its default -- what
 * Storybook derived from the component's types and the stories' argTypes.
 */
const readControls = async (page, base, docsId, file) => {
  await openDocs(page, base, docsId);
  const table = page.locator(".docblock-argstable").first();
  if ((await table.count()) === 0) {
    throw new Error("no args table on the Docs page");
  }
  const rows = await table.evaluate((el) =>
    [...el.querySelectorAll("tbody tr")]
      .map((tr) => [...tr.children])
      .filter((cells) => cells.length >= 3)
      .map(([name, description, fallback]) => {
        const text = (node) =>
          node?.textContent?.replace(/\s+/g, " ").trim() ?? "";
        const parts = [...description.children];
        return {
          name: text(name).replace(/\*$/, ""),
          required:
            name.querySelector('[title="Required"]') !== null ||
            /\*$/.test(text(name)),
          description: parts.length > 1 ? text(parts[0]) : "",
          type: text(parts.at(-1)),
          default: text(fallback) === "-" ? "" : text(fallback),
        };
      }),
  );
  fs.writeFileSync(file, `${JSON.stringify(rows, null, 2)}\n`);
};

const { chromium } = await import("@playwright/test");

const { categories } = collect(ROOT, { warn: () => {} });
const flat = (list) => list.flatMap((c) => [c, ...flat(c.children)]);
const pages = flat(categories).flatMap((category) =>
  category.pages
    .filter((page) => page.kind !== "markdown")
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

const byFile = entriesByFile(await fetchIndex(served.url));

/** Resolves a page's shots to Storybook ids, or says why one cannot be taken. */
const jobsOf = ({ page, category }) => {
  const jobs = [];
  const skipped = [];
  const stories = (byFile.get(page.storiesFile) ?? []).filter(
    (e) => e.type === "story",
  );
  const docsFile =
    page.kind === "readme" || page.kind === "autodocs"
      ? page.storiesFile
      : page.source;
  const docs = (byFile.get(docsFile) ?? []).find((e) => e.type === "docs");
  const recipe =
    page.storiesFile && PICTURE_RECIPES[path.posix.dirname(page.storiesFile)];

  for (const shot of shotsOf(page)) {
    const files = pictureFiles(ROOT, category, page, shot.name);
    if (missingOnly && files.every((file) => fs.existsSync(file))) continue;
    let run;
    if (shot.kind === "story") {
      const entry = shot.primary
        ? (stories.find((e) => e.tags?.includes(PICTURE_TAG)) ??
          stories.find((e) => !e.tags?.includes(NO_PICTURE_TAG)))
        : stories.find(
            (e) =>
              e.id === `${storyId(page.title)}--${storyKey(shot.exportName)}`,
          );
      if (!entry) {
        skipped.push(
          `${page.source}: no story for "${shot.name}" in index.json`,
        );
        continue;
      }
      run = (p, base, file) =>
        shootStory(p, base, entry.id, shot.primary ? recipe : undefined, file);
    } else if (!docs) {
      skipped.push(
        `${page.source}: no docs entry in index.json for "${shot.name}"`,
      );
      continue;
    } else if (shot.kind === "block") {
      run = (p, base, file) => shootBlock(p, base, docs.id, shot.index, file);
    } else {
      run = (p, base, file) => readControls(p, base, docs.id, file);
    }
    jobs.push({ run, page, shot, files });
  }
  return { jobs, skipped };
};

const queue = [];
const skipped = [];
for (const item of pages) {
  const resolved = jobsOf(item);
  queue.push(...resolved.jobs);
  skipped.push(...resolved.skipped);
}

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

const failed = [];
let done = 0;
const started = Date.now();
const total = queue.length;
/** The jobs in flight, so a stalled run says which page it is on. */
const inFlight = new Set();

const progress = () => {
  const seconds = Math.round((Date.now() - started) / 1000);
  const on = [...inFlight]
    .map((job) => `${job.page.slug} (${job.shot.name})`)
    .join(", ");
  return (
    `${done + failed.length}/${total} after ${seconds}s` +
    (on ? `, on ${on}` : "")
  );
};

console.log(`Taking ${total} picture(s) with ${SHOT_WORKERS} workers...`);
// A line every minute regardless of progress: on a slow runner the first
// fifty pictures can take longer than that, and a quiet log reads as a hang.
const heartbeat = setInterval(() => console.log(progress()), HEARTBEAT_MS);

const worker = async () => {
  while (queue.length > 0) {
    const job = queue.shift();
    inFlight.add(job);
    fs.mkdirSync(path.dirname(job.files[0]), { recursive: true });
    try {
      // The args table is data, read once; a picture is taken per theme.
      const themes =
        job.shot.kind === "controls" ? [THEMES.light] : Object.values(THEMES);
      for (const [i, theme] of themes.entries()) {
        const context = await newContext(browser, theme);
        try {
          await job.run(await context.newPage(), served.url, job.files[i]);
        } finally {
          await context.close();
        }
      }
      done += 1;
    } catch (error) {
      failed.push(
        `${job.page.source} (${job.shot.name}): ${error.message.split("\n")[0]}`,
      );
    } finally {
      inFlight.delete(job);
    }
    if ((done + failed.length) % 50 === 0) console.log(progress());
  }
};

await Promise.all(Array.from({ length: SHOT_WORKERS }, worker));
clearInterval(heartbeat);
await browser.close();
served.close();

console.log(
  `\n${done} picture(s) taken in ${Math.round((Date.now() - started) / 1000)}s -> ${SHOTS_DIR}/`,
);
for (const line of skipped) console.log(`[skip] ${line}`);
for (const line of failed) console.error(`[fail] ${line}`);
if (failed.length > 0) process.exit(1);
