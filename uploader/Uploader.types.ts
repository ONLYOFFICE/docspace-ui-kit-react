import type { FilesSettingsDto } from "@onlyoffice/docspace-api-sdk";

export type UploaderFilesSettings = FilesSettingsDto & {
  maxUploadFilesCount?: number;
};

export type UploadProgressData = {
  sessionId: string;
  fileName: string;
  uploadedChunks: number;
  totalChunks: number;
  percent: number;
};

export type RejectedFile = {
  fileName: string;
  fileSize: number;
  fileType: string;
  errors: Array<{ code: string; message: string }>;
};

export type UploaderProps = {
  /** Width of the uploader container */
  width?: string;
  /** Height of the uploader container */
  height?: string;
  filesSettings?: UploaderFilesSettings;
  accept: string;
  shortText: string;
  fullText?: string;
  badgeValue?: number;
  /** Called on each upload progress update per file */
  onUploadProgress?: (data: UploadProgressData) => void;
  /** Called when all files are uploaded successfully */
  onUploadSuccess?: (data: unknown[]) => void;
  /** Called when upload fails */
  onUploadError?: (data: {
    error: string;
    rejectedFiles?: RejectedFile[];
  }) => void;
  /** Target folder ID for uploads */
  targetId?: string;
  /** Main text displayed in the dropzone */
  linkMainText?: string;
  /** Secondary text displayed in the dropzone */
  secondaryText?: string;
  /** Text displaying supported file extensions */
  extensionsText?: string;
  /** Enables folder upload mode */
  isFolderUpload?: boolean;
  /** Allows multiple files/folders upload */
  isMultipleUpload?: boolean;
  /** Maximum size per single upload (e.g. "10MB") */
  maxPerUploadSize?: string;
  /** Maximum total upload size (e.g. "100MB") */
  maxTotalUploadSize?: string;
  /** Callback to generate folder URL for success toast link. If not provided, no link is shown. */
  getFolderUrl?: (folderId: string | number) => string;
};

export type TFileWithOptionalPath = File & { path?: string };
export type TFileWithOptionalEmptyDir = File & { isEmptyDirectory?: boolean };
export type TFileWithOptionalLastModifiedDate = File & {
  lastModifiedDate?: unknown;
};

