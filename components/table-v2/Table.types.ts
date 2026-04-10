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

export interface TTableColumn {
  /** Unique column key (used as id and localStorage key) */
  key: string;
  /** Column header label */
  title: string;
  /** Whether column is visible (default: true) */
  enable?: boolean;
  /** "Name" column — gets NAME_COLUMN_PERCENT width; only one per table */
  default?: boolean;
  /** Fixed px size (e.g. checkbox column); disables resize when set */
  defaultSize?: number;
  /** Pinned at minWidth; not redistributed during column distribution */
  isShort?: boolean;
  /** Minimum column width in pixels */
  minWidth?: number;
  /** Whether column is resizable (default: true when defaultSize is absent) */
  resizable?: boolean;
  /** Column cannot be toggled in settings panel */
  isDisabled?: boolean;
  /** Sort key passed to onClick handler */
  sortBy?: string;
  /** Called when sort header is clicked */
  onClick?: (sortBy: string, e: React.MouseEvent) => void;
  /** Called when the column header icon is clicked */
  onIconClick?: () => void;
  /** Called when column visibility is toggled in settings */
  onChange?: (key: string) => void;
  /** Header checkbox configuration */
  checkbox?: {
    value: boolean;
    isIndeterminate: boolean;
    onChange: (e?: React.ChangeEvent<HTMLInputElement>) => void;
  };
  /** Attach ref to this column header for dynamic width measurement */
  withTagRef?: boolean;
}

export interface TGroupMenuItem {
  label: string;
  disabled: boolean;
  onClick: (e: React.MouseEvent) => void;
  iconUrl: string;
  title: string;
  id: string;
  withDropDown?: boolean;
  options?: unknown[];
  isMobileView?: boolean;
  fixedDropdownStyles?: boolean;
}
