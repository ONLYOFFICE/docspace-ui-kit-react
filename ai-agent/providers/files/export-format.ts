import type { AiExportFormat } from "../../../api/ai";

// Export format ids handed to the chat library (and back through
// `saveAsFile`). They spell the .NET `MdOutputFormat` enum members, so the id
// travels from the menu to the API untranslated.
export const EXPORT_FORMAT_IDS = {
  docx: "Docx",
  pdf: "Pdf",
  md: "Md",
} as const satisfies Record<string, AiExportFormat>;

// File extension produced by each format.
export const EXTENSION_BY_FORMAT: Record<AiExportFormat, string> = {
  Docx: "docx",
  Pdf: "pdf",
  Md: "md",
};

const isExportFormat = (value: string): value is AiExportFormat =>
  value in EXTENSION_BY_FORMAT;

export const extensionOf = (name: string) =>
  name.slice(name.lastIndexOf(".") + 1).toLowerCase();

export const stripExt = (name: string, ext: string) =>
  new RegExp(`\\.${ext}$`, "i").test(name)
    ? name.slice(0, -(ext.length + 1))
    : name;

// What the user picked in the "Export to…" submenu. `format` is absent for the
// plain save action (a single message's download button), which always asks
// for the extension in `defaultName` — so that extension is the fallback, and
// docx the last resort, matching the endpoint's own default.
export const resolveFormat = (
  format: string | undefined,
  defaultName: string,
): AiExportFormat => {
  if (format && isExportFormat(format)) return format;

  const ext = extensionOf(defaultName);
  const byExtension = (
    Object.entries(EXTENSION_BY_FORMAT) as [AiExportFormat, string][]
  ).find(([, value]) => value === ext);

  return byExtension?.[0] ?? "Docx";
};
