import type { TTranslation } from "../../utils";
import type { TImage, TChangeImage } from "../image-editor/ImageEditor.types";

export type AvatarEditorDialogProps = {
  /** Translation function. The dialog asks it for `Common:SaveButton`, `Common:CancelButton` and `Common:ChooseAnother`, so a portal translation context is required. */
  t: TTranslation;
  /** Whether the dialog is on screen. */
  visible: boolean;
  /** Text of the dialog's header. It is not translated for you. */
  title: string;
  /** The picture and its crop, held in your state. The body is empty until `uploadedFile` is set. */
  image: TImage;
  /** Puts the save button in its loading state and blocks the editor and the cancel button. It does not block the header cross, Escape or the backdrop. */
  isLoading?: boolean;
  /** Corner radius of the crop window in pixels, on the editor's 648px canvas.
   * @default 110 */
  editorBorderRadius?: number;
  /** Ignored. It is handed to the image editor, which does not read it either; check the file's size in `onChangeFile`.
   * @deprecated */
  maxImageSize?: number;
  /** Value of `data-testid` on the dialog. */
  dataTestId?: string;
  /** Called after the dialog has reset `image` to an empty, centred, unzoomed one — by the cancel button, the header cross, Escape and the backdrop alike. */
  onClose: () => void;
  /** Called with the cropped `image` and its `data:` URL preview when save is clicked. The dialog neither closes itself nor sets `isLoading`. */
  onSave: (image: TImage, preview: string) => void | Promise<void>;
  /** Called with a new `image` whenever the crop is dragged or the zoom changes. Apply it to your state or nothing moves. */
  onChangeImage: TChangeImage;
  /** Called with the change event of the hidden file input when another picture is chosen. Read the file and put it in `image.uploadedFile` yourself. */
  onChangeFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
