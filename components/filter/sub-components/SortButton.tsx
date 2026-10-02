import React from "react";

import SortDesc from "../../../assets/sort.desc.react.svg";
import SortReactSvg from "../../../assets/sort.react.svg";

import { Events } from "../../../enums";

import { ComboBox, ComboBoxSize } from "../../combobox";
import { DropDownItem } from "../../drop-down-item";
import { IconButton } from "../../icon-button";
import { ViewSelector } from "./ViewSelector";
import { Text } from "../../text";
import { TooltipContainer } from "../../tooltip";

import { SortButtonProps, TSortDataItem } from "../Filter.types";
import styles from "../Filter.module.scss";

const SortButton = ({
  id,
  getSortData,
  getSelectedSortData,

  onChangeViewAs,
  view,
  viewAs,
  viewSettings,

  onSort,
  viewSelectorVisible,

  onSortButtonClick,
  title,
}: SortButtonProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const [sortData, setSortData] = React.useState<TSortDataItem[]>([]);
  const [selectedSortData, setSelectedSortData] = React.useState({
    sortDirection: "",
    sortId: "",
  });

  const getSortDataAction = React.useCallback(() => {
    const value = getSortData?.();
    const selectedValue = getSelectedSortData?.();

    const data = value.map((itemProp) => {
      const item = { ...itemProp };
      item.className = "option-item";

      if (selectedValue.sortId === item.key) {
        item.className += " selected-option-item";
        item.isSelected = true;
      }

      return item;
    });

    setSortData(data);

    setSelectedSortData({
      sortDirection: selectedValue.sortDirection ?? "",
      sortId: selectedValue.sortId ?? "",
    });
  }, [getSortData, getSelectedSortData]);

  React.useEffect(() => {
    window.addEventListener(Events.CHANGE_COLUMN, getSortDataAction);
    getSortDataAction();

    return () =>
      window.removeEventListener(Events.CHANGE_COLUMN, getSortDataAction);
  }, [getSortDataAction]);

  const toggleCombobox = React.useCallback(() => {
    setIsOpen((val) => !val);
  }, []);

  React.useEffect(() => {
    onSortButtonClick?.(!isOpen);
  }, [isOpen, onSortButtonClick]);

  const onOptionClick = React.useCallback(
    (e: React.MouseEvent | React.ChangeEvent<HTMLInputElement>) => {
      const target = e.target as HTMLDivElement;
      const key = (target.closest(".option-item") as HTMLDivElement)?.dataset
        .value;

      let { sortDirection } = selectedSortData;

      if (key === selectedSortData.sortId) {
        sortDirection = sortDirection === "desc" ? "asc" : "desc";
      }

      let data = sortData.map((item) => ({ ...item }));

      data = data.map((itemProp) => {
        const item = { ...itemProp };
        item.className = "option-item";
        item.isSelected = false;
        if (key === item.key) {
          item.className += " selected-option-item";
          item.isSelected = true;
        }

        return item;
      });

      setSortData(data);

      setSelectedSortData({
        sortId: key || "",
        sortDirection,
      });

      onSort?.(key || "", sortDirection);
    },
    [onSort, sortData, selectedSortData],
  );

  const advancedOptions = (
    <>
      {viewSelectorVisible ? (
        <>
          <DropDownItem
            noHover
            className="view-selector-item"
            testId="filter_sort_view_selector_item"
          >
            <Text fontWeight={600}>{view}</Text>
            <ViewSelector
              className="view-selector"
              onChangeView={onChangeViewAs}
              viewAs={viewAs}
              viewSettings={viewSettings}
            />
          </DropDownItem>

          <DropDownItem isSeparator />
        </>
      ) : null}
      {sortData?.map((item) => (
        <DropDownItem
          id={item.id}
          onClick={onOptionClick}
          className={item.className}
          key={item.key}
          data-value={item.key}
          testId={`filter_sort_option_${item.key}`}
        >
          <Text fontWeight={600}>{item.label}</Text>
          <SortDesc
            className={`option-item__icon${
              item.isSelected ? " selected-option-item__icon" : ""
            }`}
          />
        </DropDownItem>
      ))}
    </>
  );

  let advancedOptionsCount = sortData.length;

  if (viewSelectorVisible) {
    advancedOptionsCount += 1;
  }

  return (
    <TooltipContainer
      as="div"
      onClick={toggleCombobox}
      id={id}
      title={title}
      className={styles.sortButton}
      data-row-view={viewAs === "row" ? "true" : "false"}
      data-desc={selectedSortData.sortDirection === "desc" ? "true" : "false"}
      data-testid="filter_sort_button"
    >
      <ComboBox
        opened={isOpen}
        onToggle={toggleCombobox}
        className="sort-combo-box"
        options={[]}
        selectedOption={{ key: "", label: "" }}
        directionX="left"
        directionY="both"
        scaled
        size={ComboBoxSize.content}
        advancedOptions={advancedOptions}
        disableIconClick={false}
        disableItemClick
        isDefaultMode={false}
        advancedOptionsCount={advancedOptionsCount}
        onSelect={() => {}}
        withBlur={false}
        withBackdrop
        onBackdropClick={toggleCombobox}
        type="onlyIcon"
        dataTestId="filter_sort_combobox"
      >
        <IconButton iconNode={<SortReactSvg />} size={16} />
      </ComboBox>
    </TooltipContainer>
  );
};

export default React.memo(SortButton);
