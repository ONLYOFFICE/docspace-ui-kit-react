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

// Extensions the portal opens in the media viewer rather than the editor.
const IMAGE_EXTENSIONS = new Set([
  "png",
  "jpg",
  "jpeg",
  "gif",
  "webp",
  "bmp",
  "svg",
  "ico",
  "tif",
  "tiff",
  "heic",
  "avif",
]);

/**
 * Opens a chat attachment in the portal. Wired into the chat library's
 * `platform.file.openFile`, which fires when the user clicks a file chip
 * on a sent message.
 *
 * `path` comes from the AI backend attachment record and has the form
 * `"<fileId>/<title>"` for files attached from the portal (the attach
 * dialog sends the entry id as `path` and the backend prepends it to the
 * stored path). Raw-payload drafts (device uploads) have an empty path and
 * never reach this handler — the library guards on it.
 */
export const openAttachedFile = (path: string, name: string): void => {
  if (typeof window === "undefined") return;

  const [idPart] = path.split(/[\\/]/, 1);
  const fileId = Number(idPart);
  if (!Number.isInteger(fileId) || fileId <= 0) {
    console.warn(
      `[ai-agent] openFile: cannot parse a file id from path "${path}"`,
    );
    return;
  }

  const extension = (name.split(".").pop() ?? "").toLowerCase();
  const url = IMAGE_EXTENSIONS.has(extension)
    ? `${window.location.origin}/media/view/${fileId}`
    : `${window.location.origin}/doceditor?fileId=${fileId}`;

  window.open(url, "_blank");
};
