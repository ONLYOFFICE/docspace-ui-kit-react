import React, { useState, useEffect, useCallback } from "react";
import classNames from "classnames";
import { ReactSVG } from "react-svg";

import { DropDownItem } from "../drop-down-item";
import { Badge } from "../badge";
import { ComboBox, type TOption } from "../combobox";
import { toastr } from "../toast";

import styles from "./AccessRightSelect.module.scss";
import type { AccessRightSelectProps } from "./AccessRightSelect.types";

export const AccessRightSelectPure = ({
  accessOptions,
  onSelect,
  advancedOptions,
  selectedOption,
  className,
  type,
  isSelectionDisabled,
  selectionErrorText,
  availableAccess,
  isDisabled,
  dataTestId,
  ...props
}: AccessRightSelectProps) => {
  const [currentItem, setCurrentItem] = useState(selectedOption);

  useEffect(() => {
    setCurrentItem(selectedOption);
  }, [selectedOption]);

  const onSelectCurrentItem = useCallback(
    (option: TOption) => {
      if (option) {
        if (isSelectionDisabled) {
          let isError =
            option.access && option.access !== selectedOption?.access;

          if (availableAccess && option.access) {
            isError = availableAccess.every((item) => item !== option.access);
          }

          if (isError) {
            toastr.error(selectionErrorText);
            return;
          }
        }

        setCurrentItem(option);
        onSelect?.(option);
      }
    },
    [
      availableAccess,
      isSelectionDisabled,
      onSelect,
      selectedOption?.access,
      selectionErrorText,
    ],
  );

  const formatToAccessRightItem = (data: TOption[]) => {
    const items = data.map((item: TOption) => {
      const isSelected = currentItem?.key === item?.key;
      return "isSeparator" in item && item.isSeparator ? (
        <DropDownItem key={item.key} isSeparator />
      ) : (
        <DropDownItem
          className="access-right-item"
          key={item.key}
          data-key={item.key}
          isSelected={isSelected}
          isActive={isSelected}
          onClick={() => onSelectCurrentItem(item)}
          testId={`access_right_option_${item.key.toString().toLowerCase()}`}
          disabled={item?.disabled}
          tooltip={item?.tooltip}
        >
          <div className={styles.item}>
            {item.icon && typeof item.icon === "string" ? (
              <ReactSVG
                className={classNames(styles.itemIcon, {
                  [styles.isShortenIcon]: type === "onlyIcon",
                })}
                src={item.icon}
              />
            ) : null}

            <div className={styles.itemContent}>
              <div className={styles.itemTitle}>
                {item.label}
                {item.quota ? (
                  <Badge
                    label={item.quota}
                    backgroundColor={item.color}
                    fontSize="9px"
                    isPaidBadge
                    noHover
                  />
                ) : null}
              </div>
              <div className={styles.itemDescription}>{item.description}</div>
            </div>
          </div>
        </DropDownItem>
      );
    });

    return <div style={{ display: "contents" }}>{items}</div>;
  };

  const formattedOptions =
    advancedOptions ?? formatToAccessRightItem(accessOptions);

  // console.log(formattedOptions);

  return (
    <ComboBox
      className={classNames(styles.wrapper, className, {
        [styles.descriptive]: type === "descriptive",
        [styles.onlyIcon]: type === "onlyIcon",
        [styles.isDisabled]: isDisabled,
      })}
      type={type}
      isDisabled={isDisabled}
      advancedOptions={formattedOptions}
      onSelect={onSelectCurrentItem}
      options={[]}
      selectedOption={
        {
          icon: currentItem?.icon,
          key: currentItem?.key,
          label: type === "onlyIcon" ? "" : currentItem?.label,
          description: type === "onlyIcon" ? "" : currentItem?.description,
        } as TOption
      }
      forceCloseClickOutside
      dropDownClassName={styles.accessRightSelectDropdown}
      dataTestId={dataTestId}
      useImageIcon
      {...props}
    />
  );
};

const AccessRightSelect = React.memo(AccessRightSelectPure);

export { AccessRightSelect };
