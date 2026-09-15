/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { describe, it, expect, beforeEach } from "vitest";

import AiChatStore from "./AiChatStore";

describe("AiChatStore fullscreen", () => {
  let store: AiChatStore;

  beforeEach(() => {
    store = new AiChatStore();
  });

  it("mirrors the user toggle and nothing else", () => {
    expect(store.effectiveFullscreen).toBe(false);

    store.toggleFullscreen();
    expect(store.effectiveFullscreen).toBe(true);

    store.setFullscreen(false);
    expect(store.effectiveFullscreen).toBe(false);
  });

  // Both settings-like flows used to force the panel open; they no longer do,
  // so the user's preference has to survive a trip through them.
  it.each(["settings", "initial-setup"] as const)(
    "does not force fullscreen on the %s page",
    (page) => {
      store.setCurrentPage(page);

      expect(store.isOnSettingsPage).toBe(true);
      expect(store.effectiveFullscreen).toBe(false);

      store.setFullscreen(true);
      expect(store.effectiveFullscreen).toBe(true);
    },
  );

  it("does not force fullscreen while AI is unconfigured", () => {
    expect(store.hasProfiles).toBe(false);
    expect(store.effectiveFullscreen).toBe(false);

    store.setHasProfiles(true);
    expect(store.effectiveFullscreen).toBe(false);
  });

  it("drops the fullscreen preference when the panel closes", () => {
    store.openNewChat();
    store.setFullscreen(true);

    store.close();
    expect(store.effectiveFullscreen).toBe(false);
    expect(store.isVisible).toBe(false);
  });
});

// "Analyze responses" is a state of the chat, not a one-off action: it has to
// outlive the message that takes the form off the composer, and end only on
// the edges below.
describe("AiChatStore analyze mode", () => {
  let store: AiChatStore;

  beforeEach(() => {
    store = new AiChatStore();
  });

  const form = { entryId: "42", title: "Survey.pdf" };

  it("starts with the form, and reports it for the banner and the poll", () => {
    expect(store.isAnalyzeMode).toBe(false);

    store.startAnalyzeMode(form);

    expect(store.isAnalyzeMode).toBe(true);
    expect(store.analyzeEntryId).toBe("42");
    expect(store.analyzeFormTitle).toBe("Survey.pdf");
    // The form is still on the draft until the first message goes out.
    expect(store.isAnalyzePending).toBe(true);
  });

  it("moves to another form instead of stacking a second mode", () => {
    store.startAnalyzeMode(form);
    store.markAnalyzeSent();

    store.startAnalyzeMode({ entryId: "77", title: "Other.pdf" });

    expect(store.analyzeEntryId).toBe("77");
    // A fresh subject starts over: its own form is on the draft again.
    expect(store.isAnalyzePending).toBe(true);
  });

  it("refuses to start without an entry id", () => {
    // Nothing to ask the questions endpoint about, nothing to name.
    store.startAnalyzeMode({ entryId: "", title: "Survey.pdf" });

    expect(store.isAnalyzeMode).toBe(false);
  });

  it("survives the send that empties the composer", () => {
    store.startAnalyzeMode(form);

    store.markAnalyzeSent();

    expect(store.isAnalyzeMode).toBe(true);
    // No longer pending: an empty draft now means "already sent", not
    // "the user removed the form".
    expect(store.isAnalyzePending).toBe(false);
  });

  it("ends when the panel closes", () => {
    store.open();
    store.startAnalyzeMode(form);

    store.close();

    expect(store.isAnalyzeMode).toBe(false);
  });

  it("ends when the panel is toggled shut, but not when toggled open", () => {
    store.startAnalyzeMode(form);
    store.toggle();
    expect(store.isVisible).toBe(true);
    expect(store.isAnalyzeMode).toBe(true);

    store.toggle();

    expect(store.isVisible).toBe(false);
    expect(store.isAnalyzeMode).toBe(false);
  });

  // `open` is the entry point that leaves an ongoing conversation alone, so
  // it only ends the mode when it switches to another agent — whose chat the
  // analyzed form has nothing to do with.
  it("ends when the panel is opened for a different agent", () => {
    store.open(1);
    store.startAnalyzeMode(form);

    store.open(2);

    expect(store.isAnalyzeMode).toBe(false);
  });

  it("keeps the mode when opened for the same agent, or for none", () => {
    store.open(1);
    store.startAnalyzeMode(form);

    store.open(1);
    store.open();

    expect(store.isAnalyzeMode).toBe(true);
  });

  it("ends when a new chat is opened", () => {
    store.startAnalyzeMode(form);

    store.openNewChat();

    expect(store.isAnalyzeMode).toBe(false);
  });

  it("is idempotent to end, and reports nothing when off", () => {
    store.endAnalyzeMode();
    store.endAnalyzeMode();

    expect(store.isAnalyzeMode).toBe(false);
    expect(store.analyzeEntryId).toBeUndefined();
    expect(store.analyzeFormTitle).toBe("");
    expect(store.isAnalyzePending).toBe(false);
  });

  it("ignores the sent marker when no mode is on", () => {
    store.markAnalyzeSent();

    expect(store.isAnalyzeMode).toBe(false);
  });
});
