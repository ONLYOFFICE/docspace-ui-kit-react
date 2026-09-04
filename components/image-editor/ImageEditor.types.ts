import type { TTranslation } from "../../utils";

export type TImage = {
  uploadedFile?: string | File;
  zoom: number;
  x: number;
  y: number;
};
export type TChangeImage = (image: TImage) => void;
export type TSetPreview = (preview: string) => void;

export type ImageEditorProps = {
  t: TTranslation;
  image: TImage;
  onChangeImage: TChangeImage;
  Preview: React.ReactNode;
  setPreview: TSetPreview;
  isDisabled: boolean;
  classNameWrapperImageCropper?: string;
  className?: string;
  disableImageRescaling?: boolean;
  maxImageSize?: number;
  editorBorderRadius: number;
  onChangeFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export type ImageCropperProps = {
  t: TTranslation;
  image: TImage;
  onChangeImage: TChangeImage;
  uploadedFile: File | string;
  setUploadedFile: (uploadedFile?: File) => void;
  setPreviewImage: TSetPreview;
  isDisabled: boolean;
  disableImageRescaling?: boolean;
  editorBorderRadius: number;
  onChangeFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
