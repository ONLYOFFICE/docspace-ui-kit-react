import classNames from "classnames";

import { Badge } from "../../../../../../components/badge";
import { useCommonTranslation } from "../../../../../../utils/i18n";

import type { WalletOperationDto } from "../../../../../store/PaymentStore";
import { BYOK_TOOLTIP_ID, serializeByokOperation } from "../../../utils";

import styles from "../ByokMark.module.scss";

type ByokMarkAnchorProps = {
  transaction: WalletOperationDto;
  className?: string;
};

export const ByokMarkAnchor = ({
  transaction,
  className,
}: ByokMarkAnchorProps) => {
  const t = useCommonTranslation();

  if (!transaction.byok) return null;

  return (
    <Badge
      className={classNames(styles.mark, className)}
      label={t("AIByok")}
      backgroundColor="var(--byok-mark-background)"
      color="var(--byok-mark-color)"
      fontSize="10px"
      fontWeight={700}
      borderRadius="9px"
      padding="1px 8px"
      maxWidth="none"
      noHover
      data-tooltip-id={BYOK_TOOLTIP_ID}
      data-tooltip-content={serializeByokOperation(transaction)}
      dataTestId="transaction_byok_mark"
    />
  );
};
