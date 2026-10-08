import { afterEach, describe, expect, it, vi } from "vitest";

import { consumeKey } from ".";

describe("consumeKey", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("stops the keydown and swallows its keyup before window listeners", () => {
    const button = document.createElement("button");
    document.body.appendChild(button);
    const onDocumentKeyDown = vi.fn();
    const onWindowKeyUp = vi.fn();
    document.addEventListener("keydown", onDocumentKeyDown);
    window.addEventListener("keyup", onWindowKeyUp);

    button.addEventListener("keydown", (e) => consumeKey(e));
    button.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    // Focus has moved on: the keyup lands somewhere else.
    document.body.dispatchEvent(
      new KeyboardEvent("keyup", { key: "Escape", bubbles: true }),
    );

    expect(onDocumentKeyDown).not.toHaveBeenCalled();
    expect(onWindowKeyUp).not.toHaveBeenCalled();

    // Only that one keyup: the next press goes through.
    document.body.dispatchEvent(
      new KeyboardEvent("keyup", { key: "Escape", bubbles: true }),
    );
    expect(onWindowKeyUp).toHaveBeenCalledTimes(1);

    document.removeEventListener("keydown", onDocumentKeyDown);
    window.removeEventListener("keyup", onWindowKeyUp);
    button.remove();
  });

  it("lets a keyup of another key through", () => {
    const onWindowKeyUp = vi.fn();
    window.addEventListener("keyup", onWindowKeyUp);

    consumeKey({ key: "Enter", stopPropagation: () => {} });
    document.body.dispatchEvent(
      new KeyboardEvent("keyup", { key: "a", bubbles: true }),
    );
    expect(onWindowKeyUp).toHaveBeenCalledTimes(1);

    document.body.dispatchEvent(
      new KeyboardEvent("keyup", { key: "Enter", bubbles: true }),
    );
    expect(onWindowKeyUp).toHaveBeenCalledTimes(1);

    window.removeEventListener("keyup", onWindowKeyUp);
  });

  it("gives up on a keyup that never comes", () => {
    vi.useFakeTimers();
    const onWindowKeyUp = vi.fn();
    window.addEventListener("keyup", onWindowKeyUp);

    consumeKey({ key: "Enter", stopPropagation: () => {} });
    vi.advanceTimersByTime(1000);
    document.body.dispatchEvent(
      new KeyboardEvent("keyup", { key: "Enter", bubbles: true }),
    );
    expect(onWindowKeyUp).toHaveBeenCalledTimes(1);

    window.removeEventListener("keyup", onWindowKeyUp);
  });
});
