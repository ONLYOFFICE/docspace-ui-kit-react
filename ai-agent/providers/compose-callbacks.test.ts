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

import { describe, expect, it, vi } from "vitest";

import { composeCallbacks } from "./compose-callbacks";

// The widget takes one callbacks object and replaces it wholesale, so a
// provider that needs an event of its own must merge rather than pass its own
// down — otherwise every handler the host registered disappears.
describe("composeCallbacks", () => {
  it("calls both handlers of a shared event, ours first", () => {
    const order: string[] = [];
    const host = { onThreadsUpdated: () => order.push("host") };
    const own = { onThreadsUpdated: () => order.push("own") };

    composeCallbacks(host, own).onThreadsUpdated?.({} as never);

    expect(order).toEqual(["own", "host"]);
  });

  it("keeps the events only one side registered", () => {
    const onMessageSent = vi.fn();
    const onThreadsUpdated = vi.fn();

    const merged = composeCallbacks({ onMessageSent }, { onThreadsUpdated });
    merged.onMessageSent?.({} as never);
    merged.onThreadsUpdated?.({} as never);

    expect(onMessageSent).toHaveBeenCalledTimes(1);
    expect(onThreadsUpdated).toHaveBeenCalledTimes(1);
  });

  it("still runs the host handler when ours throws", () => {
    const host = vi.fn();
    const own = () => {
      throw new Error("boom");
    };

    const merged = composeCallbacks(
      { onThreadsUpdated: host },
      { onThreadsUpdated: own },
    );

    expect(() => merged.onThreadsUpdated?.({} as never)).toThrow("boom");
    // These are notifications, not a pipeline: one side failing must not
    // silently disable the other.
    expect(host).toHaveBeenCalledTimes(1);
  });

  it("returns our own set untouched when the host passes none", () => {
    const own = { onThreadsUpdated: vi.fn() };

    expect(composeCallbacks(undefined, own)).toBe(own);
  });
});
