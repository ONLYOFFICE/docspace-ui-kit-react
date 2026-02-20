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

import React from "react";
import { useDropzone, DropEvent } from "react-dropzone";
import classNames from "classnames";

import TriangleDownIcon from "../../assets/triangle.down.react.svg";

import { Loader, LoaderTypes } from "../loader";
import { Badge } from "../badge";
import { DropDown } from "../drop-down";
import { IconSizeType } from "../../utils";

import { DropzoneProps } from "./Dropzone.types";
import styles from "./Dropzone.module.scss";
import { Link } from "../link";
import {
  getRootFolderCount,
  addPathToFiles,
  createCustomGetFilesFromEvent,
} from "./utils";

const Dropzone = ({
  isLoading,
  isDisabled = false,
  isFolderUpload = false,
  isMultipleUpload = true,
  onSingleUploadError,
  onDrop,
  accept,
  maxFiles = 0,
  getFilesFromEvent,
  linkMainText,
  linkSecondaryText,
  exstsText,
  fullExstsText,
  formatsPlusBadgeValue,
  dataTestId,
  icon,
  iconClassName,
  className,
  loaderClassName,
}: DropzoneProps) => {
  const handleDrop = (acceptedFiles: File[]) => {
    if (!onDrop || acceptedFiles.length === 0) return;

    if (!isMultipleUpload) {
      if (isFolderUpload) {
        if (getRootFolderCount(acceptedFiles) > 1) {
          onSingleUploadError?.();
          return;
        }
      } else {
        if (acceptedFiles.length > 1) {
          onSingleUploadError?.();
          return;
        }
      }
    }

    onDrop(acceptedFiles);
  };

  const customGetFilesFromEvent = createCustomGetFilesFromEvent({
    isFolderUpload,
    isMultipleUpload,
    onSingleUploadError,
    getFilesFromEvent,
  });

  const dropzoneOptions = {
    maxFiles,
    noClick: isDisabled || isFolderUpload,
    noKeyboard: isDisabled || isFolderUpload,
    noDrag: isDisabled,
    ...(!isFolderUpload && accept ? { accept } : {}),
    onDrop: handleDrop,
    getFilesFromEvent: customGetFilesFromEvent,
  } as Parameters<typeof useDropzone>[0];

  const { getRootProps, getInputProps, open } = useDropzone(dropzoneOptions);

  const folderInputRef = React.useRef<HTMLInputElement>(null);

  const openFolderDialog = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (!isDisabled) {
      folderInputRef.current?.click();
    }
  };

  const handleFileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isDisabled) {
      open();
    }
  };

  const handleFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const files = addPathToFiles(Array.from(fileList));
    handleDrop(files);
    e.target.value = "";
  };

  const [isFormatsOpen, setIsFormatsOpen] = React.useState(false);
  const formatsRef = React.useRef<HTMLDivElement>(null);

  const handleFormatsClick = (e: React.MouseEvent) => {
    if (fullExstsText) {
      e.stopPropagation();
      e.preventDefault();
      setIsFormatsOpen((prev) => !prev);
    }
  };

  const handleFormatsClose = (e: Event, open: boolean) => {
    if (!open) {
      setIsFormatsOpen(false);
    }
  };

  return (
    <div
      className={classNames(styles.dropzoneWrapper, className, {
        [styles.isLoading]: isLoading,
      })}
      data-testid={dataTestId ?? "dropzone"}
      aria-busy={isLoading}
      aria-disabled={isDisabled}
    >
      {isLoading ? (
        <Loader
          className={classNames(styles.dropzoneLoader, loaderClassName)}
          size="30px"
          type={LoaderTypes.track}
        />
      ) : (
        <div
          {...getRootProps({
            className: styles.dropzone,
            "aria-label": isFolderUpload
              ? "Folder upload area"
              : "File upload area",
            "data-testid": "dropzone-input-area",
          })}
          {...(isFolderUpload ? { onClick: openFolderDialog } : {})}
        >
          {isFolderUpload ? (
            <input
              ref={folderInputRef}
              type="file"
              disabled={isDisabled}
              style={{ display: "none" }}
              onChange={handleFolderChange}
              {...({
                webkitdirectory: "",
                directory: "",
              } as React.InputHTMLAttributes<HTMLInputElement>)}
              aria-label="Folder input"
              data-testid="dropzone-input"
            />
          ) : (
            <input
              disabled={isDisabled}
              {...getInputProps({
                "aria-label": "File input",
                "data-testid": "dropzone-input",
              })}
            />
          )}
          {icon && (
            <img
              src={icon}
              alt="Upload"
              className={classNames(styles.dropzoneIcon, iconClassName)}
              data-testid="dropzone-icon"
            />
          )}
          <div
            className={styles.dropzoneLink}
            data-testid="dropzone-text"
            aria-live="polite"
            aria-relevant="additions removals"
          >
            <Link
              className={classNames(styles.dropzoneLink, {
                [styles.main]: true,
              })}
              data-testid="dropzone-main-text"
              color="accent"
              onClick={isFolderUpload ? openFolderDialog : handleFileClick}
            >
              {linkMainText}
            </Link>
            <span
              className={classNames(styles.dropzoneLink, {
                [styles.secondary]: true,
              })}
              data-testid="dropzone-secondary-text"
            >
              {linkSecondaryText}
            </span>
          </div>
          {!isFolderUpload && (
            <div
              ref={formatsRef}
              className={classNames(styles.dropzoneExsts, {
                [styles.clickable]: !!fullExstsText,
              })}
              data-testid="dropzone-file-types"
              aria-label="Supported file types"
              onClick={handleFormatsClick}
            >
              <div
                className={classNames(styles.dropzoneExstsTextContainer, {
                  [styles.isOpen]: isFormatsOpen,
                  [styles.clickable]: !!fullExstsText,
                })}
              >
                <span className={styles.dropzoneExstsText}>{exstsText}</span>
                {formatsPlusBadgeValue && formatsPlusBadgeValue > 0 ? (
                  <Badge
                    className={styles.dropzoneExstsBadge}
                    label={`+${formatsPlusBadgeValue}`}
                    isMutedBadge
                    borderRadius="50px"
                  />
                ) : null}
                {fullExstsText ? (
                  <TriangleDownIcon
                    data-size={IconSizeType.scale}
                    className={classNames(styles.dropzoneArrowIcon, {
                      [styles.isOpen]: isFormatsOpen,
                    })}
                  />
                ) : null}
                {fullExstsText ? (
                  <DropDown
                    className={styles.dropzoneFormatsDropdown}
                    open={isFormatsOpen}
                    clickOutsideAction={handleFormatsClose}
                    forwardedRef={formatsRef}
                    manualY="4"
                    directionY="bottom"
                    withBackdrop={false}
                    isDefaultMode={false}
                  >
                    <div className={styles.dropzoneFormatsContent}>
                      {fullExstsText}
                    </div>
                  </DropDown>
                ) : null}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dropzone;
