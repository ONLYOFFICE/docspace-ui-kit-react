import React, { useEffect, useMemo, useState } from "react";
import { Markdown, useOf } from "@storybook/addon-docs/blocks";

// Renders a component's README on its autodocs page, so the page and the
// package say the same thing from one file. Every README under components/
// and providers/ is available, loaded on demand; the one to show is found
// from the story file's own folder.
//
// The README is cut in two around `## Minimal example`: the intro (purpose,
// when to use, import) goes above the primary story, the reference sections
// (examples, recipes, behaviour, CSS variables, accessibility, test ids)
// below the stories. `## Props` is left out entirely -- the Controls table
// is the live version of it.

const readmes = import.meta.glob<string>(
  ["../../components/**/README.md", "../../providers/**/README.md"],
  { query: "?raw", import: "default" },
);

const REFERENCE_FROM = "\n## Minimal example";

type IndexEntry = { id: string; type: string; importPath: string };

let indexPromise: Promise<Record<string, IndexEntry>> | undefined;

// Docs page IDs by folder, so a README's `../slider/README.md` link becomes
// a link to that component's own page. index.json is what the manager reads
// and is emitted by the static build as well.
const docsIdsByFolder = () => {
  indexPromise ??= fetch("./index.json")
    .then((response) => response.json())
    .then((index: { entries: Record<string, IndexEntry> }) => {
      const byFolder: Record<string, IndexEntry> = {};

      for (const entry of Object.values(index.entries)) {
        if (entry.type !== "docs") continue;
        const folder = entry.importPath
          .replace(/^\.\//, "")
          .replace(/\/[^/]+$/, "");
        const known = byFolder[folder];
        // A folder with several story files keeps the one closest to its root.
        if (!known || entry.importPath.length < known.importPath.length) {
          byFolder[folder] = entry;
        }
      }

      return byFolder;
    })
    .catch(() => ({}));

  return indexPromise;
};

const folderOf = (fileName: string) =>
  fileName.replace(/^\.\//, "").replace(/\/[^/]+$/, "");

// Only the story file's own folder counts. A sub-part without a README of its
// own (the table's parts, the skeletons, ArticleItem) keeps its story
// description rather than borrowing the parent's whole page.
const readmeKeyFor = (fileName: string): string | undefined => {
  const key = `../../${folderOf(fileName)}/README.md`;
  return key in readmes ? key : undefined;
};

const stripSection = (text: string, heading: string) =>
  text.replace(new RegExp(`\\n## ${heading}\\n[\\s\\S]*?(?=\\n## |$)`), "");

const prepare = (
  raw: string,
  folder: string,
  ids: Record<string, IndexEntry>,
) => {
  let text = raw
    .replace(/^<!-- ui-kit-doc[\s\S]*?-->\s*/, "")
    .replace(/^# .*\n/, "");

  text = stripSection(text, "Props");

  // `../slider/README.md` -> the Slider page; a link nothing resolves stays
  // a link, so a reader still sees where it meant to go.
  text = text.replace(
    /\]\(((?:\.\.\/)+)([^)]+?)\/README\.md\)/g,
    (match, ups: string, rest: string) => {
      const parts = folder.split("/");
      const target = [
        ...parts.slice(0, parts.length - ups.length / 3),
        rest,
      ].join("/");
      const entry = ids[target];
      return entry ? `](?path=/docs/${entry.id})` : match;
    },
  );

  const cut = text.indexOf(REFERENCE_FROM);
  return cut === -1
    ? { intro: text, reference: "" }
    : { intro: text.slice(0, cut), reference: text.slice(cut) };
};

const useReadme = () => {
  const resolved = useOf("meta");
  const fileName =
    resolved.type === "meta"
      ? (resolved.preparedMeta.parameters?.fileName as string | undefined)
      : undefined;
  const key = useMemo(
    () => (fileName ? readmeKeyFor(fileName) : undefined),
    [fileName],
  );
  const [parts, setParts] = useState<{ intro: string; reference: string }>();

  useEffect(() => {
    if (!key || !fileName) return;
    let live = true;

    Promise.all([readmes[key](), docsIdsByFolder()]).then(([raw, ids]) => {
      if (live)
        setParts(
          prepare(
            raw,
            key.replace(/^\.\.\/\.\.\//, "").replace(/\/README\.md$/, ""),
            ids,
          ),
        );
    });

    return () => {
      live = false;
    };
  }, [key, fileName]);

  return { hasReadme: key !== undefined, parts };
};

export const ReadmeIntro = () => {
  const { parts } = useReadme();
  return parts ? <Markdown>{parts.intro}</Markdown> : null;
};

export const ReadmeReference = () => {
  const { parts } = useReadme();
  return parts?.reference ? <Markdown>{parts.reference}</Markdown> : null;
};

/** Whether the current component has a README to show instead of the story description. */
export const useHasReadme = () => useReadme().hasReadme;
