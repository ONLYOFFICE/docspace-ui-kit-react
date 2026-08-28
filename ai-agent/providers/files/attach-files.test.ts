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

import { describe, expect, it } from "vitest";

import {
  selectNewAttachmentIndices,
  type AttachFileInput,
} from "./attach-files";

type Ref = { id: string; title: string; kind: "file" | "image"; path?: string };

const makeStore = (attachmentFiles: Ref[], attachmentImages: Ref[] = []) => ({
  getState: () => ({ attachmentFiles, attachmentImages }),
});

const input = (path: string): AttachFileInput => ({
  path,
  title: `file-${path}.docx`,
  type: 1,
  content: "",
});

// The backend composes the ref path as `${entryId}/${title}` so the history
// chip can render the file name from it — refs never carry the bare entry id.
const ref = (
  id: string,
  entryId: string,
  kind: "file" | "image" = "file",
): Ref => ({
  id,
  title: `file-${entryId}.docx`,
  kind,
  path: `${entryId}/file-${entryId}.docx`,
});

describe("selectNewAttachmentIndices", () => {
  it("keeps everything when the composer is empty", () => {
    const store = makeStore([]);
    const kept = selectNewAttachmentIndices(store, [input("1"), input("2")]);
    expect(kept).toEqual([0, 1]);
  });

  it("drops host files already attached as files", () => {
    const store = makeStore([ref("a", "2")]);
    expect(
      selectNewAttachmentIndices(store, [input("1"), input("2"), input("3")]),
    ).toEqual([0, 2]);
  });

  it("drops host files already attached as images", () => {
    // Images are re-keyed out of `attachmentFiles` once they settle, so the
    // file bucket alone would not see them.
    const store = makeStore([], [ref("a", "7", "image")]);
    const kept = selectNewAttachmentIndices(store, [input("7"), input("8")]);
    expect(kept).toEqual([1]);
  });

  it("collapses repeats inside the batch itself", () => {
    const store = makeStore([]);
    expect(
      selectNewAttachmentIndices(store, [input("1"), input("1"), input("2")]),
    ).toEqual([0, 2]);
  });

  it("ignores refs without a host path", () => {
    const store = makeStore([{ id: "a", title: "typed.txt", kind: "file" }]);
    expect(selectNewAttachmentIndices(store, [input("1")])).toEqual([0]);
  });

  it("matches on the entry id, not on the composed ref path", () => {
    // A bare `path` comparison would miss this and let the duplicate through.
    const store = makeStore([
      { id: "a", title: "report.docx", kind: "file", path: "42/report.docx" },
    ]);
    expect(selectNewAttachmentIndices(store, [input("42")])).toEqual([]);
  });

  it("still matches a ref that carries the bare entry id", () => {
    // `${entryId}/${title}` is what the AI backend composes today, but that
    // shape is not part of any contract we own. A ref that carries the entry
    // id alone must keep deduplicating, so a backend that stops composing
    // the title in does not silently bring the duplicates back.
    const store = makeStore([
      { id: "a", title: "report.docx", kind: "file", path: "42" },
    ]);
    expect(selectNewAttachmentIndices(store, [input("42")])).toEqual([]);
  });
});
