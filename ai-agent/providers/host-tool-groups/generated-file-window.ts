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

// Standalone copy of `AppLoader` (the full-page "rombs" loader the editor
// shows while it boots) for the reserved tab. It has to be self-contained:
// the tab is `about:blank` with no stylesheet, and it lives only until the
// editor URL replaces it. Colors are the resolved values of
// styles/variables/_colors.scss; the animation is Rombs.module.scss verbatim.
// The real loader's dark block uses a selector that never matches, so the
// rombs keep their light palette in both themes — only the page background
// follows the theme, exactly like the live component.
const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const buildPlaceholderHtml = (isDark: boolean, title: string): string => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<style>
  html, body { margin: 0; height: 100%; overflow: hidden; }
  body { background: ${isDark ? "#333333" : "#ffffff"}; }
  .loader-container {
    position: fixed; inset: 0; display: flex; align-items: center;
    justify-content: center; overflow: hidden;
  }
  .rombs {
    position: fixed; top: 35%; left: calc(50% - 20px);
    width: 40px; height: 40px;
  }
  .romb {
    --rombs-loader-blue: #5dc0e8;
    --rombs-loader-green: #95c038;
    --rombs-loader-red: #ff6f3d;
    --rombs-loader-blue-colorStep_1: #f2cbbf;
    --rombs-loader-blue-colorStep_2: #ffffff;
    --rombs-loader-blue-colorStep_3: #e6e4e4;
    --rombs-loader-blue-colorStep_4: #d2d2d2;
    --rombs-loader-red-colorStep_1: #bfe8f8;
    --rombs-loader-red-colorStep_2: #ffffff;
    --rombs-loader-red-colorStep_3: #efefef;
    --rombs-loader-green-colorStep_1: #cbe0ac;
    --rombs-loader-green-colorStep_2: #ffffff;
    --rombs-loader-green-colorStep_3: #efefef;
    --rombs-loader-green-colorStep_4: #e6e4e4;
    position: absolute; width: 40px; height: 40px;
    transform: rotate(135deg) skew(20deg, 20deg);
    background: rgb(255, 0, 0); border-radius: 6px;
  }
  .romb.blue { background: var(--rombs-loader-blue); z-index: 1; animation: keyFrameBlue 2s ease-in-out 0s infinite; }
  .romb.green { background: var(--rombs-loader-green); z-index: 2; animation: keyFrameGreen 2s ease-in-out 0s infinite; }
  .romb.red { background: var(--rombs-loader-red); z-index: 3; animation: keyFrameRed 2s ease-in-out 0s infinite; }
  @keyframes keyFrameBlue {
    0% { background: var(--rombs-loader-red); top: 120px; }
    10% { background: var(--rombs-loader-blue-colorStep_1); top: 120px; }
    14% { background: var(--rombs-loader-blue-colorStep_2); top: 120px; }
    15% { background: var(--rombs-loader-blue-colorStep_2); top: 0; }
    20% { background: var(--rombs-loader-blue-colorStep_3); }
    30% { background: var(--rombs-loader-blue-colorStep_4); }
    40% { top: 120px; }
    100% { background: var(--rombs-loader-red); top: 120px; }
  }
  @keyframes keyFrameRed {
    0% { background: var(--rombs-loader-blue); top: 100px; opacity: 1; }
    10% { background: var(--rombs-loader-red-colorStep_1); top: 100px; opacity: 1; }
    14% { background: var(--rombs-loader-red-colorStep_2); top: 100px; opacity: 1; }
    15% { background: var(--rombs-loader-red-colorStep_2); top: 0; opacity: 1; }
    20% { background: var(--rombs-loader-red-colorStep_2); top: 0; opacity: 0; }
    45% { background: var(--rombs-loader-red-colorStep_3); top: 0; }
    100% { background: var(--rombs-loader-blue); top: 100px; }
  }
  @keyframes keyFrameGreen {
    0% { background: var(--rombs-loader-green); top: 110px; opacity: 1; }
    10% { background: var(--rombs-loader-green-colorStep_1); top: 110px; opacity: 1; }
    14% { background: var(--rombs-loader-green-colorStep_2); top: 110px; opacity: 1; }
    15% { background: var(--rombs-loader-green-colorStep_2); top: 0; opacity: 1; }
    20% { background: var(--rombs-loader-green-colorStep_2); top: 0; opacity: 0; }
    25% { background: var(--rombs-loader-green-colorStep_3); top: 0; opacity: 1; }
    30% { background: var(--rombs-loader-green-colorStep_4); }
    70% { top: 110px; }
    100% { background: var(--rombs-loader-green); top: 110px; }
  }
</style>
</head>
<body>
<div class="loader-container" data-testid="app-loader">
  <div class="rombs">
    <div class="romb blue"></div>
    <div class="romb green"></div>
    <div class="romb red"></div>
  </div>
</div>
</body>
</html>`;

// Paint the loader into the still-blank reserved tab. Same-origin
// `about:blank` opened by us, so its document is writable; a failure here
// (a browser that refuses, a closed tab) is not worth aborting the
// reservation for — the tab just stays blank until the editor URL lands.
const renderPlaceholder = (win: Window): void => {
  try {
    const isDark =
      document.documentElement.getAttribute("data-theme") === "dark";
    const doc = win.document;
    doc.open();
    doc.write(buildPlaceholderHtml(isDark, document.title));
    doc.close();
  } catch (error) {
    console.warn(
      "[host-tool-groups] reserveGeneratedFileWindow: could not render the placeholder",
      error,
    );
  }
};

// Reserve a tab inside the current user gesture and paint the editor's
// boot loader into it, so the user sees "the document is coming" rather than
// a blank page until the file id arrives. Call from the click handler that
// approves a generate tool; the reservation is consumed by
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
  renderPlaceholder(win);
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
