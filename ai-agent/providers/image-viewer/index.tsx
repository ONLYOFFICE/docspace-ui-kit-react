import React from "react";
import { useTranslation } from "react-i18next";
import type { ImageViewerRequest } from "@onlyoffice/ai-chat";

import { MediaViewer } from "../../../media-viewer";

import useDeviceType from "../files/use-device-type";
import { CHAT_IMAGE_FILE_ID, getChatImageMediaItem } from "./media-item";

type ChatImageViewerProps = {
  request: ImageViewerRequest;
  onClose: VoidFunction;
};

// The viewer draws a file's icon only in the menu of a file, which a picture
// of the chat does not have.
const getIcon = () => "";

// The viewer revokes a `blob:` source it was given when it closes. The chat
// keeps drawing its picture from that address, so the viewer gets a copy.
const useViewerSource = (src: string, onFail: VoidFunction) => {
  const isBlob = src.startsWith("blob:");
  const [copy, setCopy] = React.useState<string | null>(null);

  const onFailRef = React.useRef(onFail);
  onFailRef.current = onFail;

  React.useEffect(() => {
    if (!isBlob) return;

    let cancelled = false;
    setCopy(null);

    fetch(src)
      .then((response) => response.blob())
      .then((blob) => {
        if (!cancelled) setCopy(URL.createObjectURL(blob));
      })
      .catch(() => {
        if (!cancelled) onFailRef.current();
      });

    return () => {
      cancelled = true;
    };
  }, [src, isBlob]);

  return isBlob ? copy : src;
};

/**
 * A picture of the chat - an attachment, a generated image, an image a tool
 * returned - opened in the portal's media viewer instead of the chat
 * library's own: zoom, rotation and the download the chat hands over, and
 * none of the actions of a file.
 */
const ChatImageViewer = ({ request, onClose }: ChatImageViewerProps) => {
  const { t } = useTranslation(["Common"]);
  const { currentDeviceType } = useDeviceType();

  const src = useViewerSource(request.src, onClose);
  const fallbackName = t("Common:Image");

  const item = React.useMemo(
    () => (src ? getChatImageMediaItem(request, src, fallbackName) : null),
    [request, src, fallbackName],
  );

  const files = React.useMemo(() => (item ? [item.file] : []), [item]);
  const extsImagePreviewed = React.useMemo(
    () => (item ? [item.extension] : []),
    [item],
  );

  const onDownload = React.useCallback(() => {
    request.onDownload?.();
  }, [request]);

  if (!item) return null;

  return (
    <MediaViewer
      t={t}
      visible
      // Hides the menus of a file. `isPublicFile` would do that too, but it
      // also takes away the close button and the swipe that closes.
      isPreviewFile
      files={files}
      playlist={item.playlist}
      playlistPos={0}
      currentFileId={CHAT_IMAGE_FILE_ID}
      extsImagePreviewed={extsImagePreviewed}
      currentDeviceType={currentDeviceType}
      getIcon={getIcon}
      onClose={onClose}
      onDownload={onDownload}
    />
  );
};

export default ChatImageViewer;
