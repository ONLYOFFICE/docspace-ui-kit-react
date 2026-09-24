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
  EXPORT_FORMAT_IDS,
  EXTENSION_BY_FORMAT,
  extensionOf,
  resolveFormat,
  stripExt,
} from "./export-format";

describe("resolveFormat", () => {
  it("takes the id chosen in the export submenu", () => {
    expect(resolveFormat(EXPORT_FORMAT_IDS.pdf, "chat.docx")).toBe("Pdf");
    expect(resolveFormat(EXPORT_FORMAT_IDS.md, "chat.docx")).toBe("Md");
  });

  it("falls back to the default name's extension for the plain save action", () => {
    // A single message's download button passes no format and always asks
    // for ".docx"; a host that later changes that name must keep working.
    expect(resolveFormat(undefined, "chat.docx")).toBe("Docx");
    expect(resolveFormat(undefined, "chat.PDF")).toBe("Pdf");
  });

  it("falls back to docx for an unknown id or extension", () => {
    expect(resolveFormat("rtf", "chat.docx")).toBe("Docx");
    expect(resolveFormat(undefined, "chat.rtf")).toBe("Docx");
    expect(resolveFormat(undefined, "chat")).toBe("Docx");
  });

  it("covers every declared format id", () => {
    Object.values(EXPORT_FORMAT_IDS).forEach((id) => {
      expect(EXTENSION_BY_FORMAT[resolveFormat(id, "chat")]).toBe(
        EXTENSION_BY_FORMAT[id],
      );
    });
  });
});

describe("stripExt / extensionOf", () => {
  it("drops only the matching extension, case-insensitively", () => {
    expect(stripExt("chat.docx", "docx")).toBe("chat");
    expect(stripExt("chat.DOCX", "docx")).toBe("chat");
    // The exported name keeps dots of its own: only the trailing extension
    // may go, or a thread titled "v1.2 review" loses half its name.
    expect(stripExt("v1.2 review.pdf", "pdf")).toBe("v1.2 review");
    expect(stripExt("chat.pdf", "docx")).toBe("chat.pdf");
    expect(stripExt("chat", "docx")).toBe("chat");
  });

  it("reads the extension a created file arrived with", () => {
    expect(extensionOf("chat (1).PDF")).toBe("pdf");
    expect(extensionOf("chat")).toBe("chat");
  });
});
