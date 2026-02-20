import { describe, it, expect } from "vitest";
import { getTitleWithoutExtension } from ".";

describe("getTitleWithoutExtension", () => {
  it("removes extension from a standard filename", () => {
    expect(
      getTitleWithoutExtension(
        { title: "report.docx", fileExst: ".docx" },
        false,
      ),
    ).toBe("report");
  });

  it("handles titles with multiple dots", () => {
    expect(
      getTitleWithoutExtension(
        { title: "my.file.name.pdf", fileExst: ".pdf" },
        false,
      ),
    ).toBe("my.file.name");
  });

  it("returns full title when fromTemplate is true", () => {
    expect(
      getTitleWithoutExtension(
        { title: "template.docx", fileExst: ".docx" },
        true,
      ),
    ).toBe("template.docx");
  });

  it("returns full title when fileExst is empty", () => {
    expect(
      getTitleWithoutExtension({ title: "untitled", fileExst: "" }, false),
    ).toBe("untitled");
  });

  it("returns empty string when title is undefined", () => {
    expect(
      getTitleWithoutExtension({ title: undefined, fileExst: ".docx" }, false),
    ).toBe("");
  });

  it("returns full title when title has no dot", () => {
    expect(
      getTitleWithoutExtension({ title: "nodot", fileExst: ".txt" }, false),
    ).toBe("nodot");
  });

  it("handles single-character extension", () => {
    expect(
      getTitleWithoutExtension({ title: "file.a", fileExst: ".a" }, false),
    ).toBe("file");
  });
});
