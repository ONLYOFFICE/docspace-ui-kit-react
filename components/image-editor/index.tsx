import ImageCropper from "./ImageCropper";
import ButtonDelete from "./ButtonDelete";

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
}: ImageEditorProps) => {
  const setUploadedFile = (f?: File) => {
    onChangeImage({ ...image, uploadedFile: f });
  };

  const isDefaultAvatar =
    typeof image.uploadedFile === "string" &&
    image.uploadedFile.includes("default_user_photo");

  return (
    <div
      className={className}
      role="region"
      aria-label="Image editor"
      data-test-id="image-editor"
    >
      {image.uploadedFile && !isDefaultAvatar ? (
        <div
          className={classNameWrapperImageCropper}
          data-test-id="image-cropper-wrapper"
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
export type { TImage, TChangeImage, TSetPreview } from "./ImageEditor.types";
