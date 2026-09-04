import type { DropEvent, FileRejection } from "react-dropzone";
import type { FC, SVGProps } from "react";

export type SvgIconComponent = FC<SVGProps<SVGSVGElement>>;

type BaseDropzoneProps = {
  /** Shows loading state of the dropzone */
  isLoading: boolean;
  /** Upload progress percentage (0-100) shown when isLoading is true */
  uploadPercent?: number;
  /** Disables the dropzone */
  isDisabled?: boolean;
  /** Enables folder upload mode instead of file upload */
  isFolderUpload?: boolean;
  /** Allows multiple files/folders upload. When false, only one item is accepted (default: true) */
  isMultipleUpload?: boolean;
  /** Called when user tries to upload multiple items in single upload mode */
  onSingleUploadError?: () => void;
  /** Main text displayed in the dropzone */
  linkMainText: string;
  /** Secondary text displayed in the dropzone */
  linkSecondaryText: string;
  /** Text displaying supported file types (short version) */
  exstsText: string;
  /** Full text displaying all supported file types (shown in dropdown) */
  fullExstsText?: string;
  /** Value for plus badge showing additional formats count */
  formatsPlusBadgeValue?: number;
  /** Maximum number of files allowed (0 for unlimited) */
  maxFiles?: number;
  /** Optional icon URL (string) or SVG component to display */
  icon?: string | SvgIconComponent;
  /** Optional className for the icon */
  iconClassName?: string;
  /** Optional className for the dropzone container */
  className?: string;
  /** Optional className for the loader */
  loaderClassName?: string;
};

type FileDropHandler<T extends File = File> = (acceptedFiles: T[]) => void;

export type DropzoneProps = BaseDropzoneProps & {
  /** Accepted file types (string[]) */
  accept: string | string[];
  /** Custom function to get files from drop event */
  getFilesFromEvent?: (
    event: DropEvent,
  ) => Promise<(File | DataTransferItem)[]> | (File | DataTransferItem)[];
  /** Callback when files are dropped */
  onDrop?: FileDropHandler;
  /** Callback when files are rejected (e.g., wrong file type) */
  onDropRejected?: (fileRejections: FileRejection[]) => void;
  /** Data test id */
  dataTestId?: string;
};
