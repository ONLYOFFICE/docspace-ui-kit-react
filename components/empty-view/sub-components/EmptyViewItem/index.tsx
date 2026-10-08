import React from "react";

import ArrowIcon from "../../../../assets/icons/12/arrow.right.svg";

import { Text } from "../../../text";
import { ContextMenu, type ContextMenuRefType } from "../../../context-menu";

import styles from "../../EmptyView.module.scss";
import { isActivationKey } from "../../EmptyView.utils";
import type { EmptyViewItemProps } from "../../EmptyView.types";

export const EmptyViewItem = ({
  description,
  icon,
  title,
  onClick,
  disabled,
  model,
  id,
}: EmptyViewItemProps) => {
  const contextRef = React.useRef<ContextMenuRefType>(null);

  if (disabled) return;

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!model) return onClick?.(event);

    contextRef.current?.show(event);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    // Keys pressed inside the open context menu bubble here through React.
    if (event.target !== event.currentTarget || !isActivationKey(event)) return;
    event.preventDefault();

    // Dispatch a real click so onClick receives the MouseEvent it is typed
    // for, placed at the item's lower start corner so a context menu opened
    // from the keyboard appears under the item rather than at the page origin.
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        clientX: rect.left,
        clientY: rect.bottom,
      }),
    );
  };

  const elementProps = { className: styles.itemIcon };

  return (
    <div
      id={id}
      role="button"
      tabIndex={0}
      aria-label={title}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={styles.itemWrapper}
    >
      <ContextMenu ref={contextRef} model={model ?? []} />
      {React.cloneElement(icon, elementProps)}
      <div className={styles.itemBody}>
        <Text
          as="h4"
          fontWeight="600"
          lineHeight="20px"
          className={styles.itemHeader}
          noSelect
        >
          {title}
        </Text>
        <Text as="p" fontSize="12px" className={styles.itemSubheading} noSelect>
          {description}
        </Text>
      </div>
      <ArrowIcon className={styles.arrowIcon} />
    </div>
  );
};
