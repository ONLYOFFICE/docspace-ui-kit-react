/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useEffect } from "react";
import throttle from "lodash/throttle";
import AvatarEditor, { Position } from "react-avatar-editor";
import classNames from "classnames";

import ZoomMinusReactSvg from "../../../assets/zoom-minus.react.svg";
import ZoomPlusReactSvg from "../../../assets/zoom-plus.react.svg";
import RefreshReactSvg from "../../../assets/icons/16/refresh.react.svg";

import { Slider } from "../../slider";
import { IconButton } from "../../icon-button";

import { useTheme } from "../../../context/ThemeContext";

import { ImageCropperProps } from "../ImageEditor.types";

import styles from "./ImageCropper.module.scss";

const ImageCropper = ({
  t,
  image,
  onChangeImage,
  uploadedFile,
  setPreviewImage,
  isDisabled,
  disableImageRescaling,
  onChangeFile,
  editorBorderRadius,
}: ImageCropperProps) => {
  const editorRef = React.useRef<null | AvatarEditor>(null);
  const inputFilesElement = React.useRef<HTMLInputElement>(null);
  const setEditorRef = (editor: AvatarEditor | null) => {
    editorRef.current = editor;
  };
  const { isBase } = useTheme();

  const handlePositionChange = (position: Position) => {
    if (isDisabled || disableImageRescaling) return;

    onChangeImage({ ...image, x: position.x, y: position.y });
  };

  const handleSliderChange = (
    e?: React.ChangeEvent<HTMLInputElement>,
    newZoom: null | number = null,
  ) => {
    if (isDisabled) return;

    const val = e ? e?.target.value : 0;

    onChangeImage({ ...image, zoom: newZoom || +val });
  };

  const handleZoomInClick = () => {
    if (isDisabled) return;

    handleSliderChange(undefined, image.zoom <= 4.5 ? image.zoom + 0.5 : 5);
  };

  const handleZoomOutClick = () => {
    if (isDisabled) return;

    handleSliderChange(undefined, image.zoom >= 1.5 ? image.zoom - 0.5 : 1);
  };

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isDisabled) return;
    onChangeFile(e);
  };

  const onInputClick = () => {
    if (inputFilesElement.current) {
      inputFilesElement.current.value = "";
    }
  };

  const handleImageChange = throttle(() => {
    try {
      if (!editorRef.current) return;
      const newPreviewImage = editorRef.current
        .getImageScaledToCanvas()
        ?.toDataURL();
      setPreviewImage(newPreviewImage);
    } catch {
      // console.error(e);
    }
  }, 300);

  useEffect(() => {
    handleImageChange();
    return () => {
      // setPreviewImage("");
    };
  }, [handleImageChange, image, setPreviewImage]);

  return (
    <div
      className={classNames(styles.imageCropperWrapper, "icon_cropper")}
      data-testid="image-cropper"
      aria-disabled={isDisabled}
    >
      <div className={styles.iconCropperCropArea}>
        <AvatarEditor
          className={
            disableImageRescaling ? styles.iconCropperAvatarEditor : ""
          }
          ref={setEditorRef}
          image={uploadedFile}
          width={648}
          height={648}
          position={{ x: image.x, y: image.y }}
          scale={image.zoom}
          color={isBase ? [6, 22, 38, 0.2] : [20, 20, 20, 0.8]}
          border={0}
          rotate={0}
          borderRadius={editorBorderRadius}
          style={{ width: "368px", height: "368px" }}
          onPositionChange={handlePositionChange}
          onImageReady={handleImageChange}
          disableHiDPIScaling={false}
          crossOrigin="anonymous"
        />
      </div>
      <div
        className={styles.iconCropperChangeButton}
        onClick={() => inputFilesElement.current?.click()}
        title={t("Common:ChooseAnother")}
        data-testid="change_image_button"
      >
        <RefreshReactSvg />
        <div className={styles.iconCropperChangeButtonText}>
          {t("Common:ChooseAnother")}
        </div>
        <input
          id="customFileInput"
          className="custom-file-input"
          type="file"
          onChange={handleChangeImage}
          accept="image/png, image/jpeg"
          onClick={onInputClick}
          ref={inputFilesElement}
          style={{ display: "none" }}
        />
      </div>

      {typeof uploadedFile !== "string" &&
      uploadedFile?.name &&
      !disableImageRescaling ? (
        <div className={styles.iconCropperZoomContainer}>
          <IconButton
            className={styles.iconCropperZoomContainerButton}
            size={20}
            onClick={handleZoomOutClick}
            iconNode={<ZoomMinusReactSvg />}
            isFill
            isClickable={false}
            isDisabled={isDisabled}
            dataTestId="zoom_out_icon_button"
          />

          <Slider
            className={styles.slider}
            max={5}
            min={1}
            onChange={handleSliderChange}
            step={0.01}
            value={image.zoom}
            isDisabled={isDisabled}
          />
          <IconButton
            className={styles.button}
            size={20}
            onClick={handleZoomInClick}
            iconNode={<ZoomPlusReactSvg />}
            isFill
            isClickable={false}
            isDisabled={isDisabled}
            dataTestId="zoom_in_icon_button"
          />
        </div>
      ) : null}
    </div>
  );
};

export default ImageCropper;
