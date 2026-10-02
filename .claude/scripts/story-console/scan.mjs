// Opens every Storybook story in Chromium and records what it complains about:
// console.error and console.warn (formatted the way the console shows them,
// with the stack of the call), uncaught exceptions, Storybook's own error
// display, and HTTP responses of 400 and above. Nothing else in this
// repository looks at a story's console -- the Playwright specs in __tests__/
// take screenshots, CI only builds Storybook -- so a React key warning, an
// invalid DOM prop or a route the demo portal has no fixture for goes unseen.
//
// Runs against the dev server, never the static build: `storybook build` is a
// production bundle, and React prints none of its development warnings there.
//
//   node .claude/scripts/story-console/scan.mjs --start            # starts storybook dev itself
//   node .claude/scripts/story-console/scan.mjs --url http://localhost:6006
//   node .claude/scripts/story-console/scan.mjs --start --filter button --filter /^ui-/
//   node .claude/scripts/story-console/scan.mjs --start --paths components/aside,selectors/Files
//   node .claude/scripts/story-console/scan.mjs --start --changed [--base master]
//   node .claude/scripts/story-console/scan.mjs --start --docs      # docs pages too
//
// In Docker, through .claude/scripts/story-console/docker.mjs, which forwards
// every flag here. Writes audits/story-console/report.{json,md}. Exit 0 when
// clean, 1 when anything was found, 2 when the scan itself could not run.

import fs from "node:fs";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

import { chromium } from "@playwright/test";

import { changedModuleDirs } from "./changed.mjs";

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);
const require = createRequire(import.meta.url);

const { values: opts } = parseArgs({
  options: {
    url: { type: "string" },
    start: { type: "boolean", default: false },
    port: { type: "string", default: "6007" },
    filter: { type: "string", multiple: true, default: [] },
    paths: { type: "string", default: "" },
    changed: { type: "boolean", default: false },
    base: { type: "string", default: "HEAD" },
    docs: { type: "boolean", default: false },
    concurrency: { type: "string", default: "3" },
    timeout: { type: "string", default: "60000" },
    limit: { type: "string" },
    out: { type: "string", default: "audits/story-console" },
  },
});

const BASE_URL = (opts.url ?? `http://localhost:${opts.port}`).replace(
  /\/$/,
  "",
);
const TIMEOUT = Number(opts.timeout);
const CONCURRENCY = Math.max(1, Number(opts.concurrency));
const OUT_DIR = path.resolve(ROOT, opts.out);

const fail = (message) => {
  console.error(`story-console: ${message}`);
  process.exit(2);
};

// --- storybook dev -----------------------------------------------------------

let server;

const startStorybook = () => {
  const pkgPath = require.resolve("storybook/package.json");
  const { bin } = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  const entry = path.join(
    path.dirname(pkgPath),
    typeof bin === "string" ? bin : bin.storybook,
  );
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const log = fs.openSync(path.join(OUT_DIR, "storybook.log"), "w");
  // `dev` runs in this one process (see storybook's dist/bin/dispatcher.js),
  // so killing it is enough; detached gives it a process group on POSIX in
  // case a later version starts forking.
  server = spawn(
    process.execPath,
    [entry, "dev", "--port", opts.port, "--no-open", "--ci"],
    {
      cwd: ROOT,
      stdio: ["ignore", log, log],
      detached: process.platform !== "win32",
    },
  );
  server.on("exit", (code) => {
    if (code && !stopping) {
      fail(`storybook dev exited with ${code}; see ${opts.out}/storybook.log`);
    }
  });
};

let stopping = false;
const stopStorybook = () => {
  if (!server || server.exitCode !== null) return;
  stopping = true;
  if (process.platform === "win32") {
    spawnSync("taskkill", ["/pid", String(server.pid), "/T", "/F"]);
  } else {
    try {
      process.kill(-server.pid, "SIGTERM");
    } catch {
      server.kill("SIGTERM");
    }
  }
};
process.on("exit", stopStorybook);
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    stopStorybook();
    process.exit(130);
  });
}

const fetchIndex = async (deadline) => {
  for (;;) {
    try {
      const res = await fetch(`${BASE_URL}/index.json`);
      if (res.ok) return await res.json();
    } catch {
      // not listening yet
    }
    if (Date.now() > deadline) {
      fail(`no Storybook index at ${BASE_URL}/index.json`);
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
};

// --- which entries -----------------------------------------------------------

const toMatcher = (pattern) => {
  const re = /^\/(.+)\/([a-z]*)$/.exec(pattern);
  if (re) {
    const regex = new RegExp(re[1], re[2]);
    return (s) => regex.test(s);
  }
  const needle = pattern.toLowerCase();
  return (s) => s.toLowerCase().includes(needle);
};

const selectEntries = (index) => {
  let entries = Object.values(index.entries).filter(
    (e) => e.type === "story" || (opts.docs && e.type === "docs"),
  );

  let dirs = opts.paths
    .split(",")
    .map((p) => p.trim().replace(/\\/g, "/").replace(/\/$/, ""))
    .filter(Boolean);
  if (opts.changed) {
    const changed = changedModuleDirs(ROOT, opts.base);
    if (changed.shared.length) {
      console.log(
        `story-console: shared code changed (${changed.shared.join(", ")}); ` +
          "--changed only covers the stories under the changed modules -- run " +
          "the whole scan to see its effect everywhere",
      );
    }
    dirs = [...dirs, ...changed.modules];
    if (!dirs.length) {
      console.log("story-console: no changed module has stories");
      process.exit(0);
    }
  }
  if (dirs.length) {
    entries = entries.filter((e) => {
      const file = e.importPath.replace(/^\.\//, "");
      return dirs.some((d) => file === d || file.startsWith(`${d}/`));
    });
  }

  const matchers = opts.filter.map(toMatcher);
  if (matchers.length) {
    entries = entries.filter((e) =>
      matchers.some(
        (m) => m(e.id) || m(e.title) || m(e.importPath.replace(/^\.\//, "")),
      ),
    );
  }

  if (opts.limit) entries = entries.slice(0, Number(opts.limit));
  return entries;
};

// --- in the page -------------------------------------------------------------

// Runs before any page script. Wraps console.error and console.warn so each
// call reaches the scanner already formatted (%s, %d, %o, %c substituted, the
// way DevTools shows it -- Playwright's own message text leaves them in) and
// with the stack of the call, which is what points at the component.
//
// React's own warnings (unknown DOM prop, invalid nesting, missing key) are
// logged from inside React, so that stack is React's alone, and React 19 no
// longer appends a component stack to the arguments. It does hand its shared
// internals to a DevTools hook, and their getCurrentStack() is the component
// stack of the fiber being processed, with source lines -- so a stand-in hook
// is installed here, before React loads, and asked on every call.
const pageHook = () => {
  const renderers = [];
  if (!window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    const noop = () => {};
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
      supportsFiber: true,
      renderers: new Map(),
      inject(internals) {
        renderers.push(internals);
        return renderers.length;
      },
      onCommitFiberRoot: noop,
      onCommitFiberUnmount: noop,
      onPostCommitFiberRoot: noop,
      onScheduleFiberRoot: noop,
      setStrictMode: noop,
    };
  }
  const componentStack = () => {
    for (const internals of renderers) {
      try {
        const stack = internals.currentDispatcherRef?.getCurrentStack?.();
        if (stack) return stack;
      } catch {
        // not rendering
      }
    }
    return null;
  };
  const show = (value) => {
    if (typeof value === "string") return value;
    if (value instanceof Error) return `${value.name}: ${value.message}`;
    if (value instanceof Element) return `<${value.tagName.toLowerCase()}>`;
    if (typeof value === "function") return `[function ${value.name}]`;
    try {
      const json = JSON.stringify(value);
      return json && json.length > 300 ? `${json.slice(0, 300)}...` : json;
    } catch {
      return String(value);
    }
  };
  const format = (args) => {
    const rest = [...args];
    let head = "";
    if (typeof rest[0] === "string") {
      head = rest.shift().replace(/%[sdifoOc%]/g, (token) => {
        if (token === "%%") return "%";
        if (!rest.length) return token;
        const value = rest.shift();
        if (token === "%c") return "";
        if (token === "%d" || token === "%i") return String(parseInt(value));
        if (token === "%f") return String(parseFloat(value));
        return show(value);
      });
    }
    return [head, ...rest.map(show)].filter((s) => s !== "").join(" ");
  };
  for (const level of ["error", "warn"]) {
    const original = console[level];
    console[level] = function (...args) {
      try {
        const error = args.find((a) => a instanceof Error);
        window.__storyConsole({
          level,
          text: format(args),
          stack: (error && error.stack) || new Error().stack,
          componentStack: componentStack(),
        });
      } catch {
        // the binding is gone while the page unloads
      }
      return original.apply(this, args);
    };
  }
};

// Settled means Storybook has finished with the entry: a story's render has
// reached a final phase (after its play function, if it has one), or a docs
// page has rendered, or the error display is up.
const isSettled = () => {
  const classes = document.body.classList;
  if (classes.contains("sb-show-errordisplay")) return true;
  if (classes.contains("sb-show-nopreview")) return true;
  const render = window.__STORYBOOK_PREVIEW__?.currentRender;
  const phase = render?.phase;
  if (phase) {
    return ["completed", "finished", "played", "errored", "aborted"].includes(
      phase,
    );
  }
  return (
    classes.contains("sb-show-main") &&
    !classes.contains("sb-show-preparing-story") &&
    !classes.contains("sb-show-preparing-docs")
  );
};

const readPreview = () => ({
  phase: window.__STORYBOOK_PREVIEW__?.currentRender?.phase ?? null,
  errorDisplay: document.body.classList.contains("sb-show-errordisplay")
    ? [
        document.querySelector("#error-message")?.textContent?.trim(),
        document.querySelector("#error-stack")?.textContent?.trim(),
      ]
        .filter(Boolean)
        .join("\n")
    : null,
});

// --- cleaning up what comes back ----------------------------------------------

const origin = new URL(BASE_URL).origin;

// Dev-server URLs to repository paths: http://localhost:6007/components/x.tsx?t=1
// -> components/x.tsx, /@fs/app/... -> ..., node_modules/.vite/deps chunks kept.
const cleanUrl = (s) =>
  s
    .replaceAll(origin, "")
    .replace(/\/@fs\/[^\s)]*?\/(node_modules|components|selectors)\//g, "$1/")
    .replace(/\?[tv]=[\w.-]+/g, "")
    .replace(/(^|[\s(])\/(?=[\w@.])/g, "$1");

// Frames from this repository first -- they are where a fix goes -- then at
// most two from dependencies for context, four when there are none of ours.
// Vite's pre-bundled chunks live under a hashed cache directory; only the
// chunk name says anything.
const cleanStack = (stack) => {
  const frames = (stack ?? "")
    .split("\n")
    .slice(1)
    .map((line) =>
      cleanUrl(line.trim()).replace(
        /node_modules\/\.(?:cache\/storybook\/[^/]+\/[^/]+\/sb-vite|vite)\/deps\//g,
        "deps/",
      ),
    )
    .filter(
      (line) =>
        line.startsWith("at ") &&
        !line.includes("__storyConsole") &&
        !line.includes("console.<computed>") &&
        !line.includes("console.error") &&
        !line.includes("console.warn"),
    );
  const isDep = (line) =>
    /\(?(deps|node_modules)\//.test(line) || line.includes("<anonymous>");
  const own = frames.filter((line) => !isDep(line)).slice(0, 8);
  const deps = frames.filter(isDep).slice(0, own.length ? 2 : 4);
  return [...own, ...deps];
};

// The same defect in two stories must land in one group: numbers, hashes and
// the tail of long messages are not what tells two messages apart.
// A request's query string is cache-busting as often as not (socket.io's
// `t=`), so network findings group by method and path.
const signature = (finding) =>
  `${finding.level}|${cleanUrl(finding.text)
    .split("\n")[0]
    .replace(finding.level === "network" ? /\?\S*/g : /$^/, "")
    .replace(/\b[0-9a-f]{8,}\b/gi, "#")
    .replace(/\b\d+(\.\d+)?\b/g, "N")
    .slice(0, 240)}`;

const loadIgnores = () => {
  const file = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "ignore.json",
  );
  const rules = JSON.parse(fs.readFileSync(file, "utf8"));
  return rules.map((rule) => ({
    ...rule,
    regex: new RegExp(rule.pattern),
    storyRegex: rule.stories ? new RegExp(rule.stories) : null,
  }));
};

// --- the scan ----------------------------------------------------------------

const scanEntry = async (page, entry, bucket) => {
  const viewMode = entry.type === "docs" ? "docs" : "story";
  const url = `${BASE_URL}/iframe.html?id=${encodeURIComponent(entry.id)}&viewMode=${viewMode}`;
  const started = Date.now();
  bucket.length = 0;
  bucket.open = true;
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: TIMEOUT });
    await page.waitForFunction(isSettled, null, {
      timeout: TIMEOUT,
      polling: 100,
    });
    // Effects and fetches that start after the first render: wait until no
    // request has been in flight for half a second, five seconds at most.
    const quietBy = Date.now() + 5000;
    while (Date.now() < quietBy) {
      if (bucket.inflight.size === 0 && Date.now() - bucket.lastActivity > 500)
        break;
      await page.waitForTimeout(100);
    }
    const preview = await page.evaluate(readPreview);
    return {
      status: preview.errorDisplay ? "error-display" : "ok",
      ...preview,
    };
  } catch (error) {
    const message = String(error?.message ?? error);
    // A Vite dependency re-optimisation reloads the page mid-render; that is
    // the dev server, not the story, and the entry is retried.
    const retry = /Execution context was destroyed|net::ERR_|Navigation/.test(
      message,
    );
    return {
      status: retry ? "retry" : "timeout",
      phase: null,
      errorDisplay: null,
      note: message.split("\n")[0],
    };
  } finally {
    bucket.open = false;
    bucket.ms = Date.now() - started;
  }
};

const run = async () => {
  if (opts.start && !opts.url) startStorybook();
  const index = await fetchIndex(
    Date.now() + (opts.start ? 5 * 60_000 : 10_000),
  );
  const entries = selectEntries(index);
  if (!entries.length) fail("no stories match the selection");
  const ignores = loadIgnores();

  console.log(
    `story-console: ${entries.length} entr${entries.length === 1 ? "y" : "ies"} ` +
      `from ${BASE_URL}, ${CONCURRENCY} at a time`,
  );

  const browser = await chromium.launch();
  const results = [];
  const queue = [...entries];
  const retried = new Set();
  let done = 0;

  // `only` scans that one entry and stops; without it the worker takes from
  // the shared queue until it is empty.
  const worker = async (only) => {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1024 },
    });
    const bucket = [];
    bucket.inflight = new Set();
    bucket.lastActivity = Date.now();
    const push = (finding) => {
      if (bucket.open) bucket.push(finding);
    };

    await context.exposeBinding("__storyConsole", (_source, payload) =>
      push({
        level: payload.level,
        text: cleanUrl(payload.text),
        stack: cleanStack(payload.stack),
        // Starts with a newline, so cleanStack's header skip drops nothing.
        rendered: cleanStack(payload.componentStack),
      }),
    );
    await context.addInitScript(pageHook);
    const page = await context.newPage();

    page.on("pageerror", (error) =>
      push({
        level: "pageerror",
        text: `${error.name}: ${error.message}`,
        stack: cleanStack(error.stack),
      }),
    );
    // Messages the browser itself logs (CSP, deprecations, mixed content) do
    // not go through console.* and carry no arguments. "Failed to load
    // resource" is dropped: the response handler below has it, with the URL.
    page.on("console", (msg) => {
      const type = msg.type();
      if (type !== "error" && type !== "warning") return;
      if (msg.args().length) return;
      if (msg.text().startsWith("Failed to load resource")) return;
      push({
        level: type === "warning" ? "warn" : "error",
        text: cleanUrl(msg.text()),
        stack: msg.location().url ? [`at ${cleanUrl(msg.location().url)}`] : [],
        source: "browser",
      });
    });
    page.on("request", (req) => {
      bucket.inflight.add(req);
      bucket.lastActivity = Date.now();
    });
    const settle = (req) => {
      bucket.inflight.delete(req);
      bucket.lastActivity = Date.now();
    };
    page.on("requestfinished", settle);
    page.on("requestfailed", (req) => {
      settle(req);
      const reason = req.failure()?.errorText ?? "failed";
      // Aborted by the next navigation, not by the story.
      if (reason.includes("ERR_ABORTED")) return;
      push({
        level: "network",
        text: `${reason} ${req.method()} ${cleanUrl(req.url())}`,
        stack: [],
      });
    });
    page.on("response", (res) => {
      // Answered by the demo portal's service worker: its own console.warn
      // already names the route, so this would only say it twice.
      if (res.status() < 400 || res.fromServiceWorker()) return;
      push({
        level: "network",
        text: `${res.status()} ${res.request().method()} ${cleanUrl(res.url())}`,
        stack: [],
      });
    });

    const pending = only ? [only] : queue;
    for (;;) {
      const entry = pending.shift();
      if (!entry) break;
      const outcome = await scanEntry(page, entry, bucket);
      if (outcome.status === "retry" && !retried.has(entry.id)) {
        retried.add(entry.id);
        pending.push(entry);
        continue;
      }
      if (outcome.status === "retry") outcome.status = "timeout";

      const findings = [];
      const ignored = [];
      for (const finding of bucket) {
        const rule = ignores.find(
          (r) =>
            (!r.level || r.level === finding.level) &&
            (!r.storyRegex || r.storyRegex.test(entry.id)) &&
            r.regex.test(finding.text),
        );
        (rule ? ignored : findings).push(
          rule ? { ...finding, ignoredBy: rule.pattern } : finding,
        );
      }
      results.push({
        id: entry.id,
        type: entry.type,
        title: entry.title,
        name: entry.name,
        importPath: entry.importPath.replace(/^\.\//, ""),
        ms: bucket.ms,
        ...outcome,
        findings,
        ignored: ignored.length,
      });

      done += 1;
      if (done % 25 === 0 || done === entries.length) {
        console.log(`story-console: ${done}/${entries.length}`);
      }
      // Leave the story before the next one starts, so its unload and its
      // aborted requests are not counted against the next.
      await page.goto("about:blank").catch(() => {});
    }
    await context.close();
  };

  // One entry alone first: the first request makes the dev server compile the
  // preview, and every worker asking at once only turns that into timeouts.
  await worker(queue.shift());
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, queue.length) }, () => worker()),
  );
  await browser.close();
  return { index, results };
};

// --- report ------------------------------------------------------------------

const buildGroups = (results) => {
  const groups = new Map();
  for (const result of results) {
    const seen = new Set();
    for (const finding of result.findings) {
      const key = signature(finding);
      if (seen.has(key)) continue;
      seen.add(key);
      if (!groups.has(key)) {
        groups.set(key, {
          level: finding.level,
          text: finding.text,
          stack: finding.stack,
          rendered: finding.rendered ?? [],
          stories: [],
        });
      }
      groups
        .get(key)
        .stories.push({ id: result.id, importPath: result.importPath });
    }
  }
  const order = { pageerror: 0, error: 1, warn: 2, network: 3 };
  return [...groups.values()].sort(
    (a, b) =>
      order[a.level] - order[b.level] || b.stories.length - a.stories.length,
  );
};

const writeReport = ({ results }) => {
  results.sort((a, b) => a.id.localeCompare(b.id));
  const groups = buildGroups(results);
  const broken = results.filter((r) => r.status === "error-display");
  const timedOut = results.filter((r) => r.status === "timeout");
  const withFindings = results.filter((r) => r.findings.length);
  const ignored = results.reduce((n, r) => n + r.ignored, 0);

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(OUT_DIR, "report.json"),
    `${JSON.stringify({ scanned: results.length, groups, results }, null, 2)}\n`,
  );

  const md = [];
  md.push("# Story console scan", "");
  md.push(
    `${results.length} entries scanned; ${broken.length} show the error display, ` +
      `${timedOut.length} timed out, ${withFindings.length} printed something; ` +
      `${groups.length} distinct messages; ${ignored} ignored by ignore.json.`,
    "",
  );
  if (broken.length) {
    md.push("## Error display", "");
    for (const r of broken) {
      md.push(
        `### ${r.id}`,
        "",
        `\`${r.importPath}\``,
        "",
        "```",
        r.errorDisplay.slice(0, 1500),
        "```",
        "",
      );
    }
  }
  if (timedOut.length) {
    md.push("## Timed out", "");
    for (const r of timedOut)
      md.push(
        `- ${r.id} (\`${r.importPath}\`) -- ${r.note ?? `phase ${r.phase}`}`,
      );
    md.push("");
  }
  if (groups.length) {
    md.push("## Messages", "");
    groups.forEach((g, i) => {
      md.push(
        `### ${i + 1}. [${g.level}] ${g.text.split("\n")[0].slice(0, 160)}`,
        "",
      );
      md.push(
        `${g.stories.length} entr${g.stories.length === 1 ? "y" : "ies"}`,
        "",
      );
      md.push(
        "```",
        g.text.slice(0, 1200),
        ...(g.stack.length ? ["", ...g.stack] : []),
        "```",
        "",
      );
      if (g.rendered.length) {
        md.push("Rendered by:", "", "```", ...g.rendered, "```", "");
      }
      const files = [...new Set(g.stories.map((s) => s.importPath))];
      for (const file of files.slice(0, 12)) {
        const ids = g.stories
          .filter((s) => s.importPath === file)
          .map((s) => s.id);
        md.push(
          `- \`${file}\`: ${ids.slice(0, 6).join(", ")}${ids.length > 6 ? `, +${ids.length - 6}` : ""}`,
        );
      }
      if (files.length > 12)
        md.push(`- ...and ${files.length - 12} more files`);
      md.push("");
    });
  }
  fs.writeFileSync(path.join(OUT_DIR, "report.md"), `${md.join("\n")}\n`);

  const rel = path.relative(ROOT, OUT_DIR).replaceAll("\\", "/");
  console.log(
    `story-console: ${broken.length} error display, ${timedOut.length} timeout, ` +
      `${groups.length} distinct message(s) in ${withFindings.length} entr${withFindings.length === 1 ? "y" : "ies"} ` +
      `-> ${rel}/report.md`,
  );
  return broken.length || timedOut.length || groups.length ? 1 : 0;
};

run()
  .then((scan) => {
    const code = writeReport(scan);
    stopStorybook();
    process.exit(code);
  })
  .catch((error) => {
    stopStorybook();
    fail(error?.stack ?? String(error));
  });
