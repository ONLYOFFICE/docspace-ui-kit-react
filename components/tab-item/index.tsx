import { useCallback, useEffect, useState } from "react";
import classNames from "classnames";
import { Text } from "../text";
import styles from "./TabItem.module.scss";
import { TTabItemProps } from "./TabItem.types";

const TabItem = ({
  label,
  onSelect,
  isActive: isActiveInit = false,
  isDisabled,
  className,
  allowNoSelection,
  withMultiSelect = false,
  dataTestId,
  lockLastSelection = false,
  ...rest
}: TTabItemProps) => {
  const [isActive, setIsActive] = useState(isActiveInit);

  const onSelectItem = useCallback(
    (itemIsActive: boolean) => {
      if (!allowNoSelection) {
        setIsActive(itemIsActive);
      }
    },
    [allowNoSelection],
  );

  const onItemClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDisabled) return;
    if (lockLastSelection && isActive) return;

    if (!(isActive && !withMultiSelect)) {
      onSelectItem(!isActive);
    }
    onSelect?.(e);
  };

  useEffect(() => {
    onSelectItem(isActiveInit);
  }, [isActiveInit, onSelectItem]);

  return (
    <div
      className={classNames(
        styles.tabItem,
        {
          [styles.active]: isActive,
          [styles.disabled]: isDisabled,
        },
        className,
        "tab-item",
      )}
      onClick={onItemClick}
      aria-selected={isActive}
      data-testid={dataTestId ?? "tab-item"}
      {...rest}
    >
      <Text
        className={classNames(styles.tabItemText, {
          [styles.active]: isActive,
        })}
        noSelect
        truncate
        fontSize="13px"
        fontWeight={600}
        lineHeight="20px"
        data-testid="tab-item-text"
      >
        {label}
      </Text>
    </div>
  );
};

export { TabItem };
