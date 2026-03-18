/*
 * (c) Copyright Ascensio System SIA 2009-2026
 *
 * This program is a free software product.
 * You can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
 * Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
 * to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
 * any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
 * of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
 * the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions of the Program must
 * display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product logo when
 * distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
 * trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
 * content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
 * International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 */

import { ContentType, RoleType, ServerType, ChatReasoningEffort } from "../enums";
import { TCreatedBy } from "./index";

export type TToolCallResultSourceData = {
  title: string;
  text: string;
  fileId?: number;
  url?: string; // external page url
  relativeUrl?: string; // knowledge doc url
  faviconUrl?: string;
};

export type TToolCallResultSource = {
  data: TToolCallResultSourceData | TToolCallResultSourceData[];
  error?: string;
};

export type TToolCallContent = {
  type: ContentType.Tool;
  arguments: Record<string, unknown>;
  name: string;
  result?: Record<string, unknown> | TToolCallResultSource;
  callId?: string;
  mcpServerInfo?: {
    serverId: string;
    serverName: string;
    serverType: ServerType;
    icon: {
      icon48: string;
      icon32: string;
      icon24: string;
      icon16: string;
    };
  };
  managed?: boolean;
};

export type TContent =
  | {
      type: ContentType.Text;
      text: string;
    }
  | TToolCallContent
  | {
      type: ContentType.Files;
      id: number;
      title: string;
      extension: string;
    }
  | {
      type: ContentType.Images;
      id: number;
      url: string;
      fileType: number;
    };

export type TMessage = {
  role: RoleType;
  contents: TContent[];
  createdOn: string;
  id?: number;
};

export type TMultimodal = { image: { formats: string[] } };

export type TChat = {
  id: string;
  title: string;
  createdOn: string;
  modifiedOn: string;
  createdBy: TCreatedBy;
};

export type TAIConfig = {
  vectorizationEnabled: boolean;
  vectorizationNeedReset?: boolean;
  webSearchEnabled: boolean;
  webSearchNeedReset?: boolean;
  knowledgeSearchToolName: string;
  webSearchToolName: string;
  webCrawlingToolName: string;
  aiReady: boolean;
  aiReadyNeedReset?: boolean;
  embeddingModel: string;
  portalMcpServerId: string;

  generateDocxToolName?: string;
  generateFormToolName?: string;
  generatePresentationToolName?: string;

  modelAliases: Record<string, string>;
};

export type TMCPTool = {
  name: string;
  enabled: boolean;
};

export type TServer = {
  id: string;
  name: string;
  serverType: ServerType;
  description?: string;
  icon?: {
    icon48: string;
    icon32: string;
    icon24: string;
    icon16: string;
  };
  enabled?: boolean;
  connected?: boolean;
  headers: Record<string, string>;
  endpoint: string;
  authorizationEndpoint?: string;
  needReset?: boolean;
};

export type TAIRoomChatSettings = {
  prompt: string;
  providerId: number;
  modelId: string;
  internal: boolean;
  modelAlias?: string;
  multimodal?: TMultimodal;
  thinking?: boolean;
};

export interface UserChatSettingsDto {
  webSearchEnabled: boolean;
  reasoningEffort: ChatReasoningEffort | null;
}
