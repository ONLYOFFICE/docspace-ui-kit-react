import type { TTranslation } from "../../utils/common";
import type { TServiceUsage } from "../types";
import {
  ADMIN,
  AI_TOOLS,
  BACKUP_SERVICE,
  DISK_STORAGE,
  MANAGER,
  STORAGE_ENUM,
} from "../constants";
import { isDocsConnectServiceName } from "./docs-connect";
import { formatCompactNumber } from "./common";

/**
 * Localized per-unit price label for a service, e.g. "$12.00/user". The unit
 * word is translated per service so each language localizes it correctly.
 * Returns an empty string for services without a defined unit rate.
 */
export const getServiceUnitRate = (
  t: TTranslation,
  service: string,
  price: string,
): string => {
  if (isDocsConnectServiceName(service))
    return t("Common:SpendRatePerUser", { price });

  switch (service) {
    case ADMIN:
    case MANAGER:
      return t("Common:SpendRatePerAdmin", { price });
    case DISK_STORAGE:
    case STORAGE_ENUM:
      return t("Common:SpendRatePerGB", { price });
    default:
      return "";
  }
};

/**
 * Human-readable usage summary for a single service, e.g. "Admins: 50",
 * "Tokens: 14.28M" or "Billed backups: 18".
 */
export const getServiceUsageSubLabel = (
  t: TTranslation,
  item: TServiceUsage,
  language?: string,
): string => {
  if (item.service === BACKUP_SERVICE)
    return t("Common:BilledBackups", { count: item.totalQuantity });

  if (item.service === AI_TOOLS)
    return t("Common:UnitCount", {
      unit: item.serviceUnit,
      count: formatCompactNumber(item.totalQuantity, language),
    });

  if (!item.serviceUnit) return "—";

  return t("Common:UnitCount", {
    unit: item.serviceUnit,
    count: item.totalQuantity,
  });
};
