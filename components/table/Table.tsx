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

import { useRef } from "react";

import { TableContainer } from "./table-container";
import { TableHeader } from "./table-header";
import { TableBody } from "./table-body";
import type { TableProps } from "./Table.types";

export function Table({
  // shared
  columnStorageName,
  columnInfoPanelStorageName,
  useReactWindow,
  infoPanelVisible,
  isIndexEditingMode = false,
  // header
  columns,
  sectionWidth,
  showSettings,
  sortBy,
  sorted,
  sortingVisible,
  settingsTitle,
  tagRef,
  withoutWideColumn,
  resetColumnsSize,
  isLengthenHeader,
  setHideColumns,
  onHeaderClick,
  headerStyle,
  // body
  fetchMoreFiles,
  filesLength,
  hasMoreFiles,
  itemCount,
  itemHeight,
  onScroll,
  children,
  // container
  className,
  noSelect,
}: TableProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <TableContainer
      forwardedRef={containerRef}
      useReactWindow={useReactWindow}
      noSelect={noSelect}
      className={className}
    >
      <TableHeader
        containerRef={containerRef}
        columns={columns}
        columnStorageName={columnStorageName}
        columnInfoPanelStorageName={columnInfoPanelStorageName}
        useReactWindow={useReactWindow}
        infoPanelVisible={infoPanelVisible}
        isIndexEditingMode={isIndexEditingMode}
        sectionWidth={sectionWidth}
        showSettings={showSettings}
        sortBy={sortBy}
        sorted={sorted}
        sortingVisible={sortingVisible}
        settingsTitle={settingsTitle}
        tagRef={tagRef}
        withoutWideColumn={withoutWideColumn}
        resetColumnsSize={resetColumnsSize}
        isLengthenHeader={isLengthenHeader}
        setHideColumns={setHideColumns}
        onClick={onHeaderClick}
        style={headerStyle}
      />
      <TableBody
        columnStorageName={columnStorageName}
        columnInfoPanelStorageName={columnInfoPanelStorageName}
        useReactWindow={useReactWindow}
        infoPanelVisible={infoPanelVisible}
        isIndexEditingMode={isIndexEditingMode}
        fetchMoreFiles={fetchMoreFiles}
        filesLength={filesLength}
        hasMoreFiles={hasMoreFiles}
        itemCount={itemCount}
        itemHeight={itemHeight}
        onScroll={onScroll}
      >
        {children}
      </TableBody>
    </TableContainer>
  );
}

