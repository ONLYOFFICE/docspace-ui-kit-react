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

import React from "react";
import Dropzone from "react-dropzone";
import equal from "fast-deep-equal/react";

import CatalogFolderReactSvgUrl from "../../assets/icons/16/catalog.folder.react.svg";
import DocumentReactSvgUrl from "../../assets/document.react.svg";

import classNames from "classnames";
import { IconButton } from "../icon-button";
import { Button, ButtonSize } from "../button";
import { InputSize, InputType, TextInput } from "../text-input";
import { Loader, LoaderTypes } from "../loader";
import { toastr } from "../toast";

import styles from "./FileInput.module.scss";

import { FileInputProps } from "./FileInput.types";
import { globalColors } from "../../providers/theme/themes";
import { useCommonTranslation } from "../../utils";

const FileInputPure = ({
  onInput,
  size = InputSize.base,
  placeholder,
  isDisabled = false,
  scale = false,
  hasError = false,
  hasWarning = false,
  accept = [""],
  id,
  buttonLabel,
  isLoading = false,
  fromStorage = false,
  path,
  idButton,
  isDocumentIcon = false,
  isMultiple = true,
  className,
  "data-test-id": dataTestId,
  ...rest
}: FileInputProps) => {
  const t = useCommonTranslation();
  const inputRef = React.useRef<null | HTMLInputElement>(null);

  const [fileName, setFileName] = React.useState("");

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      toastr.error(t("NotSupportedFormat"));
      return;
    }

    setFileName(
      acceptedFiles.length > 1
        ? acceptedFiles.map((file) => file.name).join(", ")
        : acceptedFiles[0].name,
    );

    onInput?.(acceptedFiles.length > 1 ? acceptedFiles : acceptedFiles[0]);
  };

  const getSize = () => {
    let iconSize = 0;
    let buttonSize = ButtonSize.small;

    switch (size) {
      case InputSize.base:
        iconSize = 15;
        buttonSize = ButtonSize.extraSmall;
        break;
      case InputSize.middle:
        iconSize = 15;
        buttonSize = ButtonSize.small;
        break;
      case InputSize.large:
        iconSize = 16;
        buttonSize = ButtonSize.medium;
        break;
      default:
        break;
    }

    return { iconSize, buttonSize };
  };

  const { iconSize, buttonSize } = getSize();

  const wrapperClasses = classNames(styles.container, className, {
    [styles.scale]: scale ? 1 : 0,
    [styles[size]]: size,
    [styles.error]: hasError,
    [styles.warning]: hasWarning,
    [styles.disabled]: isDisabled,
  });

  const iconClasses = classNames(styles.icon, {
    [styles[size]]: size,
    [styles.disabled]: isDisabled,
    [styles.error]: hasError,
    [styles.warning]: hasWarning,
  });

  const textInputClasses = classNames(
    styles.textInput,
    {
      [styles[size]]: size,
      [styles.disabled]: isDisabled || isLoading,
      [styles.error]: hasError,
      [styles.warning]: hasWarning,
    },
    "text-input",
  );

  const iconButtonClasses = classNames(styles.iconButton, {
    [styles.disabled]: isDisabled,
  });

  const onClickProp =
    fromStorage && !isDisabled ? { onClick: rest.onClick } : {};

  return (
    <Dropzone
      onDrop={onDrop}
      noClick={isDisabled || isLoading}
      accept={accept}
      multiple={isMultiple}
    >
      {({ getRootProps, getInputProps }) => (
        <div
          className={wrapperClasses}
          id={idButton}
          data-testid={dataTestId ?? "file-input"}
          aria-disabled={isDisabled ? "true" : "false"}
          role="button"
          {...rest}
          {...getRootProps()}
        >
          <TextInput
            isReadOnly
            className={textInputClasses}
            placeholder={placeholder}
            value={fromStorage && path ? path : fileName}
            size={size}
            isDisabled={isDisabled || isLoading}
            hasError={hasError}
            hasWarning={hasWarning}
            scale={scale}
            type={InputType.text}
            withBorder
            {...onClickProp}
          />
          {!fromStorage ? (
            <input
              data-testid="upload-click-input"
              type="file"
              id={id}
              ref={inputRef}
              style={{ display: "none" }}
              {...getInputProps()}
            />
          ) : null}

          {buttonLabel ? (
            <Button
              isDisabled={isDisabled}
              label={buttonLabel}
              size={buttonSize}
              type="button"
            />
          ) : (
            <div className={iconClasses} {...onClickProp}>
              {isLoading ? (
                <Loader
                  className={styles.loader}
                  size="20px"
                  type={LoaderTypes.track}
                />
              ) : (
                <IconButton
                  data-testid="icon-button"
                  className={iconButtonClasses}
                  iconNode={
                    isDocumentIcon ? (
                      <DocumentReactSvgUrl />
                    ) : (
                      <CatalogFolderReactSvgUrl />
                    )
                  }
                  color={globalColors.gray}
                  size={iconSize}
                  isDisabled={isDisabled}
                />
              )}
            </div>
          )}
        </div>
      )}
    </Dropzone>
  );
};

export { FileInputPure };

const compare = (
  prevProps: Readonly<FileInputProps>,
  nextProps: Readonly<FileInputProps>,
) => {
  return equal(prevProps, nextProps);
};

export const FileInput = React.memo(FileInputPure, compare);
