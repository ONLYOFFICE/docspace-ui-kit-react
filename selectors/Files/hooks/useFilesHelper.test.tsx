import React, { use } from "react";
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  LoadersContext,
  LoadersContextProvider,
} from "../../utils/contexts/Loaders";
import type { UseFilesHelpersProps } from "../FilesSelector.types";
import useFilesHelper from "./useFilesHelper";

const mocks = vi.hoisted(() => {
  const getFolderByFolderId = vi.fn();
  const getFolderInfo = vi.fn();

  // Stable across renders, as the real provider's clients are.
  return {
    getFolderByFolderId,
    api: {
      foldersApi: { getFolderByFolderId, getFolderInfo },
      apiClient: { request: vi.fn() },
    },
  };
});

vi.mock("../../../providers/api", () => ({ useApi: () => mocks.api }));
vi.mock("../../../providers/api/ApiProvider", () => ({
  useApi: () => mocks.api,
}));
vi.mock("../../../components/toast", () => ({ toastr: { error: vi.fn() } }));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LoadersContextProvider>{children}</LoadersContextProvider>
);

const setup = (props: Partial<UseFilesHelpersProps> = {}) =>
  renderHook(
    () => ({
      loaders: use(LoadersContext),
      files: useFilesHelper({
        setHasNextPage: vi.fn(),
        setTotal: vi.fn(),
        setItems: vi.fn(),
        setBreadCrumbs: vi.fn(),
        setIsRoot: vi.fn(),
        setIsInit: vi.fn(),
        setSelectedItemSecurity: vi.fn(),
        setSelectedTreeNode: vi.fn(),
        setIsSelectedParentFolder: vi.fn(),
        setSelectedItemId: vi.fn(),
        setSelectedItemType: vi.fn(),
        getFilesArchiveError: vi.fn(() => "error"),
        getRootData: vi.fn(async () => {}),
        disabledItems: [],
        isInit: false,
        ...props,
      } as UseFilesHelpersProps),
    }),
    { wrapper },
  );

describe("useFilesHelper", () => {
  beforeEach(() => {
    mocks.getFolderByFolderId.mockReset();
  });

  // The Selector asks for no further page while isNextPageLoading is set.
  it("ends the page load when the third-party fallback fails too", async () => {
    mocks.getFolderByFolderId.mockRejectedValue(new Error("request failed"));

    const { result } = setup({
      selectedItemId: 5,
      isThirdParty: true,
      rootThirdPartyId: "third-party-root",
    });

    await act(async () => {
      await result.current.files.getFileList(0);
    });

    expect(mocks.getFolderByFolderId).toHaveBeenCalledTimes(2);
    expect(result.current.loaders.isNextPageLoading).toBe(false);
  });
});
