import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  __resetGeneratedFileWindowForTests,
  hasReservedGeneratedFileWindow,
  releaseGeneratedFileWindow,
  reserveGeneratedFileWindow,
  takeReservedGeneratedFileWindow,
} from "./generated-file-window";
import {
  addDialogSubmitInterceptor,
  runDialogSubmitInterceptors,
} from "../components-overrides/dialog-footer/submit-interceptors";

type FakeWindow = {
  closed: boolean;
  close: () => void;
  document: { open: () => void; write: (html: string) => void; close: () => void };
};

const makeWindow = (): FakeWindow => {
  const win: FakeWindow = {
    closed: false,
    close: vi.fn(() => {
      win.closed = true;
    }),
    document: { open: vi.fn(), write: vi.fn(), close: vi.fn() },
  };
  return win;
};

describe("generated-file window reservation", () => {
  let open: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    __resetGeneratedFileWindowForTests();
    open = vi.fn(() => makeWindow());
    vi.stubGlobal("open", open);
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  // The whole point: the tab is opened synchronously, in the gesture, and
  // handed over untouched later.
  it("opens a blank tab on reserve and hands it over once", () => {
    reserveGeneratedFileWindow();
    expect(open).toHaveBeenCalledWith("", "_blank");
    expect(hasReservedGeneratedFileWindow()).toBe(true);

    const win = takeReservedGeneratedFileWindow();
    expect(win).toBe(open.mock.results[0].value);
    expect(takeReservedGeneratedFileWindow()).toBeNull();
    expect(hasReservedGeneratedFileWindow()).toBe(false);
  });

  // The tab takes focus the moment it opens, so it must not be blank: the
  // editor's boot loader is painted into it, in the portal's theme.
  it("paints the app loader into the reserved tab, following the theme", () => {
    document.documentElement.setAttribute("data-theme", "dark");
    reserveGeneratedFileWindow();
    const { document: doc } = open.mock.results[0].value as FakeWindow;
    expect(doc.open).toHaveBeenCalled();
    expect(doc.close).toHaveBeenCalled();
    const html = (doc.write as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as string;
    expect(html).toContain('data-testid="app-loader"');
    expect(html).toContain("keyFrameBlue");
    expect(html).toContain("background: #333333");
    document.documentElement.removeAttribute("data-theme");
  });

  // Rendering trouble must not cost the reservation itself.
  it("keeps the reservation when the placeholder cannot be written", () => {
    const win = makeWindow();
    win.document.write = vi.fn(() => {
      throw new Error("denied");
    });
    open.mockReturnValueOnce(win);
    reserveGeneratedFileWindow();
    expect(hasReservedGeneratedFileWindow()).toBe(true);
  });

  // A denied call or a failed stream must not leave a blank tab behind.
  it("closes the spare tab on release", () => {
    reserveGeneratedFileWindow();
    const win = open.mock.results[0].value as FakeWindow;
    releaseGeneratedFileWindow();
    expect(win.close).toHaveBeenCalled();
    expect(takeReservedGeneratedFileWindow()).toBeNull();
  });

  // Two approvals in a row (or a re-render calling reserve twice) must end
  // with one spare tab, not a growing pile.
  it("replaces a stale reservation instead of stacking tabs", () => {
    reserveGeneratedFileWindow();
    reserveGeneratedFileWindow();
    const first = open.mock.results[0].value as FakeWindow;
    expect(first.close).toHaveBeenCalled();
    expect(takeReservedGeneratedFileWindow()).toBe(open.mock.results[1].value);
  });

  // The user may close the blank tab before the file is ready; the opener
  // then has to fall back to window.open instead of navigating a dead window.
  it("does not hand over a tab the user already closed", () => {
    reserveGeneratedFileWindow();
    (open.mock.results[0].value as FakeWindow).closed = true;
    expect(hasReservedGeneratedFileWindow()).toBe(false);
    expect(takeReservedGeneratedFileWindow()).toBeNull();
  });

  // Popups blocked even inside the gesture: nothing is reserved and nothing
  // throws — the opener's own fallback takes over.
  it("survives a blocked window.open", () => {
    open.mockReturnValueOnce(null);
    reserveGeneratedFileWindow();
    expect(hasReservedGeneratedFileWindow()).toBe(false);
    expect(() => releaseGeneratedFileWindow()).not.toThrow();
  });
});

describe("dialog submit interceptors", () => {
  it("runs every registered interceptor and stops after removal", () => {
    const a = vi.fn();
    const b = vi.fn();
    const removeA = addDialogSubmitInterceptor(a);
    const removeB = addDialogSubmitInterceptor(b);

    runDialogSubmitInterceptors();
    expect(a).toHaveBeenCalledTimes(1);
    expect(b).toHaveBeenCalledTimes(1);

    removeA();
    runDialogSubmitInterceptors();
    expect(a).toHaveBeenCalledTimes(1);
    expect(b).toHaveBeenCalledTimes(2);
    removeB();
  });

  // One misbehaving interceptor must not break the dialog's own submit or
  // starve the interceptors after it.
  it("isolates a throwing interceptor", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const removeBad = addDialogSubmitInterceptor(() => {
      throw new Error("boom");
    });
    const after = vi.fn();
    const removeAfter = addDialogSubmitInterceptor(after);

    expect(() => runDialogSubmitInterceptors()).not.toThrow();
    expect(after).toHaveBeenCalledTimes(1);
    removeBad();
    removeAfter();
    vi.restoreAllMocks();
  });
});
