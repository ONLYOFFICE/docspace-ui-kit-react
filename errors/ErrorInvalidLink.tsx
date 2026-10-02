import { useCommonTranslation, getTranslationReady } from "../utils/i18n";
import ErrorContainer from "../components/error-container/ErrorContainer";

export const ErrorInvalidLink = () => {
  const t = useCommonTranslation();
  const ready = getTranslationReady();

  return ready ? (
    <ErrorContainer
      headerText={t("InvalidLink")}
      bodyText={t("LinkDoesNotExist")}
    />
  ) : null;
};
