import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render } from "@testing-library/react";

import { ModalDialog } from ".";

// A phone with a touch screen: the swipe is read only there.
vi.mock("../../utils", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../../utils")>()),
  isTouchDevice: true,
  isMobile: () => true,
}));

vi.mock("react-device-detect", () => ({
  isSafari: false,
  isTablet: false,
  isMobileOnly: false,
  isMobile: false,
}));

// Drags the header down by 200px, past the 120px that closes the sheet.
const swipeDown = () => {
  const handle = document.getElementById("modal-header-swipe")!;
  fireEvent.touchStart(handle, { touches: [{ clientY: 100, target: handle }] });
  fireEvent.touchMove(handle, { touches: [{ clientY: 300, target: handle }] });
  fireEvent.touchEnd(handle);
};

describe("ModalDialog swipe", () => {
  const onClose = vi.fn();

  beforeEach(() => {
    onClose.mockClear();
  });

  it("closes a dialog that can close", () => {
    render(
      <ModalDialog visible onClose={onClose}>
        <ModalDialog.Header>Rename</ModalDialog.Header>
        <ModalDialog.Body>Body</ModalDialog.Body>
      </ModalDialog>,
    );

    swipeDown();

    expect(onClose).toHaveBeenCalled();
  });

  it("leaves a dialog with isCloseable={false} open", () => {
    render(
      <ModalDialog visible onClose={onClose} isCloseable={false}>
        <ModalDialog.Header>Rename</ModalDialog.Header>
        <ModalDialog.Body>Body</ModalDialog.Body>
      </ModalDialog>,
    );

    swipeDown();

    expect(onClose).not.toHaveBeenCalled();
  });
});
