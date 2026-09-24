import type { TTranslation } from "../../utils";

export type TImage = {
  /** The picture being edited: a `File` from the input, or a URL string. Only a `File` gets zoom controls. */
  uploadedFile?: string | File;
  /** Scale of the picture inside the crop circle, from 1 to 5. */
  zoom: number;
  /** Horizontal position of the crop window, 0 to 1, where 0.5 is centred. */
  x: number;
  /** Vertical position of the crop window, 0 to 1, where 0.5 is centred. */
  y: number;
};
export type TChangeImage = (image: TImage) => void;
export type TSetPreview = (preview: string) => void;

export type ImageEditorProps = {
  /** Translation function. The editor asks it for `Common:ChooseAnother`, so a portal translation context is required. */
  t: TTranslation;
  /** The picture and its crop, held in your state. The whole editor renders nothing while `uploadedFile` is empty. */
  image: TImage;
  /** Called with a new `image` whenever the crop is dragged or the zoom changes. Apply it to your state or nothing moves. */
  onChangeImage: TChangeImage;
  /** Rendered beside the cropper, inside the wrapper that `classNameWrapperImageCropper` names — the place for a preview of the cropped result. */
  Preview: React.ReactNode;
  /** Called, at most every 300ms, with the cropped picture as a `data:` URL. A canvas tainted by a cross-origin image makes it stop silently. */
  setPreview: TSetPreview;
  /** Blocks dragging, zooming and choosing another file. It is required, so pass `false` when nothing is in flight. */
  isDisabled: boolean;
  /** Added to the element that wraps the cropper and `Preview`. It is the hook for laying those two out side by side. */
  classNameWrapperImageCropper?: string;
  /** Added to the outer element. */
  className?: string;
  /** Hides the zoom row and freezes the crop position, leaving the picture as it is. */
  disableImageRescaling?: boolean;
  /** Ignored. Nothing in this folder reads it; check the file's size in `onChangeFile` instead.
   * @deprecated */
  maxImageSize?: number;
  /** Corner radius of the crop window in pixels, measured on the 648px canvas — half of it, 324, is a circle. */
  editorBorderRadius: number;
  /** Called with the change event of the hidden file input when another picture is chosen. Read the file and put it in `image.uploadedFile` yourself. */
  onChangeFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export type ImageCropperProps = {
  /** Translation function, for the `Common:ChooseAnother` label. */
  t: TTranslation;
  /** The picture and its crop. */
  image: TImage;
  /** Called with a new `image` whenever the crop is dragged or the zoom changes. */
  onChangeImage: TChangeImage;
  /** The picture itself, taken from `image.uploadedFile` by the editor. */
  uploadedFile: File | string;
  /** Called with `undefined` to drop the picture. The cropper itself never calls it. */
  setUploadedFile: (uploadedFile?: File) => void;
  /** Called with the cropped picture as a `data:` URL, throttled to every 300ms. */
  setPreviewImage: TSetPreview;
  /** Blocks dragging, zooming and choosing another file. */
  isDisabled: boolean;
  /** Hides the zoom row and freezes the crop position. */
  disableImageRescaling?: boolean;
  /** Corner radius of the crop window in pixels, on the 648px canvas. */
  editorBorderRadius: number;
  /** Called with the change event of the hidden file input. */
  onChangeFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
