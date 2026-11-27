import React from "react";
import { afterEach, describe, expect, it } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";

import { ContextMenu } from ".";
import type { ContextMenuRefType } from "./ContextMenu.types";

const setWidth = (value: number | undefined) => {
  if (value === undefined) Reflect.deleteProperty(window, "innerWidth");
  else
    Object.defineProperty(window, "innerWidth", { value, configurable: true });
};

describe("ContextMenu names", () => {
  afterEach(() => setWidth(undefined));

  it("names the back button of a mobile sub-menu", async () => {
    setWidth(375);
    const ref = React.createRef<ContextMenuRefType>();

    render(
      <ContextMenu
        ref={ref}
        ignoreChangeView
        header={{ title: "Report.docx", icon: "file.svg" }}
        model={[
          {
            key: "move",
            label: "Move to",
            items: [{ key: "rooms", label: "Rooms" }],
          },
        ]}
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

    await act(async () => {
      fireEvent.click(screen.getByText("Move to"));
    });

    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
  });
});
