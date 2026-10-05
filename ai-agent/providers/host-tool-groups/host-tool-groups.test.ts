import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { __resetGeneratedFileWindowForTests } from "./generated-file-window";
import { openGeneratedFileWithToolCall } from ".";

describe("openGeneratedFileWithToolCall", () => {
  let editor: HTMLIFrameElement;

  beforeEach(() => {
    __resetGeneratedFileWindowForTests();
    // A real Window to stand in for the new tab: MessageEvent wants one as
    // its source.
    editor = document.createElement("iframe");
    document.body.appendChild(editor);
    vi.spyOn(window, "open").mockReturnValue(editor.contentWindow);
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    editor.remove();
    vi.restoreAllMocks();
  });

  it("opens the portal's own editor for the file", () => {
    expect(openGeneratedFileWithToolCall(42, "generate", {})).toBe(true);
    expect(window.open).toHaveBeenCalledWith(
      `${window.location.origin}/doceditor?fileId=42`,
      "_blank",
    );
  });

  it("sends the tool call to this origin only, never to any origin", () => {
    const tab = editor.contentWindow as Window;
    const postMessage = vi.spyOn(tab, "postMessage");

    openGeneratedFileWithToolCall(42, "generate", { text: "draft" });
    window.dispatchEvent(
      new MessageEvent("message", {
        data: { type: "editorDocumentReady" },
        source: tab,
      }),
    );

    expect(postMessage).toHaveBeenCalledTimes(1);
    expect(postMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "callEditorTool",
        name: "generate",
        arguments: { text: "draft" },
      }),
      window.location.origin,
    );
  });

  it("ignores a ready signal from any other window", () => {
    const tab = editor.contentWindow as Window;
    const postMessage = vi.spyOn(tab, "postMessage");

    openGeneratedFileWithToolCall(42, "generate", {});
    window.dispatchEvent(
      new MessageEvent("message", {
        data: { type: "editorDocumentReady" },
        source: window,
      }),
    );

    expect(postMessage).not.toHaveBeenCalled();
  });
});
