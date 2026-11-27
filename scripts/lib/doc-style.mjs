// The length and wording checks behind `.claude/rules/doc-writing.md`: how long
// a sentence, a bullet, a prop's JSDoc or a story's text may run, and whether a
// prop's description says anything its name does not.
//
// Pure functions over text, so `check-readme.mjs` owns the files and the
// findings and this module can be tested on strings. The sentence split and the
// tautology test are the ones the server's `openapi-desc-opt` scan uses for
// endpoint texts, carried over so the two repositories measure the same way.

import * as ts from "typescript";

/**
 * Ceilings in words. They sit near the library's p85 on the day they were set,
 * so a warning marks the tail rather than half the library; the norms the rule
 * asks for are lower.
 */
export const LIMITS = {
  sentence: 25,
  lead: 60,
  whenBullet: 30,
  prop: 40,
  argType: 40,
  story: 50,
  behaviourBullet: 50,
  accessibility: 50,
  cssEffect: 20,
};

// Words that carry no meaning of their own in a prop description. The first two
// lines are the server scan's list; the third is what a prop's JSDoc wraps
// around its name ("Whether the component is disabled").
const STOP_WORDS = new Set(
  `a an the of to for in on by with and or is are was were this that it its be as from at all
if when which what current specified given new used use uses set get gets returns return
prop props property component element whether should will can has have not no`.split(
    /\s+/,
  ),
);

const ABBREVIATIONS = /\b(e\.g|i\.e|etc|vs|cf)\./gi;

/**
 * Prose with the parts that are not prose taken out: code spans become one
 * word, a link keeps its text, emphasis markers go. Code is masked before
 * anything is split, because `ModalDialog.Header` and `api/2.0` carry dots that
 * end no sentence.
 */
const plain = (text) =>
  text
    .replace(/`[^`]*`/g, "CODE")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/[*_]{1,2}(?=\S)|(?<=\S)[*_]{1,2}/g, "")
    .replace(ABBREVIATIONS, "$1")
    .replace(/\s+/g, " ")
    .trim();

/** Words in a text, with code spans counted as one word each. */
export const wordCount = (text) =>
  plain(text)
    .split(" ")
    .filter((word) => /[\p{L}\p{N}]/u.test(word)).length;

/**
 * The sentences of a text; a fragment of fewer than two words is dropped. A
 * blank line and a list item end a sentence too, so a story description whose
 * bullets carry no full stop is not read as one long sentence.
 */
export const sentences = (text) =>
  text
    .split(/\n\s*\n|\n(?=\s*(?:[-*+]|\d+\.)\s)/)
    .flatMap((block) =>
      plain(block.replace(/^\s*(?:[-*+]|\d+\.)\s+/, "")).split(
        /(?<=[.!?])\s+(?=[\p{Lu}\p{N}"(])/u,
      ),
    )
    .map((part) => part.trim())
    .filter((part) => wordCount(part) >= 2);

/** The sentences longer than `limit` words, each with its length. */
export const longSentences = (text, limit = LIMITS.sentence) =>
  sentences(text)
    .map((sentence) => ({ sentence, words: wordCount(sentence) }))
    .filter(({ words }) => words > limit);

/** The first words of a sentence, for a finding that has to name it. */
export const excerpt = (sentence, words = 8) => {
  const parts = sentence.split(" ");
  return parts.length > words
    ? `${parts.slice(0, words).join(" ")}…`
    : sentence;
};

export const splitCamel = (name) =>
  name.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/[-_]/g, " ");

// A light stem, so that "disabled" and "disables" are the same word. Nothing
// here needs more: the question is only whether a description adds a word.
const stem = (word) =>
  word.length > 5 ? word.replace(/(ing|ed|es|s)$/, "") : word;

/** The meaningful words of a text, stemmed. */
export const contentWords = (text) =>
  new Set(
    plain(splitCamel(text))
      .replace(/CODE/g, " ")
      .toLowerCase()
      .split(/[^\p{L}\p{N}]+/u)
      .filter((word) => word.length > 2 && !STOP_WORDS.has(word))
      .map(stem),
  );

// What only a live Storybook can answer: its panels, and a sentence that opens
// by telling the reader to act on the canvas. The API site prints a story's
// description under a still picture, where neither means anything.
const LIVE_ONLY = [
  /\b(?:Controls|Actions|Interactions) panel\b/,
  /(?:^|[.!?]\s+|—\s*)(?:Hover|Click|Press|Drag|Scroll|Resize|Type|Right[- ]click)\b[^.!?\n]*/i,
];

/** The phrase of a story's description that needs a live canvas, or null. */
export const liveOnlyPhrase = (text) => {
  for (const pattern of LIVE_ONLY) {
    const match = pattern.exec(text);
    if (match) return match[0].replace(/^[.!?—\s]+/, "");
  }
  return null;
};

// Props whose meaning React or the kit's own convention fixes, so a description
// that names the element they land on is all there is to say.
const PLUMBING = new Set([
  "id",
  "className",
  "style",
  "ref",
  "forwardedRef",
  "testId",
  "dataTestId",
]);

/**
 * Whether a description adds at most one word to its prop's name and the
 * component's -- "`isDisabled`: Disables the button." The threshold is the
 * server scan's `tautological-param`.
 */
export const isTautological = (name, description, context = "") => {
  if (PLUMBING.has(name)) return false;
  const known = new Set([...contentWords(name), ...contentWords(context)]);
  const novel = [...contentWords(description)].filter(
    (word) => !known.has(word),
  );
  return novel.length <= 1;
};

/**
 * The prose of a README as blocks: paragraphs, bullets and the Effect cell of
 * the CSS-variables table, each with its `##` section (`null` above the first)
 * and the line it starts on. Fenced code, HTML comments, headings, other tables
 * and the generated props block are not prose and are left out.
 */
export const markdownProse = (markdown) => {
  // Comments and the generated block are blanked rather than removed, so the
  // line numbers still point into the file.
  const blank = (match) => match.replace(/[^\n]/g, "");
  const lines = markdown
    .replace(/<!-- (props|enums):start[\s\S]*?<!-- \1:end -->/g, blank)
    .replace(/<!--[\s\S]*?-->/g, blank)
    .split("\n");

  const blocks = [];
  let section = null;
  let inFence = false;
  let current = null;

  const close = () => {
    if (current) blocks.push({ ...current, text: current.text.trim() });
    current = null;
  };

  lines.forEach((line, index) => {
    if (line.trimStart().startsWith("```")) {
      close();
      inFence = !inFence;
      return;
    }
    if (inFence) return;

    const heading = /^(#{1,6})\s+(.+?)\s*$/.exec(line);
    if (heading) {
      close();
      if (heading[1] === "##") section = heading[2];
      return;
    }

    if (line.trim() === "") {
      close();
      return;
    }

    if (line.trimStart().startsWith("|")) {
      close();
      const cells = line
        .trim()
        .replace(/^\||\|$/g, "")
        .split(/(?<!\\)\|/)
        .map((cell) => cell.trim());
      const isRule = cells.every((cell) => /^:?-+:?$/.test(cell));
      if (
        section === "CSS variables" &&
        !isRule &&
        cells.length >= 3 &&
        cells.at(-1) !== "Effect"
      ) {
        blocks.push({
          section,
          kind: "cell",
          text: cells.at(-1),
          line: index + 1,
        });
      }
      return;
    }

    const bullet = /^\s*(?:[-*+]|\d+\.)\s+(.*)$/.exec(line);
    if (bullet) {
      close();
      current = { section, kind: "bullet", text: bullet[1], line: index + 1 };
      return;
    }

    if (current) {
      current.text += ` ${line.trim()}`;
      return;
    }

    current = {
      section,
      kind: "paragraph",
      text: line.trim(),
      line: index + 1,
    };
  });

  close();
  return blocks;
};

/** The string a property initializer spells, or null when it computes one. */
const stringOf = (node) => {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text;
  }
  if (ts.isTemplateExpression(node)) {
    return [
      node.head.text,
      ...node.templateSpans.map((span) => `CODE${span.literal.text}`),
    ].join("");
  }
  if (
    ts.isBinaryExpression(node) &&
    node.operatorToken.kind === ts.SyntaxKind.PlusToken
  ) {
    const left = stringOf(node.left);
    const right = stringOf(node.right);
    return left === null || right === null ? null : left + right;
  }
  if (ts.isParenthesizedExpression(node)) return stringOf(node.expression);
  return null;
};

const keyOf = (node) =>
  node.name && (ts.isIdentifier(node.name) || ts.isStringLiteral(node.name))
    ? node.name.text
    : null;

/** The property assignment an object literal is the value of, if any. */
const ownerOf = (object) =>
  object?.parent && ts.isPropertyAssignment(object.parent)
    ? object.parent
    : null;

/**
 * The texts of a story file a reader sees on the Docs page: every
 * `parameters.docs.description.story`, named by its story's export, and every
 * `argTypes` description, named by its prop.
 */
export const storyTexts = (source, fileName = "story.tsx") => {
  const file = ts.createSourceFile(
    fileName,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const found = [];

  const exportName = (node) => {
    for (let at = node; at; at = at.parent) {
      if (ts.isVariableDeclaration(at) && ts.isIdentifier(at.name)) {
        return at.name.text;
      }
    }
    return null;
  };

  const visit = (node) => {
    if (ts.isPropertyAssignment(node)) {
      const key = keyOf(node);
      const text = stringOf(node.initializer);
      const line =
        file.getLineAndCharacterOfPosition(node.getStart(file)).line + 1;

      // story: "…" inside description: { … }
      if (key === "story" && text !== null) {
        const description = ownerOf(node.parent);
        if (description && keyOf(description) === "description") {
          found.push({ kind: "story", name: exportName(node), text, line });
        }
      }

      // argTypes: { prop: { description: "…" } }
      if (key === "description" && text !== null) {
        const prop = ownerOf(node.parent);
        const argTypes = prop && ownerOf(prop.parent);
        if (argTypes && keyOf(argTypes) === "argTypes") {
          found.push({ kind: "argType", name: keyOf(prop), text, line });
        }
      }
    }
    ts.forEachChild(node, visit);
  };

  visit(file);
  return found;
};
