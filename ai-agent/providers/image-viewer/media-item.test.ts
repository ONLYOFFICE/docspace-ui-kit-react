import { describe, expect, it } from "vitest";

import { getMobileMediaContextModel } from "../../../media-viewer/MediaViewer.helpers";
import { CHAT_IMAGE_FILE_ID, getChatImageMediaItem } from "./media-item";

const PNG = "data:image/png;base64,AAAA";

describe("getChatImageMediaItem", () => {
  it("keeps the name of a picture that has an image extension", () => {
    const item = getChatImageMediaItem(
      { src: PNG, title: "Chart.JPG" },
      PNG,
      "Image",
    );

    expect(item.extension).toBe(".jpg");
    expect(item.playlist[0].title).toBe("Chart.JPG");
    expect(item.file.title).toBe("Chart.JPG");
  });

  it("takes the extension from a data URL's type when the name has none", () => {
    const src = "data:image/webp;base64,AAAA";
    const item = getChatImageMediaItem({ src, title: "sketch" }, src, "Image");

    expect(item.extension).toBe(".webp");
    expect(item.playlist[0].title).toBe("sketch.webp");
  });

  it("takes the extension from a URL's path, not its query", () => {
    const src = "https://example.com/pics/cat.gif?size=2.png";
    const item = getChatImageMediaItem({ src }, src, "Image");

    expect(item.extension).toBe(".gif");
    expect(item.playlist[0].title).toBe("Image.gif");
  });

  it("falls back to .png for a source that says nothing of its type", () => {
    const item = getChatImageMediaItem(
      { src: "blob:http://localhost/1", title: "report.docx" },
      "blob:http://localhost/2",
      "Image",
    );

    expect(item.extension).toBe(".png");
    // A name with an extension of another kind keeps it and gains the image's,
    // since the viewer picks its mode by the last one.
    expect(item.playlist[0].title).toBe("report.docx.png");
  });

  it("shows the source it was handed, not the request's own", () => {
    const item = getChatImageMediaItem(
      { src: "blob:http://localhost/1" },
      "blob:http://localhost/copy",
      "Image",
    );

    expect(item.playlist[0].src).toBe("blob:http://localhost/copy");
    expect(item.playlist[0].fileId).toBe(CHAT_IMAGE_FILE_ID);
    expect(item.file.id).toBe(CHAT_IMAGE_FILE_ID);
  });

  it("offers Download only when the chat can save the picture", () => {
    const withDownload = getChatImageMediaItem(
      { src: PNG, onDownload: () => {} },
      PNG,
      "Image",
    );
    const withoutDownload = getChatImageMediaItem({ src: PNG }, PNG, "Image");

    expect(withDownload.file.security?.Download).toBe(true);
    expect(withoutDownload.file.security?.Download).toBe(false);
    expect(Object.keys(withDownload.file.security ?? {})).toEqual(["Download"]);
  });
});

// A phone and a tablet have no toolbar: the viewer's menu is their only way
// to the download, and it must offer nothing else of a file.
describe("the viewer's menu for a chat picture on a phone", () => {
  const t = ((key: string) => key) as never;

  const menuOf = (onDownload?: VoidFunction) => {
    const { file } = getChatImageMediaItem(
      { src: PNG, title: "chart.png", onDownload },
      PNG,
      "Image",
    );

    return getMobileMediaContextModel(t, file, false, {
      onClickDownload: onDownload,
    })
      .filter((option) => !option.disabled)
      .map((option) => option.key);
  };

  it("has Download alone for a picture the chat can download", () => {
    expect(menuOf(() => {})).toEqual(["download"]);
  });

  it("has no row for a picture the chat cannot download", () => {
    expect(menuOf()).toEqual([]);
  });
});
