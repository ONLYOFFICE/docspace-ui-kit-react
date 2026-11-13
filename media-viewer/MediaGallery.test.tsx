import type { TFunction } from "i18next";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import MediaGallery from "./MediaGallery";
import type { MediaGalleryProps } from "./MediaGallery.types";
import type { MediaViewerProps } from "./MediaViewer.types";

const get = vi.fn();
let baseUrl = "";
let viewerProps: MediaViewerProps | undefined;

vi.mock("../providers/api", () => ({
  useApi: () => ({ apiClient: { instance: { get } }, baseUrl }),
}));

const Viewer = (props: MediaViewerProps) => {
  viewerProps = props;

  const {
    files,
    playlist,
    currentFileId,
    nextMedia,
    prevMedia,
    onDownload,
    onClickDownload,
  } = props;

  return (
    <div data-testid="viewer" data-current={currentFileId}>
      <span data-testid="playlist-length">{playlist.length}</span>
      <button type="button" onClick={nextMedia}>
        next
      </button>
      <button type="button" onClick={prevMedia}>
        prev
      </button>
      <button type="button" onClick={() => onDownload?.(currentFileId)}>
        download
      </button>
      <button
        type="button"
        onClick={() => onClickDownload?.(files[0], vi.fn() as never)}
      >
        download first
      </button>
    </div>
  );
};

vi.mock("./MediaViewer", () => ({
  default: (props: MediaViewerProps) => <Viewer {...props} />,
}));

const file = (id: number, kind: "image" | "media" | "document") => ({
  id,
  title: `File ${id}`,
  fileExst: kind === "document" ? ".docx" : kind === "image" ? ".png" : ".mp4",
  fileStatus: 0,
  canShare: true,
  version: 1,
  viewUrl: `https://portal.test/view/${id}`,
  viewAccessibility: {
    ImageView: kind === "image",
    MediaView: kind === "media",
  },
});

const answer = (
  files: (ReturnType<typeof file> & { encrypted?: boolean })[],
  total = files.length,
) => ({
  data: { response: { files, total } },
});

const t = ((key: string) => key) as unknown as TFunction;

const renderGallery = (props: Partial<MediaGalleryProps> = {}) =>
  render(
    <MediaGallery
      t={t}
      folderId={7}
      getIcon={() => ""}
      extsImagePreviewed={[".png"]}
      {...props}
    />,
  );

const current = () => screen.getByTestId("viewer").getAttribute("data-current");

describe("MediaGallery", () => {
  beforeEach(() => {
    get.mockReset();
    baseUrl = "";
    viewerProps = undefined;
  });

  it("hands the viewer the files as they are on the portal's own origin", async () => {
    baseUrl = window.location.origin;
    get.mockResolvedValueOnce(answer([file(1, "image")]));

    renderGallery();

    await waitFor(() => expect(current()).toBe("1"));
    expect(viewerProps?.playlist[0].encrypted).toBe(false);
  });

  it("reads the files of a portal on another origin through the API client", async () => {
    baseUrl = "https://portal.test";
    get.mockResolvedValueOnce(answer([file(1, "image")]));

    renderGallery();

    await waitFor(() => expect(current()).toBe("1"));
    expect(viewerProps?.playlist[0].encrypted).toBe(true);

    const blob = new Blob(["picture"]);
    const { signal } = new AbortController();
    get.mockResolvedValueOnce({ data: blob });

    const read = await viewerProps?.decryptFile?.({
      src: "https://portal.test/view/1",
      fileId: 1,
      title: "File 1",
      signal,
    });

    expect(read).toEqual({ data: blob });
    expect(get).toHaveBeenLastCalledWith("https://portal.test/view/1", {
      responseType: "blob",
      signal,
    });
  });

  it("leaves a really encrypted file to the consumer's decryptFile", async () => {
    baseUrl = "https://portal.test";
    const decryptFile = vi.fn().mockResolvedValue({ data: "plain" });
    get.mockResolvedValueOnce(
      answer([{ ...file(1, "image"), encrypted: true }]),
    );

    renderGallery({ decryptFile });

    await waitFor(() => expect(current()).toBe("1"));

    const params = {
      src: "https://portal.test/view/1",
      fileId: 1,
      title: "File 1",
      signal: new AbortController().signal,
    };

    await expect(viewerProps?.decryptFile?.(params)).resolves.toEqual({
      data: "plain",
    });
    expect(decryptFile).toHaveBeenCalledWith(params);
    expect(get).toHaveBeenCalledTimes(1);
  });

  it("keeps the alias of the user's own documents readable in the request", async () => {
    get.mockResolvedValueOnce(answer([file(1, "image")]));

    renderGallery({ folderId: "@my" });

    await waitFor(() => expect(current()).toBe("1"));
    expect(get.mock.calls[0][0]).toBe("/api/2.0/files/@my");
  });

  it("shows the loader until the folder answers, then the first media file", async () => {
    get.mockResolvedValueOnce(
      answer([file(1, "document"), file(2, "image"), file(3, "media")]),
    );

    renderGallery();

    expect(screen.getByTestId("viewer-loader")).toBeInTheDocument();

    await waitFor(() => expect(current()).toBe("2"));
    expect(screen.getByTestId("playlist-length")).toHaveTextContent("2");
  });

  it("asks for the files of the folder itself, page by page", async () => {
    get.mockResolvedValueOnce(answer([file(1, "image")], 1));

    renderGallery({ folderId: "sbox-12", pageSize: 25 });

    await waitFor(() => expect(current()).toBe("1"));

    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith("/api/2.0/files/sbox-12", {
      params: {
        startIndex: 0,
        count: 25,
        filterType: 1,
        withsubfolders: false,
      },
      headers: undefined,
    });
  });

  it("sends the key of a public room link", async () => {
    get.mockResolvedValueOnce(answer([file(1, "image")]));

    renderGallery({ requestToken: "room-key" });

    await waitFor(() => expect(current()).toBe("1"));

    expect(get.mock.calls[0][1].headers).toEqual({
      "Request-Token": "room-key",
    });
  });

  it("opens the start file when it is among the loaded ones", async () => {
    get.mockResolvedValueOnce(
      answer([file(1, "image"), file(2, "image"), file(3, "image")]),
    );

    renderGallery({ startFileId: "3" });

    await waitFor(() => expect(current()).toBe("3"));
  });

  it("moves between the files and stops at both ends", async () => {
    get.mockResolvedValueOnce(answer([file(1, "image"), file(2, "image")]));

    renderGallery();

    await waitFor(() => expect(current()).toBe("1"));

    fireEvent.click(screen.getByText("prev"));
    expect(current()).toBe("1");

    fireEvent.click(screen.getByText("next"));
    expect(current()).toBe("2");

    fireEvent.click(screen.getByText("next"));
    expect(current()).toBe("2");
  });

  it("loads the next page near the end of the playlist", async () => {
    get
      .mockResolvedValueOnce(answer([file(1, "image"), file(2, "image")], 3))
      .mockResolvedValueOnce(answer([file(3, "image")], 3));

    renderGallery({ pageSize: 2 });

    await waitFor(() =>
      expect(screen.getByTestId("playlist-length")).toHaveTextContent("3"),
    );

    expect(get).toHaveBeenCalledTimes(2);
    expect(get.mock.calls[1][1].params.startIndex).toBe(2);
  });

  it("keeps loading while the pages hold no media", async () => {
    get
      .mockResolvedValueOnce(answer([file(1, "document")], 2))
      .mockResolvedValueOnce(answer([file(2, "image")], 2));

    renderGallery({ pageSize: 1 });

    await waitFor(() => expect(current()).toBe("2"));
  });

  it("shows the empty content for a folder with no media", async () => {
    get.mockResolvedValueOnce(answer([file(1, "document")]));

    renderGallery({ emptyContent: <p>Nothing to show</p> });

    expect(await screen.findByText("Nothing to show")).toBeInTheDocument();
    expect(screen.queryByTestId("viewer")).toBeNull();
  });

  it("reports a failed first request and renders nothing", async () => {
    const error = new Error("Forbidden");
    const onLoadError = vi.fn();
    get.mockRejectedValueOnce(error);

    const { container } = renderGallery({
      onLoadError,
      emptyContent: <p>Nothing to show</p>,
    });

    await waitFor(() => expect(onLoadError).toHaveBeenCalledWith(error));
    expect(container).toBeEmptyDOMElement();
  });

  it("keeps what is loaded when a later page fails", async () => {
    const onLoadError = vi.fn();
    get
      .mockResolvedValueOnce(answer([file(1, "image")], 2))
      .mockRejectedValueOnce(new Error("Network"));

    renderGallery({ pageSize: 1, onLoadError });

    await waitFor(() => expect(get).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(current()).toBe("1"));
    expect(onLoadError).not.toHaveBeenCalled();
  });

  it("hands the file to onDownload", async () => {
    const onDownload = vi.fn();
    get.mockResolvedValueOnce(answer([file(1, "image"), file(2, "image")]));

    renderGallery({ onDownload, startFileId: 2 });

    await waitFor(() => expect(current()).toBe("2"));

    fireEvent.click(screen.getByText("download"));
    expect(onDownload).toHaveBeenLastCalledWith(
      expect.objectContaining({ id: 2 }),
    );

    fireEvent.click(screen.getByText("download first"));
    expect(onDownload).toHaveBeenLastCalledWith(
      expect.objectContaining({ id: 1 }),
    );
  });

  it("opens the file's view URL when no onDownload is given", async () => {
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    get.mockResolvedValueOnce(answer([file(1, "image")]));

    renderGallery();

    await waitFor(() => expect(current()).toBe("1"));

    fireEvent.click(screen.getByText("download"));
    expect(open).toHaveBeenCalledWith("https://portal.test/view/1", "_self");

    open.mockRestore();
  });

  it("starts over when the folder changes", async () => {
    get
      .mockResolvedValueOnce(answer([file(1, "image")]))
      .mockResolvedValueOnce(answer([file(9, "image")]));

    const { rerender } = renderGallery();

    await waitFor(() => expect(current()).toBe("1"));

    rerender(
      <MediaGallery
        t={t}
        folderId={8}
        getIcon={() => ""}
        extsImagePreviewed={[".png"]}
      />,
    );

    await waitFor(() => expect(current()).toBe("9"));
    expect(get.mock.calls[1][0]).toBe("/api/2.0/files/8");
  });
});
