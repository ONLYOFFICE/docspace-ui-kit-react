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

"use client";

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, render } from "@testing-library/react";

import { ContextRoomProvider } from "./index";

const clouds = {
  selectContextFolder: vi.fn(),
  clearContextFolder: vi.fn(),
};
const useCloudsStore = { getState: () => clouds };

vi.mock("@onlyoffice/ai-chat", () => ({
  useStores: () => ({ useCloudsStore }),
}));

const hasRoomAiFolder = vi.fn<(roomId: string) => Promise<boolean>>();
const aiApi = { hasRoomAiFolder };

vi.mock("../../../providers/api", () => ({
  useApi: () => ({ aiApi }),
}));

import ContextRoomSync, { CONTEXT_ROOM_CLOUD } from "./ContextRoomSync";

const flush = () => act(async () => {});

const renderSync = (room: { id: string; name: string } | null) =>
  render(
    <ContextRoomProvider room={room}>
      <ContextRoomSync />
    </ContextRoomProvider>,
  );

describe("ContextRoomSync", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("connects the room once its .ai folder is confirmed", async () => {
    hasRoomAiFolder.mockResolvedValue(true);
    renderSync({ id: "12", name: "Sales" });
    await flush();

    expect(hasRoomAiFolder).toHaveBeenCalledWith("12");
    expect(clouds.selectContextFolder).toHaveBeenCalledWith(
      CONTEXT_ROOM_CLOUD,
      { id: "12", name: "Sales" },
    );
    expect(clouds.clearContextFolder).not.toHaveBeenCalled();
  });

  it("drops the connection for a room without a .ai folder", async () => {
    hasRoomAiFolder.mockResolvedValue(false);
    renderSync({ id: "12", name: "Sales" });
    await flush();

    expect(clouds.selectContextFolder).not.toHaveBeenCalled();
    expect(clouds.clearContextFolder).toHaveBeenCalledTimes(1);
  });

  it("treats a failed check as no folder", async () => {
    hasRoomAiFolder.mockRejectedValue(new Error("boom"));
    renderSync({ id: "12", name: "Sales" });
    await flush();

    expect(clouds.selectContextFolder).not.toHaveBeenCalled();
    expect(clouds.clearContextFolder).toHaveBeenCalledTimes(1);
  });

  it("clears without asking when there is no room", async () => {
    renderSync(null);
    await flush();

    expect(hasRoomAiFolder).not.toHaveBeenCalled();
    expect(clouds.clearContextFolder).toHaveBeenCalledTimes(1);
  });

  it("follows the room while the chat stays open", async () => {
    hasRoomAiFolder.mockResolvedValue(true);
    const { rerender } = renderSync({ id: "12", name: "Sales" });
    await flush();

    rerender(
      <ContextRoomProvider room={{ id: "12", name: "Sales" }}>
        <ContextRoomSync />
      </ContextRoomProvider>,
    );
    await flush();
    // Same room, new object: nothing re-runs.
    expect(hasRoomAiFolder).toHaveBeenCalledTimes(1);

    rerender(
      <ContextRoomProvider room={{ id: "13", name: "Legal" }}>
        <ContextRoomSync />
      </ContextRoomProvider>,
    );
    await flush();
    expect(hasRoomAiFolder).toHaveBeenLastCalledWith("13");
    expect(clouds.selectContextFolder).toHaveBeenLastCalledWith(
      CONTEXT_ROOM_CLOUD,
      { id: "13", name: "Legal" },
    );

    rerender(
      <ContextRoomProvider room={null}>
        <ContextRoomSync />
      </ContextRoomProvider>,
    );
    await flush();
    expect(clouds.clearContextFolder).toHaveBeenCalledTimes(1);
  });

  it("ignores a late answer for a room that was left", async () => {
    let resolve: (value: boolean) => void = () => {};
    hasRoomAiFolder.mockReturnValueOnce(
      new Promise<boolean>((r) => {
        resolve = r;
      }),
    );
    const { rerender } = renderSync({ id: "12", name: "Sales" });
    await flush();

    rerender(
      <ContextRoomProvider room={null}>
        <ContextRoomSync />
      </ContextRoomProvider>,
    );
    await flush();
    await act(async () => {
      resolve(true);
    });

    expect(clouds.selectContextFolder).not.toHaveBeenCalled();
  });
});
