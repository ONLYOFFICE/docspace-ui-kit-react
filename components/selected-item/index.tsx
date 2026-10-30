import React from "react";
import { ReactSVG } from "react-svg";
import CrossReactSvgUrl from "../../assets/icons/12/cross.react.svg";
import { IconButton } from "../icon-button";
import { TooltipContainer } from "../tooltip";
import { activateOnButtonKey } from "../../utils/keyboard-activation";

import type { SelectedItemProps } from "./SelectedItem.types";
import styles from "./SelectedItem.module.scss";

export type { SelectedItemProps };

export const SelectedItemPure = (props: SelectedItemProps) => {
  const {
    label,
    onClose,
    isDisabled = false,
    onClick,
    isInline = true,
    className,
    id,
    propKey,
    group,
    forwardedRef,
    classNameCloseButton,
    hideCross,
    title,
    dataTestId,
    icon,
    isActive,
    clickable,
  } = props;
  if (!label) return null;

  const onCloseClick = (e: React.MouseEvent) => {
    if (!isDisabled) onClose(propKey, label, group || "", e);
  };

  const handleOnClick = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;

    if (!isDisabled && !target.closest(".selected-tag-removed"))
      onClick?.(propKey, label, group, e);
  };

  // A clickable chip is a button to the keyboard: Enter / Space click it, so
  // the key takes the same path as the pointer.
  const keyboardProps =
    clickable && !isDisabled
      ? {
          role: "button",
          tabIndex: 0,
          "aria-pressed": isActive,
          onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) =>
            activateOnButtonKey(e, ({ currentTarget }) =>
              currentTarget.click(),
            ),
        }
      : {};

  const selectedItemClassNames = [
    styles.selectedItem,
    isInline && styles.isInline,
    isDisabled && styles.disabled,
    isActive && styles.isActive,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const labelClassNames = [
    styles.label,
    "selected-item_label",
    isDisabled && styles.disabled,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <TooltipContainer
      as="div"
      onClick={handleOnClick}
      className={selectedItemClassNames}
      id={id}
      ref={forwardedRef}
      data-testid={dataTestId ?? "selected-item"}
      title={title}
      {...keyboardProps}
    >
      {icon ? (
        typeof icon === "string" ? (
          <ReactSVG className={styles.icon} src={icon} />
        ) : (
          <span className={styles.icon}>{React.createElement(icon)}</span>
        )
      ) : null}
      <div className={labelClassNames}>{label}</div>
      {!hideCross ? (
        <IconButton
          className={`selected-tag-removed ${classNameCloseButton}`}
          iconNode={<CrossReactSvgUrl />}
          size={12}
          onClick={onCloseClick}
          isFill
          isDisabled={isDisabled}
        />
      ) : null}
    </TooltipContainer>
  );
};

const SelectedItem = React.memo(SelectedItemPure);

export { SelectedItem };
