import React, { useRef } from "react";
import { observer } from "mobx-react";

import {
  TableBody,
  TableContainer,
} from "../../../../../../../components/table";
import { Text } from "../../../../../../../components/text";
import { Tooltip } from "../../../../../../../components/tooltip";
import { CommonTrans } from "../../../../../../../utils/i18n/CommonTrans";

import type { TAiToolsPrices } from "../../../../../../types";

import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import styles from "./ModelSettingsTable.module.scss";
import { Link, LinkTarget } from "../../../../../../../components";

import { useServicesStore } from "../../../../../../store/ServicesStoreProvider";
import { usePaymentStore } from "../../../../../../store/PaymentStoreProvider";
import { usePermissionTooltipText } from "../../../../../hooks/usePermissionTooltipText";

const PERMISSION_TOOLTIP_ID = "aiModelPermissionTooltip";

const TABLE_VERSION = "1";
const COLUMNS_SIZE = `aiModelsColumnsSize_ver-${TABLE_VERSION}`;
const INFO_PANEL_COLUMNS_SIZE = `infoPanelAiModelsColumnsSize_ver-${TABLE_VERSION}`;

type ModelSettingsTableViewProps = {
  sectionWidth: number;
  isDisabled: boolean;
};

const TableView = (props: ModelSettingsTableViewProps) => {
  const { sectionWidth, isDisabled } = props;

  const servicesStore = useServicesStore();
  const paymentStore = usePaymentStore();

  const permissionTooltipText = usePermissionTooltipText();

  const {
    aiToolsPrices,
    formatAiModelsCurrency,
    setAiModelAvailability,
    aiModelAvailabilityMap,
    aiModelAvailabilityUpdatingSet,
  } = servicesStore;

  const userId = paymentStore.userId;

  const models = aiToolsPrices?.chat ?? [];

  const onToggle = async (modelId: string, enabled: boolean) => {
    await setAiModelAvailability(modelId, enabled);
  };

  const ref = useRef<HTMLDivElement>(null);
  const columnStorageName = `${COLUMNS_SIZE}=${userId}`;
  const columnInfoPanelStorageName = `${INFO_PANEL_COLUMNS_SIZE}=${userId}`;

  return (
    <div className={styles.tableWrapper}>
      <Text className={styles.introText}>
        <CommonTrans
          i18nKey="AIModelsIntroduction"
          components={{
            1: (
              <Link
                fontWeight={600}
                fontSize="12px"
                textDecoration="underline"
                href="https://openrouter.ai/models"
                target={LinkTarget.blank}
              />
            ),
          }}
        />
      </Text>

      <TableContainer
        forwardedRef={ref as React.RefObject<HTMLDivElement>}
        useReactWindow={false}
        className={styles.tableContainer}
      >
        <TableHeader
          sectionWidth={sectionWidth}
          containerRef={ref as React.RefObject<HTMLDivElement>}
          columnStorageName={columnStorageName}
          columnInfoPanelStorageName={columnInfoPanelStorageName}
          itemHeight={48}
        />
        <TableBody
          useReactWindow
          columnStorageName={columnStorageName}
          columnInfoPanelStorageName={columnInfoPanelStorageName}
          itemHeight={48}
          filesLength={models.length}
          fetchMoreFiles={() => Promise.resolve()}
          hasMoreFiles={false}
          itemCount={models.length}
        >
          {models.map((m) => (
            <TableRow
              key={m.id}
              modelId={m.id}
              title={m.alias}
              provider={m.provider}
              inputPrice={formatAiModelsCurrency(m.price.prompt)}
              outputPrice={formatAiModelsCurrency(m.price.completion)}
              enabled={aiModelAvailabilityMap?.get(m.id) ?? true}
              isUpdating={aiModelAvailabilityUpdatingSet?.has(m.id) ?? false}
              onToggle={onToggle}
              image={m.image}
              isDisabled={isDisabled}
              tooltipId={PERMISSION_TOOLTIP_ID}
            />
          ))}
        </TableBody>
      </TableContainer>

      {isDisabled ? (
        <Tooltip
          id={PERMISSION_TOOLTIP_ID}
          place="bottom"
          maxWidth="300px"
          float
          getContent={() => permissionTooltipText}
        />
      ) : null}
    </div>
  );
};

export default observer(TableView);

