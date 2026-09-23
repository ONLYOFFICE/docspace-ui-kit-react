import type { TTranslation } from "../../utils";
import type { TImage, TChangeImage } from "../image-editor/ImageEditor.types";

export type AvatarEditorDialogProps = {
  /** Translator for the button labels (`Common:SaveButton`, `Common:CancelButton`) and the image editor's own strings. */
  t: TTranslation;
  /** Whether the dialog is open. */
  visible: boolean;
  /** Heading shown in the dialog header. */
  title: string;
  /** Current image, zoom and crop position; controlled by the caller. */
  image: TImage;
  /** Shows a loader on the save button and disables cancel and the editor. */
  isLoading?: boolean;
  /** Border radius of the crop mask, in pixels; `0` gives a square crop. */
  editorBorderRadius?: number;
  /** @deprecated Has no effect. Size limits and compression are the caller's job, in `onChangeFile`. */
  maxImageSize?: number;
  /** Test id forwarded to the underlying modal dialog. */
  dataTestId?: string;
  /** Called when the dialog is closed or cancelled, after the image is reset. */
  onClose: () => void;
  /** Called by the save button with the current image and the cropped preview as a data URL. */
  onSave: (image: TImage, preview: string) => void | Promise<void>;
  /** Called whenever the image, zoom or crop position changes. */
  onChangeImage: TChangeImage;
  /** Change handler for the editor's file input ("Choose another"). */
  onChangeFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
