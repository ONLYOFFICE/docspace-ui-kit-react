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

// The generated-document flow opens the new file in a NEW TAB only after the
// backend has created it and the tool result has streamed back — long after
// the "Allow" click that started it. Browsers grant `window.open` only inside
// a user gesture (Chrome: about 5 s of transient activation), so a slow
// round-trip means the popup blocker eats the tab and the generation silently
// never runs. The fix is to open the tab synchronously in the click handler
// and navigate it later; this module owns that reservation.

type ReservedWindow = {
  win: Window;
  reservedAt: number;
};

let reserved: ReservedWindow | null = null;

// Reserve a blank tab inside the current user gesture. Call from the click
// handler that approves a generate tool; the reservation is consumed by
// `takeReservedGeneratedFileWindow` or discarded by
// `releaseGeneratedFileWindow`. Re-reserving replaces (and closes) a stale,
// still-blank reservation so at most one spare tab exists.
export const reserveGeneratedFileWindow = (): void => {
  if (typeof window === "undefined") return;
  releaseGeneratedFileWindow();
  const win = window.open("", "_blank");
  if (!win) {
    console.warn(
      "[host-tool-groups] reserveGeneratedFileWindow: window.open blocked inside the gesture",
    );
    return;
  }
  reserved = { win, reservedAt: Date.now() };
  console.log("[host-tool-groups] reserved a tab for the generated file");
};

// Close a reservation that was never used (denied call, failed stream, no
// file id in the result). A no-op when nothing is reserved or the user
// already closed the blank tab.
export const releaseGeneratedFileWindow = (): void => {
  const current = reserved;
  reserved = null;
  if (!current) return;
  if (!current.win.closed) {
    console.log("[host-tool-groups] releasing the unused reserved tab");
    current.win.close();
  }
};

// Hand the reserved tab over to the caller, which becomes responsible for
// navigating it. Returns null when nothing usable is reserved.
export const takeReservedGeneratedFileWindow = (): Window | null => {
  const current = reserved;
  reserved = null;
  if (!current || current.win.closed) return null;
  return current.win;
};

export const hasReservedGeneratedFileWindow = (): boolean =>
  reserved !== null && !reserved.win.closed;

// Test-only reset of the module state.
export const __resetGeneratedFileWindowForTests = (): void => {
  reserved = null;
};
