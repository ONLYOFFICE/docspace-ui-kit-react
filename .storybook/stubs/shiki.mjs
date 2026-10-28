// Stub for `shiki/core` and `shiki/engine/javascript`, which ai-chat's code
// highlighter imports next to `react-shiki/core` (see react-shiki.mjs). Same
// idea: hold the widget in its loading state instead of failing. The
// highlighter promise never settles, so code blocks keep the plain block the
// widget draws before shiki loads, and nothing throws into the console.
export const createHighlighterCore = () => new Promise(() => {});

export const createJavaScriptRegexEngine = () => ({});
