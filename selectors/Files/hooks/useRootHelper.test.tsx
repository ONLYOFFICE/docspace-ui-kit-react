import React from "react";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  FolderType,
  type FolderDtoInteger,
} from "@onlyoffice/docspace-api-sdk";

import { FORMS_SECTION_ID } from "../../utils/constants";
import { LoadersContextProvider } from "../../utils/contexts/Loaders";
import type { UseRootHelperProps } from "../FilesSelector.types";
import useRootHelper from "./useRootHelper";

const mocks = vi.hoisted(() => ({
  api: { foldersApi: { getRootFolders: vi.fn() }, apiClient: {} },
}));

vi.mock("../../../providers/api", () => ({ useApi: () => mocks.api }));
vi.mock("../../../providers/api/ApiProvider", () => ({
  useApi: () => mocks.api,
}));

const treeFolders = [
  { id: 1, parentId: 0, rootFolderType: FolderType.USER, security: {} },
  { id: 2, parentId: 0, rootFolderType: FolderType.VirtualRooms, security: {} },
] as FolderDtoInteger[];

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LoadersContextProvider>{children}</LoadersContextProvider>
);

const getRootIds = async (props: Partial<UseRootHelperProps>) => {
  const setItems = vi.fn();

  const { result } = renderHook(
    () =>
      useRootHelper({
        setBreadCrumbs: vi.fn(),
        setTotal: vi.fn(),
        setItems,
        setHasNextPage: vi.fn(),
        setIsInit: vi.fn(),
        treeFolders,
        withRoomsTreeFolder: true,
        withFormsTreeFolder: true,
        ...props,
      }),
    { wrapper },
  );

  await act(async () => {
    await result.current.getRootData();
  });

  return setItems.mock.calls[0][0].map(
    (item: { id: number | string }) => item.id,
  );
};

describe("useRootHelper", () => {
  it("lists Files, Rooms and Forms by default", async () => {
    expect(await getRootIds({})).toEqual([1, 2, FORMS_SECTION_ID]);
  });

  it("keeps Forms when Rooms is hidden", async () => {
    expect(await getRootIds({ withRoomsTreeFolder: false })).toEqual([
      1,
      FORMS_SECTION_ID,
    ]);
  });

  it("keeps Rooms when Forms is hidden", async () => {
    expect(await getRootIds({ withFormsTreeFolder: false })).toEqual([1, 2]);
  });

  it("lists only Files when both are hidden", async () => {
    expect(
      await getRootIds({
        withRoomsTreeFolder: false,
        withFormsTreeFolder: false,
      }),
    ).toEqual([1]);
  });
});
