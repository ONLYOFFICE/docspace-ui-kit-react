"use client";

import React from "react";

import {
  requestSuggestedQuestions,
  subscribeToSuggestedQuestions,
  type ReadSuggestedQuestions,
  type SuggestedQuestion,
  type Unsubscribe,
} from "./suggested-questions";

/**
 * The starter questions of the form the composer is analyzing, waited for
 * while the user reads the intro.
 *
 * `attachmentId` is the id the attach round trip minted for that form — the
 * questions are generated per attachment record, not per host file. It is
 * `undefined` while no form owns the message *and* while one is still being
 * attached, and passing `undefined` is how the caller says "stop": the request
 * in flight is aborted, the socket room is left and any answer is discarded.
 * The same happens when the id changes (another form became the subject) and
 * on unmount.
 *
 * Two ways in, in this order, because the generation is asynchronous and can
 * finish at any point:
 *
 * 1. subscribe to the attachment's room, so an event that fires during the
 *    request below is still caught;
 * 2. ask once — a form analyzed before is a cache hit and answers `ready`
 *    immediately, which is the common case and shows the chips with no wait;
 * 3. otherwise sit on the subscription until the backend emits.
 *
 * One wait per attachment, ever: re-rendering does not open a second
 * subscription or send a second request.
 *
 * `onTyping` is returned rather than watched here: the moment the user writes
 * their own question the suggestions are moot, so the caller wires it to the
 * composer and this stops waiting for them.
 */
export const useAnalyzeQuestions = (
  read: ReadSuggestedQuestions,
  attachmentId: string | undefined,
): {
  questions: SuggestedQuestion[] | null;
  /** Call when the user starts typing: ends the wait for good. */
  onTyping: () => void;
} => {
  const [questions, setQuestions] = React.useState<SuggestedQuestion[] | null>(
    null,
  );

  const controllerRef = React.useRef<AbortController | null>(null);
  const unsubscribeRef = React.useRef<Unsubscribe | null>(null);
  // The attachment this hook is already committed to, so a re-render cannot
  // start a second wait for it.
  const waitedRef = React.useRef<string | null>(null);

  const stopWaiting = React.useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    unsubscribeRef.current?.();
    unsubscribeRef.current = null;
  }, []);

  React.useEffect(() => {
    if (!attachmentId) {
      // No attachment to ask about: the mode ended, or its form is still on
      // its way in. Drop the questions either way, so the next one starts
      // clean.
      stopWaiting();
      waitedRef.current = null;
      setQuestions(null);
      return;
    }

    if (waitedRef.current === attachmentId) return;

    // A different form took over mid-flight — the previous answer must not
    // land on this one.
    stopWaiting();
    waitedRef.current = attachmentId;
    setQuestions(null);

    const controller = new AbortController();
    controllerRef.current = controller;

    // Before the request, not after: the generation may finish while it is in
    // flight, and that event is the only one there will be.
    unsubscribeRef.current = subscribeToSuggestedQuestions(
      attachmentId,
      (arrived) => {
        if (controller.signal.aborted) return;
        // Nothing usable in the event is not an answer — the socket said its
        // piece, so stop holding the room open for it.
        stopWaiting();
        if (arrived) setQuestions(arrived);
      },
    );

    requestSuggestedQuestions(read, attachmentId, controller.signal).then(
      (cached) => {
        if (controller.signal.aborted || !cached) return;
        // Already generated: the socket has nothing left to deliver.
        stopWaiting();
        setQuestions(cached);
      },
    );
  }, [attachmentId, read, stopWaiting]);

  React.useEffect(() => () => stopWaiting(), [stopWaiting]);

  return { questions, onTyping: stopWaiting };
};
