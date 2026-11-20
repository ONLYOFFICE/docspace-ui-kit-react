import type {
  MediaViewerProps,
  NumberOrString,
  TFile,
} from "./MediaViewer.types";

export type MediaGalleryProps = Pick<
  MediaViewerProps,
  | "t"
  | "getIcon"
  | "extsImagePreviewed"
  | "currentDeviceType"
  | "autoPlay"
  | "decryptFile"
  | "getDecryptionErrorMessage"
  | "resolveTitle"
  | "getPdfViewerScriptUrl"
  | "onClose"
> & {
  /** The folder or room whose media files are shown. */
  folderId: NumberOrString;
  /**
   * The key of a public room link, sent with every request for an anonymous
   * visitor.
   */
  requestToken?: string;
  /**
   * Reads every file through the API client, also on the portal's own origin:
   * for a frame that signs in with a token instead of the session cookie,
   * which a media element cannot send.
   */
  readThroughApiClient?: boolean;
  /**
   * The file to open first. Pages are loaded until it turns up, ten at most;
   * otherwise the first media file opens.
   */
  startFileId?: NumberOrString;
  /**
   * How many files one request asks for.
   * @default 100
   */
  pageSize?: number;
  /** Shown when the folder has no media files. Nothing by default. */
  emptyContent?: React.ReactNode;
  /**
   * Called with the file to download. By default the file's `viewUrl` opens
   * in the same window.
   */
  onDownload?: (file: TFile) => void;
  /**
   * Called when the first request for the folder fails: no access, no such
   * folder, no connection. The gallery renders nothing after that.
   */
  onLoadError?: (error: unknown) => void;
};
