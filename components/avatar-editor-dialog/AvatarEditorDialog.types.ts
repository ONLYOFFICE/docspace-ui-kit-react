import type { TTranslation } from "../../utils";
import type { TImage, TChangeImage } from "../image-editor/ImageEditor.types";

export type AvatarEditorDialogProps = {
  t: TTranslation;
  visible: boolean;
  title: string;
  image: TImage;
  isLoading?: boolean;
  editorBorderRadius?: number;
  maxImageSize?: number;
  dataTestId?: string;
  onClose: () => void;
  onSave: (image: TImage, preview: string) => void | Promise<void>;
  onChangeImage: TChangeImage;
  onChangeFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
