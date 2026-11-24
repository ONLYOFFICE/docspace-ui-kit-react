import React, { isValidElement } from "react";
import { ReactSVG } from "react-svg";

import classNames from "classnames";
import { Text } from "../../../components/text";
import { isSeparator } from "../../utils/typeGuards";

import styles from "./MessageError.module.scss";
import type PlayerMessageErrorProps from "./MessageError.props";

export const MessageError = ({
  model,
  isMobile,
  errorTitle,
  onMaskClick,
}: PlayerMessageErrorProps) => {
  const items = (
    !isMobile
      ? model.filter((el) => el.key !== "rename")
      : model.filter((el) => el.key === "delete" || el.key === "download")
  ).filter((m) => !m.disabled);

  return (
    <div data-testid="message-error-container">
      <div
        className={classNames(styles.mediaError)}
        data-testid="message-error"
      >
        <div data-testid="message-error-title">
          <Text fontSize="15px" textAlign="center" className={styles.title}>
            {errorTitle}
          </Text>
        </div>
      </div>
      {items.length !== 0 ? (
        <div
          className={styles.errorToolbar}
          data-testid="message-error-toolbar"
        >
          {items.map((item) => {
            if (item.disabled || isSeparator(item)) return;

            const onClick = (
              event: React.MouseEvent<HTMLDivElement, MouseEvent>,
            ) => {
              onMaskClick?.();
              item.onClick?.(event);
            };

            const icon = isValidElement(item.iconNode) ? (
              item.iconNode
            ) : item.icon ? (
              <ReactSVG src={item.icon} />
            ) : null;

            if (!icon) return;

            return (
              <div
                className={styles.toolbarItem}
                key={item.key}
                data-testid={`toolbar-item-${item.key}`}
                onClick={onClick}
              >
                {icon}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};
