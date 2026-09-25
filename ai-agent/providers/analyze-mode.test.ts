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

import { beforeEach, describe, expect, it } from "vitest";

import AiChatStore, {
  endAnalyzeOnChipRemoval,
  watchAnalyzeClose,
} from "./ai-chat-store/AiChatStore";
import {
  analyzeModeCallbacks,
  analyzeSentMiddleware,
} from "./analyze-sent-middleware";
import { composeCallbacks } from "./compose-callbacks";
import { resolveAttachmentCap } from "./files/attachment-limit";

// The pieces of the analyze mode are each covered on their own; what breaks in
// production is the seam between them, where the order of two events decides
// whether the mode survives. These tests replay those orders against the real
// store, the real middleware and the real callbacks merge — no widget, so the
// sequences are written out here exactly as the library performs them.
describe("analyze mode edges", () => {
  let store: AiChatStore;

  beforeEach(() => {
    store = new AiChatStore();
    // The two halves of entering the mode: the attach starts it, and the
    // records coming back put the chip on the draft.
    store.startAnalyzeMode({ entryId: "42", title: "Survey.pdf" });
    store.markAnalyzeAttached("42");
  });

  // What `useMessages` does on send: the middleware chain runs first
  // (synchronously), the composer draft is emptied right after, and only then
  // do the effects watching the draft get to see it.
  const send = () => {
    analyzeSentMiddleware(store).beforeSend?.({} as never);
    const draftIsEmpty = false;
    endAnalyzeOnChipRemoval(store, draftIsEmpty);
  };

  it("survives the send that empties the composer", () => {
    send();

    expect(store.isAnalyzeMode).toBe(true);
    expect(store.isAnalyzePending).toBe(false);
  });

  // The guard is the phase, not the chip — so the very same "draft is empty"
  // signal has to mean two different things depending on what came first.
  // Taking the chip off before the send is the user leaving the mode, and it
  // is also the regression that moving the marker to `onMessageSent` (which
  // fires after the clear) would reintroduce.
  it("ends when the draft empties before the send is marked", () => {
    endAnalyzeOnChipRemoval(store, false);

    expect(store.isAnalyzeMode).toBe(false);
  });

  it("keeps the mode while the chip is still on the draft", () => {
    endAnalyzeOnChipRemoval(store, true);

    expect(store.isAnalyzeMode).toBe(true);
  });

  // Switching to another form empties the draft for it and only then asks the
  // backend for its record. The chip is gone for that whole round trip, and
  // reading it as "the user backed out" is what made the panel title fall
  // back to the plain chat name and back again — a visible flicker on every
  // second "Analyze responses".
  it("holds the mode while the next form is still being attached", () => {
    store.startAnalyzeMode({ entryId: "77", title: "Other.pdf" });

    endAnalyzeOnChipRemoval(store, false);

    expect(store.isAnalyzeMode).toBe(true);
    expect(store.analyzeEntryId).toBe("77");

    // And once its chip lands, removing it exits as usual.
    store.markAnalyzeAttached("77");
    endAnalyzeOnChipRemoval(store, false);

    expect(store.isAnalyzeMode).toBe(false);
  });

  // The records of the form that was replaced mid-flight must not promote the
  // mode that has already moved on.
  it("ignores an attach report from a form it no longer analyzes", () => {
    store.startAnalyzeMode({ entryId: "77", title: "Other.pdf" });

    store.markAnalyzeAttached("42");
    endAnalyzeOnChipRemoval(store, false);

    expect(store.isAnalyzeMode).toBe(true);
  });

  // After the send there is no chip by design, so a later re-render of the
  // same effect must not finish the mode off.
  it("ignores the empty draft on every render after the send", () => {
    send();

    endAnalyzeOnChipRemoval(store, false);
    endAnalyzeOnChipRemoval(store, false);

    expect(store.isAnalyzeMode).toBe(true);
  });

  // The thread the first message creates is ours; a thread the user picked is
  // a different conversation. Only `kind` tells them apart — the id changes in
  // both cases.
  describe("thread updates", () => {
    // Merged the way the provider merges them, so a host handler cannot get
    // in the way of the mode ending.
    const callbacks = () =>
      composeCallbacks({ onThreadsUpdated: () => {} }, analyzeModeCallbacks(store));

    it("stays through the thread its own first message creates", () => {
      send();

      callbacks().onThreadsUpdated?.({ kind: "created" } as never);

      expect(store.isAnalyzeMode).toBe(true);
    });

    it("ends when the user switches to another thread", () => {
      send();

      callbacks().onThreadsUpdated?.({ kind: "switched" } as never);

      expect(store.isAnalyzeMode).toBe(false);
    });
  });

  // The draft outlives the panel, so closing the chat has to take the form
  // off it — but only while the form is still there, and only for a chat
  // that was analyzing one.
  describe("closing the panel", () => {
    const watch = () => {
      const phases: string[] = [];
      const dispose = watchAnalyzeClose(store, (phase) => phases.push(phase));
      return { phases, dispose };
    };

    beforeEach(() => {
      store.open();
    });

    it("drops the form that is still on the draft", () => {
      const { phases, dispose } = watch();

      store.close();

      expect(phases).toEqual(["pending"]);
      dispose();
    });

    it("drops the form whose attach is still in flight", () => {
      store.startAnalyzeMode({ entryId: "77", title: "Other.pdf" });
      const { phases, dispose } = watch();

      store.toggle();

      expect(phases).toEqual(["attaching"]);
      dispose();
    });

    it("leaves the draft alone once the message took the form", () => {
      send();
      const { phases, dispose } = watch();

      store.close();

      expect(phases).toEqual([]);
      dispose();
    });

    it("leaves an ordinary chat's draft alone", () => {
      store.endAnalyzeMode();
      const { phases, dispose } = watch();

      store.close();

      expect(phases).toEqual([]);
      dispose();
    });

    it("does not fire when the mode ends with the panel open", () => {
      const { phases, dispose } = watch();

      store.endAnalyzeMode();

      expect(phases).toEqual([]);
      dispose();
    });
  });

  // The mode outlives the message that empties the composer, so from then on
  // the draft has a free slot that nothing else may take: hiding the "+" menu
  // covers the menu alone, while drag-and-drop and the host's "Ask AI" row
  // action attach straight through this cap.
  describe("the cap it puts on the composer", () => {
    const capOf = (analyzePending: boolean) =>
      resolveAttachmentCap({
        analyzeActive: true,
        analyzePending,
        analyzeFileName: "Survey.pdf",
        sectionLimit: 5,
      });

    it("leaves the one slot the form itself occupies before the send", () => {
      expect(capOf(true)).toEqual({
        limit: 1,
        reason: "analyze",
        fileName: "Survey.pdf",
      });
    });

    it("takes the slot away once the message is sent", () => {
      send();

      expect(capOf(store.isAnalyzePending).limit).toBe(0);
    });

    it("keeps the section and widget caps out of the mode's way", () => {
      expect(
        resolveAttachmentCap({
          analyzeActive: false,
          analyzePending: false,
          sectionLimit: 1,
        }),
      ).toEqual({ limit: 1, reason: "section" });

      expect(
        resolveAttachmentCap({
          analyzeActive: false,
          analyzePending: false,
          sectionLimit: 5,
        }),
      ).toEqual({ limit: 5, reason: "widget" });
    });
  });
});
