import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, render } from "@testing-library/react";

type Room = { id: string; name: string };
type Selected = { cloud: string; room: Room };

const clouds = {
  selectedContextFolders: [] as Selected[],
  selectedKnowledgeFolders: [] as Selected[],
  selectContextFolders: vi.fn(),
  selectKnowledgeFolders: vi.fn(),
};
const useCloudsStore = { getState: () => clouds };

vi.mock("@onlyoffice/ai-chat", () => ({
  useStores: () => ({ useCloudsStore }),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: { defaultValue?: string }) =>
      options?.defaultValue ?? key,
  }),
}));

type SelectorProps = Record<string, unknown> & {
  onSubmit: (items: { id: string | number; label?: string }[]) => void;
  selectedItems?: { id: string | number; label?: string }[];
  headerProps?: { headerLabel: string };
};
let selectorProps: SelectorProps | null = null;

vi.mock("../../../selectors/Room", () => ({
  default: (props: SelectorProps) => {
    selectorProps = props;
    return <div data-testid="room-selector" />;
  },
}));

import { RoomsType } from "../../../enums";
import { CONTEXT_ROOM_CLOUD } from "../context-room/ContextRoomSync";
import ContextRoomsDialog from "./context-rooms-dialog";

const selector = () => {
  if (!selectorProps) throw new Error("selector not rendered");
  return selectorProps;
};

describe("ContextRoomsDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    selectorProps = null;
    clouds.selectedContextFolders = [];
    clouds.selectedKnowledgeFolders = [];
  });

  it("picks Instructions rooms, several at once, the connected ones ticked", () => {
    clouds.selectedContextFolders = [
      { cloud: CONTEXT_ROOM_CLOUD, room: { id: "12", name: "Skills" } },
      { cloud: "google", room: { id: "abc", name: "Drive" } },
    ];
    render(<ContextRoomsDialog kind="skills" onClose={vi.fn()} />);
    const props = selector();
    expect(props.roomType).toBe(RoomsType.InstructionsRoom);
    expect(props.isMultiSelect).toBe(true);
    expect(props.forceIsMultiSelect).toBe(true);
    expect(props.sortSelectedFirst).toBe(true);
    expect(props.useAside).toBe(true);
    expect(props.selectedItems).toEqual([{ id: "12", label: "Skills" }]);
    expect(props.headerProps?.headerLabel).toBe("Instructions rooms");
  });

  it("picks Knowledge rooms for the knowledge slot", () => {
    clouds.selectedKnowledgeFolders = [
      { cloud: CONTEXT_ROOM_CLOUD, room: { id: "9", name: "Docs" } },
    ];
    render(<ContextRoomsDialog kind="knowledge" onClose={vi.fn()} />);
    const props = selector();
    expect(props.roomType).toBe(RoomsType.KnowledgeRoom);
    expect(props.selectedItems).toEqual([{ id: "9", label: "Docs" }]);
    expect(props.headerProps?.headerLabel).toBe("Knowledge bases");
  });

  it("replaces the chat's skills rooms with the pick and closes", () => {
    const onClose = vi.fn();
    render(<ContextRoomsDialog kind="skills" onClose={onClose} />);
    act(() => {
      selector().onSubmit([
        { id: 12, label: "Skills" },
        { id: "13", label: undefined },
      ]);
    });
    expect(clouds.selectContextFolders).toHaveBeenCalledWith(
      CONTEXT_ROOM_CLOUD,
      [
        { id: "12", name: "Skills" },
        { id: "13", name: "" },
      ],
    );
    expect(clouds.selectKnowledgeFolders).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("an empty pick disconnects every knowledge base", () => {
    const onClose = vi.fn();
    render(<ContextRoomsDialog kind="knowledge" onClose={onClose} />);
    act(() => selector().onSubmit([]));
    expect(clouds.selectKnowledgeFolders).toHaveBeenCalledWith(
      CONTEXT_ROOM_CLOUD,
      [],
    );
    expect(clouds.selectContextFolders).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("cancelling only closes", () => {
    const onClose = vi.fn();
    render(<ContextRoomsDialog kind="skills" onClose={onClose} />);
    (selector().onCancel as () => void)();
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(clouds.selectContextFolders).not.toHaveBeenCalled();
  });
});
