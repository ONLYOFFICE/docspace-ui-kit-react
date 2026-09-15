import type { TTranslation } from "../../../utils/common";
import type {
  TransactionSourceType,
  WalletOperationDto,
} from "../../store/PaymentStore";

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
