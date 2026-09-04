import CardIconUrl from "../../../assets/icons/16/card.react.svg";
import CheckReactSvg from "../../../assets/check.edit.react.svg";
import styles from "./CardInformation.module.scss";
import classNames from "classnames";
import { Text } from "../../../components/text";
import AttentionReactSvg from "../../../assets/plugin.incompatible.react.svg";
import { useCommonTranslation } from "../../../utils/i18n";
import { observer } from "mobx-react";
import { usePaymentStore } from "../../store/PaymentStoreProvider";

type CardInfoComponentProps = {
  scale?: boolean;
  withoutMargin?: boolean;
};

const CardInfoComponent = ({
  scale,
  withoutMargin,
}: CardInfoComponentProps) => {
  const store = usePaymentStore();
  const { walletCustomerStatusNotActive } = store.tariff;
  const t = useCommonTranslation();

  return (
    <div
      className={classNames(styles.cardRow, {
        [styles.warningColor]: walletCustomerStatusNotActive,
        [styles.scale]: scale,
        [styles.withoutMargin]: withoutMargin,
      })}
    >
      <div className={styles.iconButton}>
        <CardIconUrl />
      </div>

      <div className={styles.cardContent}>
        <Text fontSize="14px" fontWeight={600} lineHeight="16px">
          {walletCustomerStatusNotActive ? t("Unlinked") : t("Linked")}
        </Text>
      </div>

      <div
        className={classNames(styles.tickedWrapper, {
          [styles.warningColor]: walletCustomerStatusNotActive,
        })}
      >
        {walletCustomerStatusNotActive ? (
          <AttentionReactSvg />
        ) : (
          <CheckReactSvg />
        )}
      </div>
    </div>
  );
};

export const CardInformation = observer(CardInfoComponent);

