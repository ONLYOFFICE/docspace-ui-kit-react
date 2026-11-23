import React from "react";
import classNames from "classnames";
import { useInterfaceDirection } from "../../../context/InterfaceDirectionContext";
import styles from "./RowContent.module.scss";
import { pickAriaProps } from "../../../utils/aria-props";
import { RowContentProps } from "./RowContent.types";
import { getSideInfo } from "./RowContent.utils";

const RowContent = (props: RowContentProps) => {
  const {
    children,
    disableSideInfo = false,
    id,
    className,
    style,
    sideColor,
    onClick,
    convertSideInfo = true,
  } = props;

  const { interfaceDirection } = useInterfaceDirection();

  const sideInfo = getSideInfo(children, convertSideInfo, interfaceDirection);

  return (
    <div
      {...pickAriaProps(props)}
      className={classNames(styles.rowContent, className)}
      id={id}
      onClick={onClick}
      style={style}
      data-testid="row-content"
    >
      <div
        data-testid="main-container-wrapper"
        className={classNames(
          styles.mainContainerWrapper,
          "row-main-container-wrapper",
        )}
        style={style}
      >
        <div className={classNames(styles.mainContainer, "rowMainContainer")}>
          {children[0]}
        </div>
        <div className={classNames(styles.mainIcons, "mainIcons")}>
          {children[1]}
        </div>
      </div>
      {children.map((element: React.ReactNode, index: number) => {
        if (index > 1 && React.isValidElement(element)) {
          const p = element.props as {
            containerWidth?: string;
            containerMinWidth?: string;
          };
          return (
            <div
              data-testid="side-container"
              className={classNames(styles.sideContainerWrapper)}
              key={`side-${index * 10}`}
              style={{
                width: p.containerWidth || "40px",
                minWidth: p.containerMinWidth || "40px",
              }}
            >
              {element}
            </div>
          );
        }
        return null;
      })}
      {!disableSideInfo ? (
        <div
          data-testid="tablet-side-info"
          className={classNames(styles.tabletSideInfo)}
          style={{ color: sideColor }}
        >
          {sideInfo}
        </div>
      ) : null}
    </div>
  );
};

export { RowContent };
