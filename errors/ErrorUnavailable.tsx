import { useCommonTranslation, getTranslationReady } from "../utils/i18n";
import ErrorContainer from "../components/error-container/ErrorContainer";
import styles from "./Errors.module.scss";

const ErrorUnavailable = () => {
  const t = useCommonTranslation();
  const ready = getTranslationReady();

  return (
    ready && (
      <div className={styles.errorUnavailableWrapper}>
        <ErrorContainer
          headerText={t("ErrorDeactivatedText")}
        />
      </div>
    )
  );
};

export default ErrorUnavailable;
