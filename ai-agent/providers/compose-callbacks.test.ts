import { describe, expect, it, vi } from "vitest";

import { composeCallbacks } from "./compose-callbacks";

// The widget takes one callbacks object and replaces it wholesale, so a
// provider that needs an event of its own must merge rather than pass its own
// down — otherwise every handler the host registered disappears.
describe("composeCallbacks", () => {
  it("calls both handlers of a shared event, ours first", () => {
    const order: string[] = [];
    const host = { onThreadsUpdated: () => order.push("host") };
    const own = { onThreadsUpdated: () => order.push("own") };

    composeCallbacks(host, own).onThreadsUpdated?.({} as never);

    expect(order).toEqual(["own", "host"]);
  });

  it("keeps the events only one side registered", () => {
    const onMessageSent = vi.fn();
    const onThreadsUpdated = vi.fn();

    const merged = composeCallbacks({ onMessageSent }, { onThreadsUpdated });
    merged.onMessageSent?.({} as never);
    merged.onThreadsUpdated?.({} as never);

    expect(onMessageSent).toHaveBeenCalledTimes(1);
    expect(onThreadsUpdated).toHaveBeenCalledTimes(1);
  });

  it("still runs the host handler when ours throws", () => {
    const host = vi.fn();
    const own = () => {
      throw new Error("boom");
    };

    const merged = composeCallbacks(
      { onThreadsUpdated: host },
      { onThreadsUpdated: own },
    );

    expect(() => merged.onThreadsUpdated?.({} as never)).toThrow("boom");
    // These are notifications, not a pipeline: one side failing must not
    // silently disable the other.
    expect(host).toHaveBeenCalledTimes(1);
  });

  it("returns our own set untouched when the host passes none", () => {
    const own = { onThreadsUpdated: vi.fn() };

    expect(composeCallbacks(undefined, own)).toBe(own);
  });
});
