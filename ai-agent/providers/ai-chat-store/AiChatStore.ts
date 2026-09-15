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

import { makeAutoObservable } from "mobx";

export type AiChatRouterPage =
  "chat" | "settings" | "history" | "initial-setup";

/**
 * The "Analyze responses" mode: the chat is about one PDF form's collected
 * answers until an explicit edge ends it.
 *
 * `phase` exists because "the composer holds no form" means three different
 * things, and only the order of events tells them apart:
 *
 * - `attaching` — the mode is entered, the draft has been emptied for the
 *   form and its record has not come back yet. An empty draft here is this
 *   attach in flight.
 * - `pending` — the form is on the draft. An empty draft now is the user
 *   taking its chip off, which exits the mode.
 * - `active` — the first message took the form off the draft. An empty draft
 *   is how the mode looks from here on, and the mode stands on its own.
 */
export type AnalyzeMode = {
  /** DocSpace file id of the form. */
  entryId: string;
  /** File name, shown in the banner and the chips header. */
  title: string;
  phase: "attaching" | "pending" | "active";
};

// Docked (non-fullscreen) panel width on desktop. Matches the CSS default of
// `--chat-panel-width` in Section.module.scss: the panel renders at this width
// until the user drags the resizer, and every open starts from it again.
export const DEFAULT_CHAT_PANEL_WIDTH = 400;

// Single source of truth for the AI Chat panel UI: visibility + fullscreen
// + selected agent + mirrors of the upstream router page and profiles
// presence. Computed getters express every derived UI decision so
// consumers can `observer` the store and stay reactive without any local
// useEffect bridging.
class AiChatStore {
  isVisible = false;

  // User-explicit fullscreen toggle. It is the only input to the effective
  // fullscreen value: no view forces the panel open any more, so the user's
  // preference holds across pages.
  userFullscreen = false;

  currentPage: AiChatRouterPage = "chat";

  // Width of the docked panel in px, driven by the edge resizer. Session-only
  // by design: it is deliberately not persisted and every open resets it to
  // `DEFAULT_CHAT_PANEL_WIDTH`, so a fresh panel always has the familiar size.
  // Ignored in fullscreen and on tablet/mobile, where the panel is not
  // resizable and its width comes from the layout instead.
  panelWidth = DEFAULT_CHAT_PANEL_WIDTH;

  agentId: number | null = null;

  // Mirror of upstream profiles count > 0 — the authoritative "AI is
  // configured" signal exposed by the upstream chat package. Bridged from the
  // Zustand `useProfilesStore` by AiChatStoresBridge; read by the panel header
  // to decide where the close button goes.
  hasProfiles = false;

  // Set when `openNewChat` opens the panel from a closed state. The thread
  // reset itself needs the lib stores, which only exist inside the provider,
  // so it is performed by AiChatStoresBridge, which consumes this flag. Keeping
  // it here lets the opener (`useOpenAiChat`) depend on this store alone — a
  // section without an AiChatStoreProvider (e.g. a public room opened
  // anonymously) can then call the opener as a no-op instead of throwing on the
  // library's `useStores` (Bug 83210).
  pendingNewChat = false;

  /**
   * The chat is analyzing one PDF form's responses ("Analyze responses"), or
   * `null` for an ordinary chat.
   *
   * A mode rather than a one-off action: it survives sending a message, which
   * is what the chip on the composer draft cannot do (the widget empties the
   * draft on send). While it is set the composer takes no other file, the
   * panel says so in its title, and the chips are that form's own questions.
   */
  analyzeMode: AnalyzeMode | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get isAnalyzeMode(): boolean {
    return this.analyzeMode !== null;
  }

  /** DocSpace file id of the analyzed form — the questions endpoint's key. */
  get analyzeEntryId(): string | undefined {
    return this.analyzeMode?.entryId;
  }

  /** File name of the analyzed form, for the banner and the chips header. */
  get analyzeFormTitle(): string {
    return this.analyzeMode?.title ?? "";
  }

  /**
   * The form still owns a slot on the draft — it is on it, or on its way
   * there. Until the first message goes out, that slot is the one thing the
   * composer accepts (see `resolveAttachmentCap`).
   */
  get isAnalyzePending(): boolean {
    return this.isAnalyzeMode && this.analyzeMode?.phase !== "active";
  }

  /**
   * The form's chip is on the draft, so an empty draft means the user took it
   * off — the one reading of "no form on the composer" that exits the mode.
   * False while the attach is still in flight, when the draft is empty
   * because this very mode emptied it.
   */
  get isAnalyzeOnDraft(): boolean {
    return this.analyzeMode?.phase === "pending";
  }

  // Both `settings` and `initial-setup` are settings-like flows; the close
  // button routes out of them instead of shutting the panel (see
  // AiChatPanelHeaderContainer).
  get isOnSettingsPage(): boolean {
    return (
      this.currentPage === "settings" || this.currentPage === "initial-setup"
    );
  }

  get isOnHistoryPage(): boolean {
    return this.currentPage === "history";
  }

  // The user's toggle always wins: settings flows fit the narrow panel and
  // the not-configured state now renders a compact empty view, so neither
  // needs to force fullscreen on.
  get effectiveFullscreen(): boolean {
    return this.userFullscreen;
  }

  open = (agentId?: number) => {
    // Opening the panel for a different agent is a different conversation,
    // and the form the old one was analyzing does not belong to it. Opening
    // it for the same agent (or for none) keeps the mode, because this is the
    // entry point that deliberately leaves an ongoing chat alone — unlike
    // `openNewChat`, which ends the mode whatever it was.
    if (agentId !== undefined && agentId !== this.agentId) {
      this.endAnalyzeMode();
    }
    if (agentId !== undefined) this.agentId = agentId;
    if (!this.isVisible) this.panelWidth = DEFAULT_CHAT_PANEL_WIDTH;
    this.isVisible = true;
  };

  // Open the panel, starting a fresh conversation when it was closed (an
  // already-open panel keeps its thread — flows that drop something into an
  // open chat must not reset it). The thread reset is deferred to
  // AiChatStoresBridge via `pendingNewChat`, so this needs no lib stores.
  openNewChat = () => {
    if (!this.isVisible) {
      this.pendingNewChat = true;
      this.panelWidth = DEFAULT_CHAT_PANEL_WIDTH;
      // A fresh conversation is not the one that was analyzing a form.
      //
      // Only here, inside the branch that actually starts one. An already
      // open chat keeps its thread (that is the whole point of this entry
      // point), and the analyze mode is part of that thread's state: ending
      // it for a panel that is merely being raised would take the mode away
      // on every "Ask AI" and every repeat of "Analyze responses", since both
      // come through here before they attach anything. The new-thread paths
      // that must end it still do, through `onThreadsUpdated` — the reset
      // this flag triggers arrives as a "switched" thread event.
      this.endAnalyzeMode();
    }
    this.isVisible = true;
  };

  consumePendingNewChat = () => {
    this.pendingNewChat = false;
  };

  close = () => {
    this.agentId = null;
    this.isVisible = false;
    this.userFullscreen = false;
    this.panelWidth = DEFAULT_CHAT_PANEL_WIDTH;
    // Closing the panel is one of the explicit ways out of the analyze mode.
    this.endAnalyzeMode();
  };

  toggle = () => {
    this.isVisible = !this.isVisible;
    if (!this.isVisible) {
      this.userFullscreen = false;
      this.endAnalyzeMode();
    }
    // Both directions reset: closing clears the drag, opening starts fresh.
    this.panelWidth = DEFAULT_CHAT_PANEL_WIDTH;
  };

  setAgentId = (agentId: number | null) => {
    this.agentId = agentId;
  };

  setFullscreen = (value: boolean) => {
    this.userFullscreen = value;
  };

  toggleFullscreen = () => {
    this.userFullscreen = !this.userFullscreen;
  };

  setCurrentPage = (page: AiChatRouterPage) => {
    this.currentPage = page;
  };

  setPanelWidth = (value: number) => {
    this.panelWidth = value;
  };

  setHasProfiles = (value: boolean) => {
    this.hasProfiles = value;
  };

  /**
   * Enter the mode for `form`.
   *
   * Replacing the subject of a mode that is already on is refused before it
   * reaches this store (`useAttachHostFilesToChat`): an analyzing chat keeps
   * the form it was opened on for its whole life, and a second "Analyze
   * responses" is answered with a toast instead. Handing a different form to
   * a live mode is therefore not something any caller does today — it still
   * replaces the subject rather than stacking a second mode, because half a
   * mode is worse than a wrong one.
   *
   * Called when the attach starts, so the mode begins in `attaching`: the
   * draft is emptied for the form before its record comes back, and that gap
   * must not read as the user removing the chip. Re-entering the mode for the
   * form it is already on leaves the phase alone, so a repeated click cannot
   * push a sent mode back to the start.
   */
  startAnalyzeMode = (form: { entryId: string; title: string }) => {
    // Without an entry id the questions endpoint has nothing to ask about and
    // the banner nothing to name, so there is no mode to enter.
    if (!form.entryId) return;
    if (this.analyzeMode?.entryId === form.entryId) {
      this.analyzeMode.title = form.title;
      return;
    }
    this.analyzeMode = { ...form, phase: "attaching" };
  };

  /**
   * The form's chip is on the draft now — the attach reported its record.
   * From here an empty draft is the user backing out (see
   * {@link endAnalyzeOnChipRemoval}).
   */
  markAnalyzeAttached = (entryId: string) => {
    if (this.analyzeMode?.entryId !== entryId) return;
    if (this.analyzeMode.phase === "attaching") {
      this.analyzeMode.phase = "pending";
    }
  };

  /**
   * The first message of the mode is on its way. Called from the send
   * middleware rather than from `onMessageSent`, because the draft is emptied
   * before that event fires and the empty draft must not read as "the user
   * removed the form".
   */
  markAnalyzeSent = () => {
    if (this.analyzeMode) this.analyzeMode.phase = "active";
  };

  endAnalyzeMode = () => {
    this.analyzeMode = null;
  };
}

/**
 * Backing out of the analyze mode by taking the form's chip off the draft.
 *
 * Between the chip landing and the first message, removing it is how a user
 * leaves the mode. The other two times the draft is empty are not that
 * gesture, and the phase is what tells them apart: the attach clears the
 * draft before the form's record arrives (`attaching`), and the send clears
 * it on the way out (`active`, flipped by the send middleware synchronously,
 * ahead of the clear).
 *
 * Lives here, beside the store, rather than inside the effect that calls it
 * (`AiChatStoresBridge`): that module pulls in the whole widget, and the order
 * this depends on — send marker, then clear, then this — is exactly what a
 * test needs to be able to replay (see `analyze-mode.test.ts`).
 */
export const endAnalyzeOnChipRemoval = (
  store: AiChatStore,
  hasAnalyzeChip: boolean,
) => {
  if (!hasAnalyzeChip && store.isAnalyzeOnDraft) store.endAnalyzeMode();
};

export default AiChatStore;
