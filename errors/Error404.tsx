"use client";

import { useCommonTranslation, getTranslationReady } from "../utils/i18n";
import ErrorContainer from "../components/error-container/ErrorContainer";

const Error404 = () => {
  const t = useCommonTranslation();
  const ready = getTranslationReady();

  return ready && <ErrorContainer headerText={t("Error404Text")} />;
};

export default Error404;
