// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

import React, { forwardRef, useState } from "react";
import { ReactSVG } from "react-svg";
import classNames from "classnames";

import { useAnimation } from "../../hooks/useAnimation";
import { Badge } from "../badge";

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
    <li>
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
      {item.iconNode ? (
        <div className={styles.nodeIcon}>{item.iconNode}</div>
      ) : item.icon ? (
        <ReactSVG className={styles.itemIcon} src={item.icon} />
      ) : null}
      <span className={styles.itemText}>{item.label}</span>
      {item.showBadge && (
        <div
          className={styles.itemBadge}
          onClick={(e) => {
            e.stopPropagation();
            item.onClickBadge?.(item.id);
          }}
        >
          {item.badgeComponent ?? <Badge label={item.labelBadge} />}
        </div>
      )}
    </>
  );

  return (
    <li>
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
          <button
            type="button"
            className={itemClassName}
            aria-expanded={hasChildren && !iconOnly ? isExpanded : undefined}
            title={iconOnly ? item.label : undefined}
            onClick={handleClick}
          >
            {content}
          </button>
        )}
      </div>
      {hasChildren && !iconOnly && (
        <div
          className={classNames(styles.subItems, {
            [styles.expanded]: isExpanded,
          })}
        >
          <ul className={styles.subItemsInner}>
            {item.children!.map((subItem) => (
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

    const handleItemClick = (item: NavMenuItem) => {
      item.onClick?.(item);
      if (!iconOnly && item.children?.length) {
        setExpandedId((prev) =>
          prev === item.id && activeItemId === item.id ? null : item.id,
        );
      }
    };

    const handleSubItemClick = (subItem: NavSubItem) => {
      subItem.onClick?.(subItem);
    };

    return (
      <nav
        ref={ref}
        className={classNames(styles.root, { [styles.iconOnly]: iconOnly }, className)}
      >
        {groups.map((group) => (
          <div key={group.id} className={styles.group}>
            {group.label && (
              <span className={styles.groupLabel}>{group.label}</span>
            )}
            <ul className={styles.itemList}>
              {group.items.map((item) => (
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
        ))}
      </nav>
    );
  },
);

NavMenuComponent.displayName = "NavMenu";

export { NavMenuComponent as NavMenu };
