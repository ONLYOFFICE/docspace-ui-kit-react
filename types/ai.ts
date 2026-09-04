import {
  ContentType,
  RoleType,
  ServerType,
  ChatReasoningEffort,
} from "../enums";
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

  recommendedModelForForms?: string;
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


export type TChatPlaylistImage = {
  fileId: number;
  title: string;
  src: string;
};
