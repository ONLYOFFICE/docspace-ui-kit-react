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

import { afterEach, describe, expect, it, vi } from "vitest";

import {
  SUGGESTED_QUESTIONS_RETRY_DELAY_MS,
  pollSuggestedQuestions,
  readSuggestedQuestions,
} from "./suggested-questions";

const QUESTION = {
  question: "How many people picked each payment method?",
  prompt: "Count the responses per value of the payment method field.",
};

describe("readSuggestedQuestions", () => {
  it("reads the field off a record that carries it", () => {
    expect(
      readSuggestedQuestions({ id: "a", suggestedQuestions: [QUESTION] }),
    ).toEqual([QUESTION]);
  });

  it("returns undefined when the record has no such field", () => {
    expect(readSuggestedQuestions({ id: "a" })).toBeUndefined();
    expect(readSuggestedQuestions(null)).toBeUndefined();
    expect(readSuggestedQuestions("nope")).toBeUndefined();
  });

  it("drops malformed entries instead of the whole array", () => {
    expect(
      readSuggestedQuestions({
        suggestedQuestions: [QUESTION, { question: "no prompt" }, 42, null],
      }),
    ).toEqual([QUESTION]);
  });
});

// The endpoint is a long poll of its own (the server holds each call for up
// to 25s), so this loop only decides whether to ask again.
describe("pollSuggestedQuestions", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  const run = (
    poll: (entryId: string, signal: AbortSignal) => Promise<unknown>,
    controller = new AbortController(),
  ) => pollSuggestedQuestions(poll as never, "42", controller.signal);

  it("keeps asking while the server says pending, a breather apart", async () => {
    vi.useFakeTimers();
    const poll = vi
      .fn()
      .mockResolvedValueOnce({ status: "pending", questions: [] })
      .mockResolvedValueOnce({ status: "pending", questions: [] })
      .mockResolvedValue({ status: "ready", questions: [QUESTION] });

    const polled = run(poll);

    // The first answer lands at once; the second only after the pause.
    await vi.advanceTimersByTimeAsync(0);
    expect(poll).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(SUGGESTED_QUESTIONS_RETRY_DELAY_MS - 1);
    expect(poll).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(SUGGESTED_QUESTIONS_RETRY_DELAY_MS * 2);
    await expect(polled).resolves.toEqual([QUESTION]);
    expect(poll).toHaveBeenCalledTimes(3);
    expect(poll).toHaveBeenLastCalledWith("42", expect.any(AbortSignal));
  });

  // Aborting must not have to sit through the pause: the user removed the
  // form or started typing, and the answer is no longer wanted.
  it("gives up mid-breather when aborted", async () => {
    vi.useFakeTimers();
    const controller = new AbortController();
    const poll = vi.fn().mockResolvedValue({ status: "pending", questions: [] });

    const polled = run(poll, controller);
    await vi.advanceTimersByTimeAsync(0);
    expect(poll).toHaveBeenCalledTimes(1);

    controller.abort();
    await expect(polled).resolves.toBeNull();
    expect(poll).toHaveBeenCalledTimes(1);
  });

  it("stops on unavailable — there will never be questions", async () => {
    const poll = vi
      .fn()
      .mockResolvedValue({ status: "unavailable", questions: [] });

    await expect(run(poll)).resolves.toBeNull();
    expect(poll).toHaveBeenCalledTimes(1);
  });

  it("stops when the request fails", async () => {
    const poll = vi.fn().mockRejectedValue(new Error("network"));

    await expect(run(poll)).resolves.toBeNull();
    expect(poll).toHaveBeenCalledTimes(1);
  });

  it("stops once aborted, and does not report what arrived after", async () => {
    const controller = new AbortController();
    const poll = vi.fn(async () => {
      controller.abort();
      return { status: "ready", questions: [QUESTION] };
    });

    await expect(run(poll, controller)).resolves.toBeNull();
    expect(poll).toHaveBeenCalledTimes(1);
  });

  it("does not ask at all when already aborted", async () => {
    const controller = new AbortController();
    controller.abort();
    const poll = vi.fn();

    await expect(run(poll, controller)).resolves.toBeNull();
    expect(poll).not.toHaveBeenCalled();
  });

  it("treats a ready answer with no usable questions as nothing", async () => {
    const poll = vi
      .fn()
      .mockResolvedValue({ status: "ready", questions: [{ question: 1 }] });

    await expect(run(poll)).resolves.toBeNull();
  });
});
