/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from "react";
import type { DebouncedFunc } from "lodash";
import throttle from "lodash/throttle";
import { isTablet as Tablet } from "react-device-detect";
import classNames from "classnames";

import VerticalDotsReactSvg from "../../assets/icons/16/vertical-dots.react.svg";

import { isTablet, isMobile } from "../../utils";

import { DropDownItem } from "../drop-down-item";
import { DropDown } from "../drop-down";
import { IconButton } from "../icon-button";

import type { ContextMenuModel } from "../context-menu";

import styles from "./ContextMenuButton.module.scss";
import type { ContextMenuButtonProps } from "./ContextMenuButton.types";
import { ContextMenuButtonDisplayType } from "./ContextMenuButton.enums";

const ContextMenuButtonPure = ({
  opened = false,
  data = [],
  displayType = ContextMenuButtonDisplayType.dropdown,
  onClose,
  isDisabled = false,
  getData,
  onClick,
  className,
  iconOpenName,
  id,
  style,
  displayIconBorder = false,
  iconClassName,
  color,
  hoverColor,
  clickColor,
  size = 16,
  iconHoverName,
  iconClickName,
  isFill = true,
  onMouseEnter,
  onMouseLeave,
  onMouseOut,
  onMouseOver,
  title = "",
  dropDownClassName,
  directionX = "left",
  directionY,
  columnCount,
  zIndex,
  usePortal = true,
  iconName,
  fixedDirection = false,
  testId,
}: ContextMenuButtonProps) => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const throttledResize = React.useRef<null | DebouncedFunc<() => void>>(null);

  const [state, setState] = React.useState({
    isOpen: opened,
    data,
    displayType: ContextMenuButtonDisplayType.dropdown,
    offsetX: 0,
    offsetY: 0,
  });

  const getTypeByWidth = React.useCallback(() => {
    if (displayType !== "auto") return displayType;

    return ContextMenuButtonDisplayType.dropdown;
  }, [displayType]);

  React.useEffect(() => {
    const type = displayType === "auto" ? getTypeByWidth() : displayType;

    setState((s) => ({ ...s, displayType: type }));
  }, [displayType, getTypeByWidth]);

  const resize = React.useCallback(() => {
    if (displayType !== "auto") return;

    const type = getTypeByWidth();

    setState((s) => {
      if (type === state.displayType) return s;

      return { ...s, displayType: type };
    });
  }, [displayType, getTypeByWidth, state.displayType]);

  React.useEffect(() => {
    throttledResize.current = throttle(resize, 300);

    window.addEventListener("resize", throttledResize.current);

    return () => {
      if (throttledResize.current) {
        window.removeEventListener("resize", throttledResize.current);
        throttledResize.current.cancel();
      }
    };
  }, [resize]);

  const toggle = React.useCallback((o?: boolean) => {
    setState((s) => ({
      ...s,
      isOpen: typeof o === "boolean" ? o : !s.isOpen,
    }));
  }, []);

  const onCloseAction = React.useCallback(() => {
    setState((s) => ({ ...s, isOpen: !s.isOpen }));
    onClose?.();
  }, [onClose]);

  React.useEffect(() => {
    toggle(opened);
  }, [toggle, opened]);

  React.useEffect(() => {
    setState((s) => ({ ...s, displayType: getTypeByWidth() }));
  }, [getTypeByWidth]);

  const onIconButtonClick = (e: React.MouseEvent) => {
    if (isDisabled || state.displayType === "toggle") {
      e.preventDefault();

      return;
    }

    setState((s) => ({ ...s, data: getData!(), isOpen: !s.isOpen }));

    if (!isDisabled && state.isOpen) onClick?.(e);
  };

  const clickOutsideAction = (e: Event) => {
    const path = e.composedPath?.();
    const dropDownItem = path
      ? path.find((x: EventTarget) => x === ref.current)
      : null;

    if (dropDownItem) return;

    onCloseAction();
  };

  const getLabel = (item: ContextMenuModel) => {
    return item && "label" in item ? item.label : "";
  };

  const onDropDownItemClick = (
    item: ContextMenuModel,
    e: React.MouseEvent | React.ChangeEvent<HTMLInputElement>,
  ) => {
    if ("onClick" in item) {
      const open = state.displayType === "dropdown";
      item.onClick?.({ originalEvent: e, action: open, item });
    }
    toggle();
  };

  const callNewMenu = (e: React.MouseEvent) => {
    if (isDisabled || state.displayType !== "toggle") {
      e.preventDefault();
      return;
    }

    setState((s) => ({ ...s, data: getData!() }));
    onClick?.(e);
  };

  const iconButtonName = state.isOpen && iconOpenName ? iconOpenName : iconName;
  const iconButtonNode = !iconButtonName ? <VerticalDotsReactSvg /> : undefined;

  return (
    <div
      className={classNames(styles.outer, className, "context-menu-button", {
        [styles.displayIconBorder]: displayIconBorder,
      })}
      id={id}
      style={style}
      data-testid={testId ?? "context-menu-button"}
      onClick={callNewMenu}
      ref={ref}
      aria-disabled={isDisabled}
    >
      <IconButton
        className={iconClassName}
        color={color}
        hoverColor={hoverColor}
        clickColor={clickColor}
        size={size}
        iconName={iconButtonName}
        iconNode={iconButtonNode}
        iconHoverName={iconHoverName}
        iconClickName={iconClickName}
        isFill={isFill}
        isDisabled={isDisabled}
        onClick={onIconButtonClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseDown={onMouseOver}
        onMouseUp={onMouseOut}
        title={title}
      />{" "}
      {state.displayType === ContextMenuButtonDisplayType.dropdown ? (
        <DropDown
          className={dropDownClassName}
          fixedDirection={fixedDirection}
          directionX={directionX}
          directionY={directionY}
          open={state.isOpen}
          forwardedRef={ref}
          clickOutsideAction={clickOutsideAction}
          columnCount={columnCount}
          withBackdrop={isTablet() || isMobile() || Tablet}
          withoutBackground
          zIndex={zIndex}
          isDefaultMode={usePortal}
          eventTypes={["click"]}
        >
          {state.data?.map((item: ContextMenuModel, index: number) => {
            if (!item) return null;
            const { key, ...rest } = item;
            return (
              item && (
                <DropDownItem
                  key={key || index}
                  {...rest}
                  id={item.id}
                  testId={item?.dataTestId ?? `${key}_item`}
                  label={getLabel(item)}
                  onClick={(
                    e: React.MouseEvent | React.ChangeEvent<HTMLInputElement>,
                  ) => onDropDownItemClick(item, e)}
                />
              )
            );
          })}
        </DropDown>
      ) : null}
    </div>
  );
};

export { ContextMenuButtonPure };

const compare = (
  prevProps: ContextMenuButtonProps,
  nextProps: ContextMenuButtonProps,
) => {
  if (
    prevProps.opened === nextProps.opened &&
    prevProps.displayType === nextProps.displayType &&
    prevProps.isDisabled === nextProps.isDisabled &&
    prevProps.getData === nextProps.getData
  ) {
    return true;
  }

  return false;
};

export const ContextMenuButton = React.memo(ContextMenuButtonPure, compare);
