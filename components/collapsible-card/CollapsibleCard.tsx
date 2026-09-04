import React from "react";
import classNames from "classnames";

import ArrowIcon from "../../assets/arrow.react.svg";

import styles from "./CollapsibleCard.module.scss";
import type { CollapsibleCardProps } from "./CollapsibleCard.types";

const useUniqueId = (prefix: string) =>
  React.useId().replace(/:/g, "-").concat(`-${prefix}`);

export const CollapsibleCard = ({
  title,
  description,
  children,
  isOpen,
  defaultOpen = false,
  onToggle,
  className,
  style,
  dataTestId,
}: CollapsibleCardProps) => {
  const isControlled = isOpen !== undefined;
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = isControlled ? isOpen : internalOpen;

  const bodyId = useUniqueId("body");

  const handleToggle = () => {
    const next = !open;
    if (!isControlled) setInternalOpen(next);
    onToggle?.(next);
  };

  return (
    <div
      className={classNames(styles.container, className)}
      style={style}
      data-testid={dataTestId ?? "collapsible-card"}
      data-open={open ? "true" : "false"}
    >
      <button
        type="button"
        className={styles.header}
        onClick={handleToggle}
        aria-expanded={open}
        aria-controls={bodyId}
      >
        <span className={styles.heading}>
          <span className={styles.title}>{title}</span>
          {description ? (
            <span className={styles.description}>{description}</span>
          ) : null}
        </span>
        <span className={styles.chevron} aria-hidden="true">
          <ArrowIcon />
        </span>
      </button>
      {open && children ? (
        <div id={bodyId} className={styles.body}>
          {children}
        </div>
      ) : null}
    </div>
  );
};
