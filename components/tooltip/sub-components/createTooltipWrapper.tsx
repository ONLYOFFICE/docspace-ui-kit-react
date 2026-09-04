import type React from "react";
import { forwardRef, useEffect, useState } from "react";

import { useTooltipControl } from "../hooks/useTooltipControl";
import type { MouseEventHandler, WithTooltipProps } from "../Tooltip.types";

export const createTooltipWrapper = <TProps extends object>(
  Component: React.ComponentType<TProps>,
) => {
  type PropsWithHandlers = TProps &
    WithTooltipProps & {
      onClick?: MouseEventHandler;
      onMouseEnter?: MouseEventHandler;
      onMouseLeave?: MouseEventHandler;
      onMouseMove?: MouseEventHandler;
    };

  const ComponentWithTooltip = forwardRef<HTMLElement, PropsWithHandlers>(
    (props, ref) => {
      const {
        title,
        tooltipContent,
        onClick,
        onMouseEnter,
        onMouseLeave,
        onMouseMove,
        ...componentProps
      } = props;

      const content = tooltipContent || title;
      const contentString = typeof content === "string" ? content : undefined;

      // `data-tooltip-element` and the tooltip event handlers are attached
      // only after first mount on the client. The server's rendered DOM
      // therefore always matches the client's *first* render — the upgrade
      // happens in a follow-up render, so React never reports a hydration
      // mismatch when `contentString` differs between server/client (e.g.
      // when the host translation is still warming up on the server pass).
      const [mounted, setMounted] = useState(false);
      useEffect(() => {
        setMounted(true);
      }, []);

      const tooltipHandlers = useTooltipControl(
        onClick,
        onMouseEnter,
        onMouseLeave,
        contentString,
      );

      const isTestEnvironment =
        typeof process !== "undefined" && process.env?.NODE_ENV === "test";

      if (isTestEnvironment && contentString) {
        return (
          <Component
            ref={ref}
            {...(componentProps as TProps)}
            title={contentString}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onMouseMove={onMouseMove}
          />
        );
      }

      if (!contentString || !mounted) {
        return (
          <Component
            ref={ref}
            {...(componentProps as TProps)}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onMouseMove={onMouseMove}
          />
        );
      }

      const element = (
        <Component
          ref={ref}
          {...(componentProps as TProps)}
          data-tooltip-element={tooltipHandlers.anchorId}
          onMouseEnter={tooltipHandlers.handleMouseEnter}
          onMouseMove={tooltipHandlers.handleMouseMove}
          onMouseLeave={tooltipHandlers.handleMouseLeave}
          onClick={tooltipHandlers.handleClick}
        />
      );

      return element;
    },
  );

  ComponentWithTooltip.displayName = `withTooltip(${
    Component.displayName || Component.name || "Component"
  })`;

  return ComponentWithTooltip;
};
