import { beforeEach, describe, expect, it, vi } from "vitest";

// The socket helper is a singleton built against a live connection; only the
// three calls this module makes are needed, and they are what the tests read.
// Hoisted, because the factory below runs before the module body.
const mocks = vi.hoisted(() => ({
  socket: { emit: vi.fn(), on: vi.fn(), off: vi.fn() },
}));
const socket = mocks.socket;

vi.mock("../../../utils/socket", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../../../utils/socket")>()),
  default: mocks.socket,
}));

import { SocketCommands, SocketEvents } from "../../../utils/socket";

import {
  requestSuggestedQuestions,
  subscribeToSuggestedQuestions,
} from "./suggested-questions";

const QUESTION = {
  question: "How many people picked each payment method?",
  prompt: "Count the responses per value of the payment method field.",
};

describe("subscribeToSuggestedQuestions", () => {
  beforeEach(() => {
    socket.emit.mockClear();
    socket.on.mockClear();
    socket.off.mockClear();
  });

  // The room the backend emits into is `{tenantId}-form-analysis-{id}`; the
  // socket server prepends the tenant half itself, so only the tail is sent.
  it("joins the attachment's room and leaves it on unsubscribe", () => {
    const stop = subscribeToSuggestedQuestions("att-1", vi.fn());

    expect(socket.emit).toHaveBeenCalledWith(SocketCommands.Subscribe, {
      roomParts: "form-analysis-att-1",
    });
    expect(socket.on).toHaveBeenCalledWith(
      SocketEvents.FormSuggestedQuestions,
      expect.any(Function),
    );

    stop();

    expect(socket.off).toHaveBeenCalledWith(
      SocketEvents.FormSuggestedQuestions,
      socket.on.mock.calls[0][1],
    );
    expect(socket.emit).toHaveBeenLastCalledWith(SocketCommands.Unsubscribe, {
      roomParts: "form-analysis-att-1",
    });
  });

  const emitEvent = (data: unknown) => {
    const handle = socket.on.mock.calls[0][1] as (payload: unknown) => void;
    handle(data);
  };

  it("hands over the questions of its own attachment", () => {
    const onQuestions = vi.fn();
    subscribeToSuggestedQuestions("att-1", onQuestions);

    emitEvent({ attachmentId: "att-1", questions: [QUESTION] });

    expect(onQuestions).toHaveBeenCalledWith([QUESTION]);
  });

  // One socket carries every room the session joined, so an event for another
  // form arrives here too.
  it("ignores an event for another attachment", () => {
    const onQuestions = vi.fn();
    subscribeToSuggestedQuestions("att-1", onQuestions);

    emitEvent({ attachmentId: "att-2", questions: [QUESTION] });

    expect(onQuestions).not.toHaveBeenCalled();
  });

  it("reports nothing usable as nothing", () => {
    const onQuestions = vi.fn();
    subscribeToSuggestedQuestions("att-1", onQuestions);

    emitEvent({ attachmentId: "att-1", questions: [{ question: 1 }] });

    expect(onQuestions).toHaveBeenCalledWith(null);
  });
});

// One request, not a loop: it only asks whether the backend already has the
// questions cached. Everything else is the socket's job.
describe("requestSuggestedQuestions", () => {
  const run = (
    read: (attachmentId: string, signal: AbortSignal) => Promise<unknown>,
    controller = new AbortController(),
  ) => requestSuggestedQuestions(read as never, "att-1", controller.signal);

  it("returns the questions of a cache hit", async () => {
    const read = vi
      .fn()
      .mockResolvedValue({ status: "ready", questions: [QUESTION] });

    await expect(run(read)).resolves.toEqual([QUESTION]);
    expect(read).toHaveBeenCalledTimes(1);
    expect(read).toHaveBeenCalledWith("att-1", expect.any(AbortSignal));
  });

  it("asks once and gives up on pending, leaving it to the socket", async () => {
    const read = vi
      .fn()
      .mockResolvedValue({ status: "pending", questions: [] });

    await expect(run(read)).resolves.toBeNull();
    expect(read).toHaveBeenCalledTimes(1);
  });

  it("returns nothing on unavailable, and on a failed request", async () => {
    await expect(
      run(vi.fn().mockResolvedValue({ status: "unavailable", questions: [] })),
    ).resolves.toBeNull();
    await expect(
      run(vi.fn().mockRejectedValue(new Error("network"))),
    ).resolves.toBeNull();
  });

  it("does not report an answer that arrived after the abort", async () => {
    const controller = new AbortController();
    const read = vi.fn(async () => {
      controller.abort();
      return { status: "ready", questions: [QUESTION] };
    });

    await expect(run(read, controller)).resolves.toBeNull();
  });

  it("treats a ready answer with no usable questions as nothing", async () => {
    const read = vi
      .fn()
      .mockResolvedValue({ status: "ready", questions: [{ question: 1 }] });

    await expect(run(read)).resolves.toBeNull();
  });
});
