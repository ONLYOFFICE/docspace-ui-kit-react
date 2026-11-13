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
   * The file to open first. Found only among the files already loaded;
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
