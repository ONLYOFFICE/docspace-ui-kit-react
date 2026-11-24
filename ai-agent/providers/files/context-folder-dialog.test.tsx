import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, render } from "@testing-library/react";

const clouds = {
  selectFolderContext: vi.fn(),
  addFolderContext: vi.fn(),
  selectedFolderContexts: [] as unknown[],
};
const useCloudsStore = { getState: () => clouds };

vi.mock("@onlyoffice/ai-chat", () => ({
  FOLDER_CONTEXTS_LIMIT: 3,
  useStores: () => ({ useCloudsStore }),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: { defaultValue?: string }) =>
      options?.defaultValue ?? key,
  }),
}));

vi.mock("../../hooks/useGetIcon", () => ({
  default: () => ({ getIcon: () => "" }),
}));

type Crumb = { id?: string | number; label: string; roomType?: number };
type SelectorProps = Record<string, unknown> & {
  onSubmit: (
    id: string | number | null | undefined,
    title: string,
    isPublic: boolean,
    breadCrumbs: Crumb[],
  ) => void;
  onFolderToggle: (
    item: {
      id: string | number;
      label: string;
      isSelected?: boolean;
      roomType?: number;
    },
    breadCrumbs: Crumb[],
  ) => void;
  getIsDisabled: (
    isFirstLoad: boolean,
    isSelectedParentFolder: boolean,
    selectedItemId: unknown,
    itemType: unknown,
    isRoot: boolean,
  ) => boolean;
};
let selectorProps: SelectorProps | null = null;

vi.mock("../../../selectors/Files", () => ({
  default: (props: SelectorProps) => {
    selectorProps = props;
    return <div data-testid="files-selector" />;
  },
}));

import { CONTEXT_ROOM_CLOUD } from "../context-room/ContextRoomSync";
import ContextFolderDialog from "./context-folder-dialog";

const selector = () => {
  if (!selectorProps) throw new Error("selector not rendered");
  return selectorProps;
};

describe("ContextFolderDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    selectorProps = null;
    clouds.selectedFolderContexts = [];
  });

  it("offers folders only, rooms included, without the virtual root", () => {
    render(<ContextFolderDialog onClose={vi.fn()} />);
    const props = selector();
    expect(props.isRoomsOnly).toBe(false);
    // The Instructions and Knowledge rooms are the Skill sets and Knowledge
    // bases, picked in lists of their own.
    expect(props.withAIRoomsTreeFolder).toBe(false);
    expect(props.withCreate).toBe(false);
    expect(props.openRoot).toBe(true);
    expect(props.getIsDisabled(true, false, "5", undefined, false)).toBe(true);
    expect(props.getIsDisabled(false, false, "", undefined, true)).toBe(true);
    expect(props.getIsDisabled(false, false, "5", undefined, false)).toBe(
      false,
    );
  });

  it("hands the folder to the chat as the round's context and closes", () => {
    const onClose = vi.fn();
    render(<ContextFolderDialog onClose={onClose} />);
    act(() =>
      selector().onSubmit(5, "Q3 reports", false, [
        { id: "", label: "" },
        { id: 1, label: "My documents" },
        { id: 5, label: "Q3 reports" },
      ]),
    );
    // The path skips the virtual root and ends with the folder itself.
    expect(clouds.selectFolderContext).toHaveBeenCalledWith(
      CONTEXT_ROOM_CLOUD,
      {
        id: "5",
        name: "Q3 reports",
        path: "My documents / Q3 reports",
        kind: "folder",
      },
    );
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("tells the chat that the open folder is a room", () => {
    render(<ContextFolderDialog onClose={vi.fn()} />);
    act(() =>
      selector().onSubmit(9, "Design", false, [
        { id: 2, label: "Rooms" },
        { id: 9, label: "Design", roomType: 6 },
      ]),
    );
    expect(clouds.selectFolderContext).toHaveBeenCalledWith(
      CONTEXT_ROOM_CLOUD,
      { id: "9", name: "Design", path: "Rooms / Design", kind: "room" },
    );
  });

  it("has a title and a close button of its own", () => {
    const onClose = vi.fn();
    const { unmount } = render(<ContextFolderDialog onClose={onClose} />);
    expect(selector().withHeader).toBe(true);
    expect(selector().headerProps).toEqual({
      headerLabel: "Select folder",
      onCloseClick: onClose,
      isCloseable: true,
    });
    unmount();
    render(<ContextFolderDialog mode="add" onClose={onClose} />);
    expect(selector().headerProps).toMatchObject({
      headerLabel: "Select",
      onCloseClick: onClose,
    });
  });

  it("connects the place the user stands in when nothing is ticked in add mode", () => {
    const onClose = vi.fn();
    render(<ContextFolderDialog mode="add" onClose={onClose} />);
    // The root lists the sections; it is no place to connect.
    expect(selector().getIsDisabled(false, false, "", undefined, true)).toBe(
      true,
    );
    // A whole section has no row to tick: it is picked by standing in it.
    expect(selector().getIsDisabled(false, false, "2", undefined, false)).toBe(
      false,
    );
    act(() =>
      selector().onSubmit(2, "Rooms", false, [
        { id: "", label: "" },
        { id: 2, label: "Rooms" },
      ]),
    );
    // Added next to the others, not in their place.
    expect(clouds.addFolderContext.mock.calls).toEqual([
      [
        CONTEXT_ROOM_CLOUD,
        { id: "2", name: "Rooms", path: "Rooms", kind: "folder" },
      ],
    ]);
    expect(clouds.selectFolderContext).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("connects no open place in add mode once the chat is full", () => {
    clouds.selectedFolderContexts = [{}, {}, {}];
    const onClose = vi.fn();
    render(<ContextFolderDialog mode="add" onClose={onClose} />);
    expect(selector().getIsDisabled(false, false, "5", undefined, false)).toBe(
      true,
    );
    act(() =>
      selector().onSubmit(5, "Q3 reports", false, [
        { id: 1, label: "My documents" },
        { id: 5, label: "Q3 reports" },
      ]),
    );
    expect(clouds.addFolderContext).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("ticks folders only in add mode, up to what the chat still takes", () => {
    clouds.selectedFolderContexts = [{}];
    const { unmount } = render(
      <ContextFolderDialog mode="add" onClose={vi.fn()} />,
    );
    expect(selector().isMultiSelect).toBe(true);
    expect(selector().withFolderSelection).toBe(true);
    expect(selector().maxSelectedItems).toBe(2);
    unmount();
    render(<ContextFolderDialog onClose={vi.fn()} />);
    expect(selector().isMultiSelect).toBe(false);
    expect(selector().withFolderSelection).toBe(false);
  });

  it("adds every ticked folder, from wherever each was ticked, instead of the open one", () => {
    const onClose = vi.fn();
    render(<ContextFolderDialog mode="add" onClose={onClose} />);
    const docs = [
      { id: "", label: "" },
      { id: 1, label: "My documents" },
    ];
    act(() => {
      selector().onFolderToggle({ id: 5, label: "Q3" }, docs);
      selector().onFolderToggle({ id: 6, label: "Q4" }, docs);
      selector().onFolderToggle({ id: 9, label: "Sales", roomType: 6 }, [
        { id: 2, label: "Rooms" },
      ]);
      // Cleared again: the selector reports the state before the click.
      selector().onFolderToggle({ id: 6, label: "Q4", isSelected: true }, docs);
    });
    // Ticked folders are a pick on the root too.
    expect(selector().getIsDisabled(false, false, "", undefined, true)).toBe(
      false,
    );
    act(() =>
      selector().onSubmit(2, "Rooms", false, [{ id: 2, label: "Rooms" }]),
    );
    // A ticked room is told from a folder, for its icon and its label.
    expect(clouds.addFolderContext.mock.calls).toEqual([
      [
        CONTEXT_ROOM_CLOUD,
        { id: "5", name: "Q3", path: "My documents / Q3", kind: "folder" },
      ],
      [
        CONTEXT_ROOM_CLOUD,
        { id: "9", name: "Sales", path: "Rooms / Sales", kind: "room" },
      ],
    ]);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("takes no more ticks than the chat has room for", () => {
    clouds.selectedFolderContexts = [{}, {}];
    render(<ContextFolderDialog mode="add" onClose={vi.fn()} />);
    act(() => {
      selector().onFolderToggle({ id: 5, label: "Q3" }, []);
      selector().onFolderToggle({ id: 6, label: "Q4" }, []);
    });
    act(() =>
      selector().onSubmit(1, "Docs", false, [{ id: 1, label: "Docs" }]),
    );
    expect(clouds.addFolderContext).toHaveBeenCalledTimes(1);
  });

  it("names the folder after the last breadcrumb when the selector has no title", () => {
    render(<ContextFolderDialog onClose={vi.fn()} />);
    act(() =>
      selector().onSubmit("7", "", false, [
        { label: "Rooms" },
        { label: "Sales" },
      ]),
    );
    expect(clouds.selectFolderContext).toHaveBeenCalledWith(
      CONTEXT_ROOM_CLOUD,
      { id: "7", name: "Sales", path: "Rooms / Sales", kind: "folder" },
    );
  });

  it("ignores a submit on the virtual root", () => {
    const onClose = vi.fn();
    render(<ContextFolderDialog onClose={onClose} />);
    act(() => {
      selector().onSubmit("", "", false, []);
      selector().onSubmit(undefined, "", false, []);
      selector().onSubmit(null, "", false, []);
    });
    expect(clouds.selectFolderContext).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });
});
