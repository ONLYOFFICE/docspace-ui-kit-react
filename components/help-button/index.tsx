"use client";

import React from "react";
import uniqueId from "lodash/uniqueId";
import classNames from "classnames";
import InfoReactSvg from "../../assets/info.react.svg";
import { IconButton } from "../icon-button";
import { Tooltip } from "../tooltip";
import { groupRoleWhenNamed, pickAriaProps } from "../../utils/aria-props";
import { useCommonTranslation } from "../../utils/i18n";
import { activateOnButtonKey } from "../../utils/keyboard-activation";

import type { HelpButtonProps } from "./HelpButton.types";
import styles from "./HelpButton.module.scss";

export type { HelpButtonProps };

const HelpButton = (props: HelpButtonProps) => {
  const {
    id,
    className = "icon-button",
    size = 12,
    color,
    dataTip,
    getContent,
    place,
    offset,
    style,
    afterShow,
    afterHide,
    tooltipMaxWidth,
    tooltipContent,
    openOnClick = true,
    isClickable = true,
    children,
    isOpen,
    noUserSelect,
    dataTestId,
    tooltipStyle,
    iconNode,
  } = props;

  const t = useCommonTranslation();
  const aria = pickAriaProps(props);
  const currentId = id || uniqueId();
  const ref = React.useRef(null);
  const componentClass = classNames(className, "help-icon");

  const contentString = React.useMemo(() => {
    if (getContent) {
      const content = getContent({ content: null, activeAnchor: null });
      return typeof content === "string" ? content : null;
    }
    return typeof tooltipContent === "string" ? tooltipContent : null;
  }, [getContent, tooltipContent]);

  const useGlobalTooltip = contentString !== null;

  // Both tooltips open on a click on their anchor, which the keyboard can
  // give: the shared one's anchor is the icon, the local one's its SVG. A
  // tooltip that opens on hover has no such route, so its icon stays as it is.
  const isKeyboardButton =
    !!(getContent || tooltipContent) && (useGlobalTooltip || openOnClick);

  // The shared tooltip has a fixed id; the local one gets its own, so the
  // icon can point at it while it is open.
  const localTooltipId = `help-tooltip-${React.useId()}`;
  const tooltipId = useGlobalTooltip ? "info-tooltip" : localTooltipId;

  // A tooltip opened from the keyboard is a toggletip: its text goes into a
  // live region, which a screen reader announces, and it closes when the
  // focus leaves the icon for anything but the tooltip itself.
  const [shownFromKey, setShownFromKey] = React.useState(false);
  const [announcement, setAnnouncement] = React.useState("");
  const anchorRef = React.useRef<Element | null>(null);

  const getShownTooltip = () => document.getElementById(tooltipId);

  const toggleFromAnchor = (anchor: Element) =>
    anchor.dispatchEvent(new MouseEvent("click", { bubbles: true }));

  const openFromKey = (e: React.KeyboardEvent<HTMLDivElement>) =>
    activateOnButtonKey(e, ({ currentTarget }) => {
      const anchor = useGlobalTooltip
        ? currentTarget
        : (currentTarget.querySelector("svg") ?? currentTarget);
      anchorRef.current = anchor;
      // Emptied first, so the same text shown again is a change to announce.
      setAnnouncement("");
      toggleFromAnchor(anchor);

      // The tooltip renders after the click; its text is read from the page
      // once it is there, whatever getContent drew.
      window.setTimeout(() => {
        const tooltip = getShownTooltip();
        setShownFromKey(!!tooltip);
        setAnnouncement(tooltip?.textContent?.trim() ?? "");
      }, 0);
    });

  const onBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!shownFromKey) return;
    const tooltip = getShownTooltip();
    const next = e.relatedTarget as Node | null;
    if (next && (tooltip?.contains(next) || e.currentTarget.contains(next)))
      return;
    setShownFromKey(false);
    setAnnouncement("");
    if (tooltip && anchorRef.current) toggleFromAnchor(anchorRef.current);
  };

  const keyboardProps = isKeyboardButton
    ? {
        role: "button",
        tabIndex: 0,
        onKeyDown: openFromKey,
        ariaLabel: t("Info"),
        "aria-describedby": shownFromKey ? tooltipId : undefined,
      }
    : {};

  const globalTooltipProps = useGlobalTooltip
    ? {
        "data-tooltip-id": "info-tooltip",
        "data-tooltip-content": contentString,
        "data-tooltip-place": place || "top",
      }
    : {};

  const anchorSelect = children
    ? `div[id='${currentId}']`
    : `div[id='${currentId}'] svg`;

  const localTooltipProps = {
    id: localTooltipId,
    clickable: true,
    openOnClick,
    place: place || "top",
    offset,
    afterShow,
    afterHide,
    maxWidth: tooltipMaxWidth,
    anchorSelect,
    isOpen,
    noUserSelect,
    tooltipStyle,
  };

  return (
    <div
      ref={ref}
      style={style}
      data-testid={dataTestId ?? "help-button"}
      onBlur={isKeyboardButton ? onBlur : undefined}
    >
      {children ? (
        <div
          {...aria}
          role={groupRoleWhenNamed(aria)}
          id={currentId}
          className={componentClass}
          {...globalTooltipProps}
        >
          {children}
        </div>
      ) : (
        <IconButton
          {...keyboardProps}
          {...aria}
          id={currentId}
          className={componentClass}
          isClickable={isClickable}
          iconNode={iconNode ?? <InfoReactSvg />}
          size={size}
          color={color}
          data-for={currentId}
          dataTip={dataTip}
          {...globalTooltipProps}
        />
      )}

      {!useGlobalTooltip && (getContent || tooltipContent) ? (
        getContent ? (
          <Tooltip {...localTooltipProps} getContent={getContent} />
        ) : (
          <Tooltip {...localTooltipProps}>{tooltipContent}</Tooltip>
        )
      ) : null}

      {isKeyboardButton && !children ? (
        <span
          className={styles.visuallyHidden}
          role="status"
          data-testid="help-button-announcement"
        >
          {announcement}
        </span>
      ) : null}
    </div>
  );
};

export { HelpButton };
