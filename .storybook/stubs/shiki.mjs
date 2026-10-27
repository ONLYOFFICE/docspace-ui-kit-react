// `shiki` is an optional peer of `@onlyoffice/ai-chat` and, like `react-shiki`
// beside it, deliberately not a dependency here (see react-shiki.mjs and the
// `//devDependencies` note in package.json). Since 1.0.2-20261022 the widget's
// syntax highlighter builds its own core highlighter, importing
// `createHighlighterCore` from `shiki/core` and `createJavaScriptRegexEngine`
// from `shiki/engine/javascript` unconditionally -- `storybook build` stops
// with MISSING_EXPORT for both, and the dev server cannot load the chunk.
//
// The widget calls these only once a code block asks for highlighting. A
// highlighter that never arrives holds the block in its loading state, the
// plain unhighlighted block the react-shiki stub already leaves in place;
// throwing instead would log "Failed to load highlighter" for every block.

/** Never settles: the code block stays the plain one shown while loading. */
export const createHighlighterCore = (options) => {
  // The widget passes its themes as `import("shiki/themes/...")` promises.
  // Nothing here awaits them, and without shiki they reject, so they are
  // settled here rather than surface as unhandled rejections.
  for (const theme of options?.themes ?? []) {
    Promise.resolve(theme).catch(() => {});
  }

  return new Promise(() => {});
};

/** An inert engine: it is only handed to createHighlighterCore above. */
export const createJavaScriptRegexEngine = () => ({});
