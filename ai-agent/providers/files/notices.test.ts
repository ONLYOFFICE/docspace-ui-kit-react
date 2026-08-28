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

import { beforeEach, describe, expect, it, vi } from "vitest";

const info = vi.fn();
const warning = vi.fn();
// The factory is hoisted above the declarations above, so reach them lazily.
vi.mock("../../../components/toast", () => ({
  toastr: {
    info: (...args: unknown[]) => info(...args),
    warning: (...args: unknown[]) => warning(...args),
  },
}));

import { notifyAlreadyAttached, notifyAttachmentLimit } from "./notices";

// Stand-in for i18next: echo the key so the assertions can name it, and keep
// the interpolation values for the plural checks.
const t = ((key: string, options?: { count?: number }) =>
  `${key}:${options?.count}`) as unknown as Parameters<
  typeof notifyAlreadyAttached
>[0];

describe("attachment notices", () => {
  beforeEach(() => {
    info.mockClear();
    warning.mockClear();
  });

  // Two call sites hand the count straight through from the attach result,
  // so a zero must stay silent rather than claim a duplicate.
  it("says nothing when nothing was left out", () => {
    notifyAlreadyAttached(t, 0);
    notifyAttachmentLimit(t, 0);
    expect(info).not.toHaveBeenCalled();
    expect(warning).not.toHaveBeenCalled();
  });

  it("ignores a negative count the same way", () => {
    notifyAlreadyAttached(t, -1);
    notifyAttachmentLimit(t, -1);
    expect(info).not.toHaveBeenCalled();
    expect(warning).not.toHaveBeenCalled();
  });

  it("uses the singular key for one duplicate", () => {
    notifyAlreadyAttached(t, 1);
    expect(info).toHaveBeenCalledWith("Common:AttachFilesAlreadyAttached_one:1");
  });

  it("uses the plural key for more than one", () => {
    notifyAlreadyAttached(t, 3);
    expect(info).toHaveBeenCalledWith(
      "Common:AttachFilesAlreadyAttached_other:3",
    );
  });

  it("warns once about the attachment cap", () => {
    notifyAttachmentLimit(t, 2);
    expect(warning).toHaveBeenCalledWith("Common:ChatAttachmentLimitReached:2");
  });
});
