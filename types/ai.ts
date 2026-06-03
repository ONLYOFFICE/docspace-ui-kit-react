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

export type TModelCapabilities = {
  vision: boolean;
  toolCalling: boolean;
  thinking: boolean;
};

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

  systemAiEnabled?: boolean;

  recomendedModelForForms?: string;
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
  capabilities?: TModelCapabilities;
};

export interface UserChatSettingsDto {
  webSearchEnabled: boolean;
  reasoningEffort: ChatReasoningEffort | null;
}
