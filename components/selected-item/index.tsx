import React from "react";
import { ReactSVG } from "react-svg";
import CrossReactSvgUrl from "../../assets/icons/12/cross.react.svg";
import { IconButton } from "../icon-button";
import { TooltipContainer } from "../tooltip";

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
  } = props;
  if (!label) return null;

  const onCloseClick = (e: React.MouseEvent) => {
    if (!isDisabled) onClose(propKey, label, group || "", e);
  };

  const handleOnClick = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;

    if (!isDisabled && !target.classList.contains("selected-tag-removed"))
      onClick?.(propKey, label, group, e);
  };

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
