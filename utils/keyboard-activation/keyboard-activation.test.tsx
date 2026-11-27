import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { activateOnButtonKey } from ".";

const renderButton = () => {
  const activate = vi.fn();
  const onPageKeyDown = vi.fn();
  render(
    <div onKeyDown={onPageKeyDown}>
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => activateOnButtonKey(e, activate)}
      >
        Open
      </div>
    </div>,
  );
  return { activate, onPageKeyDown, button: screen.getByRole("button") };
};

describe("activateOnButtonKey", () => {
  it("activates on Enter and Space and keeps them from the page", () => {
    const { activate, onPageKeyDown, button } = renderButton();

    fireEvent.keyDown(button, { key: "Enter" });
    fireEvent.keyUp(button, { key: "Enter" });
    fireEvent.keyDown(button, { key: " " });
    fireEvent.keyUp(button, { key: " " });

    expect(activate).toHaveBeenCalledTimes(2);
    expect(onPageKeyDown).not.toHaveBeenCalled();
  });

  it("activates once while the key is held", () => {
    const { activate, onPageKeyDown, button } = renderButton();

    fireEvent.keyDown(button, { key: "Enter" });
    fireEvent.keyDown(button, { key: "Enter", repeat: true });
    fireEvent.keyDown(button, { key: "Enter", repeat: true });
    fireEvent.keyUp(button, { key: "Enter" });

    expect(activate).toHaveBeenCalledTimes(1);
    expect(onPageKeyDown).not.toHaveBeenCalled();
  });

  it.each(["ctrlKey", "altKey", "metaKey"])(
    "leaves the key with %s to the page",
    (modifier) => {
      const { activate, onPageKeyDown, button } = renderButton();

      const notCancelled = fireEvent.keyDown(button, {
        key: "Enter",
        [modifier]: true,
      });

      expect(activate).not.toHaveBeenCalled();
      expect(onPageKeyDown).toHaveBeenCalledTimes(1);
      expect(notCancelled).toBe(true);
    },
  );
});
