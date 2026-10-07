// React elements of an MDX page that the site renders as text rather than as
// a picture: the ones whose content is data in their source -- a list of
// cards, a table of facts, an access matrix -- which reads better as Markdown
// than as a screenshot of the page. Each renderer reads the component's
// source with the TypeScript parser; nothing is executed.
//
// A tag listed in BLOCK_RENDERERS is not photographed. A tag not listed is.

import fs from "node:fs";
import path from "node:path";
import * as ts from "typescript";

const unwrap = (node) => {
  let current = node;
  while (
    current &&
    (ts.isParenthesizedExpression(current) ||
      ts.isAsExpression(current) ||
      ts.isSatisfiesExpression(current) ||
      ts.isTypeAssertionExpression(current))
  ) {
    current = current.expression;
  }
  return current;
};

/**
 * A literal's value: strings, numbers, booleans, arrays, objects and the
 * module's own constants by name. A call to `docsHref("id")` is the
 * Storybook link `?path=/docs/id`, which the page rewriter turns into the
 * page's link on the site. Anything else -- an icon, a function -- is left
 * out.
 */
const evaluate = (node, scope) => {
  const value = unwrap(node);
  if (!value) return undefined;
  if (ts.isStringLiteral(value) || ts.isNoSubstitutionTemplateLiteral(value)) {
    return value.text;
  }
  if (ts.isNumericLiteral(value)) return Number(value.text);
  if (value.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (value.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (ts.isIdentifier(value)) return scope.get(value.text);
  if (ts.isArrayLiteralExpression(value)) {
    return value.elements
      .map((e) => evaluate(e, scope))
      .filter((e) => e !== undefined);
  }
  if (ts.isObjectLiteralExpression(value)) {
    const object = {};
    for (const property of value.properties) {
      if (!ts.isPropertyAssignment(property)) continue;
      const key = ts.isIdentifier(property.name)
        ? property.name.text
        : ts.isStringLiteral(property.name)
          ? property.name.text
          : undefined;
      if (!key) continue;
      const evaluated = evaluate(property.initializer, scope);
      if (evaluated !== undefined) object[key] = evaluated;
    }
    return object;
  }
  if (
    ts.isCallExpression(value) &&
    ts.isIdentifier(value.expression) &&
    value.expression.text === "docsHref" &&
    value.arguments[0]
  ) {
    return `?path=/docs/${evaluate(value.arguments[0], scope)}`;
  }
  return undefined;
};

/** The top-level `const name = ...` literals of a module, by name, in order. */
const constants = (source) => {
  const scope = new Map();
  for (const statement of source.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.initializer) {
        scope.set(
          declaration.name.text,
          evaluate(declaration.initializer, scope),
        );
      }
    }
  }
  return scope;
};

/** JSX text inside an element, as one line; `{"→"}` and the like included. */
const textOf = (element) => {
  const parts = [];
  const visit = (node) => {
    if (ts.isJsxText(node)) parts.push(node.text);
    else if (ts.isJsxExpression(node)) {
      if (node.expression && ts.isStringLiteral(node.expression)) {
        parts.push(node.expression.text);
      }
    } else ts.forEachChild(node, visit);
  };
  visit(element);
  return parts
    .join(" ")
    .replace(/&bull;/g, "•")
    .replace(/\s+/g, " ")
    .trim();
};

const need = (value, what) => {
  if (value === undefined) {
    throw new Error(`docs/welcome/WelcomePage.tsx: no ${what}`);
  }
  return value;
};

const openingOf = (node) =>
  ts.isJsxElement(node) ? node.openingElement : node;

const attributesOf = (node) => {
  const attrs = {};
  for (const p of openingOf(node).attributes.properties) {
    if (!ts.isJsxAttribute(p) || !ts.isIdentifier(p.name)) continue;
    const init = p.initializer;
    if (!init) attrs[p.name.text] = true;
    else if (ts.isStringLiteral(init)) attrs[p.name.text] = init.text;
    else if (ts.isJsxExpression(init)) {
      attrs[p.name.text] = init.expression?.getText();
    }
  }
  return attrs;
};

/** The `styles.<key>` of an element's className, when it has one. */
const styleOf = (node) => {
  const className = attributesOf(node).className ?? "";
  return (
    /^styles\.(\w+)$/.exec(className)?.[1] ??
    /\$\{styles\.(\w+)\}/.exec(className)?.[1]
  );
};

const isElement = (node) =>
  ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node);

/** Every element of the tree, in document order. */
const elements = (root) => {
  const found = [];
  const visit = (node) => {
    if (isElement(node)) found.push(node);
    ts.forEachChild(node, visit);
  };
  visit(root);
  return found;
};

const parse = (root, file) =>
  ts.createSourceFile(
    file,
    fs.readFileSync(path.join(root, file), "utf8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );

const table = (header, rows) =>
  [
    `| ${header.join(" | ")} |`,
    `| ${header.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.join(" | ")} |`),
  ].join("\n");

/**
 * The Welcome hero (`docs/welcome/WelcomePage.tsx`): the title, the version
 * line and the facts card. Its tiles and cards are navigation, which the site
 * has in its sidebar and its category pages.
 */
const welcomePage = (root) => {
  const source = parse(root, "docs/welcome/WelcomePage.tsx");
  const data = constants(source);
  const all = elements(source);
  const byStyle = (key) =>
    all.filter((el) => styleOf(el) === key).map((el) => textOf(el));
  const byTag = (tag) =>
    all.filter((el) => openingOf(el).tagName.getText() === tag);

  const lines = [`# ${need(byStyle("title")[0], "styles.title")}`, ""];
  const subline = byTag("Text").find(
    (el) => attributesOf(el).fontSize === "13px",
  );
  const link = byTag("Link")[0];
  if (subline) {
    lines.push(
      link
        ? `${textOf(subline)} -- [${textOf(link)}](${attributesOf(link).href})`
        : textOf(subline),
      "",
    );
  }

  const facts = data.get("facts") ?? [];
  if (facts.length > 0) {
    lines.push(
      `**${need(byStyle("factsTitle")[0], "styles.factsTitle")}**`,
      "",
      table(
        facts.map((f) => f.label),
        [facts.map((f) => f.value)],
      ),
      "",
    );
  }

  return lines.join("\n").trim();
};

/**
 * An access matrix (`docs/access/matrix.ts`): the table the component draws
 * for `<AccessMatrix name="..." />`, one column per portal type or room role,
 * a tick where the row's action is allowed.
 */
const accessMatrix = (root, block) => {
  const data = constants(parse(root, "docs/access/matrix.ts"));
  const matrix = data.get("MATRICES")?.[block.attrs.name];
  if (!matrix) throw new Error(`no access matrix named "${block.attrs.name}"`);
  const all =
    matrix.axis === "type" ? data.get("PORTAL_TYPES") : data.get("ROOM_ROLES");
  const keys = matrix.columns ?? all.map((column) => column.key);
  const columns = all.filter((column) => keys.includes(column.key));
  return table(
    ["Action", ...columns.map((column) => column.label)],
    matrix.rows.map((row) => [
      row.action,
      ...columns.map((column) =>
        row.allowed.includes(column.key) ? "✓" : "—",
      ),
    ]),
  );
};

const INFOGRAPHICS = "docs/agent-skills/Infographics.tsx";

/** What the skill takes care of: one line per area, with its words of code. */
const skillBenefits = (root) =>
  (constants(parse(root, INFOGRAPHICS)).get("BENEFITS") ?? [])
    .map((b) => `- **${b.title}** -- ${b.note}: \`${b.code}\``)
    .join("\n");

/** The same request without the skill and with it, as two numbered lists. */
const vibeFlow = (root) => {
  const data = constants(parse(root, INFOGRAPHICS));
  const flow = (label, steps) => [
    `**${label}**`,
    "",
    ...steps.map(
      (step, i) =>
        `${i + 1}. ${step.title}${step.note ? ` -- ${step.note}` : ""}`,
    ),
  ];
  return [
    ...flow("Without", data.get("WITHOUT") ?? []),
    "",
    ...flow("With the skill", data.get("WITH") ?? []),
  ].join("\n");
};

/** The eval results, as the table the figure carries for screen readers. */
const evalResults = (root) => {
  const score = (pair, percent) =>
    percent
      ? `${Math.round((pair[0] / pair[1]) * 100)}%`
      : `${pair[0]}/${pair[1]}`;
  return table(
    ["Suite", "With the skill", "Without"],
    (constants(parse(root, INFOGRAPHICS)).get("RESULTS") ?? []).map((row) => [
      row.suite,
      score(row.with, row.percent),
      score(row.without, row.percent),
    ]),
  );
};

/**
 * The two sync chains, each node as `title (note)` joined by its edges, and
 * the figure's caption.
 */
const syncDiagram = (root) => {
  const source = parse(root, INFOGRAPHICS);
  const figure = elements(source).find(
    (el) =>
      ts.isJsxElement(el) &&
      styleOf(el) === "figure" &&
      elements(el).some((child) => styleOf(child) === "sync"),
  );
  if (!figure) throw new Error("no sync figure in Infographics.tsx");
  const rows = elements(figure)
    .filter((el) => styleOf(el) === "sync")
    .map((row) =>
      elements(row)
        .filter((el) => ["node", "edge"].includes(styleOf(el)))
        .map((el) =>
          styleOf(el) === "edge"
            ? textOf(el).replace(/^→\s*/, "")
            : {
                title: elements(el).find((c) => styleOf(c) === "nodeTitle"),
                note: elements(el).find((c) => styleOf(c) === "nodeNote"),
              },
        )
        .map((part) =>
          typeof part === "string"
            ? `-> ${part} ->`
            : `**${textOf(part.title)}** (${textOf(part.note)})`,
        )
        .join(" ")
        .replace(/ ->$/, ""),
    );
  const caption = elements(figure).find((el) => styleOf(el) === "caption");
  return [
    ...rows.map((row) => `- ${row}`),
    "",
    caption ? `_${textOf(caption)}_` : "",
  ]
    .join("\n")
    .trim();
};

/** Tag -> renderer `(root, block) => markdown`. */
export const BLOCK_RENDERERS = {
  WelcomePage: welcomePage,
  AccessMatrix: accessMatrix,
  SkillBenefits: skillBenefits,
  VibeFlow: vibeFlow,
  EvalResults: evalResults,
  SyncDiagram: syncDiagram,
};
