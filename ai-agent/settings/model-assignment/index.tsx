import { useTranslation } from "react-i18next";

import { ModelAssignmentPage } from "@onlyoffice/ai-chat";

import { Heading } from "../../../components/heading";
import { Text } from "../../../components/text";

import styles from "./ModelAssignment.module.scss";

const ModelAssignment = () => {
  const { t } = useTranslation(["Common"]);

  return (
    <ModelAssignmentPage
      hideHeader
      noPadding
      className={styles.modelAssignment}
      // The field sits right under the "Default AI model" heading, so its own
      // caption is redundant. `FieldContainer` requires a `header`, and the
      // page falls back to its own label only on `undefined` — an empty
      // string is the supported way to render the row without a caption.
      defaultModelLabel=""
      defaultSetupHeader={
        <>
          <Heading
            level={3}
            fontWeight={700}
            fontSize="16px"
            lineHeight="22px"
            className={styles.defaultSetupTitle}
          >
            {t("Common:DefaultAISetupTitle")}
          </Heading>
          <Text lineHeight="20px" className={styles.defaultSetupDescription}>
            {t("Common:DefaultAISetupDescription")}
          </Text>
        </>
      }
    />
  );
};

export default ModelAssignment;
