import { describe, expect, it } from "vitest";

import {
  EXPORT_FORMAT_IDS,
  EXTENSION_BY_FORMAT,
  extensionOf,
  resolveFormat,
  stripExt,
} from "./export-format";

describe("resolveFormat", () => {
  it("takes the id chosen in the export submenu", () => {
    expect(resolveFormat(EXPORT_FORMAT_IDS.pdf, "chat.docx")).toBe("Pdf");
    expect(resolveFormat(EXPORT_FORMAT_IDS.md, "chat.docx")).toBe("Md");
  });

  it("falls back to the default name's extension for the plain save action", () => {
    // A single message's download button passes no format and always asks
    // for ".docx"; a host that later changes that name must keep working.
    expect(resolveFormat(undefined, "chat.docx")).toBe("Docx");
    expect(resolveFormat(undefined, "chat.PDF")).toBe("Pdf");
  });

  it("falls back to docx for an unknown id or extension", () => {
    expect(resolveFormat("rtf", "chat.docx")).toBe("Docx");
    expect(resolveFormat(undefined, "chat.rtf")).toBe("Docx");
    expect(resolveFormat(undefined, "chat")).toBe("Docx");
  });

  it("covers every declared format id", () => {
    Object.values(EXPORT_FORMAT_IDS).forEach((id) => {
      expect(EXTENSION_BY_FORMAT[resolveFormat(id, "chat")]).toBe(
        EXTENSION_BY_FORMAT[id],
      );
    });
  });
});

describe("stripExt / extensionOf", () => {
  it("drops only the matching extension, case-insensitively", () => {
    expect(stripExt("chat.docx", "docx")).toBe("chat");
    expect(stripExt("chat.DOCX", "docx")).toBe("chat");
    // The exported name keeps dots of its own: only the trailing extension
    // may go, or a thread titled "v1.2 review" loses half its name.
    expect(stripExt("v1.2 review.pdf", "pdf")).toBe("v1.2 review");
    expect(stripExt("chat.pdf", "docx")).toBe("chat.pdf");
    expect(stripExt("chat", "docx")).toBe("chat");
  });

  it("reads the extension a created file arrived with", () => {
    expect(extensionOf("chat (1).PDF")).toBe("pdf");
    expect(extensionOf("chat")).toBe("chat");
  });
});
