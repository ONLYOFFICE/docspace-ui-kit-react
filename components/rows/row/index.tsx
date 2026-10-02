"use client";

import equal from "fast-deep-equal";
import classNames from "classnames";
import React, { useRef } from "react";
import { isMobile } from "react-device-detect"; // TODO: isDesktop=true for IOS(Firefox & Safari)

import { VDRIndexingAction } from "../../../enums";
import { isMobile as isMobileUtils } from "../../../utils/device";

import { Checkbox } from "../../checkbox";
import {
  ContextMenuButton,
  ContextMenuButtonDisplayType,
} from "../../context-menu-button";
import { ContextMenu, ContextMenuRefType } from "../../context-menu";
import { Loader, LoaderTypes } from "../../loader";
import { IndexIconButtons } from "./sub-components/index-icon-buttons";

import { RowProps } from "./Row.types";
import { hasOwnProperty } from "../../../utils";
import styles from "./Row.module.scss";

const Row = React.memo((props: RowProps) => {
  const {
    checked,
    children,
    contentElement,
    contextButtonSpacerWidth = "26px",
    data,
    element,
    indeterminate,
    onSelect,
    onRowClick,
    onContextClick,
    onChangeIndex,

    getContextModel,
    isRoom,
    withoutBorder = false,
    contextTitle,
    badgesComponent,
    isArchive,
    mode = "default",
    inProgress,
    rowContextClose,
    className,
    badgeUrl,
    isDisabled,
    isIndexEditingMode,
    dataTestId,
  } = props;

  const cm = useRef<ContextMenuRefType>(null);
  const row = useRef<null | HTMLDivElement>(null);

  const renderCheckbox = hasOwnProperty(props, "checked");

  const renderElement = hasOwnProperty(props, "element");

  const renderContentElement = hasOwnProperty(props, "contentElement");

  const contextData = data?.contextOptions ? data : props;

  const renderContext =
    hasOwnProperty(contextData, "contextOptions") &&
    contextData &&
    contextData.contextOptions &&
    contextData.contextOptions.length > 0;

  const changeCheckbox = () => {
    onSelect?.(!checked, data);
  };

  const getOptions = () => {
    onContextClick?.();
    return contextData.contextOptions || [];
  };

  const onContextMenu = (e: React.MouseEvent) => {
    onContextClick?.(e.button === 2);
    if (!cm.current?.menuRef.current) {
      if (row.current) row.current.click(); // TODO: need fix context menu to global
    }
    if (cm.current) cm.current.show(e);
  };

  let contextMenuHeader;
  if (React.isValidElement(children) && children.props.item) {
    const coverValue = children.props.item.logo?.cover;
    let coverObject;

    // Handle both string and object types for cover
    if (coverValue) {
      if (typeof coverValue === "string") {
        // If cover is a string, create an ICover object with the string as data
        coverObject = {
          data: coverValue,
          id: "",
        };
      } else if (typeof coverValue === "object") {
        // If cover is already an object with data and id
        coverObject = coverValue;
      }
    }

    contextMenuHeader = {
      icon: children.props.item.icon,
      avatar: children.props.item.avatar,
      title: children.props.item.title
        ? children.props.item.title
        : children.props.item.displayName || "",
      color: children.props.item.logo?.color,
      logo: children.props.item.logo?.medium,
      cover: coverObject,
      original: "",
      large: "",
      medium: "",
      small: "",
    };
  }

  const onElementClick = () => {
    if (!isMobile) return;

    onSelect?.(true, data);
  };

  const changeIndex = (
    e: React.MouseEvent<HTMLElement>,
    action: VDRIndexingAction,
  ) => {
    e.stopPropagation();
    onChangeIndex?.(action);
  };

  return (
    <div
      ref={row}
      onContextMenu={onContextMenu}
      className={classNames(
        styles.row,
        checked ? "checked" : "",
        {
          [styles.withoutBorder]: withoutBorder,
          [styles.modern]: mode === "modern",
          [styles.checked]: checked,
          [styles.mobile]: isMobile,
        },
        className,
      )}
      data-testid={dataTestId ?? "row"}
    >
      {inProgress ? (
        <Loader
          className={classNames(
            styles.rowProgressLoader,
            "row-progress-loader",
          )}
          color=""
          size="20px"
          type={LoaderTypes.track}
        />
      ) : (
        <>
          {mode === "default" && renderCheckbox ? (
            <div
              className={classNames(
                styles.checkboxElement,
                { [styles.isIndexEditingMode]: isIndexEditingMode },
                "not-selectable",
              )}
            >
              <Checkbox
                className="checkbox"
                isChecked={checked}
                isIndeterminate={indeterminate}
                onChange={changeCheckbox}
                isDisabled={isDisabled}
              />
            </div>
          ) : null}
          {mode === "modern" && renderCheckbox && renderElement ? (
            <div
              className={classNames(
                styles.checkboxElement,
                {
                  [styles.isIndexEditingMode]: isIndexEditingMode,
                  [styles.modern]: mode === "modern",
                  [styles.checked]: checked,
                },
                "not-selectable styled-checkbox-container",
              )}
            >
              <div
                onClick={onElementClick}
                className={classNames(styles.element, "styled-element")}
              >
                {element}
              </div>
              <Checkbox
                className={classNames(styles.checkbox, "checkbox")}
                isChecked={checked}
                isIndeterminate={indeterminate}
                onChange={changeCheckbox}
                isDisabled={isDisabled}
              />
            </div>
          ) : null}

          {mode === "default" && renderElement ? (
            <div
              onClick={onRowClick}
              className={classNames(styles.element, "styled-element")}
            >
              {element}
            </div>
          ) : null}
        </>
      )}

      <div
        className={classNames(styles.content, "row_content")}
        onClick={onRowClick}
      >
        {children}
      </div>
      <div
        className={classNames(styles.optionButton, "row_context-menu-wrapper")}
        style={{ ["--manual-width" as string]: contextButtonSpacerWidth }}
      >
        {badgesComponent || null}
        {renderContentElement ? (
          <div className={styles.contentElement}>{contentElement}</div>
        ) : null}
        {isIndexEditingMode ? (
          <IndexIconButtons
            onUpIndexClick={(e: React.MouseEvent<HTMLElement>) =>
              changeIndex(e, VDRIndexingAction.HigherIndex)
            }
            onDownIndexClick={(e: React.MouseEvent<HTMLElement>) =>
              changeIndex(e, VDRIndexingAction.LowerIndex)
            }
          />
        ) : (
          <>
            {renderContext ? (
              <ContextMenuButton
                isFill
                className="expandButton"
                getData={getOptions}
                directionX="right"
                displayType={ContextMenuButtonDisplayType.toggle}
                onClick={onContextMenu}
                title={contextTitle}
              />
            ) : (
              <div className="expandButton"> </div>
            )}
            <ContextMenu
              getContextModel={getContextModel}
              model={contextData.contextOptions || []}
              ref={cm}
              header={contextMenuHeader}
              withBackdrop={isMobileUtils()}
              onHide={rowContextClose}
              isRoom={isRoom}
              isArchive={isArchive}
              badgeUrl={badgeUrl}
            />
          </>
        )}
      </div>
    </div>
  );
}, equal);

export { Row };
