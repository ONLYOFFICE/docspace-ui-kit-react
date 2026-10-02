import { useCommonTranslation } from "../../../../utils/i18n";

import ClearReactSvg from "../../../../assets/icons/17/clear.react.svg";

import { Button, ButtonSize } from "../../../../components/button";
import {
  ModalDialog,
  ModalDialogType,
} from "../../../../components/modal-dialog";
import { Text } from "../../../../components/text";
import {
  ComboBox,
  ComboBoxSize,
  TOption,
} from "../../../../components/combobox";

import styles from "../styles/TransactionHistory.module.scss";

type FilterPanelProps = {
  isFilterDialogVisible: boolean;
  closeFilterDialog: () => void;
  isSelectorVisible: boolean;
  selectorComponent: React.ReactNode;
  datesComponent: React.ReactNode;
  contactSelector: React.ReactNode;
  typeOfHistoty: TOption[];
  selectedType: TOption;
  onSelectType: (option: TOption) => void;
  onApplyFilter: () => void;
  isChanged: boolean;
  clearFilter: () => void;
  shouldShowClearButton: boolean;
  hideTypeFilter?: boolean;
};

const FilterPanel = ({
  isFilterDialogVisible,
  closeFilterDialog,
  isSelectorVisible,
  selectorComponent,
  datesComponent,
  contactSelector,
  typeOfHistoty,
  selectedType,
  onSelectType,
  onApplyFilter,
  isChanged,
  clearFilter,
  shouldShowClearButton,
  hideTypeFilter,
}: FilterPanelProps) => {
  const t = useCommonTranslation();
  return (
    <ModalDialog
      visible={isFilterDialogVisible}
      onClose={closeFilterDialog}
      displayType={ModalDialogType.aside}
      className={styles.filterDialog}
      containerVisible={isSelectorVisible}
      headerIcons={
        shouldShowClearButton
          ? [
              {
                key: "clear-filter",
                iconNode: <ClearReactSvg />,
                onClick: clearFilter,
              },
            ]
          : []
      }
    >
      <ModalDialog.Container>{selectorComponent}</ModalDialog.Container>
      <ModalDialog.Header>{t("Filter")}</ModalDialog.Header>
      <ModalDialog.Body>
        <div className={styles.filterDialogContent}>
          {!hideTypeFilter ? (
            <>
              <div className={styles.filterDialogSection}>
                <Text fontWeight={600} fontSize="15px">
                  {t("Type")}
                </Text>
                <ComboBox
                  options={typeOfHistoty}
                  selectedOption={selectedType}
                  onSelect={onSelectType}
                  directionY="both"
                  noBorder={false}
                  dropDownMaxHeight={300}
                  showDisabledItems
                  size={ComboBoxSize.content}
                  scaled
                  dataTestId="transaction_type_combobox"
                  dropDownTestId="transaction_type_dropdown"
                />
              </div>
              <div className={styles.filterDialogDivider} />
            </>
          ) : null}
          <div className={styles.filterDialogSection}>
            <Text fontWeight={600} fontSize="15px">
              {t("TransactionPeriod")}
            </Text>
            <div>{datesComponent}</div>
          </div>
          <div className={styles.filterDialogDivider} />
          <div className={styles.filterDialogSection}>
            <Text fontWeight={600} fontSize="15px">
              {t("Contact")}
            </Text>
            <div>{contactSelector}</div>
          </div>
        </div>
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <Button
          onClick={onApplyFilter}
          size={ButtonSize.medium}
          label={t("ApplyButton")}
          isDisabled={!isChanged}
          primary
          scale
          testId="apply_filter_button"
        />
        <Button
          onClick={closeFilterDialog}
          size={ButtonSize.medium}
          label={t("CancelButton")}
          scale
          testId="cancel_filter_button"
        />
      </ModalDialog.Footer>
    </ModalDialog>
  );
};
export default FilterPanel;
