import React from "react";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  FolderType,
  type FolderDtoInteger,
} from "@onlyoffice/docspace-api-sdk";

import {
  AI_HUB_ROOT_FOLDER_TYPE,
  FORMS_SECTION_ID,
  PRIVATE_SECTION_ID,
} from "../../utils/constants";
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

describe("useRootHelper Private section", () => {
  it("lists Private after Forms when the host turns it on", async () => {
    expect(await getRootIds({ withPrivateTreeFolder: true })).toEqual([
      1,
      2,
      FORMS_SECTION_ID,
      PRIVATE_SECTION_ID,
    ]);
  });

  it("keeps Private when Rooms and Forms are hidden", async () => {
    expect(
      await getRootIds({
        withRoomsTreeFolder: false,
        withFormsTreeFolder: false,
        withPrivateTreeFolder: true,
      }),
    ).toEqual([1, PRIVATE_SECTION_ID]);
  });

  it("leaves Private out of a My documents only picker", async () => {
    expect(
      await getRootIds({ withPrivateTreeFolder: true, isUserOnly: true }),
    ).toEqual([1]);
  });
});

describe("useRootHelper AI sections", () => {
  const withAiRoots = [
    ...treeFolders,
    { id: 3, parentId: 0, rootFolderType: FolderType.AiAgents, security: {} },
    {
      id: 4,
      parentId: 0,
      rootFolderType: AI_HUB_ROOT_FOLDER_TYPE as FolderType,
      security: {},
    },
  ] as FolderDtoInteger[];

  it("lists AI rooms after Forms and never AI agents", async () => {
    expect(
      await getRootIds({
        treeFolders: withAiRoots,
        withAIRoomsTreeFolder: true,
      }),
    ).toEqual([1, 2, FORMS_SECTION_ID, 4]);
  });

  it("titles the AI section as the host's AI Workspace", async () => {
    // The hosts' Common namespace names the section; a key the host dropped
    // would leave the row without a label (the former "AiRooms").
    const setItems = vi.fn();
    const { result } = renderHook(
      () =>
        useRootHelper({
          setBreadCrumbs: vi.fn(),
          setTotal: vi.fn(),
          setItems,
          setHasNextPage: vi.fn(),
          setIsInit: vi.fn(),
          treeFolders: withAiRoots,
          withRoomsTreeFolder: true,
          withFormsTreeFolder: true,
          withAIRoomsTreeFolder: true,
        }),
      { wrapper },
    );
    await act(async () => {
      await result.current.getRootData();
    });
    const labels = setItems.mock.calls[0][0].map(
      (item: { id: number | string; label: string }) => [item.id, item.label],
    );
    expect(labels).toContainEqual([4, "AI Workspace"]);
    expect(labels.every(([, label]: [unknown, string]) => label)).toBe(true);
  });

  it("leaves AI rooms out when the host turns it off", async () => {
    expect(await getRootIds({ treeFolders: withAiRoots })).toEqual([
      1,
      2,
      FORMS_SECTION_ID,
    ]);
  });

  it("leaves AI rooms out of a My documents only picker", async () => {
    expect(
      await getRootIds({
        treeFolders: withAiRoots,
        withAIRoomsTreeFolder: true,
        isUserOnly: true,
      }),
    ).toEqual([1]);
  });
});
