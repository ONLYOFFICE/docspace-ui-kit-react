import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const copyMock = vi.hoisted(() => vi.fn<(text: string) => boolean>());
vi.mock("copy-to-clipboard", () => ({ default: copyMock }));

import { copyToHostClipboard } from "./index";

const setSecureContext = (value: boolean) => {
  Object.defineProperty(window, "isSecureContext", {
    configurable: true,
    value,
  });
};

const setClipboard = (clipboard: Partial<Clipboard> | undefined) => {
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: clipboard,
  });
};

describe("copyToHostClipboard (Bug 84481)", () => {
  beforeEach(() => {
    copyMock.mockReset();
  });

  afterEach(() => {
    setSecureContext(true);
    setClipboard(undefined);
  });

  it("writes through the Clipboard API in a secure context", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    setSecureContext(true);
    setClipboard({ writeText });

    await copyToHostClipboard("hello", { format: "markdown" });

    expect(writeText).toHaveBeenCalledWith("hello");
    expect(copyMock).not.toHaveBeenCalled();
  });

  it("falls back to execCommand copy when served over plain HTTP", async () => {
    setSecureContext(false);
    setClipboard(undefined);
    copyMock.mockReturnValue(true);

    await copyToHostClipboard("hello", { format: "text" });

    expect(copyMock).toHaveBeenCalledWith("hello", { format: "text/plain" });
  });

  it("falls back when the Clipboard API refuses the write", async () => {
    setSecureContext(true);
    setClipboard({ writeText: vi.fn().mockRejectedValue(new Error("denied")) });
    copyMock.mockReturnValue(true);

    await copyToHostClipboard("hello");

    expect(copyMock).toHaveBeenCalledWith("hello", { format: "text/plain" });
  });

  it("rejects when the fallback cannot copy either", async () => {
    setSecureContext(false);
    setClipboard(undefined);
    copyMock.mockReturnValue(false);

    await expect(copyToHostClipboard("hello")).rejects.toThrow(
      "Copying to the clipboard failed",
    );
  });
});
