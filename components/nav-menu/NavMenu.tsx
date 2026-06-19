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

import React, { forwardRef, useState, useEffect } from "react";
import { ReactSVG } from "react-svg";
import classNames from "classnames";

import { useAnimation } from "../../hooks/useAnimation";
import { Badge } from "../badge";
import { TooltipContainer } from "../tooltip";

import { NavMenuProps, NavMenuItem, NavSubItem } from "./NavMenu.types";
import styles from "./NavMenu.module.scss";

type NavMenuSubItemWrapperProps = {
  subItem: NavSubItem;
  isActive: boolean;
  withAnimation: boolean;
  onSubItemClick: (sub: NavSubItem) => void;
  LinkRouter?: NavMenuProps["LinkRouter"];
};

const NavMenuSubItemWrapper = ({
  subItem,
  isActive,
  withAnimation,
  onSubItemClick,
  LinkRouter,
}: NavMenuSubItemWrapperProps) => {
  const {
    animationPhase,
    isAnimationReady,
    animationElementRef,
    parentElementRef,
    endWidth,
    triggerAnimation,
  } = useAnimation(isActive);

  const handleClick = () => {
    onSubItemClick(subItem);
    if (withAnimation) triggerAnimation();
  };

  const itemClassName = classNames(styles.subItem, {
    [styles.active]: isActive,
  });

  const content = (
    <>
      {subItem.iconNode ? (
        <div className={styles.subNodeIcon}>{subItem.iconNode}</div>
      ) : subItem.icon ? (
        <ReactSVG className={styles.subItemIcon} src={subItem.icon} />
      ) : null}
      <span className={styles.subItemText}>{subItem.label}</span>
    </>
  );

  return (
    <li
      className={classNames({
        [styles.subItemWithSeparator]: subItem.withTopSeparator,
      })}
    >
      <div
        ref={parentElementRef as React.RefObject<HTMLDivElement>}
        className={styles.subItemWrapper}
      >
        <div
          ref={animationElementRef}
          className={classNames(styles.subItemSibling, {
            [styles.active]: isActive,
            [styles.animationReady]: isAnimationReady,
            [styles.animatedProgress]:
              isActive && animationPhase === "progress",
            [styles.animatedFinish]: isActive && animationPhase === "finish",
          })}
          style={{ "--end-width": `${endWidth}%` } as React.CSSProperties}
        />
        {subItem.linkData && LinkRouter ? (
          <LinkRouter
            to={subItem.linkData.path}
            state={subItem.linkData.state}
            className={itemClassName}
            onClick={handleClick}
          >
            {content}
          </LinkRouter>
        ) : (
          <button type="button" className={itemClassName} onClick={handleClick}>
            {content}
          </button>
        )}
        {subItem.showBadge && (
          <div
            className={styles.subItemBadge}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            {subItem.badgeComponent ?? (
              <Badge
                label={subItem.labelBadge}
                onClick={() => subItem.onClickBadge?.(subItem.id)}
              />
            )}
          </div>
        )}
      </div>
    </li>
  );
};

type NavMenuItemWrapperProps = {
  item: NavMenuItem;
  isActive: boolean;
  isExpanded: boolean;
  hasChildren: boolean;
  activeItemId?: string;
  withAnimation: boolean;
  iconOnly: boolean;
  onItemClick: (item: NavMenuItem) => void;
  onSubItemClick: (sub: NavSubItem) => void;
  LinkRouter?: NavMenuProps["LinkRouter"];
};

const NavMenuItemWrapper = ({
  item,
  isActive,
  isExpanded,
  hasChildren,
  activeItemId,
  withAnimation,
  iconOnly,
  onItemClick,
  onSubItemClick,
  LinkRouter,
}: NavMenuItemWrapperProps) => {
  const {
    animationPhase,
    isAnimationReady,
    animationElementRef,
    parentElementRef,
    endWidth,
    triggerAnimation,
  } = useAnimation(isActive);

  const handleClick = () => {
    onItemClick(item);
    if (withAnimation) triggerAnimation();
  };

  const itemClassName = classNames(styles.item, { [styles.active]: isActive });

  const content = (
    <>
      {item.iconNode || item.icon ? (
        <div className={styles.itemIconWrapper}>
          {item.iconNode ? (
            <div className={styles.nodeIcon}>{item.iconNode}</div>
          ) : (
            <ReactSVG className={styles.itemIcon} src={item.icon!} />
          )}
          {item.showBadge && (
            <span className={styles.itemSignalDot} />
          )}
        </div>
      ) : null}
      <span className={styles.itemText}>{item.label}</span>
    </>
  );

  return (
    <li
      className={classNames({
        [styles.endOfActiveSection]: item.endOfActiveSection,
        [styles.flattenedChild]: item.isFlattenedChild,
      })}
      style={
        item.isFlattenedChild
          ? ({
              "--flatten-index": item.flattenIndex ?? 0,
            } as React.CSSProperties)
          : undefined
      }
    >
      <div
        ref={parentElementRef as React.RefObject<HTMLDivElement>}
        className={styles.itemWrapper}
      >
        <div
          ref={animationElementRef}
          className={classNames(styles.itemSibling, {
            [styles.active]: isActive,
            [styles.animationReady]: isAnimationReady,
            [styles.animatedProgress]:
              isActive && animationPhase === "progress",
            [styles.animatedFinish]: isActive && animationPhase === "finish",
          })}
          style={{ "--end-width": `${endWidth}%` } as React.CSSProperties}
        />
        {!hasChildren && item.linkData && LinkRouter ? (
          <LinkRouter
            to={item.linkData.path}
            state={item.linkData.state}
            className={itemClassName}
            onClick={handleClick}
          >
            {content}
          </LinkRouter>
        ) : (
          <TooltipContainer
            as="button"
            type="button"
            className={itemClassName}
            aria-expanded={hasChildren && !iconOnly ? isExpanded : undefined}
            title={iconOnly ? item.label : undefined}
            onClick={handleClick}
          >
            {content}
          </TooltipContainer>
        )}
        {item.showBadge && (
          <div
            className={styles.itemBadge}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            {item.badgeComponent ?? (
              <Badge
                label={item.labelBadge}
                onClick={() => item.onClickBadge?.(item.id)}
              />
            )}
          </div>
        )}
      </div>
      {hasChildren && !iconOnly && (
        <div
          className={classNames(styles.subItems, {
            [styles.expanded]: isExpanded,
          })}
        >
          <ul className={styles.subItemsInner}>
            {(item.children ?? []).map((subItem) => (
              <NavMenuSubItemWrapper
                key={subItem.id}
                subItem={subItem}
                isActive={subItem.id === activeItemId}
                withAnimation={withAnimation}
                onSubItemClick={onSubItemClick}
                LinkRouter={LinkRouter}
              />
            ))}
          </ul>
        </div>
      )}
    </li>
  );
};

const NavMenuComponent = forwardRef<HTMLElement, NavMenuProps>(
  (
    {
      groups,
      activeItemId,
      defaultExpandedId,
      withAnimation = false,
      className,
      LinkRouter,
      iconOnly = false,
    },
    ref,
  ) => {
    const [expandedId, setExpandedId] = useState<string | null>(
      defaultExpandedId ?? null,
    );

    // Keep the parent item expanded whenever the active item changes.
    // Needed when navigation happens outside the menu (URL change, page load).
    useEffect(() => {
      if (!activeItemId) return;
      const allItems = groups.flatMap((g) => g.items);
      const parent = allItems.find((item) =>
        item.children?.some((sub) => sub.id === activeItemId),
      );
      if (parent) setExpandedId(parent.id);
      else if (allItems.some((item) => item.id === activeItemId)) {
        // Active item is a top-level item — expand it if it has children.
        const item = allItems.find((i) => i.id === activeItemId);
        if (item?.children?.length) setExpandedId(item.id);
      }
    }, [activeItemId, groups]);

    const handleItemClick = (item: NavMenuItem) => {
      item.onClick?.(item);
      if (!iconOnly && item.children?.length) {
        // Collapse only when the item is also active; non-active expanded
        // items stay open until another item is clicked (by design).
        setExpandedId((prev) =>
          prev === item.id && activeItemId === item.id ? null : item.id,
        );
      }
    };

    const handleSubItemClick = (subItem: NavSubItem) => {
      subItem.onClick?.(subItem);
    };

    // When iconOnly, flatten only the active parent's children into the list
    // so the collapsed sidebar shows the active section's sub-items without
    // exposing all other groups' children.
    const flatten = (items: NavMenuItem[]): NavMenuItem[] => {
      if (!iconOnly) return items;
      const flat: NavMenuItem[] = [];
      for (const item of items) {
        flat.push({ ...item, children: undefined });
        const isActiveParent =
          item.id === activeItemId ||
          item.children?.some((sub) => sub.id === activeItemId);
        if (isActiveParent) {
          const children = item.children ?? [];
          children.forEach((sub, index) => {
            flat.push({
              id: sub.id,
              label: sub.label,
              icon: sub.icon,
              iconNode: sub.iconNode,
              onClick: sub.onClick ? () => sub.onClick?.(sub) : undefined,
              linkData: sub.linkData,
              showBadge: sub.showBadge,
              labelBadge: sub.labelBadge,
              badgeComponent: sub.badgeComponent,
              onClickBadge: sub.onClickBadge,
              // Reveal animation for flattened children in icon-only mode.
              isFlattenedChild: true,
              flattenIndex: index,
              // Spacer below the active section's last item in icon-only mode.
              endOfActiveSection: index === children.length - 1,
            });
          });
        }
      }
      return flat;
    };

    return (
      <nav
        ref={ref}
        className={classNames(styles.root, { [styles.iconOnly]: iconOnly }, className)}
      >
        {groups.map((group) => {
          const items = flatten(group.items);
          return (
            <div key={group.id} className={styles.group}>
              {group.label && (
                <span className={styles.groupLabel}>{group.label}</span>
              )}
              <ul className={styles.itemList}>
                {items.map((item) => (
                  <NavMenuItemWrapper
                    key={item.id}
                    item={item}
                    isActive={item.id === activeItemId}
                    isExpanded={item.id === expandedId}
                    hasChildren={!!item.children?.length}
                    activeItemId={activeItemId}
                    withAnimation={withAnimation}
                    iconOnly={iconOnly}
                    onItemClick={handleItemClick}
                    onSubItemClick={handleSubItemClick}
                    LinkRouter={LinkRouter}
                  />
                ))}
              </ul>
            </div>
          );
        })}
      </nav>
    );
  },
);

NavMenuComponent.displayName = "NavMenu";

export { NavMenuComponent as NavMenu };
