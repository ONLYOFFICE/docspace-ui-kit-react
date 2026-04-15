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
import { ReactSVG } from "react-svg";
import classNames from "classnames";

import RightArrowReactSvgUrl from "../../assets/right.arrow.react.svg";
import ArrowLeftReactUrl from "../../assets/arrow-left.react.svg";
import ExternalLinkReactSvgUrl from "../../assets/external.link.svg";

import { globalColors } from "../../providers/theme";
import { useInterfaceDirection } from "../../context/InterfaceDirectionContext";
import { useTheme } from "../../context/ThemeContext";
import { isTouchDevice } from "../../utils/device";
import { useCommonTranslation } from "../../utils/i18n";

import { ToggleButton } from "../toggle-button";
import { Badge } from "../badge";
import { Link, LinkType } from "../link";

import type { DropDownItemProps } from "./DropDownItem.types";
import styles from "./DropDownItem.module.scss";
import { TooltipContainer } from "../tooltip";
import { getConstName } from "../../constants/consts";

export type { DropDownItemProps };

const IconComponent = ({
  icon,
  fillIcon = true,
}: {
  icon: string | React.ReactElement | React.ElementType;
  fillIcon?: boolean;
}) => {
  const isImageSrc = (src: string) =>
    (!src.includes("images/") && !src.includes(".svg")) ||
    src.includes("webplugins");

  const isDataUrlSvg = (src: string) => src.startsWith("data:image/svg+xml");

  if (typeof icon === "string" && isDataUrlSvg(icon)) {
    return (
      <ReactSVG
        className={
          fillIcon
            ? classNames(styles.dropDownItemIcon, "drop-down-item_icon")
            : ""
        }
        src={icon}
      />
    );
  }

  if (typeof icon === "string" && isImageSrc(icon)) {
    return (
      <img className="drop-down-icon_image" src={icon} alt="plugin-logo" />
    );
  }

  if (
    typeof icon === "function" &&
    React.isValidElement(React.createElement(icon))
  ) {
    return <div>{React.createElement(icon)}</div>;
  }

  return (
    <ReactSVG
      src={typeof icon === "string" ? icon : ""}
      className={
        fillIcon
          ? classNames(styles.dropDownItemIcon, "drop-down-item_icon")
          : ""
      }
    />
  );
};

const DropDownItem = ({
  isSeparator = false,
  isHeader = false,
  withHeaderArrow,
  headerArrowAction,
  icon,
  children,
  disabled = false,
  className,
  fillIcon = true,
  isSubMenu = false,
  isActive = false,
  withoutIcon = false,
  noHover = false,
  noActive = false,
  isSelected,
  isActiveDescendant,
  isBeta,
  additionalElement,
  setOpen,
  withToggle,
  checked,
  onClick,
  onMouseDown,
  onClickSelectedItem,
  label = "",
  tabIndex = -1,
  textOverflow = false,
  minWidth,
  isModern,
  style,
  isPaidBadge,
  badgeLabel,
  withExternalLink,
  externalLinkPath,
  onExternalLinkClick,
  testId,
  tooltip,
  truncateText,
  stopMouseDownPropagation,
  betaLabel,
  paidLabel,
  ...rest
}: DropDownItemProps) => {
  const t = useCommonTranslation();
  const { isRTL } = useInterfaceDirection();
  const { isBase } = useTheme();

  const resolvedBetaLabel = betaLabel || getConstName("BetaLabel") || "";
  const resolvedPaidLabel = paidLabel || t("Paid") || "";

  const withDisabledTooltip = disabled && tooltip;

  const handleMouseDown = (e: React.MouseEvent<HTMLElement>) => {
    // Stop propagation to prevent click-outside detection from closing dropdown
    if (stopMouseDownPropagation) e.stopPropagation();
    onMouseDown?.(e);
  };

  const handleClick = (
    e: React.MouseEvent<HTMLElement> | React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!disabled) onClick?.(e);
    if (isSelected) onClickSelectedItem?.();
    if (withDisabledTooltip && isTouchDevice) return e.stopPropagation();

    setOpen?.(false);
  };

  const handleToggleClick = (
    e: React.MouseEvent | React.ChangeEvent<HTMLInputElement>,
  ) => {
    e.stopPropagation();
  };

  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    handleClick(e);
  };

  return (
    <div
      {...rest}
      className={classNames(
        styles.dropDownItem,
        {
          [styles.headerItem]: isHeader,
          [styles.separator]: isSeparator,
          [styles.noHover]: noHover || isHeader,
          [styles.noActive]: noActive || isHeader,
          [styles.rtlIem]: !noHover && !isHeader && isRTL,
          [styles.selected]: (disabled && isSelected) || isActive,
          [styles.activeDescendant]: isActiveDescendant && !disabled,
          [styles.textOverflow]: textOverflow,
          [styles.modern]: isModern,
          [styles.disabled]: disabled && !isSelected,
        },
        className,
      )}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      tabIndex={tabIndex}
      data-testid={testId ?? "drop-down-item"}
      data-focused={isActiveDescendant}
      data-tooltip-id={
        withDisabledTooltip && isTouchDevice ? "info-tooltip" : undefined
      }
      data-tooltip-content={
        withDisabledTooltip && isTouchDevice ? tooltip : undefined
      }
      data-tooltip-place="bottom-end"
      role={isSeparator ? "separator" : "option"}
      aria-selected={isSelected}
      aria-disabled={disabled}
      style={
        { "--drop-down-min-width": minWidth, ...style } as React.CSSProperties
      }
    >
      {isHeader && withHeaderArrow ? (
        <div className={styles.iconWrapper} onClick={headerArrowAction}>
          <div className="drop-down-icon_image">
            <ArrowLeftReactUrl />
          </div>
        </div>
      ) : null}

      {icon && !withoutIcon ? (
        <div className={styles.iconWrapper}>
          <IconComponent icon={icon} fillIcon={fillIcon} />
        </div>
      ) : null}

      {isSeparator ? (
        "\u00A0"
      ) : label ? (
        <TooltipContainer
          as="span"
          dir="auto"
          title={!withDisabledTooltip && typeof label === "string" ? label : undefined}
          className={truncateText ? styles.truncateText : undefined}
        >
          {label}
        </TooltipContainer>
      ) : (
        children
      )}

      {isSubMenu ? (
        <div
          className={classNames(styles.iconWrapper, styles.submenuArrow, {
            [styles.RTL]: isRTL,
            [styles.active]: isActive,
          })}
        >
          <div
            data-disabled={disabled}
            className={classNames(
              styles.dropDownItemIcon,
              { [styles.disabled]: disabled },
              "drop-down-item_icon",
            )}
          >
            <RightArrowReactSvgUrl />
          </div>
        </div>
      ) : null}

      {withToggle ? (
        <div className={styles.wrapperToggle} onClick={handleToggleClick}>
          <ToggleButton
            isChecked={checked || false}
            onChange={handleToggleChange}
            noAnimation
          />
        </div>
      ) : null}

      {isBeta ? (
        <div className={styles.wrapperBadge}>
          <Badge
            noHover
            fontSize="9px"
            isHovered={false}
            borderRadius="50px"
            backgroundColor={globalColors.mainPurple}
            label={resolvedBetaLabel}
          />
        </div>
      ) : null}
      {isPaidBadge ? (
        <div className={styles.wrapperBadge}>
          <Badge
            noHover
            fontSize="9px"
            isHovered={false}
            borderRadius="50px"
            style={{ marginInlineStart: "10px" }}
            backgroundColor={
              isBase
                ? globalColors.favoritesStatus
                : globalColors.favoriteStatusDark
            }
            label={badgeLabel || resolvedPaidLabel}
            isPaidBadge
          />
        </div>
      ) : null}

      {withExternalLink && externalLinkPath ? (
        <Link
          type={LinkType.action}
          className={styles.externalLink}
          onClick={(e) => {
            e.stopPropagation();
            onExternalLinkClick?.();
          }}
        >
          <ExternalLinkReactSvgUrl />
        </Link>
      ) : null}

      {additionalElement ? (
        <div className={styles.elementWrapper}>{additionalElement}</div>
      ) : null}
    </div>
  );
};

export { DropDownItem };
