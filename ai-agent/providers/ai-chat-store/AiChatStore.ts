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

// Single source of truth for the AI Chat panel UI: visibility + fullscreen
// + selected agent + mirrors of the upstream router page and profiles
// presence. Computed getters express every derived UI decision so
// consumers can `observer` the store and stay reactive without any local
// useEffect bridging.
class AiChatStore {
  isVisible = false;

  // User-explicit fullscreen toggle. The *effective* fullscreen value can
  // additionally be forced on by `isOnSettingsPage` or `!aiReady` — those
  // forcings don't mutate this field so the user's preference is preserved
  // when the forcing condition goes away.
  userFullscreen = false;

  currentPage: AiChatRouterPage = "chat";

  agentId: number | null = null;

  // Mirror of upstream profiles count > 0. Bridged from the Zustand
  // `useProfilesStore` by AiChatStoresBridge.
  hasProfiles = false;

  // Set when `openNewChat` opens the panel from a closed state. The thread
  // reset itself needs the lib stores, which only exist inside the provider,
  // so it is performed by AiChatStoresBridge, which consumes this flag. Keeping
  // it here lets the opener (`useOpenAiChat`) depend on this store alone — a
  // section without an AiChatStoreProvider (e.g. a public room opened
  // anonymously) can then call the opener as a no-op instead of throwing on the
  // library's `useStores` (Bug 83210).
  pendingNewChat = false;

  constructor() {
    makeAutoObservable(this);
  }

  // Ready when the user has at least one configured AI profile. Replaces
  // the older `aiConfig.aiReady` check — profiles is the authoritative
  // signal exposed by the upstream chat package.
  get aiReady(): boolean {
    return this.hasProfiles;
  }

  // Both `settings` and `initial-setup` are settings-like flows that
  // must occupy the full panel and disable the user-facing fullscreen
  // toggle.
  get isOnSettingsPage(): boolean {
    return (
      this.currentPage === "settings" || this.currentPage === "initial-setup"
    );
  }

  get isOnHistoryPage(): boolean {
    return this.currentPage === "history";
  }

  // Fullscreen is forced when:
  // - upstream router is on the settings page (no room for the rest of the
  //   docs layout), or
  // - AI is not configured yet (the empty/setup state needs the whole panel
  //   so the CTA isn't cramped into a sidebar).
  // Otherwise the user's toggle wins.
  get effectiveFullscreen(): boolean {
    return this.userFullscreen;
  }

  get isFullscreenToggleDisabled(): boolean {
    return false;
  }

  open = (agentId?: number) => {
    if (agentId !== undefined) this.agentId = agentId;
    this.isVisible = true;
  };

  // Open the panel, starting a fresh conversation when it was closed (an
  // already-open panel keeps its thread — flows that drop something into an
  // open chat must not reset it). The thread reset is deferred to
  // AiChatStoresBridge via `pendingNewChat`, so this needs no lib stores.
  openNewChat = () => {
    if (!this.isVisible) this.pendingNewChat = true;
    this.isVisible = true;
  };

  consumePendingNewChat = () => {
    this.pendingNewChat = false;
  };

  close = () => {
    this.agentId = null;
    this.isVisible = false;
    this.userFullscreen = false;
  };

  toggle = () => {
    this.isVisible = !this.isVisible;
    if (!this.isVisible) this.userFullscreen = false;
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

  setHasProfiles = (value: boolean) => {
    this.hasProfiles = value;
  };
}

export default AiChatStore;
