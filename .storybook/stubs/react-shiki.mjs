// `react-shiki` is an optional peer of `@onlyoffice/ai-chat` and is deliberately
// not a dependency here: nothing in this package imports it, and the consumers
// that render the AI agent declare it themselves (the DocSpace client carries it
// in its catalog). See the `//devDependencies` note in package.json.
//
// Storybook still has to render an assistant answer, and the widget's markdown
// renderer imports this module unconditionally -- an unresolved import throws
// inside the message component and takes the whole story down with it. So the
// Storybook dev server aliases the module to this stub.
//
// The widget's own `SyntaxHighlighter` already draws a plain, unhighlighted
// block whenever `useShikiHighlighter` has not produced a highlighter yet (its
// loading state). Returning `null` from the hook holds it in exactly that state,
// so code blocks in Storybook look like the real ones do before shiki loads --
// no highlighting, and no divergent markup of our own.
export const useShikiHighlighter = () => null;

const ShikiHighlighter = () => null;

export default ShikiHighlighter;
