import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Every call the module makes lands in `order`, which is what the first test
// is about: the subscription has to be in place before the request goes out.
const mocks = vi.hoisted(() => {
  const order: string[] = [];
  return {
    order,
    socket: {
      emit: vi.fn((command: string) => order.push(`socket:${command}`)),
      on: vi.fn(),
      off: vi.fn(),
    },
  };
});
const { order, socket } = mocks;

vi.mock("../../../utils/socket", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../../../utils/socket")>()),
  default: mocks.socket,
}));

import { SocketCommands } from "../../../utils/socket";

import { useAnalyzeQuestions } from "./use-analyze-questions";

const QUESTION = {
  question: "How many people picked each payment method?",
  prompt: "Count the responses per value of the payment method field.",
};

/** Delivers a socket event to the listener the hook registered. */
const emitQuestions = (attachmentId: string, questions: unknown) => {
  const handle = socket.on.mock.calls.at(-1)?.[1] as (d: unknown) => void;
  act(() => handle({ attachmentId, questions }));
};

const pendingAnswer = () =>
  vi.fn(async () => {
    order.push("request");
    return { status: "pending" as const, questions: [] };
  });

describe("useAnalyzeQuestions", () => {
  beforeEach(() => {
    order.length = 0;
    socket.emit.mockClear();
    socket.on.mockClear();
    socket.off.mockClear();
  });

  // Generation is asynchronous and can finish while the request is in flight.
  // Subscribing afterwards would miss the only event there will ever be, and
  // the chips would never appear for a form analyzed for the first time.
  it("subscribes before it asks", async () => {
    const read = pendingAnswer();

    renderHook(() => useAnalyzeQuestions(read, "att-1"));
    await waitFor(() => expect(read).toHaveBeenCalled());

    expect(order).toEqual([`socket:${SocketCommands.Subscribe}`, "request"]);
  });

  it("shows the questions the socket brings", async () => {
    const read = pendingAnswer();
    const { result } = renderHook(() => useAnalyzeQuestions(read, "att-1"));
    await waitFor(() => expect(read).toHaveBeenCalled());

    expect(result.current.questions).toBeNull();

    emitQuestions("att-1", [QUESTION]);

    expect(result.current.questions).toEqual([QUESTION]);
    // Nothing left to wait for, so the room is dropped.
    expect(socket.off).toHaveBeenCalled();
  });

  // A form analyzed before is a cache hit: the chips must appear without
  // waiting for an event that is never emitted again.
  it("shows a cache hit without waiting for the socket", async () => {
    const read = vi.fn(async () => ({
      status: "ready" as const,
      questions: [QUESTION],
    }));

    const { result } = renderHook(() => useAnalyzeQuestions(read, "att-1"));

    await waitFor(() => expect(result.current.questions).toEqual([QUESTION]));
    expect(socket.off).toHaveBeenCalled();
  });

  it("asks once per attachment, however often it re-renders", async () => {
    const read = pendingAnswer();
    const { rerender } = renderHook(() => useAnalyzeQuestions(read, "att-1"));
    await waitFor(() => expect(read).toHaveBeenCalled());

    rerender();
    rerender();

    expect(read).toHaveBeenCalledTimes(1);
    expect(socket.on).toHaveBeenCalledTimes(1);
  });

  it("drops the wait and the questions when the form leaves", async () => {
    const read = pendingAnswer();
    const { result, rerender } = renderHook(
      ({ id }: { id?: string }) => useAnalyzeQuestions(read, id),
      { initialProps: { id: "att-1" as string | undefined } },
    );
    await waitFor(() => expect(read).toHaveBeenCalled());
    emitQuestions("att-1", [QUESTION]);
    expect(result.current.questions).toEqual([QUESTION]);

    rerender({ id: undefined });

    expect(result.current.questions).toBeNull();
    expect(socket.emit).toHaveBeenCalledWith(
      SocketCommands.Unsubscribe,
      expect.anything(),
    );
  });

  // Writing your own question makes the suggestions moot, and the answer that
  // lands afterwards must not push chips under a half-typed message.
  it("stops listening once the user starts typing", async () => {
    const read = pendingAnswer();
    const { result } = renderHook(() => useAnalyzeQuestions(read, "att-1"));
    await waitFor(() => expect(read).toHaveBeenCalled());

    act(() => result.current.onTyping());
    emitQuestions("att-1", [QUESTION]);

    expect(result.current.questions).toBeNull();
  });
});
