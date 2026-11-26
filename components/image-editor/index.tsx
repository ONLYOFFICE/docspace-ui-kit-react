import ImageCropper from "./ImageCropper";
import ButtonDelete from "./ButtonDelete";

import { pickAriaProps } from "../../utils/aria-props";

import { ImageEditorProps } from "./ImageEditor.types";

const ImageEditor = ({
  t,
  image,
  onChangeImage,
  Preview,
  setPreview,
  isDisabled,
  classNameWrapperImageCropper,
  className,
  disableImageRescaling,
  editorBorderRadius,
  onChangeFile,
  ...rest
}: ImageEditorProps) => {
  const setUploadedFile = (f?: File) => {
    onChangeImage({ ...image, uploadedFile: f });
  };

  const isDefaultAvatar =
    typeof image.uploadedFile === "string" &&
    image.uploadedFile.includes("default_user_photo");

  return (
    <div
      {...pickAriaProps(rest)}
      className={className}
      role="region"
      data-testid="image-editor"
    >
      {image.uploadedFile && !isDefaultAvatar ? (
        <div
          className={classNameWrapperImageCropper}
          data-testid="image-cropper-wrapper"
        >
          <ImageCropper
            t={t}
            image={image}
            onChangeImage={onChangeImage}
            uploadedFile={image.uploadedFile}
            setUploadedFile={setUploadedFile}
            setPreviewImage={setPreview}
            isDisabled={isDisabled}
            disableImageRescaling={disableImageRescaling}
            onChangeFile={onChangeFile}
            editorBorderRadius={editorBorderRadius}
          />
          {Preview}
        </div>
      ) : null}
    </div>
  );
};

export { ImageEditor, ButtonDelete };
export type {
  ImageEditorProps,
  TImage,
  TChangeImage,
  TSetPreview,
} from "./ImageEditor.types";
