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
import classNames from "classnames";

import { Link, LinkType } from "../link";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";

import type { QuickActionItem, QuickActionsProps } from "./QuickActions.types";

import styles from "./QuickActions.module.scss";

// The collapse affordance only applies past this many tiles. With 4 or fewer
// the grid keeps its original single-row layout and never collapses.
const COLLAPSE_THRESHOLD = 4;

// Returns whether the tiles inside `gridRef` wrap onto more than one row, and
// keeps it in sync on resize. Rows are detected by comparing each tile's
// offsetTop to the first tile's — clipping the container (overflow:hidden)
// doesn't change the tiles' natural layout positions, so this holds while
// collapsed too. Desktop lays the tiles out with flex-wrap:nowrap (they shrink
// instead of wrapping), so this stays false there and the grid never collapses.
const useRowOverflow = (
  gridRef: React.RefObject<HTMLDivElement | null>,
  itemCount: number,
) => {
  const [overflows, setOverflows] = React.useState(false);

  useIsomorphicLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return undefined;

    const measure = () => {
      const tiles = grid.children;
      if (tiles.length < 2) {
        setOverflows(false);
        return;
      }
      const firstTop = (tiles[0] as HTMLElement).offsetTop;
      const lastTop = (tiles[tiles.length - 1] as HTMLElement).offsetTop;
      setOverflows(lastTop > firstTop);
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(grid);
    return () => ro.disconnect();
  }, [gridRef, itemCount]);

  return overflows;
};

const QuickActionTile = ({ item }: { item: QuickActionItem }) => {
  const { icon, label, onClick, href, target, disabled, dataTestId } = item;

  const content = (
    <>
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
      <span className={styles.label}>{label}</span>
    </>
  );

  const tileClassName = classNames(styles.tile, {
    [styles.disabled]: disabled,
  });

  if (href && !disabled) {
    const rel = target === "_blank" ? "noopener noreferrer" : undefined;

    return (
      <a
        className={tileClassName}
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
        aria-label={label}
        data-testid={dataTestId}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={tileClassName}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      data-testid={dataTestId}
    >
      {content}
    </button>
  );
};

export const QuickActions = ({
  items,
  className,
  dataTestId,
  showMoreLabel = "Show more",
}: QuickActionsProps) => {
  const gridRef = React.useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = React.useState(false);

  // Tiles never squash — they keep their width and wrap (handled in CSS via
  // container queries on the banner's own width). The "Show more" collapse,
  // however, only applies past the threshold: with 4 or fewer tiles they just
  // wrap and all stay visible, with no overlay.
  const aboveThreshold = items.length > COLLAPSE_THRESHOLD;

  // Detect whether the tiles actually wrap onto more than one row (measured, not
  // a fixed breakpoint — a wide banner may fit them all on one line). Collapse
  // only when there are enough tiles AND they overflow.
  const overflows = useRowOverflow(gridRef, items.length);
  const collapsible = aboveThreshold && overflows;

  // Once expanded the tiles stay expanded (no "show less"). Reset only when the
  // grid stops being collapsible — e.g. the container grows so everything fits
  // on one row again — so a later overflow starts collapsed.
  React.useEffect(() => {
    if (!collapsible) setExpanded(false);
  }, [collapsible]);

  // Collapsed: clip the grid so only the first row plus a peek shows, with the
  // blurred "Show more" overlay on top. Expanding removes the clip. Every tile
  // stays mounted either way (the clip is purely visual).
  const isCollapsed = collapsible && !expanded;

  const grid = (
    <div ref={gridRef} className={styles.grid}>
      {items.map((item) => (
        <QuickActionTile key={item.id} item={item} />
      ))}
    </div>
  );

  if (items.length === 0) return null;

  return (
    <div
      className={classNames(styles.quickActions, className, {
        [styles.collapsed]: isCollapsed,
      })}
      data-testid={dataTestId}
    >
      {grid}
      {isCollapsed ? (
        <button
          type="button"
          className={styles.showMore}
          onClick={() => setExpanded(true)}
          data-testid="quick-actions-show-more"
        >
          <Link
            className={styles.showMoreLabel}
            type={LinkType.action}
            isHovered
            // The wrapping <button> owns the click; render the link as plain
            // styled text so it doesn't nest an interactive control.
            tabIndex={-1}
          >
            {showMoreLabel}
          </Link>
        </button>
      ) : null}
    </div>
  );
};

export type { QuickActionItem, QuickActionsProps };

export * from "./icons";
