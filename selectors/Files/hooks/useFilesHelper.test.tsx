import React from "react";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { LoadersContextProvider } from "../../utils/contexts/Loaders";
import type { UseFilesHelpersProps } from "../FilesSelector.types";
import useFilesHelper from "./useFilesHelper";

const mocks = vi.hoisted(() => {
  const getFolderByFolderId = vi.fn();
  const getFolderInfo = vi.fn();

  // Kept stable across renders, as the helper memoizes getFileList on it.
  return {
    getFolderByFolderId,
    getFolderInfo,
    api: { foldersApi: { getFolderByFolderId, getFolderInfo }, apiClient: {} },
  };
});

vi.mock("../../../providers/api", () => ({ useApi: () => mocks.api }));
vi.mock("../../../providers/api/ApiProvider", () => ({
  useApi: () => mocks.api,
}));

const ROOM_ID = 50;

const roomListing = {
  folders: [],
  files: [
    {
      id: 7,
      title: "5b802921-dfc8-4007-9619-e604c0be4972.docx",
      fileExst: ".docx",
      encrypted: true,
      viewUrl: "https://portal/file/7",
      security: {},
    },
  ],
  total: 1,
  count: 1,
  pathParts: [
    { id: 2002, title: "Rooms" },
    { id: ROOM_ID, title: "Pirate room", roomType: 5 },
  ],
  current: { id: ROOM_ID, private: true, security: {} },
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LoadersContextProvider>{children}</LoadersContextProvider>
);

const setup = (props: Partial<UseFilesHelpersProps>) =>
  renderHook(
    () =>
      useFilesHelper({
        setBreadCrumbs: vi.fn(),
        setIsSelectedParentFolder: vi.fn(),
        setHasNextPage: vi.fn(),
        setTotal: vi.fn(),
        setItems: vi.fn(),
        selectedItemId: ROOM_ID,
        setIsRoot: vi.fn(),
        setIsInit: vi.fn(),
        disabledItems: [],
        setSelectedItemSecurity: vi.fn(),
        isThirdParty: false,
        setSelectedTreeNode: vi.fn(),
        isRoomsOnly: false,
        getFilesArchiveError: () => "",
        isInit: false,
        withCreate: false,
        setSelectedItemId: vi.fn(),
        setSelectedItemType: vi.fn(),
        setIsInsideKnowledge: vi.fn(),
        setIsInsideResultStorage: vi.fn(),
        setIsInsidePrivateRoom: vi.fn(),
        ...props,
      }),
    { wrapper },
  );

describe("useFilesHelper", () => {
  it("hands the loaded files and their private room to onFilesLoaded", async () => {
    mocks.getFolderByFolderId.mockResolvedValue({
      data: { response: roomListing },
    });
    const onFilesLoaded = vi.fn();

    const { result } = setup({ onFilesLoaded });
    await act(async () => {
      await result.current.getFileList(0);
    });

    expect(onFilesLoaded).toHaveBeenCalledTimes(1);
    expect(onFilesLoaded).toHaveBeenCalledWith(
      [
        {
          id: 7,
          title: "5b802921-dfc8-4007-9619-e604c0be4972.docx",
          fileExst: ".docx",
          encrypted: true,
          viewUrl: "https://portal/file/7",
        },
      ],
      { folderId: ROOM_ID, roomId: ROOM_ID, isInsidePrivateRoom: true },
    );
    expect(mocks.getFolderInfo).not.toHaveBeenCalled();
  });
});
