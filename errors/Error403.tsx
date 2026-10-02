import { useCommonTranslation } from "../utils/i18n";
import ErrorContainer from "../components/error-container/ErrorContainer";

export const Error403 = () => {
  const t = useCommonTranslation();
  return <ErrorContainer headerText={t("Error403Text")} />;
};
