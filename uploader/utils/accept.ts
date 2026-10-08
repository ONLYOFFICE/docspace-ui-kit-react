/**
 * Turns `accept` into what the drop library understands.
 *
 * react-dropzone (and the file input under it) has no wildcard for "anything":
 * `"*"` and even `"*\/*"` refuse every file, and only an empty value lets any
 * type through. So a list that names `*` or `*\/*` anywhere, an empty string
 * and a missing value all become `""` -- any file. Anything else (".pdf,.docx",
 * "image/*") is passed on as it is.
 */
export const normalizeAccept = (accept?: string): string => {
  if (!accept) return "";

  const entries = accept
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

  if (!entries.length) return "";
  if (entries.some((entry) => entry === "*" || entry === "*/*")) return "";

  return accept;
};
