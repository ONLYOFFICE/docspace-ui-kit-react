import React from "react";

import { Button, ButtonSize } from "../../../../components/button";
import { Text } from "../../../../components/text";
import { useCommonTranslation } from "../../../../utils/i18n";

import styles from "../styles/ServiceLimits.module.scss";

type LimitActionsProps = {
  canSave: boolean;
  isDirty: boolean;
  isSaving: boolean;
  onSave: () => void;
  onCancel: () => void;
  testId: string;
};

const LimitActions = ({
  canSave,
  isDirty,
  isSaving,
  onSave,
  onCancel,
  testId,
}: LimitActionsProps) => {
  const t = useCommonTranslation();

  return (
    <div className={styles.actions}>
      <Button
        label={t("SaveButton")}
        size={ButtonSize.small}
        primary
        isDisabled={!canSave}
        isLoading={isSaving}
        onClick={onSave}
        testId={`${testId}_save_button`}
      />
      <Button
        label={t("CancelButton")}
        size={ButtonSize.small}
        isDisabled={!isDirty || isSaving}
        onClick={onCancel}
        testId={`${testId}_cancel_button`}
      />
      {isDirty ? (
        <Text
          className={styles.reminder}
          fontSize="12px"
          fontWeight={600}
          aria-live="polite"
          dataTestId={`${testId}_reminder`}
        >
          {t("YouHaveUnsavedChanges")}
        </Text>
      ) : null}
    </div>
  );
};

export default LimitActions;
