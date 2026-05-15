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
import classNames from "classnames";
import { TileContainerProps, TileItemProps } from "./TileContainer.types";

import styles from "./TileContainer.module.scss";
import { Heading, HeadingSize } from "../../heading";

export const TileContainer = ({
  children,
  useReactWindow,
  id = "tileContainer",
  className,
  infiniteGrid: InfiniteGrid,
  headingFolders,
  headingFiles,
  isDesc,
  style,
  noSelect,
}: TileContainerProps) => {
  const Rooms: React.ReactElement[] = [];
  const Folders: React.ReactElement[] = [];
  const Files: React.ReactElement[] = [];
  const Templates: React.ReactElement[] = [];

  React.Children.map(children, (item) => {
    if (
      !item ||
      !React.isValidElement<TileItemProps>(item) ||
      !item.props?.item
    )
      return null;

    const {
      isFolder,
      isRoom,
      isTemplate,
      fileExst,
      id: itemId,
    } = item.props.item;

    if ((isFolder || itemId === -1) && !fileExst && !isRoom) {
      Folders.push(
        <div
          className={classNames(
            "tile-item",
            styles.tileItemWrapper,
            styles.folder,
            "folder",
          )}
          key={itemId}
        >
          {item}
        </div>,
      );
    } else if (isTemplate) {
      Templates.push(
        <div
          className={classNames(
            "tile-item",
            styles.tileItemWrapper,
            styles.template,
            "template",
          )}
          key={itemId}
        >
          {item}
        </div>,
      );
    } else if (isRoom) {
      Rooms.push(
        <div
          className={classNames(
            "tile-item",
            styles.tileItemWrapper,
            styles.room,
            "room",
          )}
          key={itemId}
        >
          {item}
        </div>,
      );
    } else {
      Files.push(
        <div
          className={classNames(
            "tile-item",
            styles.tileItemWrapper,
            styles.file,
            "file",
          )}
          key={itemId}
        >
          {item}
        </div>,
      );
    }
  });

  const headingClassNames = classNames(styles.header, {
    [styles.isDesc]: isDesc,
  });

  const renderTile = (
    <>
      {Rooms.length > 0 ? (
        useReactWindow ? (
          Rooms
        ) : (
          <div className={classNames(styles.gridWrapper, styles.rooms)}>
            {Rooms}
          </div>
        )
      ) : null}

      {Templates.length > 0 ? (
        useReactWindow ? (
          Templates
        ) : (
          <div className={classNames(styles.gridWrapper, styles.templates)}>
            {Templates}
          </div>
        )
      ) : null}

      {Folders.length > 0 ? (
        <Heading
          size={HeadingSize.xsmall}
          id="folder-tile-heading"
          className={headingClassNames}
          data-type="header"
        >
          {headingFolders}
        </Heading>
      ) : null}
      {Folders.length > 0 ? (
        useReactWindow ? (
          Folders
        ) : (
          <div className={classNames(styles.gridWrapper, styles.folders)}>
            {Folders}
          </div>
        )
      ) : null}

      {Files.length > 0 ? (
        <Heading
          size={HeadingSize.xsmall}
          className={headingClassNames}
          data-type="header"
        >
          {headingFiles}
        </Heading>
      ) : null}
      {Files.length > 0 ? (
        useReactWindow ? (
          Files
        ) : (
          <div className={classNames(styles.gridWrapper, styles.files)}>
            {Files}
          </div>
        )
      ) : null}
    </>
  );

  const isRooms = Rooms.length > 0;
  const isTemplates = Templates.length > 0;

  return (
    <div
      className={classNames(className, styles.tileContainer, {
        [styles.noSelect]: noSelect,
      })}
      id={id}
      style={style}
    >
      {useReactWindow && InfiniteGrid ? (
        <InfiniteGrid isRooms={isRooms} isTemplates={isTemplates}>
          {renderTile}
        </InfiniteGrid>
      ) : (
        renderTile
      )}
    </div>
  );
};
