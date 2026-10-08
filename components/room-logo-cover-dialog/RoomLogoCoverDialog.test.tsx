import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import type { TTranslation } from "../../utils";

import { RoomLogoCoverDialog } from ".";

const t = ((key: string) => key) as TTranslation;

const dialogHeight = () =>
  document
    .getElementById("modal-onMouseDown-close")
    ?.style.getPropertyValue("--dialog-height");

describe("RoomLogoCoverDialog", () => {
  it("measures its height on the first opening", async () => {
    render(
      <RoomLogoCoverDialog
        t={t}
        visible
        covers={[]}
        onClose={() => {}}
        onApply={() => {}}
      />,
    );

    // The Portal mounts the content after the first render. The height has
    // to be measured against it then, not left at the 648px desktop preset:
    // jsdom's 768px window leaves room for 768 - 84.
    await screen.findByTestId("room_logo_cover_dialog");
    expect(dialogHeight()).toBe(`${window.innerHeight - 84}px`);
  });
});
