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
