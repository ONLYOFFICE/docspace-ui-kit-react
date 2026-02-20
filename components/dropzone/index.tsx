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

const Dropzone = ({
  isLoading,
  isDisabled = false,
  isFolderUpload = false,
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
  const filterFiles = (files: File[]) => {
    return files.filter((file) => {
      const hasPath = file.webkitRelativePath && file.webkitRelativePath.includes("/");
      if (isFolderUpload) {
        return hasPath;
      }
      return !hasPath;
    });
  };

  const handleDrop = (acceptedFiles: File[]) => {
    if (!onDrop) return;

    const filteredFiles = filterFiles(acceptedFiles);
    if (filteredFiles.length > 0) {
      onDrop(filteredFiles);
    }
  };

  const customGetFilesFromEvent = async (event: DropEvent): Promise<File[]> => {
    const items = (event as DragEvent).dataTransfer?.items;
    if (!items) {
      if (getFilesFromEvent) {
        const files = await Promise.resolve(getFilesFromEvent(event));
        return filterFiles(files as File[]);
      }
      return [];
    }

    const hasDirectory = Array.from(items).some((item) => {
      const entry = item.webkitGetAsEntry?.();
      return entry?.isDirectory;
    });

    if (!isFolderUpload && hasDirectory) {
      return [];
    }

    if (isFolderUpload && !hasDirectory) {
      return [];
    }

    if (getFilesFromEvent) {
      const files = await Promise.resolve(getFilesFromEvent(event));
      return files as File[];
    }

    const files: File[] = [];
    const entries: FileSystemEntry[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const entry = item.webkitGetAsEntry?.();
      if (entry) {
        entries.push(entry);
      }
    }

    const processEntry = async (entry: FileSystemEntry, path = ""): Promise<void> => {
      if (entry.isFile) {
        const fileEntry = entry as FileSystemFileEntry;
        const file = await new Promise<File>((resolve) => {
          fileEntry.file((f) => {
            Object.defineProperty(f, "webkitRelativePath", {
              value: path + f.name,
              writable: false,
            });
            resolve(f);
          });
        });
        files.push(file);
      } else if (entry.isDirectory) {
        const dirEntry = entry as FileSystemDirectoryEntry;
        const reader = dirEntry.createReader();
        const subEntries = await new Promise<FileSystemEntry[]>((resolve) => {
          reader.readEntries((entries) => resolve(entries));
        });
        for (const subEntry of subEntries) {
          await processEntry(subEntry, path + entry.name + "/");
        }
      }
    };

    for (const entry of entries) {
      const isDirectory = entry.isDirectory;
      
      if (!isFolderUpload) {
        if (isDirectory) {
          continue;
        }
        await processEntry(entry, "");
      } else {
        if (!isDirectory) {
          continue;
        }
        await processEntry(entry, "");
      }
    }

    return files;
  };

  const dropzoneOptions = {
    maxFiles,
    noClick: isDisabled || isFolderUpload,
    noKeyboard: isDisabled || isFolderUpload,
    noDrag: isDisabled,
    ...(accept ? { accept } : {}),
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
    
    const files = Array.from(fileList);
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
            "aria-label": isFolderUpload ? "Folder upload area" : "File upload area",
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
        </div>
      )}
    </div>
  );
};

export default Dropzone;
