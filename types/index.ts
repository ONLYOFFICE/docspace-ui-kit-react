import type {
  EmployeeFullDto,
  FileDtoInteger,
  GroupDto,
} from "@onlyoffice/docspace-api-sdk";

export type { EmployeeFullDto, FileDtoInteger, GroupDto };

import type {
  ShareAccessRights,
  EmployeeStatus,
  EmployeeActivationStatus,
  ThemeKeys,
  FileStatus,
  FileType,
  FolderType,
  ShareRights,
  FileFillingFormStatus,
  VectorizationStatus,
  RoomsType,
} from "../enums";
import type { TooltipRefProps } from "react-tooltip";

export type TGetIcon = (
  size: number,
  fileExst: string,
) => React.FC<React.SVGProps<SVGSVGElement>> | null | string;

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
  StartFilling?: boolean;
  ResetFilling?: boolean;
  EditForm: boolean;
  Comment: boolean;
  CreateRoomFrom: boolean;
  CopyLink: boolean;
  Embed: boolean;
  Vectorization: boolean;
  AskAi?: boolean;
  UpdateXlsx?: boolean;
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
  UpdateXlsx?: boolean;
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

export type ValueOf<T> = T[keyof T];

export type TViewAs =
  | "tile"
  | "table"
  | "row"
  | "settings"
  | "profile"
  | "tileDynamicHeight";

declare global {
  interface Window {
    timezone: string;
    __systemTooltipRef?: React.RefObject<TooltipRefProps | null>;
    i18n?: {
      t?: (key: string, options?: Record<string, string | number>) => string;
      inLoad: { url: string; callbacks: Function[] }[];
      loaded: Record<
        string,
        { data: Record<string, string>; namespaces: string }
      >;
      instance?: import("i18next").i18n;
    };
    AscDesktopEditor?: {
      execCommand: (key: string, value: string) => void;
      cloudCryptoCommand: (
        key: string,
        value: unknown,
        callback: unknown,
      ) => void;
      getCloudKeys?: (domain: string) => Array<{ id: string }>;
      getViewportSettings?: () => {
        widgetType: "window" | "tab";
        captionHeight: number;
      };
      onViewportSettingsChanged?: VoidFunction;
      attachEvent?: (listener: string, callback: VoidFunction) => void;
    };
    RendererProcessVariable?: {
      theme?: { id: string; system: string; type: string; addlocal: string };
    };
    DocSpace: {
      navigate: (path: string, state?: { [key: string]: unknown }) => void;
      location: Location & { state: unknown };
      displayFileExtension?: boolean;
    };
    logs: {
      socket: string[];
    };
  }
}
export type TShareSettings = {
  ExternalLink?: number;
  PrimaryExternalLink?: number;
};

export type TFileViewAccessibility = {
  CanConvert: boolean;
  CoAuhtoring: boolean;
  ImageView: boolean;
  MediaView: boolean;
  MustConvert: boolean;
  WebComment: boolean;
  WebCustomFilterEditing: boolean;
  WebEdit: boolean;
  WebRestrictedEditing: boolean;
  WebReview: boolean;
  WebView: boolean;
};

export type TShareRightsType =
  | "ExternalLink"
  | "Group"
  | "PrimaryExternalLink"
  | "User";

export type TAvailableShareRights = Partial<
  Record<TShareRightsType, ShareRights[]>
>;

type TDimensions = {
  width: number;
  height: number;
};

export type TFile = {
  isFile?: boolean;
  access: ShareAccessRights;
  canShare: boolean;
  comment: string;
  contentLength: string;
  created: string;
  createdBy: TCreatedBy;
  denyDownload?: boolean;
  denySharing?: boolean;
  fileExst: string;
  fileStatus: FileStatus;
  fileType: FileType;
  folderId: number;
  id: number;
  parentRoomType?: FolderType;
  shareSettings?: TShareSettings;
  mute: boolean;
  parentShared?: boolean;
  pureContentLength: number;
  rootFolderId: number;
  rootFolderType: FolderType;
  security: TFileSecurity;
  shared: boolean;
  thumbnailStatus: number;
  title: string;
  updated: string;
  updatedBy: TCreatedBy;
  sharedBy?: TCreatedBy;
  ownedBy?: TCreatedBy;
  version: number;
  versionGroup: number;
  viewAccessibility: TFileViewAccessibility;
  viewUrl: string;
  webUrl: string;
  shortWebUrl: string;
  availableShareRights?: TAvailableShareRights;
  providerId?: number;
  providerKey?: string;
  providerItem?: boolean;
  thumbnailUrl?: string;
  expired?: string;
  isForm?: boolean;
  isFolder?: boolean;
  formFillingStatus?: FileFillingFormStatus;
  startFilling?: boolean;
  fileEntryType: number;
  hasDraft?: boolean;
  order?: string;
  locked?: boolean;
  lockedBy?: string;
  customFilterEnabled?: boolean;
  customFilterEnabledBy?: string;
  originId?: number;
  originRoomId?: number;
  originRoomTitle?: string;
  originTitle?: string;
  requestToken?: string;
  isFavorite?: boolean;
  vectorizationStatus?: VectorizationStatus;
  expirationDate?: string;
  sharedForUser?: boolean;
  external?: boolean;
  isLinkExpired?: boolean;
  dimensions?: TDimensions;
  editingBy?: Record<string, string>;
  activeEditors?: Record<string, string>;
  isFillingPreparing?: boolean;
  resultsFolderId?: number;
  externalDbTableName?: string;
};

export type TPathParts = {
  id: number;
  title: string;
  roomType?: RoomsType;
  folderType?: FolderType;
};

export type TFolder = {
  parentId: number;
  filesCount: number;
  foldersCount: number;
  new: number;
  mute: boolean;
  pinned: boolean;
  private: boolean;
  id: number;
  rootFolderId: number;
  canShare: boolean;
  security: TFolderSecurity;
  title: string;
  access: ShareAccessRights;
  shared: boolean;
  created: string;
  createdBy: TCreatedBy;
  updated: string;
  updatedBy: TCreatedBy;
  sharedBy?: TCreatedBy;
  ownedBy?: TCreatedBy;
  rootFolderType: FolderType;
  isArchive?: boolean;
  roomType?: RoomsType;
  path?: TPathParts[];
  type?: FolderType;
  isFolder?: boolean;
  indexing: boolean;
  denyDownload: boolean;
  fileEntryType: number;
  parentShared?: boolean;
  parentRoomType?: FolderType;
  order?: string;
  isRoom?: boolean;
  rootRoomType?: RoomsType;
  shareSettings?: TShareSettings;
  availableShareRights?: TAvailableShareRights;
  isFavorite?: boolean;
  expirationDate?: string;
  sharedForUser?: boolean;
  isLinkExpired?: boolean;
  external?: boolean;
  originalFormId?: number;
};

export type TSortOrder = "descending" | "ascending";

export type TSortBy =
  | "DateAndTime"
  | "DateAndTimeCreation"
  | "Tags"
  | "Type"
  | "AZ"
  | "Author"
  | "roomType"
  | "usedspace"
  | "Size";
