import React, { useEffect, useLayoutEffect, useState } from "react";
import { DropDownItem } from "../../drop-down-item";
import { ActionOption, SubmenuItemProps } from "../MainButtonMobile.types";
import styles from "../MainButtonMobile.module.scss";
import classNames from "classnames";

const SubmenuItem = ({
  option,
  toggle,
  noHover,
  recalculateHeight,
  openedSubmenuKey,
  setOpenedSubmenuKey,
  openByDefault,
}: SubmenuItemProps) => {
  const [isOpenSubMenu, setIsOpenSubMenu] = useState(false);

  useLayoutEffect(() => {
    recalculateHeight();
  }, [isOpenSubMenu, recalculateHeight]);

  useEffect(() => {
    if (openedSubmenuKey === option.key) return;
    setIsOpenSubMenu(false);
  }, [openedSubmenuKey, option.key]);

  useEffect(() => {
    if (openByDefault) {
      setOpenedSubmenuKey(option.key);
      setIsOpenSubMenu(true);
    }
  }, [openByDefault, option.key, setOpenedSubmenuKey]);

  const onClick = () => {
    setOpenedSubmenuKey(option.key);
    setIsOpenSubMenu((v) => !v);
  };

  return (
    <div key={`mobile-submenu-${option.key}`}>
      <DropDownItem
        id={option.id}
        key={option.key}
        label={option.label}
        className={classNames(styles.dropDownItem, option.className, {
          "is-separator": option.isSeparator,
          "main-button_drop-down": !option.isSeparator,
        })}
        onClick={onClick}
        icon={option.icon}
        isActive={isOpenSubMenu}
        isSubMenu
        noHover={noHover}
      />
      {isOpenSubMenu
        ? option.items?.map((suboption: ActionOption) => {
            const subMenuOnClickAction = () => {
              toggle(false);
              setIsOpenSubMenu(false);
              suboption.onClick?.({ action: suboption.action });
            };

            return (
              <DropDownItem
                id={suboption.id}
                key={suboption.key}
                label={suboption.label}
                className={classNames(
                  styles.dropDownItem,
                  styles.sublevel,
                  suboption.className,
                  "main-button_drop-down",
                )}
                onClick={subMenuOnClickAction}
                icon={suboption.icon}
                withoutIcon={suboption.withoutIcon}
                noHover={noHover}
              />
            );
          })
        : null}
    </div>
  );
};

export default SubmenuItem;