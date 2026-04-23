import React, { useCallback } from "react";

import { TableCell, TableRow } from "../../../../../../../components/table";
import { Text } from "../../../../../../../components/text";
import { ToggleButton } from "../../../../../../../components/toggle-button";

import styles from "./ModelSettingsTable.module.scss";

type ModelSettingsRowProps = {
  modelId: string;
  image: string;
  title: string;
  isDisabled: boolean;
  provider?: string;
  inputPrice: string;
  outputPrice?: string;
  enabled: boolean;
  isUpdating: boolean;
  onToggle: (modelId: string, enabled: boolean) => Promise<void>;
  tooltipId?: string;
};

const ModelSettingsRow: React.FC<ModelSettingsRowProps> = ({
  modelId,
  title,
  provider,
  inputPrice,
  outputPrice,
  enabled,
  isUpdating,
  onToggle,
  image,
  isDisabled,
  tooltipId,
}) => {
  const onChange = useCallback(() => {
    void onToggle(modelId, !enabled);
  }, [enabled, modelId, onToggle]);

  return (
    <TableRow>
      <TableCell>
        <div className={styles.modelCell}>
          <div className={styles.modelTitleRow}>
            <div className={styles.modelIconPlaceholder}>
              <div
                // biome-ignore lint/security/noDangerouslySetInnerHtml: TODO fix
                dangerouslySetInnerHTML={{ __html: image }}
                className={styles.iconsContainer}
              />
            </div>
            <Text
              fontSize="12px"
              fontWeight={600}
              className={styles.modelTitle}
            >
              {title}
            </Text>
            {provider ? (
              <Text
                fontSize="12px"
                fontWeight={400}
                as="span"
                className={styles.modelProvider}
              >
                ({provider})
              </Text>
            ) : null}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Text fontSize="12px" fontWeight={600} className={styles.priceCell}>
          {inputPrice}
        </Text>
      </TableCell>
      <TableCell>
        <Text fontSize="12px" fontWeight={600} className={styles.priceCell}>
          {outputPrice ?? "—"}
        </Text>
      </TableCell>
      <TableCell>
        <div className={styles.toggleCell}>
          <div
            className={styles.toggleWrapper}
            {...(isDisabled && tooltipId
              ? { "data-tooltip-id": tooltipId }
              : {})}
          >
            <ToggleButton
              isChecked={enabled}
              onChange={onChange}
              isDisabled={isDisabled || isUpdating}
              dataTestId={`ai_model_toggle_${modelId}`}
            />
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ModelSettingsRow;
