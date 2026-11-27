import type { ImageViewerRequest } from "@onlyoffice/ai-chat";

import type { PlaylistType, TFile } from "../../../media-viewer";

// The media viewer is built for the portal's files: it finds what to show by
// a file id and takes the kind of the file from the extension of its title.
// A picture of the chat is neither, so it is shown as the one file of a
// playlist made up for it.
export const CHAT_IMAGE_FILE_ID = 1;

const DEFAULT_EXTENSION = ".png";

// The extensions a browser draws in an <img>. `.tif` / `.tiff` / `.heic` are
// left out on purpose: the viewer decodes those itself, from a download of
// the source.
const IMAGE_EXTENSIONS = [
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".bmp",
  ".svg",
  ".avif",
  ".ico",
];

const MIME_EXTENSIONS: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/gif": ".gif",
  "image/webp": ".webp",
  "image/bmp": ".bmp",
  "image/svg+xml": ".svg",
  "image/avif": ".avif",
  "image/x-icon": ".ico",
  "image/vnd.microsoft.icon": ".ico",
};

const extensionOf = (name: string): string => {
  const dot = name.lastIndexOf(".");
  if (dot < 0) return "";

  const extension = name.substring(dot).trim().toLowerCase();
  return IMAGE_EXTENSIONS.includes(extension) ? extension : "";
};

const extensionOfSource = (src: string): string => {
  if (src.startsWith("data:")) {
    const mime = src.substring(5, src.search(/[;,]/)).toLowerCase();
    return MIME_EXTENSIONS[mime] ?? "";
  }

  if (src.startsWith("blob:")) return "";

  try {
    return extensionOf(new URL(src, "http://localhost").pathname);
  } catch {
    return "";
  }
};

export type ChatImageMediaItem = {
  file: TFile;
  playlist: PlaylistType[];
  /** The one extension the viewer is told it may draw as an image. */
  extension: string;
};

/**
 * What the media viewer needs to show a picture of the chat: a file with the
 * picture's name and no right but Download (and that only when the chat can
 * save the picture), and a playlist of that one file.
 */
export const getChatImageMediaItem = (
  request: ImageViewerRequest,
  src: string,
  fallbackName: string,
): ChatImageMediaItem => {
  const name = request.title?.trim() ?? "";
  const titleExtension = extensionOf(name);
  const extension =
    titleExtension || extensionOfSource(request.src) || DEFAULT_EXTENSION;

  // The viewer reads the extension off the title, so a name without one of
  // an image gets it.
  const title = titleExtension ? name : `${name || fallbackName}${extension}`;

  const file = {
    id: CHAT_IMAGE_FILE_ID,
    title,
    fileExst: extension,
    security: { Download: !!request.onDownload },
  } as unknown as TFile;

  const playlist: PlaylistType[] = [
    {
      id: 0,
      fileId: CHAT_IMAGE_FILE_ID,
      src,
      title,
      fileExst: extension,
      fileStatus: 0,
      canShare: false,
      thumbnailUrl: "",
      version: 1,
    },
  ];

  return { file, playlist, extension };
};
