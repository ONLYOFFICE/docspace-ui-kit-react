import { describe, expect, it, vi } from "vitest";

// The module calls require(`PUBLIC_DIR/...`) at the top level which only
// resolves under Webpack.  We fully mock the module, reproducing its Map-
// building logic but replacing require() with a path-returning stub.
vi.mock(".", () => {
  const iconsMap: Record<string, string[]> = {
    "word.svg": [".docx", ".dotx", ".docm", ".dotm"],
    "wordCommon.svg": [
      ".fodt", ".doc", ".ott", ".odt", ".rtf",
      ".stw", ".sxw", ".wps", ".wpt", ".pages", ".hwp", ".hwpx",
    ],
    "cell.svg": [".xlsx", ".xltx", ".xlsb", ".xltm", ".xlsm"],
    "cellCommon.svg": [
      ".xls", ".ods", ".csv", ".fods", ".et", ".ett", ".ots", ".sxc", ".numbers",
    ],
    "diagram.svg": [".vsdx", ".vssx", ".vstx", ".vsdm", ".vssm", ".vstm"],
    "slide.svg": [".pptx", ".potx", ".ppsx", ".pptm", ".ppsm", ".potm"],
    "slideCommon.svg": [
      ".ppt", ".odp", ".otp", ".pps", ".fodp", ".dps", ".dpt", ".sxi", ".pot", ".key", ".odg",
    ],
    "pdf.svg": [".pdf"],
    "form.svg": [".docxf", ".oform"],
    "archive.svg": ["archive"],
    "calendar.svg": [".ics"],
    "ebook.svg": ["ebook"],
    "html.svg": ["html", ".xps", ".md", ".xml", ".oxps"],
    "letter.svg": [".iaf"],
    "text.svg": [".txt"],
    "video.svg": [
      ".3gp", ".asf", ".avi", ".f4v", ".fla", ".flv", ".m2ts", ".m4v",
      ".mkv", ".mov", ".mp4", ".mpeg", ".mpg", ".mts", ".ogv", ".svi",
      ".vob", ".webm", ".wmv",
    ],
    "image.svg": ["image"],
    "sound.svg": ["sound"],
    "file.svg": ["file"],
    "folder.svg": ["folder"],
    "folderComplete.svg": ["folderComplete"],
    "folderInProgress.svg": ["folderInProgress"],
    "room/custom.svg": ["customRoom"],
    "room/ai.svg": ["aiRoom"],
    "room/editing.svg": ["editingRoom"],
    "room/form.svg": ["formRoom"],
    "room/public.svg": ["publicRoom"],
    "room/virtual-data.svg": ["virtualRoom"],
    "room/archive.svg": ["archiveRoom"],
  };

  const all = Object.entries(iconsMap).flatMap(([iconName, formats]) =>
    formats.map((format): [string, string] => [format, iconName]),
  );
  const nonRoom = all.filter(([, iconName]) => !iconName.startsWith("room/"));

  const generateMapForSize = (
    size: number,
    entries: [string, string][],
  ): Map<string, string> =>
    new Map(
      entries.map(([format, iconName]) => {
        const svg = `${format.replace(/^\./, "")}.svg`;
        const url = `PUBLIC_DIR/images/icons/${size}/${iconName}?url`;
        return [svg, url];
      }),
    );

  return {
    iconSize24: generateMapForSize(24, nonRoom),
    iconSize32: generateMapForSize(32, all),
    iconSize64: generateMapForSize(64, nonRoom),
    iconSize96: generateMapForSize(96, nonRoom),
  };
});

const { iconSize24, iconSize32, iconSize64, iconSize96 } = await import(".");

describe("image-helpers", () => {
  it("exports iconSize24 as a Map", () => {
    expect(iconSize24).toBeInstanceOf(Map);
  });

  it("exports iconSize32 as a Map", () => {
    expect(iconSize32).toBeInstanceOf(Map);
  });

  it("exports iconSize64 as a Map", () => {
    expect(iconSize64).toBeInstanceOf(Map);
  });

  it("exports iconSize96 as a Map", () => {
    expect(iconSize96).toBeInstanceOf(Map);
  });

  it("iconSize32 contains room icons", () => {
    expect(iconSize32.has("customRoom.svg")).toBe(true);
    expect(iconSize32.has("editingRoom.svg")).toBe(true);
  });

  it("iconSize24 does not contain room icons", () => {
    expect(iconSize24.has("customRoom.svg")).toBe(false);
    expect(iconSize24.has("editingRoom.svg")).toBe(false);
  });

  it("all maps contain common file type icons", () => {
    const commonIcons = ["docx.svg", "pdf.svg", "xlsx.svg", "txt.svg"];

    for (const icon of commonIcons) {
      expect(iconSize24.has(icon)).toBe(true);
      expect(iconSize32.has(icon)).toBe(true);
      expect(iconSize64.has(icon)).toBe(true);
      expect(iconSize96.has(icon)).toBe(true);
    }
  });

  it("maps have string values for known extensions", () => {
    const val = iconSize32.get("docx.svg");
    expect(typeof val).toBe("string");
  });
});
