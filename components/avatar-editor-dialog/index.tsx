// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

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
          ? ({ "--modal-body-height": `${scrollBodyHeight}px` } as React.CSSProperties)
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
