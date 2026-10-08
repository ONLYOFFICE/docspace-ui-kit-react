import { useCommonTranslation } from "../utils/i18n";
import ErrorContainer from "../components/error-container/ErrorContainer";

export const ErrorOfflineContainer = () => {
  const t = useCommonTranslation();
  return <ErrorContainer headerText={t("ErrorOfflineText")} />;
};
