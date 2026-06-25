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

import React, { useEffect, useRef, useState } from "react";
import { isMobileOnly } from "react-device-detect";
import classNames from "classnames";

import ExpanderDownReactSvg from "../../assets/expander-down.react.svg";

import { DropDown } from "../drop-down";
import { DropDownItem } from "../drop-down-item";
import { Scrollbar } from "../scrollbar";
import { Text } from "../text";

import styles from "./LinkWithDropdown.module.scss";
import { LinkWithDropDownProps } from "./LinkWithDropdown.types";

const LinkWithDropdown = ({
  isSemitransparent = false,
  dropdownType = "alwaysDashed",
  isTextOverflow = false,
  fontSize = "13px",
  fontWeight,
  color,
  isBold = false,
  title,
  className = "",
  data,
  id,
  style,
  isDisabled = false,
  directionX,
  directionY,
  hasScroll = false,
  withExpander = false,
  dropDownClassName,
  isOpen = false,
  children,
  manualWidth,
  isAside,
  withoutBackground,
  fixedDirection = false,
  isDefaultMode = true,
  topSpace,
  bottomSpace,
  withDynamicScrollbar,
  ...rest
}: LinkWithDropDownProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const [state, setState] = useState({
    isOpen,
    orientation: window.orientation,
  });

  const setIsOpen = (value: boolean) =>
    setState((s) => ({ ...s, isOpen: value }));

  const onSetOrientation = () => {
    setState((s) => ({ ...s, orientation: window.orientation }));
  };

  const onOpen = () => {
    if (isDisabled) return;
    setIsOpen(!state.isOpen);
  };

  const onCheckManualWidth = () => {
    const padding = 32;
    if (ref.current) {
      const width = ref.current
        .querySelector(".text")
        ?.getBoundingClientRect().width;
      if (width) return `${width + padding}px`;
    }
  };

  const onClose = (e: Event) => {
    const target = e.target as HTMLDivElement;
    if (ref.current && ref.current.contains(target)) return;

    setIsOpen(!state.isOpen);
  };

  const onClickDropDownItem = (
    e:
      | React.MouseEvent<Element, MouseEvent>
      | React.ChangeEvent<HTMLInputElement>,
  ) => {
    const currentTarget = e.currentTarget as HTMLElement;
    const { key } = currentTarget.dataset;
    const item = data?.find((x) => x.key === key);
    setIsOpen(!state.isOpen);
    if (item && "onClick" in item) item.onClick?.(e);
  };

  useEffect(() => {
    window.addEventListener("orientationchange", onSetOrientation);

    return () => {
      window.removeEventListener("orientationchange", onSetOrientation);
    };
  }, []);

  useEffect(() => {
    setIsOpen(isOpen);
  }, [dropdownType, isOpen]);

  const showScroll = hasScroll && isMobileOnly;
  const scrollHeight = state.orientation === 90 ? 100 : 250;

  const dropDownItem = data?.map((item) => {
    const { key, ...restProp } = item;
    return (
      <DropDownItem
        key={key}
        {...restProp}
        className={classNames(styles.dropDownItem, "drop-down-item")}
        id={`${item.key}`}
        onClick={onClickDropDownItem}
        testId={`link_with_drop_down_${item.key}`}
        data-key={item.key}
        textOverflow={isTextOverflow}
      />
    );
  });

  const styledText = (
    <Text
      as="span"
      className={classNames(styles.text, {
        [styles.textOverflow]: isTextOverflow,
      })}
      truncate={isTextOverflow}
      fontSize={fontSize}
      fontWeight={fontWeight}
      color={color}
      isBold={isBold}
      title={title}
    >
      {children}
    </Text>
  );

  return (
    <span
      id={id}
      style={style}
      className={classNames(
        styles.span,
        { [styles.isOpen]: state.isOpen },
        className,
      )}
      data-test-id="link-dropdown"
      ref={ref}
    >
      <span onClick={onOpen}>
        <a
          className={classNames(
            styles.linkWithDropdown,
            {
              [styles.disabled]: isDisabled,
              [styles.semitransparent]: isSemitransparent,
              [styles.alwaysDashed]: dropdownType === "alwaysDashed",
              [styles.appearDashedAfterHover]:
                dropdownType === "appearDashedAfterHover",
            },
            className,
          )}
          style={{ color }}
          role="button"
          aria-haspopup="true"
          aria-expanded={state.isOpen}
          aria-disabled={isDisabled}
          {...rest}
        >
          {withExpander ? (
            <div
              className={classNames(
                styles.textWithExpander,
                { [styles.isOpen]: state.isOpen },
                className,
              )}
            >
              {styledText}
              <ExpanderDownReactSvg className={styles.expander} />
            </div>
          ) : (
            styledText
          )}
        </a>
      </span>
      <DropDown
        className={
          classNames(
            "fixed-max-width",
            dropDownClassName || "",
            styles.fixedMaxWidth,
          ) || ""
        }
        manualWidth={
          manualWidth || (showScroll ? onCheckManualWidth() : undefined)
        }
        open={state.isOpen}
        fixedDirection={fixedDirection}
        isDefaultMode={isDefaultMode}
        forwardedRef={ref}
        directionX={directionX}
        directionY={directionY}
        clickOutsideAction={onClose}
        isAside={isAside}
        withoutBackground={withoutBackground}
        topSpace={topSpace}
        bottomSpace={bottomSpace}
        withDynamicScrollbar={withDynamicScrollbar}
        {...rest}
      >
        {showScroll ? (
          <Scrollbar
            className="scroll-drop-down-item"
            style={{ height: scrollHeight }}
          >
            {dropDownItem}
          </Scrollbar>
        ) : (
          dropDownItem
        )}
      </DropDown>
    </span>
  );
};

export { LinkWithDropdown };
