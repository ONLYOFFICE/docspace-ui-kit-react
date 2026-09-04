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
  description,
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
  const hasDescription = Boolean(description);

  const labelNode = (
    <TooltipContainer
      as="span"
      dir="auto"
      title={!withDisabledTooltip && typeof label === "string" ? label : undefined}
      className={truncateText ? styles.truncateText : undefined}
    >
      {label}
    </TooltipContainer>
  );

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
          [styles.withDescription]: hasDescription,
          // [styles.disabled]: disabled && !isSelected,
          [styles.disabled]: disabled,
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

      {isSeparator ? "\u00A0" : null}
      {!isSeparator && label ? labelNode : null}
      {!isSeparator && !label ? children : null}

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

      {/* last, so badges and toggles stay on the label row */}
      {!isSeparator && label && hasDescription ? (
        <>
          {/* full-width and zero-height: forces the description below the row
              even when the item is wide enough to fit both side by side */}
          <div className={styles.lineBreak} />
          <div className={styles.itemDescription}>{description}</div>
        </>
      ) : null}
    </div>
  );
};

export { DropDownItem };
