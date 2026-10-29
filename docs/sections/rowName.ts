/**
 * Finds a row's name link by the whole name. The link writes a file's
 * extension in a span of its own, as the client does, so the plain text
 * matcher, which reads only an element's own text, never sees "Notes.docx"
 * in one piece.
 */
export const rowName =
  (title: string) => (_content: string, element: Element | null) =>
    element?.tagName === "A" && element.textContent === title;
