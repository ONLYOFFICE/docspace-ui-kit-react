import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import useContextMenuHotkeys from "./useContextMenuHotkeys";
import type { ContextMenuModel } from "../ContextMenu.types";

const renderMenuHotkeys = (model: ContextMenuModel[]) =>
  renderHook(() =>
    useContextMenuHotkeys({
      visible: true,
      withHotkeys: true,
      model,
      currentEvent: { current: new Event("contextmenu") },
      hide: vi.fn(),
      showDisabledItems: false,
    }),
  );

const press = (code: string) =>
  act(() => {
    window.dispatchEvent(new KeyboardEvent("keyup", { code }));
  });

describe("useContextMenuHotkeys arrows", () => {
  it("skips separators and wraps around both ways", () => {
    const model: ContextMenuModel[] = [
      { key: "first", label: "First" },
      { key: "separator", isSeparator: true },
      { key: "last", label: "Last" },
    ];
    const { result } = renderMenuHotkeys(model);

    press("ArrowDown");
    expect(result.current.currentIndex).toBe(2);

    press("ArrowDown");
    expect(result.current.currentIndex).toBe(0);

    press("ArrowUp");
    expect(result.current.currentIndex).toBe(2);
  });

  it("wraps down past a disabled item at the end", () => {
    const model: ContextMenuModel[] = [
      { key: "move-to", label: "Move to" },
      { key: "copy", label: "Copy" },
      { key: "duplicate", label: "Duplicate", disabled: true },
    ];
    const { result } = renderMenuHotkeys(model);

    press("ArrowDown");
    expect(result.current.currentIndex).toBe(1);

    press("ArrowDown");
    expect(result.current.currentIndex).toBe(0);
  });

  it("wraps up past a separator and a disabled item at the start", () => {
    const model: ContextMenuModel[] = [
      { key: "separator", isSeparator: true },
      { key: "hidden", label: "Hidden", disabled: true },
      { key: "first", label: "First" },
      { key: "last", label: "Last" },
    ];
    const { result } = renderMenuHotkeys(model);

    act(() => result.current.onMouseMove(2, model, 0));

    press("ArrowUp");
    expect(result.current.currentIndex).toBe(3);
  });
});
