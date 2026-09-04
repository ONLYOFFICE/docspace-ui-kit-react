import { useEffect, useRef } from "react";
import type React from "react";

import { Tooltip as ReactTooltip, type TooltipRefProps } from "react-tooltip";
import { flip, offset, shift } from "@floating-ui/dom";

import { checkIsSSR } from "../../utils/device";

import { Portal } from "../portal";

import { DEFAULT_OFFSET } from "./Tooltip.constants";
import styles from "./Tooltip.module.scss";

declare global {
  interface Window {
    __systemTooltipRef?: React.RefObject<TooltipRefProps | null>;
  }
}

const globalCloseEvents = {
  escape: true,
  resize: true,
  scroll: true,
  clickOutsideAnchor: true,
};

const openEvents = {
  click: true,
  mouseenter: false,
};

const closeEvents = {
  click: true,
  mouseleave: false,
};

const RootTooltip = () => {
  const systemTooltipRef = useRef<TooltipRefProps>(null);
  const infoTooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!checkIsSSR()) {
      window.__systemTooltipRef = systemTooltipRef;
    }
  }, []);

  const renderTooltip = (
    id: string,
    ref:
      | React.RefObject<TooltipRefProps | null>
      | React.RefObject<HTMLDivElement | null>,
    testId: string,
    imperativeMode: boolean,
    openOnClick: boolean = false,
  ) => {
    return (
      <div
        ref={
          imperativeMode
            ? undefined
            : (ref as React.RefObject<HTMLDivElement | null>)
        }
        className={styles.tooltip}
        data-testid={testId}
      >
        <ReactTooltip
          ref={
            imperativeMode
              ? (ref as React.RefObject<TooltipRefProps | null>)
              : undefined
          }
          id={id}
          opacity={1}
          place="bottom"
          noArrow
          className="__react_component_tooltip"
          globalCloseEvents={globalCloseEvents}
          openEvents={openOnClick ? openEvents : undefined}
          closeEvents={openOnClick ? closeEvents : undefined}
          delayShow={0}
          clickable={openOnClick}
          imperativeModeOnly={imperativeMode}
          middlewares={[
            offset(DEFAULT_OFFSET),
            flip({
              crossAxis: false,
              fallbackPlacements: [
                "right",
                "bottom",
                "left",
                "top",
                "top-start",
                "top-end",
                "right-start",
                "right-end",
                "bottom-start",
                "bottom-end",
                "left-start",
                "left-end",
              ],
            }),
            shift(),
          ]}
        />
      </div>
    );
  };

  const systemTooltip = renderTooltip(
    "system-tooltip",
    systemTooltipRef,
    "system-tooltip-container",
    true,
    false,
  );

  const infoTooltip = renderTooltip(
    "info-tooltip",
    infoTooltipRef,
    "info-tooltip-container",
    false,
    true,
  );

  const rootElement = !checkIsSSR()
    ? document?.getElementById("root") || document?.body
    : null;

  return (
    <>
      <Portal
        element={systemTooltip}
        appendTo={rootElement || undefined}
        visible
      />
      <Portal
        element={infoTooltip}
        appendTo={rootElement || undefined}
        visible
      />
    </>
  );
};

RootTooltip.displayName = "RootTooltip";

export { RootTooltip };
