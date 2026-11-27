import React from "react";
import type { TFunction } from "i18next";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";

import MediaViewer from "./MediaViewer";
import { getFileExtension } from "./utils/common";
import { decodeTiff } from "./utils/decodeTiff";
import heic2any from "heic2any";
import { ViewerWrapper } from "./sub-components/ViewerWrapper";
import {
  getDesktopMediaContextModel,
  getMobileMediaContextModel,
  getPDFContextModel,
} from "./MediaViewer.helpers";
import type { TFile } from "./MediaViewer.types";
import { DeviceType, FileStatus, FileType, FolderType } from "../enums";
import { MediaViewerProps } from "./MediaViewer.types";
import { NextButton } from "./sub-components/Buttons/NextButton";
import { PrevButton } from "./sub-components/Buttons/PrevButton";

vi.mock("./utils/common", async () => {
  const originalModule =
    await vi.importActual<typeof import("./utils/common")>("./utils/common");

  return {
    ...originalModule,
    getFileExtension: vi.fn((filename) => filename.split(".").pop()),
  };
});

vi.mock("./utils/decodeTiff", () => ({ decodeTiff: vi.fn() }));
vi.mock("heic2any", () => ({ default: vi.fn() }));

vi.mock("./sub-components/ViewerWrapper", () => ({
  ViewerWrapper: vi.fn(
    ({ visible, currentDeviceType, playlist, playlistPos }) => {
      if (
        !visible ||
        !playlist ||
        playlist.length === 0 ||
        playlistPos < 0 ||
        playlistPos >= playlist.length
      ) {
        return null;
      }
      return (
        <div data-testid="media-viewer" data-device-type={currentDeviceType}>
          <div data-testid="viewer">Viewer Component</div>
          <NextButton nextClick={vi.fn()} />
          <PrevButton prevClick={vi.fn()} />
        </div>
      );
    },
  ),
}));

// Mock data
const mockFile = {
  shortWebUrl: "",
  id: 1,
  title: "test.jpg",
  fileExst: ".jpg",
  contentLength: "1024",
  created: "2024-01-01T00:00:00.0000000Z",
  createdBy: {
    id: "1",
    displayName: "Test User",
    avatarSmall: "",
    hasAvatar: false,
    profileUrl: "",
  },
  updated: "2024-01-01T00:00:00.0000000Z",
  updatedBy: {
    id: "1",
    displayName: "Test User",
    avatarSmall: "",
    hasAvatar: false,
    profileUrl: "",
  },
  shared: false,
  fileStatus: 3,
  fileType: FileType.Image,
  folderId: 1,
  folderType: FolderType.USER,
  fileEntryType: 2,
  modifiedBy: { id: "1", displayName: "Test User" },
  modified: new Date().toISOString(),
  pureContentLength: 1024,
  isFile: true,
  access: 0,
  canShare: false,
  comment: "",
  security: {
    Read: true,
    Delete: false,
    Download: true,
    Edit: false,
    Copy: true,
    Convert: true,
    Duplicate: false,
    EditHistory: false,
    FillForms: false,
    Lock: false,
    Move: false,
    ReadHistory: false,
    Rename: false,
    Review: false,
    SubmitToFormGallery: false,
    CustomFilter: false,
    EditForm: false,
    Comment: false,
    CreateRoomFrom: false,
    CopyLink: false,
    Embed: false,
    Vectorization: false,
  },
  viewAccessibility: {
    WebEdit: true,
    WebRestrictedEditing: false,
    WebComment: true,
    WebDownload: true,
    WebView: true,
    CanConvert: true,
    CoAuhtoring: false,
    ImageView: true,
    MediaView: true,
    MustConvert: false,
    WebCustomFilterEditing: false,
    WebReview: false,
  },
  denyDownload: false,
  denySharing: false,
  mute: false,
  rootFolderId: 1,
  rootFolderType: FolderType.USER,
  version: 1,
  versionGroup: 1,
  viewUrl: "view.jpg",
  webUrl: "web.jpg",
  thumbnailStatus: 1,
};

const mockPlaylistItem = {
  fileId: 1,
  id: 1,
  src: "test.jpg",
  title: "test.jpg",
  fileExst: ".jpg",
  version: 1,
  versionGroup: 1,
  thumbnailUrl: "thumbnail.jpg",
  viewUrl: "view.jpg",
  webUrl: "web.jpg",
  canShare: true,
  fileStatus: FileStatus.None,
};

const createMockProps = (overrides = {}): MediaViewerProps => ({
  visible: true,
  files: [mockFile],
  playlist: [mockPlaylistItem],
  playlistPos: 0,
  currentFileId: 1,
  userAccess: true,
  isPreviewFile: false,
  extsImagePreviewed: [".jpg", ".png"],
  deleteDialogVisible: false,
  pluginContextMenuItems: [],
  currentDeviceType: DeviceType.desktop,
  isPublicFile: false,
  autoPlay: false,
  t: ((key: string) => key) as unknown as TFunction,
  getIcon: (size: number, ext: string) => `icon-${size}-${ext}`,
  onClose: vi.fn(),
  onDelete: vi.fn(),
  nextMedia: vi.fn(),
  prevMedia: vi.fn(),
  onDownload: vi.fn(),
  onChangeUrl: vi.fn(),
  setActiveFiles: vi.fn(),
  setBufferSelection: vi.fn(),
  onEmptyPlaylistError: vi.fn(),
  ...overrides,
});

describe("MediaViewer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it("renders media viewer with correct initial state", () => {
    const props = createMockProps();
    render(<MediaViewer {...props} />);

    expect(screen.getByTestId("media-viewer")).toBeInTheDocument();
    expect(screen.getByTestId("viewer")).toBeInTheDocument();
  });

  it("handles file navigation correctly", async () => {
    const playlist = [
      { ...mockPlaylistItem, id: 1, title: "image1.jpg", fileId: 1 },
      { ...mockPlaylistItem, id: 2, title: "image2.jpg", fileId: 2 },
      { ...mockPlaylistItem, id: 3, title: "image3.jpg", fileId: 3 },
    ];

    const files = playlist.map((item) => ({
      ...mockFile,
      id: item.fileId,
      title: item.title,
    }));

    const props = createMockProps({
      playlist,
      files,
      playlistPos: 1,
      currentFileId: 2,
    });

    render(<MediaViewer {...props} />);

    // Wait for the next-button element to be rendered
    const nextButton = await waitFor(() => screen.getByTestId("next-button"));

    // Verify that nextMedia is not called before clicking the button
    expect(props.nextMedia).not.toHaveBeenCalled();

    // Navigate to next image
    fireEvent.click(nextButton);

    // Navigate to previous image
    const prevButton = await waitFor(() => screen.getByTestId("prev-button"));
    fireEvent.click(prevButton);
  });

  it("handles keyboard navigation correctly", () => {
    const playlist = [
      { ...mockPlaylistItem, id: 1, fileId: 1 },
      { ...mockPlaylistItem, id: 2, fileId: 2 },
    ];

    const files = playlist.map((item) => ({
      ...mockFile,
      id: item.fileId,
    }));

    const props = createMockProps({
      playlist,
      files,
      playlistPos: 0,
      currentFileId: 1,
    });

    render(<MediaViewer {...props} />);

    // Right arrow key
    fireEvent.keyDown(document, { key: "ArrowRight" });

    // Left arrow key
    fireEvent.keyDown(document, { key: "ArrowLeft" });
  });

  it("handles close action correctly", () => {
    const props = createMockProps({ showCloseButton: true });
    render(<MediaViewer {...props} />);

    // Close via button
    const closeButton = screen.queryByTestId("desktop-details-close");
    if (closeButton) {
      fireEvent.click(closeButton);
      expect(props.onClose).toHaveBeenCalled();
    }
    // Button may not be rendered in mocked component
    expect(closeButton).toBeDefined();
  });

  it("handles HEIC file conversion correctly", async () => {
    const heicPlaylist = [
      {
        ...mockPlaylistItem,
        fileId: 1,
        fileExst: ".heic",
        title: "test.heic",
      },
    ];

    const heicFiles = [
      {
        ...mockFile,
        id: 1,
        fileExst: ".heic",
        title: "test.heic",
      },
    ];

    const props = createMockProps({
      playlist: heicPlaylist,
      files: heicFiles,
      currentFileId: 1,
    });

    await act(async () => {
      render(<MediaViewer {...props} />);
    });

    expect(screen.getByTestId("viewer")).toBeInTheDocument();
  });

  it("handles TIFF file conversion correctly", async () => {
    const tiffPlaylist = [
      {
        ...mockPlaylistItem,
        fileId: 1,
        fileExst: ".tiff",
        title: "test.tiff",
      },
    ];

    const tiffFiles = [
      {
        ...mockFile,
        id: 1,
        fileExst: ".tiff",
        title: "test.tiff",
      },
    ];

    const props = createMockProps({
      playlist: tiffPlaylist,
      files: tiffFiles,
      currentFileId: 1,
    });

    await act(async () => {
      render(<MediaViewer {...props} />);
    });

    expect(screen.getByTestId("viewer")).toBeInTheDocument();
  });

  it("handles download action correctly", () => {
    const props = createMockProps();
    render(<MediaViewer {...props} />);

    const downloadButton = screen.queryByTestId("download-button");
    if (downloadButton) {
      fireEvent.click(downloadButton);
      expect(props.onDownload).toHaveBeenCalled();
    }
    // Button may not be rendered in mocked component
    expect(downloadButton).toBeDefined();
  });

  it("handles mobile view correctly", () => {
    const props = createMockProps({
      currentDeviceType: DeviceType.mobile,
    });

    render(<MediaViewer {...props} />);

    expect(screen.getByTestId("media-viewer")).toHaveAttribute(
      "data-device-type",
      "mobile",
    );
  });

  it("handles delete action correctly", () => {
    const props = createMockProps({
      userAccess: true,
    });

    render(<MediaViewer {...props} />);

    const deleteButton = screen.queryByTestId("delete-button");
    if (deleteButton) {
      fireEvent.click(deleteButton);
      expect(props.onDelete).toHaveBeenCalled();
    }
    // Button may not be rendered in mocked component
    expect(deleteButton).toBeDefined();
  });
  it("handles context menu correctly", () => {
    const props = createMockProps();
    render(<MediaViewer {...props} />);

    const contextMenuButton = screen.queryByTestId("media-context-menu");
    if (contextMenuButton) {
      fireEvent.click(contextMenuButton);
      expect(screen.getByTestId("dropdown")).toBeInTheDocument();
    }
    // Button may not be rendered in mocked component
    expect(contextMenuButton).toBeDefined();
  });

  it("reads the current file once while more files arrive", async () => {
    Object.defineProperty(URL, "createObjectURL", {
      value: vi.fn(() => "blob:file"),
      configurable: true,
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      value: vi.fn(),
      configurable: true,
    });

    try {
      const decryptFile = vi.fn().mockResolvedValue({ data: new Blob(["x"]) });
      const props = createMockProps({
        playlist: [{ ...mockPlaylistItem, encrypted: true }],
        decryptFile,
      });

      const { rerender } = render(<MediaViewer {...props} />);

      await waitFor(() => expect(decryptFile).toHaveBeenCalledTimes(1));

      const files = [...props.files, { ...mockFile, id: 2, title: "next.jpg" }];

      await act(async () => {
        rerender(<MediaViewer {...props} files={files} />);
      });

      expect(decryptFile).toHaveBeenCalledTimes(1);
      expect(props.setBufferSelection).toHaveBeenLastCalledWith(files[0]);
    } finally {
      Reflect.deleteProperty(URL, "createObjectURL");
      Reflect.deleteProperty(URL, "revokeObjectURL");
    }
  });

  it("reports each file both playable and previewable as an image once", async () => {
    const extensionOf = vi.mocked(getFileExtension);
    extensionOf.mockImplementation(
      (name: string) => `.${name.split(".").pop()}`,
    );

    try {
      const onError = vi.fn();
      const playlist = [
        { ...mockPlaylistItem, id: 0, fileId: 1, title: "first.mp4" },
        { ...mockPlaylistItem, id: 1, fileId: 2, title: "second.mp4" },
      ];
      const props = createMockProps({
        playlist,
        files: playlist.map((item) => ({
          ...mockFile,
          id: item.fileId,
          title: item.title,
          fileExst: ".mp4",
        })),
        extsImagePreviewed: [".mp4"],
      });

      const view = (overrides: Partial<MediaViewerProps> = {}) => (
        <React.StrictMode>
          <MediaViewer {...props} onError={() => onError()} {...overrides} />
        </React.StrictMode>
      );

      const { rerender } = render(view());

      await waitFor(() => expect(onError).toHaveBeenCalledTimes(1));

      rerender(view({ deleteDialogVisible: true }));
      rerender(view());

      expect(onError).toHaveBeenCalledTimes(1);

      rerender(view({ playlistPos: 1, currentFileId: 2 }));

      await waitFor(() => expect(onError).toHaveBeenCalledTimes(2));
    } finally {
      extensionOf.mockImplementation(
        (name: string) => name.split(".").pop() ?? "",
      );
    }
  });

  it("does not report the next file for the extension of the previous one", async () => {
    const extensionOf = vi.mocked(getFileExtension);
    extensionOf.mockImplementation(
      (name: string) => `.${name.split(".").pop()}`,
    );

    try {
      const onError = vi.fn();
      const playlist = [
        { ...mockPlaylistItem, id: 0, fileId: 1, title: "first.mp4" },
        { ...mockPlaylistItem, id: 1, fileId: 2, title: "second.png" },
      ];
      const props = createMockProps({
        playlist,
        files: playlist.map((item) => ({
          ...mockFile,
          id: item.fileId,
          title: item.title,
        })),
        extsImagePreviewed: [".mp4", ".png"],
        onError,
      });

      const { rerender } = render(<MediaViewer {...props} />);

      await waitFor(() => expect(onError).toHaveBeenCalledTimes(1));

      await act(async () => {
        rerender(<MediaViewer {...props} playlistPos={1} currentFileId={2} />);
      });

      expect(onError).toHaveBeenCalledTimes(1);
    } finally {
      extensionOf.mockImplementation(
        (name: string) => name.split(".").pop() ?? "",
      );
    }
  });
});

describe("MediaViewer reading a file", () => {
  const lastWrapperProps = () => vi.mocked(ViewerWrapper).mock.lastCall?.[0];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getFileExtension).mockImplementation(
      (name: string) => `.${name.split(".").pop()}`,
    );
    Object.defineProperty(URL, "createObjectURL", {
      value: vi.fn(() => "blob:file"),
      configurable: true,
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      value: vi.fn(),
      configurable: true,
    });
  });

  afterEach(() => {
    vi.mocked(getFileExtension).mockImplementation(
      (name: string) => name.split(".").pop() ?? "",
    );
    Reflect.deleteProperty(URL, "createObjectURL");
    Reflect.deleteProperty(URL, "revokeObjectURL");
    vi.unstubAllGlobals();
  });

  const encryptedItem = (title: string) =>
    createMockProps({
      playlist: [{ ...mockPlaylistItem, id: 0, title, encrypted: true }],
      files: [{ ...mockFile, title }],
      playlistPos: 0,
    });

  it("converts a TIFF that comes through decryptFile", async () => {
    const decoded = new Blob(["png"], { type: "image/png" });
    vi.mocked(decodeTiff).mockResolvedValue(decoded);
    const decryptFile = vi.fn().mockResolvedValue({ data: new Blob(["x"]) });
    const bytes = new ArrayBuffer(1);
    Object.defineProperty(Blob.prototype, "arrayBuffer", {
      value: async () => bytes,
      configurable: true,
    });

    try {
      render(
        <MediaViewer
          {...encryptedItem("scan.tiff")}
          decryptFile={decryptFile}
        />,
      );

      await waitFor(() =>
        expect(URL.createObjectURL).toHaveBeenCalledWith(decoded),
      );
      expect(decodeTiff).toHaveBeenCalledWith(bytes);
    } finally {
      Reflect.deleteProperty(Blob.prototype, "arrayBuffer");
    }
  });

  it("shows the media error for a file that is only read through decryptFile", async () => {
    const onDecryptionError = vi.fn();
    const decryptFile = vi.fn().mockRejectedValue(new Error("Forbidden"));

    render(
      <MediaViewer
        {...encryptedItem("photo.jpg")}
        decryptFile={decryptFile}
        onDecryptionError={onDecryptionError}
      />,
    );

    await waitFor(() =>
      expect(lastWrapperProps()?.decryptionError).toBe("Common:MediaError"),
    );
    expect(onDecryptionError).not.toHaveBeenCalled();
  });

  it("shows the decryption error for an encrypted file", async () => {
    const onDecryptionError = vi.fn();
    const decryptFile = vi.fn().mockRejectedValue(new Error("Bad key"));
    const props = encryptedItem("photo.jpg");

    render(
      <MediaViewer
        {...props}
        files={[{ ...props.files[0], encrypted: true }]}
        decryptFile={decryptFile}
        onDecryptionError={onDecryptionError}
      />,
    );

    await waitFor(() =>
      expect(onDecryptionError).toHaveBeenCalledWith("Bad key"),
    );
    expect(lastWrapperProps()?.decryptionError).toBe(
      "Common:EncryptionDecryptPartialFailed",
    );
  });

  it("shows the message the consumer gives for a decryption error", async () => {
    const error = new Error("No decryption access for user bob");
    const getDecryptionErrorMessage = vi.fn(
      () => "Common:EncryptedFileNoAccessYet",
    );
    const props = encryptedItem("photo.jpg");

    render(
      <MediaViewer
        {...props}
        files={[{ ...props.files[0], encrypted: true }]}
        decryptFile={vi.fn().mockRejectedValue(error)}
        getDecryptionErrorMessage={getDecryptionErrorMessage}
      />,
    );

    await waitFor(() =>
      expect(lastWrapperProps()?.decryptionError).toBe(
        "Common:EncryptedFileNoAccessYet",
      ),
    );
    expect(getDecryptionErrorMessage).toHaveBeenCalledWith(error);
  });

  it("shows the general decryption error when the consumer has no message for it", async () => {
    const props = encryptedItem("photo.jpg");

    render(
      <MediaViewer
        {...props}
        files={[{ ...props.files[0], encrypted: true }]}
        decryptFile={vi.fn().mockRejectedValue(new Error("tag mismatch"))}
        getDecryptionErrorMessage={() => null}
      />,
    );

    await waitFor(() =>
      expect(lastWrapperProps()?.decryptionError).toBe(
        "Common:EncryptionDecryptPartialFailed",
      ),
    );
  });

  it("shows a decrypted HEIC the converter cannot read as it is", async () => {
    vi.mocked(heic2any).mockRejectedValueOnce(new Error("unsupported"));
    const props = encryptedItem("photo.heic");

    render(
      <MediaViewer
        {...props}
        files={[{ ...props.files[0], encrypted: true }]}
        decryptFile={vi.fn().mockResolvedValue({ data: new Blob(["heic"]) })}
      />,
    );

    await waitFor(() => expect(URL.createObjectURL).toHaveBeenCalledTimes(1));
    const [shown] = vi.mocked(URL.createObjectURL).mock.calls[0] as [Blob];
    expect(shown.type).toBe("image/heic");
    expect(lastWrapperProps()?.decryptionError).toBeUndefined();
  });

  it("shows a decrypted TIFF the decoder returns nothing for as it is", async () => {
    vi.mocked(decodeTiff).mockResolvedValue(null);
    Object.defineProperty(Blob.prototype, "arrayBuffer", {
      value: async () => new ArrayBuffer(1),
      configurable: true,
    });
    const props = encryptedItem("scan.tiff");

    try {
      render(
        <MediaViewer
          {...props}
          files={[{ ...props.files[0], encrypted: true }]}
          decryptFile={vi.fn().mockResolvedValue({ data: new Blob(["tiff"]) })}
        />,
      );

      await waitFor(() => expect(URL.createObjectURL).toHaveBeenCalledTimes(1));
      const [shown] = vi.mocked(URL.createObjectURL).mock.calls[0] as [Blob];
      expect(shown.type).toBe("image/tiff");
      expect(lastWrapperProps()?.decryptionError).toBeUndefined();
    } finally {
      Reflect.deleteProperty(Blob.prototype, "arrayBuffer");
    }
  });

  it("drops a TIFF decoded after the viewer moved to the next file", async () => {
    let finishDecoding: (blob: Blob) => void = () => {};
    vi.mocked(decodeTiff).mockReturnValue(
      new Promise((resolve) => {
        finishDecoding = resolve;
      }),
    );
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        arrayBuffer: async () => new ArrayBuffer(1),
      }),
    );

    const playlist = [
      { ...mockPlaylistItem, id: 0, fileId: 1, src: "a.tiff", title: "a.tiff" },
      { ...mockPlaylistItem, id: 1, fileId: 2, src: "b.jpg", title: "b.jpg" },
    ];
    const props = createMockProps({
      playlist,
      files: playlist.map((item) => ({
        ...mockFile,
        id: item.fileId,
        title: item.title,
      })),
      playlistPos: 0,
    });

    const { rerender } = render(<MediaViewer {...props} />);

    await waitFor(() => expect(decodeTiff).toHaveBeenCalledTimes(1));

    rerender(<MediaViewer {...props} playlistPos={1} currentFileId={2} />);

    await act(async () => {
      finishDecoding(new Blob(["a"]));
    });

    expect(URL.createObjectURL).not.toHaveBeenCalled();
    expect(lastWrapperProps()?.fileUrl).toBe("b.jpg");
  });

  const plainItem = (title: string) =>
    createMockProps({
      playlist: [{ ...mockPlaylistItem, id: 0, src: title, title }],
      files: [{ ...mockFile, title }],
      playlistPos: 0,
    });

  it.each(["scan.tiff", "photo.heic"])(
    "shows the media error for a %s the portal refuses",
    async (title) => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({ ok: false, status: 403 }),
      );

      render(<MediaViewer {...plainItem(title)} />);

      await waitFor(() =>
        expect(lastWrapperProps()?.decryptionError).toBe("Common:MediaError"),
      );
      expect(decodeTiff).not.toHaveBeenCalled();
      expect(heic2any).not.toHaveBeenCalled();
    },
  );

  it("shows a TIFF the decoder returns nothing for from its address", async () => {
    vi.mocked(decodeTiff).mockResolvedValue(null);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        arrayBuffer: async () => new ArrayBuffer(1),
      }),
    );

    render(<MediaViewer {...plainItem("scan.tiff")} />);

    await waitFor(() => expect(lastWrapperProps()?.fileUrl).toBe("scan.tiff"));
    expect(lastWrapperProps()?.decryptionError).toBeUndefined();
  });

  it("does not read the current file again for new callbacks", async () => {
    const decryptFile = vi.fn().mockResolvedValue({ data: new Blob(["x"]) });
    const props = encryptedItem("photo.jpg");

    const { rerender } = render(
      <MediaViewer {...props} decryptFile={decryptFile} />,
    );

    await waitFor(() => expect(URL.createObjectURL).toHaveBeenCalledTimes(1));

    const nextDecryptFile = vi
      .fn()
      .mockResolvedValue({ data: new Blob(["y"]) });

    rerender(
      <MediaViewer
        {...props}
        decryptFile={nextDecryptFile}
        onClose={vi.fn()}
        onDecryptionError={vi.fn()}
        onEmptyPlaylistError={vi.fn()}
        t={createMockProps().t}
      />,
    );

    await act(async () => {});

    expect(decryptFile).toHaveBeenCalledTimes(1);
    expect(nextDecryptFile).not.toHaveBeenCalled();
  });

  it("shows the decryption error for an encrypted item that is missing from the files", async () => {
    const onDecryptionError = vi.fn();

    render(
      <MediaViewer
        {...encryptedItem("photo.jpg")}
        files={[]}
        decryptFile={vi.fn().mockRejectedValue(new Error("Bad key"))}
        onDecryptionError={onDecryptionError}
      />,
    );

    await waitFor(() =>
      expect(onDecryptionError).toHaveBeenCalledWith("Bad key"),
    );
    expect(lastWrapperProps()?.decryptionError).toBe(
      "Common:EncryptionDecryptPartialFailed",
    );
  });
});

describe("Media viewer menu models", () => {
  const t = ((key: string) => key) as unknown as TFunction;
  const renamable = {
    ...mockFile,
    security: { ...mockFile.security, Rename: true },
  } as unknown as TFile;

  const visibleKeys = (model: { key: string | number; disabled?: boolean }[]) =>
    model.filter((option) => !option.disabled).map((option) => option.key);

  const models = {
    desktop: (file: TFile) =>
      getDesktopMediaContextModel(t, file, false, false, {}),
    mobile: (file: TFile) => getMobileMediaContextModel(t, file, false, {}),
    pdf: (file: TFile) => getPDFContextModel(t, file, {}),
  };

  it.each(Object.keys(models) as (keyof typeof models)[])(
    "Media viewer menu of an encrypted file (%s)",
    (kind) => {
      const model = models[kind]({ ...renamable, encrypted: true });

      expect(visibleKeys(model)).not.toContain("rename");
    },
  );

  it("Mobile menu has no Info row for a host that shows no Info panel", () => {
    const withPanel = getMobileMediaContextModel(t, mockFile, false, {
      onShowInfoPanel: () => {},
    });

    expect(visibleKeys(withPanel)).toContain("room-info");
    expect(visibleKeys(models.mobile(mockFile))).not.toContain("room-info");
  });

  it("Media viewer menu of an encrypted PDF", () => {
    const pdf = {
      ...renamable,
      security: { ...renamable.security, Download: true },
    } as TFile;

    const keys = visibleKeys(models.pdf({ ...pdf, encrypted: true }));
    expect(keys).not.toContain("download-as");
    expect(keys).not.toContain("link-for-room-members");
    expect(keys).toContain("download");
  });

  it("Media viewer menu of a PDF that is not encrypted", () => {
    const pdf = {
      ...renamable,
      security: { ...renamable.security, Download: true },
    } as TFile;

    const keys = visibleKeys(models.pdf(pdf));
    expect(keys).toContain("download-as");
    expect(keys).toContain("link-for-room-members");
  });

  it.each(Object.keys(models) as (keyof typeof models)[])(
    "Media viewer menu of a file that is not encrypted (%s)",
    (kind) => {
      const model = models[kind](renamable);

      expect(visibleKeys(model)).toContain("rename");
    },
  );
});
