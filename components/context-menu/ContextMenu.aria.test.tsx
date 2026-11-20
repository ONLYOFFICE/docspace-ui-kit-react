import React from "react";
import { describe, expect, it } from "vitest";
import { act, render } from "@testing-library/react";

import { ContextMenu } from ".";
import type { ContextMenuRefType } from "./ContextMenu.types";

describe("ContextMenu aria-*", () => {
  it("puts a passed aria-* on the menu panel", () => {
    const ref = React.createRef<ContextMenuRefType>();
    render(
      <ContextMenu
        ref={ref}
        id="file-menu"
        model={[{ key: "open", label: "Open" }]}
        aria-label="File actions"
      />,
    );

    act(() => {
      ref.current?.show({
        clientX: 10,
        clientY: 10,
        pageX: 10,
        pageY: 10,
        stopPropagation: () => {},
        preventDefault: () => {},
      } as unknown as MouseEvent);
    });

    expect(document.getElementById("file-menu")).toHaveAttribute(
      "aria-label",
      "File actions",
    );
  });
});
