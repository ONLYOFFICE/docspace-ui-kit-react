// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

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
