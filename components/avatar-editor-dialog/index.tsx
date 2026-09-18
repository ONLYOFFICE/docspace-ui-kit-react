import React, { useState, useEffect } from "react";

import { ModalDialog, ModalDialogType } from "../modal-dialog";
import { Button, ButtonSize } from "../button";
import { Text } from "../text";
import { ImageEditor } from "../image-editor";

import type { AvatarEditorDialogProps } from "./AvatarEditorDialog.types";

import styles from "./AvatarEditorDialog.module.scss";

const IMAGE_CROPPER_HEIGHT = 448;
const HEADER = 70;
const BUTTONS = 72;

const AvatarEditorDialog = ({
  t,
  visible,
  title,
  image,
  isLoading = false,
  editorBorderRadius = 110,
  maxImageSize,
  dataTestId,
  onClose,
  onSave,
  onChangeImage,
  onChangeFile,
}: AvatarEditorDialogProps) => {
  const [preview, setPreview] = useState("");
  const [scrollBodyHeight, setScrollBodyHeight] = useState<number | null>(null);

  useEffect(() => {
    const onResize = () => {
      const imageCropperModalHeight = IMAGE_CROPPER_HEIGHT + HEADER + BUTTONS;
      const screenHeight = document.documentElement.clientHeight;

      setScrollBodyHeight(
        screenHeight < imageCropperModalHeight
          ? screenHeight - HEADER - BUTTONS
          : null,
      );
    };

    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleClose = () => {
    onChangeImage({ x: 0.5, y: 0.5, zoom: 1, uploadedFile: undefined });
    onClose();
  };

  const handleSave = async () => {
    await onSave(image, preview);
  };

  return (
    <ModalDialog
      className={styles.modalDialog}
      displayType={ModalDialogType.modal}
      withBodyScroll
      visible={visible}
      onClose={handleClose}
      withFooterBorder
      withBodyScrollForcibly={!!scrollBodyHeight}
      dataTestId={dataTestId}
      style={
        scrollBodyHeight
          ? ({
              "--modal-body-height": `${scrollBodyHeight}px`,
            } as React.CSSProperties)
          : undefined
      }
    >
      <ModalDialog.Header>
        <Text fontSize="21px" fontWeight={700}>
          {title}
        </Text>
      </ModalDialog.Header>

      <ModalDialog.Body>
        <ImageEditor
          t={t}
          className={styles.imageEditorWrapper}
          classNameWrapperImageCropper="avatar-editor"
          image={image}
          Preview={null}
          setPreview={setPreview}
          onChangeImage={onChangeImage}
          onChangeFile={onChangeFile}
          isDisabled={isLoading}
          editorBorderRadius={editorBorderRadius}
          maxImageSize={maxImageSize}
        />
      </ModalDialog.Body>

      <ModalDialog.Footer>
        <Button
          label={t("Common:SaveButton")}
          size={ButtonSize.normal}
          scale
          primary
          onClick={handleSave}
          isLoading={isLoading}
        />
        <Button
          label={t("Common:CancelButton")}
          size={ButtonSize.normal}
          scale
          onClick={handleClose}
          isDisabled={isLoading}
        />
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

export { AvatarEditorDialog };
export type { AvatarEditorDialogProps };
