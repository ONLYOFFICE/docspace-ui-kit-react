import { observer } from "mobx-react";

import { Text } from "../../../components/text";
import { Link } from "../../../components/link";
import { useCommonTranslation } from "../../../utils/i18n";

import { usePaymentStore } from "../../store/PaymentStoreProvider";
import { useServicesStore } from "../../store/ServicesStoreProvider";
import { formatCompactNumber, getCurrencySymbol } from "../../utils/common";
import { AI_TOOLS } from "../../constants";

import styles from "../Overview.module.scss";

type ActiveAddonsProps = {
  onManageAddons?: () => void;
};

const ActiveAddons = ({ onManageAddons }: ActiveAddonsProps) => {
  const t = useCommonTranslation();
  const store = usePaymentStore();
  const { walletCodeCurrency, formatWalletCurrency, activeServices, language } =
    store;
  const { serviceUsage } = useServicesStore();

  const usageForService = (service: string) =>
    serviceUsage.find(
      (u) =>
        u.service === service ||
        (!!u.service &&
          (service.includes(u.service) || u.service.includes(service))),
    );

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <Text fontSize="14px" fontWeight={700}>
          {t("ActiveAddons")}
        </Text>
        {onManageAddons ? (
          <Link
            onClick={onManageAddons}
            textDecoration="underline"
            color="accent"
            fontWeight={600}
            dataTestId="overview_manage_addons_link"
          >
            {t("Manage")}
          </Link>
        ) : null}
      </div>

      <Text fontSize="18px" fontWeight={700} className={styles.cardValue}>
        {activeServices.length}
      </Text>

      {activeServices.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyContent}>
            <Text
              fontSize="12px"
              fontWeight={600}
              className={styles.mutedTitle}
            >
              {t("NoActiveAddons")}
            </Text>
            <Text fontSize="12px" className={styles.mutedTitle}>
              {t("NoActiveAddonsDesc")}
            </Text>
          </div>
        </div>
      ) : (
        <div className={styles.addonsBody}>
          <div className={styles.addonsColumns}>
            <Text fontSize="12px" fontWeight={600}>
              {t("Addon")}
            </Text>
            <Text fontSize="12px" fontWeight={600}>
              {t("UsedLimits")}
            </Text>
          </div>

          <div className={styles.addonsList}>
            {activeServices.map((item) => {
              const usage = usageForService(item.service);
              const isCurrencyUsage = item.service === AI_TOOLS;
              const currency = usage?.currency || walletCodeCurrency;

              const unitLabel = isCurrencyUsage
                ? getCurrencySymbol(currency, language)
                : item.serviceUnit;

              const usedValue = isCurrencyUsage
                ? (usage?.totalAmount ?? 0)
                : (item.used ?? usage?.totalQuantity ?? 0);

              const usedLabel = isCurrencyUsage
                ? formatWalletCurrency(usedValue, 2, currency)
                : formatCompactNumber(usedValue);

              const hasLimit = item.limit > 0;
              const percent = hasLimit
                ? Math.min(100, (usedValue / item.limit) * 100)
                : 0;

              return (
                <div className={styles.addonRow} key={item.service}>
                  <div className={styles.addonRowMain}>
                    <Text
                      fontSize="14px"
                      fontWeight={600}
                      truncate
                      className={styles.addonName}
                    >
                      {item.title}
                      <span className={styles.addonMuted}>, {unitLabel}</span>
                    </Text>
                    <Text
                      fontSize="13px"
                      fontWeight={600}
                      className={styles.addonUsage}
                    >
                      {usedLabel}
                      <span className={styles.addonMuted}>
                        {" / "}
                        {hasLimit ? formatCompactNumber(item.limit) : "—"}
                      </span>
                    </Text>
                  </div>
                  {hasLimit ? (
                    <div className={styles.addonBar}>
                      <div
                        className={styles.addonBarFill}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default observer(ActiveAddons);

