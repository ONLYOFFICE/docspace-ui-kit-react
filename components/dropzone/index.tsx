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
import { useDropzone } from "react-dropzone";
import classNames from "classnames";

import TriangleDownIcon from "../../assets/triangle.down.react.svg";

import { Loader, LoaderTypes } from "../loader";
import { PreparationPortalProgress } from "../progress-bar/PreparationPortalProgress";
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
  uploadPercent,
  isDisabled = false,
  isFolderUpload = false,
  isMultipleUpload = true,
  onSingleUploadError,
  onDrop,
  onDropRejected,
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
    onDropRejected,
    getFilesFromEvent: customGetFilesFromEvent,
  } as Parameters<typeof useDropzone>[0];

  const { getRootProps, getInputProps, open, isDragActive } =
    useDropzone(dropzoneOptions);

  const [isDraggingOnPage, setIsDraggingOnPage] = React.useState(false);
  const pageDragCounter = React.useRef(0);

  React.useEffect(() => {
    const handleDragEnter = () => {
      pageDragCounter.current += 1;
      setIsDraggingOnPage(true);
    };

    const handleDragLeave = () => {
      pageDragCounter.current -= 1;
      if (pageDragCounter.current === 0) {
        setIsDraggingOnPage(false);
      }
    };

    const handleDrop = () => {
      pageDragCounter.current = 0;
      setIsDraggingOnPage(false);
    };

    document.addEventListener("dragenter", handleDragEnter);
    document.addEventListener("dragleave", handleDragLeave);
    document.addEventListener("drop", handleDrop);

    return () => {
      document.removeEventListener("dragenter", handleDragEnter);
      document.removeEventListener("dragleave", handleDragLeave);
      document.removeEventListener("drop", handleDrop);
    };
  }, []);

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
        [styles.isDraggingOnPage]: isDraggingOnPage && !isDragActive,
        [styles.isDragOver]: isDragActive,
      })}
      data-testid={dataTestId ?? "dropzone"}
      aria-busy={isLoading}
      aria-disabled={isDisabled}
    >
      {isLoading ? (
        uploadPercent !== undefined ? (
          <PreparationPortalProgress
            className={classNames(
              styles.dropzoneLoader,
              styles.dropzoneProgress,
              loaderClassName,
            )}
            percent={uploadPercent}
          />
        ) : (
          <Loader
            className={classNames(styles.dropzoneLoader, loaderClassName)}
            size="30px"
            type={LoaderTypes.track}
          />
        )
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
          {icon &&
            (typeof icon === "string" ? (
              <img
                src={icon}
                alt="Upload"
                className={classNames(styles.dropzoneIcon, iconClassName)}
                data-testid="dropzone-icon"
              />
            ) : (
              React.createElement(icon, {
                className: classNames(styles.dropzoneIcon, iconClassName),
                "data-testid": "dropzone-icon",
              } as React.SVGProps<SVGSVGElement>)
            ))}
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

