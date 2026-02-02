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

import {
  ShareAccessRights,
  EmployeeStatus,
  EmployeeActivationStatus,
  ThemeKeys,
} from "../enums";

export type TDirectionX = "left" | "right";
export type TDirectionY = "bottom" | "top" | "both";

export type Nullable<T> = T | null;

export type ICover = {
  data: string;
  id: string;
};

export type TLogo = {
  cover?: ICover;
  original: string;
  large: string;
  medium: string;
  small: string;
  color?: string;
};

export type MergeTypes<T, MergedType> = Omit<T, keyof MergedType> & MergedType;

export type WithFlag<K extends string, V> =
  | ({ [P in K]: true } & V)
  | ({ [P in K]?: undefined } & Partial<Record<keyof V, undefined>>);

// File security type
export type TFileSecurity = {
  Convert: boolean;
  Copy: boolean;
  CustomFilter: boolean;
  Delete: boolean;
  Download: boolean;
  Duplicate: boolean;
  Edit: boolean;
  EditHistory: boolean;
  FillForms: boolean;
  Lock: boolean;
  Move: boolean;
  Read: boolean;
  ReadHistory: boolean;
  Rename: boolean;
  Review: boolean;
  SubmitToFormGallery: boolean;
  StopFilling?: boolean;
  ResetFilling?: boolean;
  EditForm: boolean;
  Comment: boolean;
  CreateRoomFrom: boolean;
  CopyLink: boolean;
  Embed: boolean;
  Vectorization: boolean;
  AskAi?: boolean;
};

// Folder security type
export type TFolderSecurity = {
  Read: boolean;
  Create: boolean;
  Delete: boolean;
  EditRoom: boolean;
  Rename: boolean;
  CopyTo: boolean;
  Copy: boolean;
  MoveTo: boolean;
  Move: boolean;
  Pin: boolean;
  Mute: boolean;
  EditAccess: boolean;
  Duplicate: boolean;
  Download: boolean;
  CopySharedLink: boolean;
  Reconnect: boolean;
  CreateRoomFrom: boolean;
  CopyLink: boolean;
  Embed: boolean;
  ChangeOwner: boolean;
  IndexExport: boolean;
};

// Room security type
export type TRoomSecurity = {
  ChangeOwner: boolean;
  CopyLink: boolean;
  CreateRoomFrom: boolean;
  Embed: boolean;
  IndexExport: boolean;
  Reconnect: boolean;
  Read: boolean;
  Create: boolean;
  Delete: boolean;
  EditRoom: boolean;
  Rename: boolean;
  CopyTo: boolean;
  Copy: boolean;
  MoveTo: boolean;
  Move: boolean;
  Pin: boolean;
  Mute: boolean;
  EditAccess: boolean;
  Duplicate: boolean;
  Download: boolean;
  CopySharedLink: boolean;
  UseChat: boolean;
};

// User group type
export type TUserGroup = {
  id: string;
  manager: string;
  name: string;
};

export type TCreatedBy = {
  avatarSmall: string;
  avatar?: string;
  avatarOriginal?: string;
  avatarMax?: string;
  avatarMedium?: string;
  displayName: string;
  hasAvatar: boolean;
  id: string;
  profileUrl: string;
  isAnonim?: boolean;
  templateAccess?: ShareAccessRights;
};

export type TUser = {
  access: number;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  status: EmployeeStatus;
  activationStatus: EmployeeActivationStatus;
  department: string;
  workFrom: string;
  avatarMax: string;
  avatarMedium: string;
  avatarOriginal: string;
  avatar: string;
  isAdmin: boolean;
  isRoomAdmin: boolean;
  isLDAP: boolean;
  listAdminModules: string[];
  isOwner: boolean;
  isVisitor: boolean;
  isCollaborator: boolean;
  mobilePhoneActivationStatus: number;
  isSSO: boolean;
  quotaLimit?: number;
  usedSpace?: number;
  id: string;
  displayName: string;
  avatarSmall: string;
  profileUrl: string;
  hasAvatar: boolean;
  theme?: ThemeKeys;
  mobilePhone?: string;
  cultureName?: string;
  groups?: TUserGroup[];
  shared?: boolean;
  loginEventId?: number;
  notes?: string;
  isCustomQuota?: string;
  title?: string;
  registrationDate?: string;
  createdBy?: TCreatedBy;
  hasPersonalFolder?: boolean;
  isAnonim: boolean;
  tfaAppEnabled?: boolean;
  sharedTo?: object;
};

/** Path object compatible with react-router */
export type PathObject = {
  pathname?: string;
  search?: string;
  hash?: string;
};

/** Route target - string path or path object */
export type To = string | PathObject;

export type LinkRouterProps = {
  id?: string;
  style?: React.CSSProperties;
  className?: string;
  to: To;
  state?: unknown;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  children?: React.ReactNode;
};
