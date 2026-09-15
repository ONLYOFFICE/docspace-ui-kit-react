import { beforeEach, describe, expect, it, vi } from "vitest";

const info = vi.fn();
const warning = vi.fn();
// The factory is hoisted above the declarations above, so reach them lazily.
vi.mock("../../../components/toast", () => ({
  toastr: {
    info: (...args: unknown[]) => info(...args),
    warning: (...args: unknown[]) => warning(...args),
  },
}));

import { notifyAlreadyAttached, notifyAttachmentLimit } from "./notices";

// Stand-in for i18next: echo the key so the assertions can name it, and keep
// the interpolation values for the plural checks.
const t = ((key: string, options?: { count?: number; limit?: number }) =>
  `${key}:${options?.count ?? options?.limit}`) as unknown as Parameters<
  typeof notifyAlreadyAttached
>[0];

describe("attachment notices", () => {
  beforeEach(() => {
    info.mockClear();
    warning.mockClear();
  });

  // Two call sites hand the count straight through from the attach result,
  // so a zero must stay silent rather than claim a duplicate.
  it("says nothing when nothing was left out", () => {
    notifyAlreadyAttached(t, 0);
    notifyAttachmentLimit(t, 0);
    expect(info).not.toHaveBeenCalled();
    expect(warning).not.toHaveBeenCalled();
  });

  it("ignores a negative count the same way", () => {
    notifyAlreadyAttached(t, -1);
    notifyAttachmentLimit(t, -1);
    expect(info).not.toHaveBeenCalled();
    expect(warning).not.toHaveBeenCalled();
  });

  it("uses the singular key for one duplicate", () => {
    notifyAlreadyAttached(t, 1);
    expect(info).toHaveBeenCalledWith(
      "Common:AttachFilesAlreadyAttached_one:1",
    );
  });

  it("uses the plural key for more than one", () => {
    notifyAlreadyAttached(t, 3);
    expect(info).toHaveBeenCalledWith(
      "Common:AttachFilesAlreadyAttached_other:3",
    );
  });

  it("warns about the cap by quoting the rule, not the count", () => {
    notifyAttachmentLimit(t, 2);
    expect(warning).toHaveBeenCalledWith("Common:AttachFilesLimit:5");
  });
});
