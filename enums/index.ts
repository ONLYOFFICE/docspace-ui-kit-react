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

import {
  SortedByType as SdkSortedByType,
  DateToAutoCleanUp as SdkDateToAutoCleanUp,
  FilesSettingsDtoDefaultSharingAccessRightsEnum as SdkFilesSettingsDtoDefaultSharingAccessRightsEnum,
} from "@onlyoffice/docspace-api-sdk";

export {
  SdkSortedByType,
  SdkDateToAutoCleanUp,
  SdkFilesSettingsDtoDefaultSharingAccessRightsEnum,
};

export * from "./ai";

export enum ShareAccessRights {
  None = 0,
  FullAccess = 1,
  ReadOnly = 2,
  DenyAccess = 3,
  Varies = 4,
  Review = 5,
  Comment = 6,
  FormFilling = 7,
  CustomFilter = 8,
  RoomManager = 9,
  Editing = 10,
  Collaborator = 11,
}

export enum ButtonKeys {
  enter = "Enter",
  numpadEnter = "NumpadEnter",
  esc = "Escape",
  tab = "Tab",
  space = "Space",
}

/**
 * Canonical mapping of numeric roomType codes used in WebSocket messages
 * (e.g. `s:modify-folder` payload field `roomType`).
 *
 * This enum is the single source of truth. When adding a new value,
 * notify the analytics team so they can update their event tracking.
 *
 * | Code | Name            |
 * |------|-----------------|
 * |  1   | FormRoom        |
 * |  2   | EditingRoom     |
 * |  5   | CustomRoom      |
 * |  6   | PublicRoom      |
 * |  8   | VirtualDataRoom |
 * |  9   | AIRoom          |
 */
export enum RoomsType {
  FormRoom = 1,
  // FillingFormsRoom = 1, // TODO: Restore when certs will be done
  EditingRoom = 2,
  // ReviewRoom = 3,   // TODO: Restore when certs will be done
  // ReadOnlyRoom = 4, // TODO: Restore when certs will be done
  CustomRoom = 5,
  PublicRoom = 6,
  VirtualDataRoom = 8,
  AIRoom = 9,
}

/**
 * Enum for employee status.
 * @readonly
 */
export enum EmployeeStatus {
  Active = 1,
  Disabled = 2,
  Pending = 4,
}

/**
 * Enum for employee type.
 * @readonly
 */
export enum EmployeeType {
  RoomAdmin = 1,
  Guest = 2,
  Admin = 3,
  User = 4,
  Owner = "owner",
}

/**
 * Enum for files selector filter.
 * @readonly
 */
export const enum FilesSelectorFilterTypes {
  DOCX = "DOCX",
  PPTX = "PPTX",
  PDF = "PDF",
  PDFForm = "PDFForm",
  IMG = "IMG",
  GZ = "GZ",
  DOCXF = "DOCXF",
  XLSX = "XLSX",
  ALL = "ALL",
  BackupOnly = "BackupOnly",
}

/**
 * Enum for file type.
 * @readonly
 */
export const enum FileType {
  Unknown = 0,
  Archive = 1,
  Video = 2,
  Audio = 3,
  Image = 4,
  Spreadsheet = 5,
  Presentation = 6,
  Document = 7,
  OFormTemplate = 8,
  OForm = 9,
  PDF = 10,
  Diagram = 11,
}

/**
 * Enum for root folders type.
 * @readonly
 */
export const enum FolderType {
  DEFAULT = 0,
  COMMON = 1,
  BUNCH = 2,
  TRASH = 3,
  USER = 5,
  SHARE = 6,
  Projects = 8,
  Favorites = 10,
  Recent = 11,
  Templates = 12,
  Privacy = 13,
  Rooms = 14,
  FormRoom = 15,
  EditingRoom = 16,
  ReviewRoom = 17,
  ReadOnlyRoom = 18,
  CustomRoom = 19,
  Archive = 20,
  PublicRoom = 22,
  Done = 25,
  InProgress = 26,
  SubFolderDone = 27,
  SubFolderInProgress = 28,
  VirtualDataRoom = 29,
  RoomTemplates = 30,
  AIAgent = 31,
  Knowledge = 32,
  ResultStorage = 33,
  AIAgents = 34,
  DefaultTemplates = 35,
}

export enum GuidanceRefKey {
  Pdf = "pdf",
  Ready = "ready",
  Share = "share",
  Uploading = "uploading",
  MainButton = "mainButton",
}

/**
 * Enum for device type.
 * @readonly
 */
export enum DeviceType {
  mobile = "mobile",
  tablet = "tablet",
  desktop = "desktop",
}

/**
 * Enum for white label logo type.
 * @readonly
 */
export const enum WhiteLabelLogoType {
  LightSmall = 1,
  LoginPage = 2,
  Favicon = 3,
  DocsEditor = 4,
  DocsEditorEmbed = 5,
  LeftMenu = 6,
  AboutPage = 7,
  Notification = 8,
  SpreadsheetEditor = 9,
  SpreadsheetEditorEmbed = 10,
  PresentationEditor = 11,
  PresentationEditorEmbed = 12,
  PdfEditor = 13,
  PdfEditorEmbed = 14,
  DiagramEditor = 15,
  DiagramEditorEmbed = 16,
}

/**
 * Enum for employee activation status.
 * @readonly
 */
export const enum EmployeeActivationStatus {
  NotActivated = 0,
  Activated = 1,
  Pending = 2,
  AutoGenerated = 4,
}

/**
 * Enum for theme keys.
 * @readonly
 */
export const enum ThemeKeys {
  Base = "0",
  BaseStr = "Base",
  Dark = "1",
  DarkStr = "Dark",
  System = "2",
  SystemStr = "System",
}

export const enum ParseErrorTypes {
  None = 0,
  EmptyRecipients = 1,
  IncorrectEmail = 2,
}

export const enum PortalFeaturesLimitations {
  Limitless = -1,
  Unavailable = 0,
}

export const enum ErrorKeys {
  LocalDomain = "LocalDomain",
  IncorrectDomain = "IncorrectDomain",
  DomainIpAddress = "DomainIpAddress",
  PunycodeDomain = "PunycodeDomain",
  PunycodeLocalPart = "PunycodeLocalPart",
  IncorrectLocalPart = "IncorrectLocalPart",
  SpacesInLocalPart = "SpacesInLocalPart",
  MaxLengthExceeded = "MaxLengthExceeded",
  IncorrectEmail = "IncorrectEmail",
  ManyEmails = "ManyEmails",
  EmptyEmail = "EmptyEmail",
}

/**
 * Enum for sort by field name
 * @readonly
 */
export const enum SortByFieldName {
  Name = "AZ",
  ModifiedDate = "DateAndTime",
  CreationDate = "DateAndTimeCreation",
  Author = "Author",
  Size = "Size",
  Type = "Type",
  Location = "Location",
  Tags = "Tags",
  RoomType = "roomType",
  LastOpened = "LastOpened",
  UsedSpace = "usedspace",
}

/**
 * Enum for file status.
 * @readonly
 */
export const enum FileStatus {
  None = 0,
  IsEditing = 1,
  IsNew = 2,
  IsConverting = 4,
  IsOriginal = 8,
  IsEditingAlone = 16,
  IsFavorite = 32,
  IsTemplate = 64,
  IsFillFormDraft = 128,
}

export const enum ShareRights {
  None = "None",
  ReadWrite = "ReadWrite",
  Read = "Read",
  Restrict = "Restrict",
  Varies = "Varies",
  Review = "Review",
  Comment = "Comment",
  FillForms = "FillForms",
  CustomFilter = "CustomFilter",
  RoomManager = "RoomManager",
  Editing = "Editing",
  ContentCreator = "ContentCreator",
}

export enum FileFillingFormStatus {
  None = 0,
  Draft = 1,
  YourTurn = 2,
  InProgress = 3,
  Completed = 4,
  Stopped = 5,
}

export enum VectorizationStatus {
  InProgress,
  Completed,
  Failed,
}

export const enum VDRIndexingAction {
  HigherIndex = "HigherIndex",
  LowerIndex = "LowerIndex",
  MoveIndex = "MoveIndex",
}

export const enum FilterGroups {
  filterType = "filter-filterType",
  filterAuthor = "filter-author",
  filterSharedBy = "filter-sharedBy",
  filterFolders = "filter-folders",
  filterRoom = "filter-room",
  filterContent = "filter-withContent",
  filterQuota = "filter-quota",
  roomFilterProviderType = "filter-provider-type",
  roomFilterType = "filter-type",
  roomFilterSubject = "filter-subject",
  roomFilterOwner = "filter-owner",
  roomFilterTags = "filter-tags",
  roomFilterFolders = "filter-withSubfolders",
  roomFilterContent = "filter-content",
  filterGroup = "filter-group",
  groupsFilterMember = "filter-group-member",
  groupsFilterManager = "filter-group-manager",
  filterLoginType = "filter-login-type",
  filterStatus = "filter-status",
  filterAccount = "filter-account",
  filterOther = "filter-other",
  filterInviter = "filter-inviter",
  filterLocation = "filter-location",
}

export const enum FilterKeys {
  withSubfolders = "withSubfolders",
  excludeSubfolders = "excludeSubfolders",
  withContent = "withContent",
  me = "me",
  other = "other",
  user = "user",
  withoutGroup = "withoutGroup",
  selectedGroup = "selectedGroup",
  byManager = "byManager",
  customQuota = "2",
  defaultQuota = "1",
}

export const enum FilterSelectorTypes {
  people = "people-selector",
  rooms = "rooms-selector",
  groups = "groups-selector",
}

export const enum Events {
  CREATE = "create",
  RENAME = "rename",
  ROOM_CREATE = "create_room",
  ROOM_EDIT = "edit_room",
  CHANGE_COLUMN = "change_column",
}

export enum ToolsPermission {
  Allow,
  AlwaysAllow,
  Deny,
}

export enum DistributedTaskStatus {
  Created,
  Running,
  Completed,
  Canceled,
  Failed,
}

/**
 * Enum for GTM dataLayer analytics events.
 * @readonly
 */
export enum AnalyticsEvents {
  PortalCreated = "portal_created",
  RoomCreated = "room_created",
  RoomDeleted = "room_deleted",
  RoomShared = "room_shared",
  RoomArchived = "room_archived",
  AgentCreated = "agent_created",
  AgentDeleted = "agent_deleted",
  FileCreated = "file_created",
  FileUploaded = "file_uploaded",
  FileDownloaded = "file_downloaded",
  FileShared = "file_shared",
  FileDeleted = "file_deleted",
  UserInvited = "user_invited",
  AiProviderAdded = "ai_provider_added",
  WalletTopUp = "wallet_topup",
  AddPaymentMethod = "add_payment_method",
  Purchase = "purchase",
  LimitReached = "limit_reached",
}
