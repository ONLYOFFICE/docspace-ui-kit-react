import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, render } from "@testing-library/react";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: { defaultValue?: string }) =>
      options?.defaultValue ?? key,
  }),
}));

vi.mock("../../hooks/useGetIcon", () => ({
  default: () => ({ getIcon: () => "" }),
}));

const { operationsApi } = vi.hoisted(() => ({ operationsApi: {} }));
vi.mock("../../../providers/api", () => ({
  useApi: () => ({ operationsApi }),
}));

const { copyFileToFolder, toastr } = vi.hoisted(() => ({
  copyFileToFolder: vi.fn(),
  toastr: { success: vi.fn(), error: vi.fn() },
}));
vi.mock("./copy-file", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./copy-file")>()),
  copyFileToFolder,
}));
vi.mock("../../../components/toast", () => ({ toastr }));

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
    security?: Record<string, boolean>,
  ) => boolean;
};
let selectorProps: SelectorProps | null = null;

vi.mock("../../../selectors/Files", () => ({
  default: (props: SelectorProps) => {
    selectorProps = props;
    return <div data-testid="files-selector" />;
  },
}));

import { CopyNotStartedError } from "./copy-file";
import CopyToRoomDialog from "./copy-to-room-dialog";

const selector = () => {
  if (!selectorProps) throw new Error("selector not rendered");
  return selectorProps;
};

const FILE = { id: 42, title: "Chart.png" };
const flush = () => act(async () => {});

describe("CopyToRoomDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    selectorProps = null;
  });

  it("has a title and a close button of its own, and offers no AI or Forms section", () => {
    const onClose = vi.fn();
    render(<CopyToRoomDialog file={FILE} onClose={onClose} />);
    expect(selector().withHeader).toBe(true);
    expect(selector().headerProps).toEqual({
      headerLabel: "Select folder",
      onCloseClick: onClose,
      isCloseable: true,
    });
    expect(selector().withAIRoomsTreeFolder).toBe(false);
    expect(selector().withFormsTreeFolder).toBe(false);
    expect(selector().formProps).toMatchObject({
      isRoomFormAccessible: false,
    });
  });

  it("lets the user confirm only a place they may add files to", () => {
    render(<CopyToRoomDialog file={FILE} onClose={vi.fn()} />);
    const { getIsDisabled } = selector();
    // A room the user only reads.
    expect(
      getIsDisabled(false, false, "9", "files", false, { Create: false }),
    ).toBe(true);
    // The rooms list itself.
    expect(
      getIsDisabled(false, false, "2", "rooms", false, { Create: true }),
    ).toBe(true);
    expect(getIsDisabled(false, false, "", undefined, true)).toBe(true);
    expect(
      getIsDisabled(false, false, "9", "files", false, { Create: true }),
    ).toBe(false);
  });

  it("copies the file into the place picked and says so once it lands", async () => {
    copyFileToFolder.mockResolvedValue(true);
    const onClose = vi.fn();
    render(<CopyToRoomDialog file={FILE} onClose={onClose} />);
    act(() =>
      selector().onSubmit(9, "Design", false, [
        { id: 2, label: "Rooms" },
        { id: 9, label: "Design" },
      ]),
    );
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(copyFileToFolder).toHaveBeenCalledWith(operationsApi, 42, 9);
    await flush();
    expect(toastr.success).toHaveBeenCalledTimes(1);
    expect(toastr.error).not.toHaveBeenCalled();
  });

  it("says nothing of a copy still running after the wait", async () => {
    copyFileToFolder.mockResolvedValue(false);
    render(<CopyToRoomDialog file={FILE} onClose={vi.fn()} />);
    act(() => selector().onSubmit(9, "Design", false, []));
    await flush();
    expect(toastr.success).not.toHaveBeenCalled();
  });

  it("shows the portal's error", async () => {
    const error = new Error("Access denied");
    copyFileToFolder.mockRejectedValue(error);
    render(<CopyToRoomDialog file={FILE} onClose={vi.fn()} />);
    act(() => selector().onSubmit(9, "Design", false, []));
    await flush();
    expect(toastr.error).toHaveBeenCalledWith(error);
  });

  it("says the copy failed when the portal started none", async () => {
    copyFileToFolder.mockRejectedValue(new CopyNotStartedError());
    render(<CopyToRoomDialog file={FILE} onClose={vi.fn()} />);
    act(() => selector().onSubmit(9, "Design", false, []));
    await flush();
    expect(toastr.success).not.toHaveBeenCalled();
    expect(toastr.error).toHaveBeenCalledWith("Common:UnexpectedError");
  });

  it("copies nothing on the virtual root", () => {
    const onClose = vi.fn();
    render(<CopyToRoomDialog file={FILE} onClose={onClose} />);
    act(() => selector().onSubmit("", "", false, []));
    expect(copyFileToFolder).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
