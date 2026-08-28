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

import type { TFunction } from "i18next";

import { toastr } from "../../../components/toast";

/**
 * A pick that produced no chip must not look like the action did nothing.
 * Both reasons are silent by design in the stores — the duplicate filter drops
 * the input before it is reserved, and the cap truncates the reservation — so
 * every attach entry point (picker, "Ask AI", drag-and-drop) reports them here,
 * with one wording for all of them.
 */

/**
 * `count` host files were left out because the composer already holds them.
 *
 * The plural suffix is resolved at the call site rather than by i18next: the
 * locale scanner only finds keys written as literals, which is the same
 * convention the other plural pairs in `Common` follow.
 */
export const notifyAlreadyAttached = (t: TFunction, count: number) => {
  if (count <= 0) return;
  toastr.info(
    count === 1
      ? t("Common:AttachFilesAlreadyAttached_one", {
          count,
          defaultValue: "This file is already attached",
        })
      : t("Common:AttachFilesAlreadyAttached_other", {
          count,
          defaultValue: "{{count}} files are already attached",
        }),
  );
};

/** `count` host files were left out because the composer is full. */
export const notifyAttachmentLimit = (t: TFunction, count: number) => {
  if (count <= 0) return;
  toastr.warning(
    t("Common:ChatAttachmentLimitReached", {
      count,
      defaultValue: "Files skipped — attachment limit reached: {{count}}",
    }),
  );
};
