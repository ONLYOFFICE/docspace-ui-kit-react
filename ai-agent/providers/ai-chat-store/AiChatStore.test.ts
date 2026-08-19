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
    expect(store.aiReady).toBe(false);
    expect(store.effectiveFullscreen).toBe(false);

    store.setHasProfiles(true);
    expect(store.aiReady).toBe(true);
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
