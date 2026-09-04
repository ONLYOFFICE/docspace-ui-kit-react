"use client";

import React from "react";
import uniqueId from "lodash/uniqueId";
import classNames from "classnames";
import InfoReactSvg from "../../assets/info.react.svg";
import { IconButton } from "../icon-button";
import { Tooltip } from "../tooltip";

import type { HelpButtonProps } from "./HelpButton.types";

export type { HelpButtonProps };

const HelpButton = (props: HelpButtonProps) => {
  const {
    id,
    className = "icon-button",
    iconName,
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
    <div ref={ref} style={style} data-testid={dataTestId ?? "help-button"}>
      {children ? (
        <div id={currentId} className={componentClass} {...globalTooltipProps}>
          {children}
        </div>
      ) : (
        <IconButton
          id={currentId}
          className={componentClass}
          isClickable={isClickable}
          iconName={iconName}
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
    </div>
  );
};

export { HelpButton };
