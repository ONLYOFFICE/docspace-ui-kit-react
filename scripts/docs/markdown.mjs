// Line-level Markdown primitives. Every transform that rewrites prose goes
// through `mapProse`, so none of them can reach into a fenced code block or an
// inline code span -- which is where every `{`, `<` and `README.md` that must
// survive untouched lives.

const FENCE = /^\s*(`{3,}|~{3,})/;

/**
 * Splits a document into `{ text, code }` lines, `code` true inside a fenced
 * block, the fences included.
 */
export const splitLines = (text) => {
  const lines = [];
  let fence = null;

  for (const line of text.split("\n")) {
    const match = FENCE.exec(line);
    if (fence) {
      lines.push({ text: line, code: true });
      if (match && match[1][0] === fence[0] && match[1].length >= fence.length)
        fence = null;
      continue;
    }
    if (match) {
      fence = match[1];
      lines.push({ text: line, code: true });
      continue;
    }
    lines.push({ text: line, code: false });
  }

  return lines;
};

/**
 * Applies `fn` to every non-code line with its inline code spans (any
 * backtick run length) masked, so `fn` sees a whole line -- a link whose text
 * is `Button` in backticks still matches -- but can change nothing inside a
 * span. The mask is a private-use character plus an index, which no prose
 * transform matches.
 */
export const mapProse = (text, fn) =>
  splitLines(text)
    .map(({ text: line, code }) => {
      if (code) return line;
      const spans = [];
      let masked = "";
      let index = 0;
      while (index < line.length) {
        const tick = line.indexOf("`", index);
        if (tick === -1) {
          masked += line.slice(index);
          break;
        }
        masked += line.slice(index, tick);
        let run = 1;
        while (line[tick + run] === "`") run += 1;
        const close = line.indexOf("`".repeat(run), tick + run);
        if (close === -1) {
          masked += line.slice(tick);
          break;
        }
        masked += `\uE000${spans.length}\uE001`;
        spans.push(line.slice(tick, close + run));
        index = close + run;
      }
      return fn(masked).replace(/\uE000(\d+)\uE001/g, (_, n) => spans[n]);
    })
    .join("\n");

/** Removes HTML comments outside code, multi-line ones included. */
export const stripHtmlComments = (text) => {
  const out = [];
  let open = false;

  for (const { text: line, code } of splitLines(text)) {
    if (code && !open) {
      out.push(line);
      continue;
    }
    let rest = line;
    let kept = "";
    while (rest.length > 0) {
      if (open) {
        const end = rest.indexOf("-->");
        if (end === -1) {
          rest = "";
          break;
        }
        open = false;
        rest = rest.slice(end + 3);
      } else {
        const start = rest.indexOf("<!--");
        if (start === -1) {
          kept += rest;
          break;
        }
        kept += rest.slice(0, start);
        open = true;
        rest = rest.slice(start + 4);
      }
    }
    // A line that held only a comment goes with it, rather than leaving a
    // blank line in the middle of a list or a table.
    if (kept.trim() === "" && line.trim() !== "") continue;
    out.push(kept);
  }

  return out.join("\n").replace(/\n{3,}/g, "\n\n");
};

const HTML_TAGS = new Set([
  "a",
  "b",
  "br",
  "code",
  "details",
  "div",
  "em",
  "hr",
  "i",
  "img",
  "kbd",
  "p",
  "span",
  "strong",
  "sub",
  "summary",
  "sup",
]);
const VOID_TAGS = new Set(["br", "hr", "img"]);

/**
 * Makes CommonMark prose valid MDX: `{` and `}` escaped, autolinks turned
 * into links, void HTML tags self-closed, and any other `<` that would open a
 * JSX element -- `<Button>` written in running text -- escaped.
 */
export const escapeForMdx = (text) =>
  mapProse(text, (prose) =>
    prose
      .replace(/[{}]/g, (brace) => `\\${brace}`)
      .replace(/<(https?:\/\/[^>\s]+)>/g, "[$1]($1)")
      .replace(
        /<(\/?)([A-Za-z][\w.-]*)([^<>]*?)(\/?)>|</g,
        (match, slash, name, attrs, selfClose) => {
          if (match === "<") return "&lt;";
          const tag = name.toLowerCase();
          if (!HTML_TAGS.has(tag) || name !== tag)
            return `&lt;${match.slice(1)}`;
          if (VOID_TAGS.has(tag) && !slash && !selfClose) {
            return `<${name}${attrs.replace(/\s+$/, "")} />`;
          }
          return match;
        },
      ),
  );

/** Every Markdown link and image target in prose: `[text](target)`. */
export const LINK =
  /(!?)\[((?:[^\]\\]|\\.)*)\]\(([^()\s]+(?:\([^()\s]*\)[^()\s]*)*)(\s+"[^"]*")?\)/g;

/**
 * Rewrites every link target outside code through `resolve(target, text,
 * isImage)`, which returns a new target, `null` to unwrap the link to its
 * text, or `undefined` to leave it.
 */
export const rewriteLinks = (text, resolve) =>
  mapProse(text, (prose) =>
    prose.replace(LINK, (match, bang, label, target, title = "") => {
      const next = resolve(target, label, bang === "!");
      if (next === undefined) return match;
      if (next === null) return label;
      return `${bang}[${label}](${next}${title})`;
    }),
  );

/** Headings outside code, as `{ depth, text }`. */
export const headings = (text) =>
  splitLines(text)
    .filter(({ code }) => !code)
    .map(({ text: line }) => /^(#{1,6})\s+(.*?)\s*#*\s*$/.exec(line))
    .filter(Boolean)
    .map((match) => ({ depth: match[1].length, text: match[2] }));

/** The first paragraph after the H1, as one line of text. */
export const firstParagraph = (text) => {
  const lines = splitLines(text);
  const h1 = lines.findIndex(
    ({ text: line, code }) => !code && /^# /.test(line),
  );
  const paragraph = [];
  for (const { text: line, code } of lines.slice(h1 + 1)) {
    if (code) break;
    if (line.trim() === "") {
      if (paragraph.length > 0) break;
      continue;
    }
    if (/^(#|\||>|-|\*|\d+\.|<|import |:::)/.test(line.trim())) {
      if (paragraph.length > 0) break;
      continue;
    }
    paragraph.push(line.trim());
  }
  return paragraph.join(" ");
};

/** The first sentence of a paragraph -- up to the first `. ` outside code. */
export const firstSentence = (paragraph) => {
  let inCode = false;
  for (let index = 0; index < paragraph.length; index += 1) {
    const char = paragraph[index];
    if (char === "`") inCode = !inCode;
    if (!inCode && char === "." && /\s/.test(paragraph[index + 1] ?? " ")) {
      return paragraph.slice(0, index + 1);
    }
  }
  return paragraph;
};

/** `Form controls` -> `form-controls`. */
export const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** A table cell: pipes escaped, newlines flattened. */
export const cell = (text) =>
  String(text)
    .replace(/\s*\n\s*/g, " ")
    .replaceAll("|", "\\|");

/** YAML front matter from a flat object of strings. */
export const frontMatter = (fields) => {
  const lines = Object.entries(fields)
    .filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    )
    .map(([key, value]) => `${key}: ${JSON.stringify(String(value))}`);
  return lines.length > 0 ? `---\n${lines.join("\n")}\n---\n\n` : "";
};
