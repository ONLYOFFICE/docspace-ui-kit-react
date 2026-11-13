import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
  type JSX,
} from "react";

import { isMobile as isMobileUtils, isTablet } from "../utils/device";
import { getFileExtension } from "./utils/common";
import { checkDialogsOpen } from "./utils/checkDialogsOpen";
import { decodeTiff } from "./utils/decodeTiff";
import { isNullOrUndefined } from "./utils/typeGuards";

import { ViewerWrapper } from "./sub-components/ViewerWrapper";

import { PdfViewerScriptContext } from "./MediaViewer.context";
import { mapSupplied, mediaTypes } from "./MediaViewer.constants";
import type { MediaViewerProps } from "./MediaViewer.types";
import { KeyboardEventKeys } from "./MediaViewer.enums";
import { isHeic, isTiff } from "./MediaViewer.utils";

import {
  getDesktopMediaContextModel,
  getMobileMediaContextModel,
  getPDFContextModel,
} from "./MediaViewer.helpers";

import "./MediaViewer.theme.scss";

const MediaViewer = (props: MediaViewerProps): JSX.Element | undefined => {
  const {
    files,
    visible,
    playlist,
    userAccess,
    playlistPos,
    currentFileId,
    isPreviewFile,
    extsImagePreviewed,
    deleteDialogVisible,
    pluginContextMenuItems,
    pluginViewerContent,
    pluginFileId,
    pluginTitle,
    currentDeviceType,
    isPublicFile = false,
    autoPlay = false,
    currentRoomId,
    decryptFile,
    resolveTitle,
    getPdfViewerScriptUrl,
    onDecryptionError,

    t,
    getIcon,
    onClose,
    onDelete,
    nextMedia,
    prevMedia,
    onDownload,
    onChangeUrl,
    setActiveFiles,
    setBufferSelection,
    onEmptyPlaylistError,

    ...other
  } = props;

  const TiffAbortSignalRef = useRef<AbortController>(undefined);
  const HeicAbortSignalRef = useRef<AbortController>(undefined);
  const EncryptedAbortSignalRef = useRef<AbortController>(undefined);

  const isWillUnmountRef = useRef(false);
  const lastRemovedFileIdRefRef = useRef<number>(undefined);

  const [title, setTitle] = useState<string>("");
  const prevBlobUrlRef = useRef<string | null>(null);

  const setFileUrl_ = useCallback((url: string | undefined) => {
    // Revoke previous blob URL to prevent memory leaks
    if (prevBlobUrlRef.current && prevBlobUrlRef.current.startsWith("blob:")) {
      URL.revokeObjectURL(prevBlobUrlRef.current);
    }
    prevBlobUrlRef.current = url && url.startsWith("blob:") ? url : null;
    setFileUrlRaw(url);
  }, []);

  const [fileUrlRaw, setFileUrlRaw] = useState<string | undefined>(() => {
    if (!currentFileId || !playlist.length) return undefined;
    const item = playlist.find(
      (file) => file.fileId?.toString() === currentFileId?.toString(),
    );
    if (item?.encrypted) return undefined;
    return item?.src;
  });
  const fileUrl = fileUrlRaw;
  const setFileUrl = setFileUrl_;

  const [isDecrypting, setIsDecrypting] = useState(false);
  // A file that cannot be decrypted has no URL to hand to the player, so the
  // viewer would sit on a loader forever with the reason only in the console.
  const [decryptionError, setDecryptionError] = useState<string | undefined>(
    undefined,
  );

  const [targetFile, setTargetFile] = useState(() => {
    if (!currentFileId) return undefined;
    return files.find((item) => item.id === currentFileId);
  });

  const ext = useMemo(() => getFileExtension(title), [title]);
  const audioIcon = useMemo(() => getIcon(96, ext), [ext, getIcon]);
  const headerIcon = useMemo(() => getIcon(32, ext), [ext, getIcon]);

  let isVideo = false;
  let isAudio = false;
  let canOpen = true;
  let isImage = false;
  let isPdf = false;

  const archiveRoom =
    other.archiveRoomsId === targetFile?.rootFolderId ||
    (!targetFile?.security?.Rename && !targetFile?.security?.Delete);

  const getContextModel = (isError?: boolean) => {
    const {
      onClickDownloadAs,
      onClickLinkEdit,
      onClickDownload,
      onPreviewClick,
      onClickRename,
      onClickDelete,
      onShowInfoPanel,
      onMoveAction,
      onCopyAction,
      onDuplicate,
      onCopyLink,
    } = other;

    const isMobile = isMobileUtils() || isTablet();

    if (!targetFile) return [];

    const desktopModel = getDesktopMediaContextModel(
      t,
      targetFile,
      archiveRoom,
      isPublicFile,
      {
        onClickDownload,
        onClickRename,
        onClickDelete,
      },
    );

    const model = getMobileMediaContextModel(t, targetFile, isPublicFile, {
      onShowInfoPanel,
      onClickDownload,
      onMoveAction,
      onCopyAction,
      onDuplicate,
      onClickRename,
      onClickDelete,
    });

    if (isPdf)
      return getPDFContextModel(t, targetFile, {
        onClickDownloadAs,
        onMoveAction,
        onCopyAction,
        onClickRename,
        onDuplicate,
        onClickDelete,
        onClickDownload,
        onClickLinkEdit,
        onPreviewClick,
        onCopyLink,
      });

    if (pluginContextMenuItems && pluginContextMenuItems.length > 0) {
      model.unshift({
        key: "separator-plugin",
        isSeparator: true,
        disabled: false,
      });

      pluginContextMenuItems.forEach((item) => {
        const onClick = async (): Promise<void> => {
          onClose?.();

          if (item.withActiveItem) setActiveFiles?.([targetFile.id]);

          await item.onClick(targetFile.id);

          if (item.withActiveItem) setActiveFiles?.([]);
        };

        model.unshift({
          id: item.key,
          disabled: false,
          ...item,
          onClick,
        });

        desktopModel.unshift({
          disabled: false,
          ...item,
          onClick: () => {
            onClick();
          },
        });
      });
    }

    return isMobile
      ? model
      : isImage && !isMobile && !isError
        ? desktopModel.filter((el) => el.key !== "download")
        : desktopModel;
  };

  const canImageView = useCallback(
    (extension: string) => extsImagePreviewed.indexOf(extension) !== -1,
    [extsImagePreviewed],
  );

  const canPlay = useCallback(
    (fileTitle: string) => {
      const extensionension =
        fileTitle[0] === "." ? fileTitle : getFileExtension(fileTitle);

      const supply = mapSupplied[extensionension];

      return !!supply && extsImagePreviewed.indexOf(extensionension) !== -1;
    },
    [extsImagePreviewed],
  );

  const onDeleteMediaMedia = useCallback(() => {
    const tempCurrentFileId = playlist.find(
      (file) => file.id === playlistPos,
    )?.fileId;

    if (tempCurrentFileId === lastRemovedFileIdRefRef.current) return;

    const canDelete = targetFile?.security?.Delete;

    if (!canDelete) return;

    if (!isNullOrUndefined(tempCurrentFileId)) {
      onDelete?.(tempCurrentFileId);
      lastRemovedFileIdRefRef.current = tempCurrentFileId;
    }
  }, [onDelete, playlist, playlistPos, targetFile?.security?.Delete]);

  const onDownloadMedia = useCallback(() => {
    if (!targetFile?.security?.Download) return;

    const tempCurrentFileId = playlist.find(
      (file) => file.id === playlistPos,
    )?.fileId;

    if (!isNullOrUndefined(tempCurrentFileId)) onDownload?.(tempCurrentFileId);
  }, [onDownload, playlist, playlistPos, targetFile?.security?.Download]);

  const onKeydown = useCallback(
    (event: KeyboardEvent) => {
      const { code, ctrlKey } = event;

      const someDialogIsOpen = checkDialogsOpen();
      if (deleteDialogVisible || someDialogIsOpen) return;

      if (code in KeyboardEventKeys) {
        const includesKeyboardCode = [
          KeyboardEventKeys.KeyS,
          KeyboardEventKeys.Numpad1,
          KeyboardEventKeys.Digit1,
          KeyboardEventKeys.Space,
        ].includes(code as KeyboardEventKeys);

        if (!includesKeyboardCode || ctrlKey) event.preventDefault();
      }

      switch (code) {
        case KeyboardEventKeys.ArrowLeft:
          if (document.fullscreenElement) return;

          if (!ctrlKey) prevMedia?.();
          break;

        case KeyboardEventKeys.ArrowRight:
          if (document.fullscreenElement) return;

          if (!ctrlKey) nextMedia?.();

          break;

        case KeyboardEventKeys.Escape:
          event.stopPropagation();
          if (!deleteDialogVisible) onClose?.();
          break;

        case KeyboardEventKeys.KeyS:
          if (ctrlKey) onDownloadMedia();
          break;

        case KeyboardEventKeys.Delete:
          onDeleteMediaMedia();
          break;

        default:
          break;
      }
    },
    [
      deleteDialogVisible,
      nextMedia,
      onClose,
      onDeleteMediaMedia,
      onDownloadMedia,
      prevMedia,
    ],
  );

  const fetchAndSetTiffDataURL = useCallback((src: string) => {
    TiffAbortSignalRef.current?.abort();
    TiffAbortSignalRef.current = new AbortController();

    fetch(src, { signal: TiffAbortSignalRef.current.signal })
      .then((response) => response.arrayBuffer())
      .then(async (response) => {
        const blob = await decodeTiff(response);

        if (blob) {
          setFileUrl(URL.createObjectURL(blob));
        }
      })
      .catch((error: Error) => {
        if (error.name === "AbortError") {
          return;
        }

        console.log(error);
      });
  }, []);

  const fetchAndSetHeicDataURL = useCallback(async (src: string) => {
    HeicAbortSignalRef.current?.abort();
    HeicAbortSignalRef.current = new AbortController();

    try {
      const { default: heic2any } = await import("heic2any");
      const response = await fetch(src, {
        signal: HeicAbortSignalRef.current.signal,
      });
      const blob = await response.blob();
      const conversionResult = await heic2any({ blob });

      if (conversionResult && !Array.isArray(conversionResult)) {
        setFileUrl(URL.createObjectURL(conversionResult));
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }
      console.error(error);
    }
  }, []);

  const onSetSelectionFile = useCallback(() => {
    setBufferSelection?.(targetFile);
  }, [setBufferSelection, targetFile]);

  useEffect(() => {
    isWillUnmountRef.current = false;
    return () => {
      isWillUnmountRef.current = true;
    };
  });

  const {
    src,
    title: currentTitle,
    fileId,
    encrypted: isEncrypted,
  } = playlist[playlistPos] || {};

  useEffect(() => {
    if (!isNullOrUndefined(fileId) && currentFileId !== fileId) {
      onChangeUrl?.(fileId);
    }
  }, [fileId, onChangeUrl, currentFileId]);

  const fetchAndDecryptFile = useCallback(
    async (
      src: string,
      fileId: number,
      title: string,
      roomId: number | string | null | undefined,
    ) => {
      EncryptedAbortSignalRef.current?.abort();
      const controller = new AbortController();
      EncryptedAbortSignalRef.current = controller;
      setIsDecrypting(true);
      setDecryptionError(undefined);

      const { signal } = controller;
      const isStale = () => signal.aborted;

      try {
        if (!decryptFile) {
          throw new Error("File decryption is not available");
        }

        const decrypted = await decryptFile({
          src,
          fileId,
          title,
          roomId,
          signal,
        });
        if (isStale()) return;
        if (!decrypted) {
          // The consumer gave up on the file (the user dismissed the unlock
          // dialog) — close the viewer instead of leaving it on a loader.
          onClose?.();
          return;
        }

        const { data: decryptedBlob, fileName: decryptedName } = decrypted;

        // The decrypted name carries the real extension
        const displayName = decryptedName || title;
        if (decryptedName) {
          setTitle(decryptedName);
        }
        const ext = getFileExtension(displayName).toLowerCase();
        const mimeTypes: Record<string, string> = {
          jpg: "image/jpeg",
          jpeg: "image/jpeg",
          png: "image/png",
          gif: "image/gif",
          webp: "image/webp",
          tif: "image/tiff",
          tiff: "image/tiff",
          heic: "image/heic",
          heif: "image/heif",
          mp4: "video/mp4",
          webm: "video/webm",
          mp3: "audio/mpeg",
          wav: "audio/wav",
          ogg: "audio/ogg",
          pdf: "application/pdf",
        };
        const mimeType = mimeTypes[ext] || "application/octet-stream";

        const typedBlob = new Blob([decryptedBlob], { type: mimeType });
        setFileUrl(URL.createObjectURL(typedBlob));
      } catch (error) {
        if (isStale()) return;
        if (error instanceof Error) {
          if (error.name === "AbortError") {
            return;
          }
          console.error("[MediaViewer] Decryption error:", error.message);
          onDecryptionError?.(error.message);
          setDecryptionError(
            t("Common:EncryptionDecryptPartialFailed", { fileNames: title }),
          );
        }
      } finally {
        if (EncryptedAbortSignalRef.current === controller) {
          setIsDecrypting(false);
        }
      }
    },
    [t, decryptFile, onClose, onDecryptionError],
  );

  useEffect(() => {
    return () => {
      TiffAbortSignalRef.current?.abort();
      HeicAbortSignalRef.current?.abort();
      EncryptedAbortSignalRef.current?.abort();
      if (
        prevBlobUrlRef.current &&
        prevBlobUrlRef.current.startsWith("blob:")
      ) {
        URL.revokeObjectURL(prevBlobUrlRef.current);
        prevBlobUrlRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const extension = getFileExtension(currentTitle);

    if (!src) {
      onEmptyPlaylistError?.();
      return;
    }

    // a failure belongs to the file that produced it, not to the next one
    setDecryptionError(undefined);

    if (isEncrypted) {
      TiffAbortSignalRef.current?.abort();
      HeicAbortSignalRef.current?.abort();
      setFileUrl(undefined);
      // `originRoomId` is set only for files moved out of a room (Recent /
      // Trash views). For files opened inside their home private room it is
      // undefined, so we fall back to the caller-provided currentRoomId from
      // the navigation context.
      const fileForRoom = files.find((file) => file.id === fileId);
      fetchAndDecryptFile(
        src,
        fileId,
        currentTitle,
        fileForRoom?.originRoomId ?? currentRoomId ?? null,
      );
    } else if (!isTiff(extension) && !isHeic(extension)) {
      TiffAbortSignalRef.current?.abort();
      HeicAbortSignalRef.current?.abort();
      EncryptedAbortSignalRef.current?.abort();
      setFileUrl(src);
    } else if (isHeic(extension)) {
      EncryptedAbortSignalRef.current?.abort();
      setFileUrl(undefined);
      fetchAndSetHeicDataURL(src);
    } else if (isTiff(extension)) {
      EncryptedAbortSignalRef.current?.abort();
      setFileUrl(undefined);
      fetchAndSetTiffDataURL(src);
    }

    const foundFile = files.find((file) => file.id === fileId);

    if (!isNullOrUndefined(foundFile)) {
      setTargetFile(foundFile);
      setBufferSelection?.(foundFile);
    }

    setTitle(
      resolveTitle
        ? resolveTitle({
            id: fileId,
            title: currentTitle,
            encrypted: isEncrypted,
          })
        : currentTitle,
    );
  }, [
    src,
    files,
    fileId,
    currentTitle,
    isEncrypted,
    currentRoomId,
    setBufferSelection,
    onEmptyPlaylistError,
    fetchAndSetTiffDataURL,
    fetchAndSetHeicDataURL,
    fetchAndDecryptFile,
    resolveTitle,
    pluginViewerContent,
    pluginTitle,
    pluginFileId,
  ]);

  useEffect(() => {
    document.addEventListener("keydown", onKeydown);

    return () => {
      document.removeEventListener("keydown", onKeydown);
    };
  }, [onKeydown]);

  if (pluginViewerContent) {
    canOpen = true;
  } else {
    if (canPlay(ext) && canImageView(ext)) {
      canOpen = false;
      other.onError?.();
    }

    if (canImageView(ext)) {
      isImage = true;
    } else {
      isImage = false;

      isVideo = mapSupplied[ext]
        ? mapSupplied[ext]?.type === mediaTypes.video
        : false;

      isAudio = mapSupplied[ext]
        ? mapSupplied[ext]?.type === mediaTypes.audio
        : false;

      isPdf = mapSupplied[ext]
        ? mapSupplied[ext]?.type === mediaTypes.pdf
        : false;
    }
  }

  return canOpen ? (
    <PdfViewerScriptContext value={getPdfViewerScriptUrl}>
      <ViewerWrapper
        title={pluginTitle || title}
        isPdf={isPdf}
        visible={visible}
        isImage={isImage}
        isAudio={isAudio}
        isVideo={isVideo}
        fileUrl={fileUrl}
        playlist={playlist}
        audioIcon={audioIcon}
        headerIcon={headerIcon}
        targetFile={targetFile}
        userAccess={userAccess}
        playlistPos={playlistPos}
        isPublicFile={isPublicFile}
        isPreviewFile={isPreviewFile}
        autoPlay={autoPlay}
        currentDeviceType={currentDeviceType}
        onClose={onClose}
        onPrevClick={prevMedia}
        onNextClick={nextMedia}
        contextModel={getContextModel}
        onDeleteClick={onDeleteMediaMedia}
        onSetSelectionFile={onSetSelectionFile}
        onDownloadClick={onDownloadMedia}
        errorTitle={t("Common:MediaError")}
        pluginViewerContent={pluginViewerContent}
        isDecrypting={isDecrypting}
        decryptionError={decryptionError}
      />
    </PdfViewerScriptContext>
  ) : undefined;
};

export default MediaViewer;
