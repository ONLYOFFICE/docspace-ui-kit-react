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

import { ImageCropper } from "./ImageCropper";
import { ButtonDelete } from "./ButtonDelete";
import { PreviewTile } from "./PreviewTile";

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

export { ImageEditor, ButtonDelete, PreviewTile };
