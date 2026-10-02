import type { TTranslation } from "../../../utils/common";
import type {
  OperationTokenUsage,
  TransactionSourceType,
  WalletOperationDto,
} from "../../store/PaymentStore";
import { AI_SEARCH, AI_TOOLS } from "../../constants";

export const isAiServiceName = (serviceName?: string) =>
  serviceName === AI_TOOLS || serviceName === AI_SEARCH;

export const hasTransactionSource = isAiServiceName;

const getSourceTypeLabel = (t: TTranslation, type: TransactionSourceType) => {
  switch (type) {
    case "Agent":
      return t("AIAgent");
    case "File":
      return t("File");
    case "Folder":
      return t("Folder");
    case "Room":
      return t("Room");
    case "Form":
      return t("FormSpaceTitle");
    default:
      return null;
  }
};

const getSourceLabelWithTitle = (
  t: TTranslation,
  type: TransactionSourceType,
  title: string,
) => {
  switch (type) {
    case "Agent":
      return t("AIAgentName", { AgentName: title });
    case "File":
      return t("TransactionSourceFile", { fileName: title });
    case "Folder":
      return t("TransactionSourceFolder", { folderName: title });
    case "Room":
      return t("TransactionSourceRoom", { roomName: title });
    case "Form":
      return t("TransactionSourceFormSpace", { formSpaceName: title });
    default:
      return title;
  }
};

export const getTransactionSourceLabel = (
  t: TTranslation,
  transaction: Pick<WalletOperationDto, "sourceType" | "sourceTitle">,
) => {
  const { sourceType, sourceTitle } = transaction;

  if (sourceType && sourceTitle) {
    return getSourceLabelWithTitle(t, sourceType, sourceTitle);
  }

  const typeLabel = sourceType ? getSourceTypeLabel(t, sourceType) : null;

  return typeLabel || sourceTitle || null;
};

export const TOKEN_USAGE_TOOLTIP_ID = "tokenUsageTooltip";

export const getCachedTokensPercent = (usage: OperationTokenUsage) => {
  if (usage.promptTokens <= 0 || usage.cachedTokens <= 0) return null;

  const percent = Math.floor((usage.cachedTokens / usage.promptTokens) * 100);

  return percent > 0 ? percent : null;
};

export const getTokenUsageSegments = (usage: OperationTokenUsage) => ({
  fromCache: usage.cachedTokens,
  notFromCache: Math.max(usage.promptTokens - usage.cachedTokens, 0),
  received: usage.completionTokens,
});

export const serializeTokenUsage = (usage: OperationTokenUsage) =>
  JSON.stringify(usage);

export const parseTokenUsage = (
  content: string | null,
): OperationTokenUsage | null =>
  content ? (JSON.parse(content) as OperationTokenUsage) : null;
