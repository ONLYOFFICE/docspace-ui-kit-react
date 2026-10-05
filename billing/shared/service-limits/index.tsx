import React, { useEffect } from "react";
import { observer } from "mobx-react";

import { Link, LinkTarget } from "../../../components/link";
import { Text } from "../../../components/text";
import { toastr } from "../../../components/toast";
import { useCommonTranslation } from "../../../utils/i18n";
import { useServiceLimitStore } from "../../store/ServiceLimitStoreProvider";

import PortalLimitSection from "./PortalLimitSection";
import ServiceLimitsLoader from "./sub-components/ServiceLimitsLoader";
import styles from "./styles/ServiceLimits.module.scss";

type ServiceLimitsProps = {
  serviceName: string;
  portalLimitDescription: string;
  helpUrl?: string;
  isDisabled?: boolean;
};

const ServiceLimits = ({
  serviceName,
  portalLimitDescription,
  helpUrl,
  isDisabled,
}: ServiceLimitsProps) => {
  const t = useCommonTranslation();
  const limitStore = useServiceLimitStore();
  const { isInit } = limitStore;

  useEffect(() => {
    const loadLimits = async () => {
      try {
        await limitStore.fetchAll(serviceName);
      } catch (error) {
        toastr.error(error as Error);
      }
    };

    loadLimits();
  }, [limitStore, serviceName]);

  if (!isInit) return <ServiceLimitsLoader />;

  return (
    <div className={styles.container} data-testid="service_limits">
      <Text className={styles.description}>
        {t("ServiceLimitsDescription")}
        {helpUrl ? (
          <Link
            className={styles.helpLink}
            href={helpUrl}
            target={LinkTarget.blank}
            fontSize="13px"
            fontWeight={600}
            color="accent"
            dataTestId="service_limits_help_link"
          >
            {t("HelpCenter")}
          </Link>
        ) : null}
      </Text>

      <PortalLimitSection
        description={portalLimitDescription}
        isDisabled={isDisabled}
      />
    </div>
  );
};

export default observer(ServiceLimits);
