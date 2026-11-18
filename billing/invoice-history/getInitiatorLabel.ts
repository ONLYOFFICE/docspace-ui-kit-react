import type { TInvoiceInitiator } from "../types";

type TTranslate = (key: string) => string;

export const getInitiatorLabel = (
  t: TTranslate,
  initiator: TInvoiceInitiator | null,
  withTopUp = true,
) => {
  if (initiator === "Manual") return withTopUp ? t("ManualTopUp") : t("Manual");
  if (initiator === "Automatic")
    return withTopUp ? t("AutomaticTopUp") : t("Automatic");
  return "";
};
