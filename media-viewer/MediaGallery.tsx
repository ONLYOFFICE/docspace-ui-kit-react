import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FilterType } from "@onlyoffice/docspace-api-sdk";

import { useApi } from "../providers/api";

import MediaViewer from "./MediaViewer";
import { ViewerLoader } from "./sub-components/ViewerLoader";
import { getPlaylist } from "./utils/getPlaylist";
import type { MediaGalleryProps } from "./MediaGallery.types";
import type {
  DecryptFileParams,
  NumberOrString,
  TFile,
} from "./MediaViewer.types";

const DEFAULT_PAGE_SIZE = 100;

// The next page is asked for this many items before the end of the playlist.
const PRELOAD_OFFSET = 3;

type FolderContent = {
  response: {
    files: TFile[];
    total: number;
  };
};

const Gallery = ({
  folderId,
  requestToken,
  startFileId,
  pageSize = DEFAULT_PAGE_SIZE,
  emptyContent = null,
  onDownload,
  onLoadError,
  decryptFile,
  resolveTitle,
  ...viewerProps
}: MediaGalleryProps) => {
  const { apiClient, baseUrl } = useApi();

  const [files, setFiles] = useState<TFile[]>([]);
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [isFailed, setIsFailed] = useState(false);
  const [mediaId, setMediaId] = useState<NumberOrString | undefined>(
    startFileId,
  );

  const isLoadingRef = useRef(false);
  const isMountedRef = useRef(false);
  const onLoadErrorRef = useRef(onLoadError);
  onLoadErrorRef.current = onLoadError;

  const filesRef = useRef(files);
  filesRef.current = files;

  // On the portal's own origin the browser sends the session with every
  // `<img>` and `<video>` request. An application on another origin signs in
  // with a key, which a media element cannot carry, so the portal answers its
  // files with 403: those are read through the API client instead and shown
  // from memory. The whole file is downloaded before it plays.
  const needsApiClient = useMemo(() => {
    if (typeof window === "undefined" || !baseUrl) return () => false;

    const portalOrigin = new URL(baseUrl, window.location.href).origin;

    if (portalOrigin === window.location.origin) return () => false;

    return (src: string) =>
      URL.canParse(src) && new URL(src).origin === portalOrigin;
  }, [baseUrl]);

  // The viewer already has one way to take a file's bytes from its consumer:
  // the hook for encrypted files. A file read through the API client goes the
  // same way, marked `encrypted` in the playlist only.
  const playlist = useMemo(
    () =>
      getPlaylist(files).map((item) =>
        needsApiClient(item.src) ? { ...item, encrypted: true } : item,
      ),
    [files, needsApiClient],
  );

  const isEncrypted = (fileId: number) =>
    filesRef.current.find((file) => file.id === fileId)?.encrypted === true;

  const readFile = useCallback(
    async (params: DecryptFileParams) => {
      if (isEncrypted(params.fileId)) {
        if (!decryptFile) throw new Error("File decryption is not available");

        return decryptFile(params);
      }

      const { data } = await apiClient.instance.get<Blob>(params.src, {
        responseType: "blob",
        signal: params.signal,
      });

      return { data };
    },
    [apiClient, decryptFile],
  );

  const resolveItemTitle = useMemo(() => {
    if (!resolveTitle) return undefined;

    return (item: { id: number; title: string }) =>
      resolveTitle({ ...item, encrypted: isEncrypted(item.id) });
  }, [resolveTitle]);

  const currentItem =
    playlist.find((item) => String(item.fileId) === String(mediaId)) ??
    playlist[0];
  const playlistPos = currentItem?.id ?? 0;

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // The folder is read page by page: the first one on mount, the next one
  // when the viewer gets close to the end of what is loaded. A folder whose
  // first pages hold no media keeps loading until one turns up.
  useEffect(() => {
    if (!canLoadMore || isLoadingRef.current) return;
    if (playlistPos < playlist.length - PRELOAD_OFFSET) return;

    const loaded = files.length;

    isLoadingRef.current = true;

    apiClient.instance
      .get<FolderContent>(
        // "@my" is the portal's alias for the user's own documents.
        `/api/2.0/files/${encodeURIComponent(String(folderId)).replace(/^%40/, "@")}`,
        {
          params: {
            startIndex: loaded,
            count: pageSize,
            filterType: FilterType.FilesOnly,
          },
          headers: requestToken ? { "Request-Token": requestToken } : undefined,
        },
      )
      .then(({ data }) => {
        if (!isMountedRef.current) return;

        const page = data.response.files;

        setFiles((prev) => [...prev, ...page]);
        setCanLoadMore(
          page.length > 0 && loaded + page.length < data.response.total,
        );
      })
      .catch((error: unknown) => {
        if (!isMountedRef.current) return;

        setCanLoadMore(false);

        if (loaded === 0) {
          setIsFailed(true);
          onLoadErrorRef.current?.(error);
        }
      })
      .finally(() => {
        isLoadingRef.current = false;
      });
  }, [
    apiClient,
    canLoadMore,
    files.length,
    folderId,
    pageSize,
    playlist.length,
    playlistPos,
    requestToken,
  ]);

  const nextMedia = useCallback(() => {
    const nextItem = playlist[playlistPos + 1];

    if (nextItem) setMediaId(nextItem.fileId);
  }, [playlist, playlistPos]);

  const prevMedia = useCallback(() => {
    const prevItem = playlist[playlistPos - 1];

    if (prevItem) setMediaId(prevItem.fileId);
  }, [playlist, playlistPos]);

  const onClickDownload = useCallback(
    (file: TFile) => {
      if (onDownload) {
        onDownload(file);
        return;
      }

      window.open(file.viewUrl, "_self");
    },
    [onDownload],
  );

  const onDownloadById = useCallback(
    (id: NumberOrString) => {
      const file = files.find((item) => item.id === id);

      if (file) onClickDownload(file);
    },
    [files, onClickDownload],
  );

  if (isFailed) return null;

  if (!currentItem) {
    if (canLoadMore) return <ViewerLoader isLoading />;

    return emptyContent;
  }

  return (
    <MediaViewer
      {...viewerProps}
      decryptFile={readFile}
      resolveTitle={resolveItemTitle}
      visible
      isPublicFile
      files={files}
      playlist={playlist}
      playlistPos={playlistPos}
      currentFileId={currentItem.fileId}
      nextMedia={nextMedia}
      prevMedia={prevMedia}
      onDownload={onDownloadById}
      onClickDownload={onClickDownload}
    />
  );
};

/**
 * The media files of one portal folder or room in the viewer, with previous /
 * next navigation. Reads the folder itself through the nearest `ApiProvider`,
 * page by page, and starts over when the folder or the link key changes.
 */
const MediaGallery = (props: MediaGalleryProps) => (
  <Gallery key={`${props.folderId}:${props.requestToken ?? ""}`} {...props} />
);

export default MediaGallery;
