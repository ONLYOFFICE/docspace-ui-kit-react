import type { DropEvent, FileRejection } from "react-dropzone";
import type { FC, SVGProps } from "react";

export type SvgIconComponent = FC<SVGProps<SVGSVGElement>>;

type BaseDropzoneProps = {
  /** Replaces the whole drop area with a loader. While it is set there is nothing to drop on and no file input in the DOM. */
  isLoading: boolean;
  /** Percentage for the progress bar shown in place of the plain loader while `isLoading`. Leave it out and the loader is an indeterminate spinner. */
  uploadPercent?: number;
  /**
   * Blocks clicking, the keyboard and dropping on the area and its format
   * line, and sets `aria-disabled`.
   */
  isDisabled?: boolean;
  /**
   * Switches to picking a directory, through a `webkitdirectory` input that any
   * click in the area opens. `accept` is then ignored.
   */
  isFolderUpload?: boolean;
  /**
   * Whether more than one file, or in folder mode more than one root folder,
   * may be dropped at once. When it is `false` an over-large drop is refused whole.
   */
  isMultipleUpload?: boolean;
  /** Called instead of `onDrop` when a single-upload rule refuses the drop. Nothing is uploaded and nothing is said to the user by the component. */
  onSingleUploadError?: () => void;
  /** The first line, a bold accent link that opens the file or folder dialog. Not translated for you. */
  linkMainText: string;
  /** The line after it, in the body colour, hidden at 600px wide or narrower. Not translated for you. */
  linkSecondaryText: string;
  /** The short list of supported formats under the two lines. Not translated for you. */
  exstsText: string;
  /** The full list, shown in a drop-down when the short line is clicked. Without it that line is not clickable. */
  fullExstsText?: string;
  /** Drawn as a `+N` pill beside the short format list. `0` and no value both leave it out. */
  formatsPlusBadgeValue?: number;
  /** Largest number of files the drop library accepts; `0` means no limit. */
  maxFiles?: number;
  /** Picture above the text, 50 by 50 pixels: a URL, or an SVG component the dropzone renders itself. */
  icon?: string | SvgIconComponent;
  /** Added after the component's own class on the icon. */
  iconClassName?: string;
  /** Added after the component's own class on the outer element. */
  className?: string;
  /** Added after the component's own classes on the loader or the progress bar. */
  loaderClassName?: string;
};

type FileDropHandler<T extends File = File> = (acceptedFiles: T[]) => void;

export type DropzoneProps = React.AriaAttributes &
  BaseDropzoneProps & {
    /**
     * Accepted types, in react-dropzone 11's form: MIME types or extensions such
     * as `.docx`, comma-separated or in an array. Ignored in folder mode.
     */
    accept: string | string[];
    /**
     * Replaces the reader that walks a dropped directory and attaches each file's
     * path. The directory and single-upload checks still run before it.
     */
    getFilesFromEvent?: (
      event: DropEvent,
    ) => Promise<(File | DataTransferItem)[]> | (File | DataTransferItem)[];
    /** Called with the accepted files. An empty result never reaches it, and neither does a drop refused by the single-upload rule. */
    onDrop?: FileDropHandler;
    /** Called with the files the drop library refused — wrong type, or more than `maxFiles`. */
    onDropRejected?: (fileRejections: FileRejection[]) => void;
    /** Value of `data-testid` on the outer element.
     * @default "dropzone" */
    dataTestId?: string;
  };
