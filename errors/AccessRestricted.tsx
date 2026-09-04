import { useEffect } from "react";
import { useCommonTranslation, getTranslationReady } from "../utils/i18n";
import ErrorContainer from "../components/error-container/ErrorContainer";
import styles from "./Errors.module.scss";

export const AccessRestricted = () => {
  const t = useCommonTranslation();
  const ready = getTranslationReady();

  useEffect(() => {
    window.history.replaceState(null, "");
  }, []);

  return (
    ready && (
      <div className={styles.accessRestrictedWrapper}>
        <ErrorContainer
          headerText={t("AccessDenied")}
          bodyText={t("PortalRestriction")}
        />
      </div>
    )
  );
};
