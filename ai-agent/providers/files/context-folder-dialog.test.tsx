import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, render } from "@testing-library/react";

const clouds = { selectFolderContext: vi.fn() };
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

vi.mock("../../hooks/useGetIcon", () => ({
  default: () => ({ getIcon: () => "" }),
}));

type Crumb = { id?: string | number; label: string };
type SelectorProps = Record<string, unknown> & {
  onSubmit: (
    id: string | number | null | undefined,
    title: string,
    isPublic: boolean,
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
  });

  it("offers folders only, rooms included, without the virtual root", () => {
    render(<ContextFolderDialog onClose={vi.fn()} />);
    const props = selector();
    expect(props.isRoomsOnly).toBe(false);
    expect(props.withAIAgentsTreeFolder).toBe(true);
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
    act(() => selector().onSubmit(5, "Q3 reports", false, []));
    expect(clouds.selectFolderContext).toHaveBeenCalledWith(
      CONTEXT_ROOM_CLOUD,
      { id: "5", name: "Q3 reports" },
    );
    expect(onClose).toHaveBeenCalledTimes(1);
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
      { id: "7", name: "Sales" },
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
