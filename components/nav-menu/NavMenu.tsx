import React, { forwardRef, useState, useEffect, useMemo } from "react";
import { ReactSVG } from "react-svg";
import classNames from "classnames";

import { useAnimation } from "../../hooks/useAnimation";
import { Badge } from "../badge";
import { TooltipContainer } from "../tooltip";
import { createTooltipWrapper } from "../tooltip/sub-components/createTooltipWrapper";
import ExpandArrowIcon from "../../assets/arrow.react.svg";

import {
  NavMenuProps,
  NavMenuItem,
  NavSubItem,
  NavMenuClickMeta,
} from "./NavMenu.types";
import styles from "./NavMenu.module.scss";

// A click with a modifier on a link is the browser's: a new tab or window
// (Ctrl/Cmd, Shift) or a download (Alt). The link does that on its own; the
// entry's onClick, which acts in this tab, must stay out of it.
const isNewContextClick = (e: React.MouseEvent) =>
  e.ctrlKey || e.metaKey || e.shiftKey || e.altKey;

type NavMenuSubItemWrapperProps = {
  subItem: NavSubItem;
  isActive: boolean;
  withAnimation: boolean;
  onSubItemClick: (sub: NavSubItem, meta: NavMenuClickMeta) => void;
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

  const isLink = !!subItem.linkData && !!LinkRouter;

  const handleClick = (e: React.MouseEvent) => {
    if (isLink && isNewContextClick(e)) return;
    onSubItemClick(subItem, { isLink });
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
        {isLink && subItem.linkData && LinkRouter ? (
          <LinkRouter
            to={subItem.linkData.path}
            state={subItem.linkData.state}
            className={itemClassName}
            data-item-id={subItem.id}
            onClick={handleClick}
          >
            {content}
          </LinkRouter>
        ) : (
          <button
            type="button"
            className={itemClassName}
            data-item-id={subItem.id}
            onClick={handleClick}
          >
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

type RailLinkType = ReturnType<
  typeof createTooltipWrapper<
    React.ComponentProps<NonNullable<NavMenuProps["LinkRouter"]>>
  >
>;

type NavMenuItemWrapperProps = {
  item: NavMenuItem;
  isActive: boolean;
  isExpanded: boolean;
  hasChildren: boolean;
  activeItemId?: string;
  withAnimation: boolean;
  iconOnly: boolean;
  withExpandControl: boolean;
  onItemClick: (item: NavMenuItem, meta: NavMenuClickMeta) => void;
  onSubItemClick: (sub: NavSubItem, meta: NavMenuClickMeta) => void;
  onToggleExpand: (item: NavMenuItem) => void;
  LinkRouter?: NavMenuProps["LinkRouter"];
  RailLink?: RailLinkType;
};

const NavMenuItemWrapper = ({
  item,
  isActive,
  isExpanded,
  hasChildren,
  activeItemId,
  withAnimation,
  iconOnly,
  withExpandControl,
  onItemClick,
  onSubItemClick,
  onToggleExpand,
  LinkRouter,
  RailLink,
}: NavMenuItemWrapperProps) => {
  const {
    animationPhase,
    isAnimationReady,
    animationElementRef,
    parentElementRef,
    endWidth,
    triggerAnimation,
  } = useAnimation(isActive);

  const isLink = !hasChildren && !!item.linkData && !!LinkRouter;

  const handleClick = (e: React.MouseEvent) => {
    if (isLink && isNewContextClick(e)) return;
    onItemClick(item, { isLink });
    if (withAnimation) triggerAnimation();
  };

  // Mobile: a separate chevron owns expand/collapse so the item body can stay
  // navigation-only.
  const showExpandControl = withExpandControl && hasChildren && !iconOnly;

  const useCollapsedBadge =
    hasChildren && !isExpanded && item.collapsedBadgeComponent != null;
  const activeBadgeComponent = useCollapsedBadge
    ? item.collapsedBadgeComponent
    : item.badgeComponent;

  const showBadge = item.showBadge || activeBadgeComponent != null;

  const itemClassName = classNames(styles.item, { [styles.active]: isActive });

  // The rail hides the label, so the entry carries it as its name.
  const railLabel = iconOnly ? item.label : undefined;

  const content = (
    <>
      {item.iconNode || item.icon ? (
        <div className={styles.itemIconWrapper}>
          {item.iconNode ? (
            <div className={styles.nodeIcon}>{item.iconNode}</div>
          ) : (
            <ReactSVG className={styles.itemIcon} src={item.icon!} />
          )}
          {showBadge && <span className={styles.itemSignalDot} />}
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
        {isLink && item.linkData && RailLink && iconOnly ? (
          <RailLink
            to={item.linkData.path}
            state={item.linkData.state}
            className={itemClassName}
            data-item-id={item.id}
            title={item.label}
            aria-label={railLabel}
            onClick={handleClick}
          >
            {content}
          </RailLink>
        ) : isLink && item.linkData && LinkRouter ? (
          <LinkRouter
            to={item.linkData.path}
            state={item.linkData.state}
            className={itemClassName}
            data-item-id={item.id}
            onClick={handleClick}
          >
            {content}
          </LinkRouter>
        ) : (
          <TooltipContainer
            as="button"
            type="button"
            className={itemClassName}
            data-item-id={item.id}
            aria-expanded={
              hasChildren && !iconOnly && !withExpandControl
                ? isExpanded
                : undefined
            }
            title={railLabel}
            aria-label={railLabel}
            onClick={handleClick}
          >
            {content}
          </TooltipContainer>
        )}
        {showBadge && (
          <div
            className={styles.itemBadge}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            {activeBadgeComponent ?? (
              <Badge
                label={item.labelBadge}
                onClick={() => item.onClickBadge?.(item.id)}
              />
            )}
          </div>
        )}
        {showExpandControl && (
          <button
            type="button"
            className={styles.expandButton}
            aria-label={item.label}
            aria-expanded={isExpanded}
            onClick={() => onToggleExpand(item)}
          >
            <ExpandArrowIcon
              className={classNames(styles.expandIcon, {
                [styles.expandIconExpanded]: isExpanded,
              })}
            />
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
      withExpandControl = false,
    },
    ref,
  ) => {
    // A set so mobile (withExpandControl) can keep several sections open at
    // once; desktop keeps at most one entry to preserve single-expand.
    const [expandedIds, setExpandedIds] = useState<Set<string>>(() =>
      defaultExpandedId ? new Set([defaultExpandedId]) : new Set(),
    );

    // Keep the parent item expanded whenever the active item changes.
    // Needed when navigation happens outside the menu (URL change, page load).
    useEffect(() => {
      if (!activeItemId) return;
      const allItems = groups.flatMap((g) => g.items);
      const parent = allItems.find((item) =>
        item.children?.some((sub) => sub.id === activeItemId),
      );
      let target: string | null | undefined;
      if (parent) {
        target = parent.id;
      } else {
        const item = allItems.find((i) => i.id === activeItemId);
        // Active item is a top-level item with children — expand it; a
        // childless one (e.g. Overview) collapses the open section (desktop).
        if (item?.children?.length) target = item.id;
        else if (item) target = null;
        else return; // unknown id — leave the current state untouched
      }

      setExpandedIds((prev) => {
        if (withExpandControl) {
          // Mobile: only ensure the active section is open; never auto-collapse
          // the sections the user opened manually.
          if (target == null || prev.has(target)) return prev;
          return new Set(prev).add(target);
        }
        // Desktop: the active section replaces whatever was expanded.
        return target ? new Set([target]) : new Set();
      });
    }, [activeItemId, groups, withExpandControl]);

    // The rail's links show their hidden label as a tooltip, as its buttons do.
    const RailLink = useMemo(
      () => (LinkRouter ? createTooltipWrapper(LinkRouter) : undefined),
      [LinkRouter],
    );

    const handleItemClick = (item: NavMenuItem, meta: NavMenuClickMeta) => {
      // An onClick that returns `false` handled the interaction itself (e.g.
      // opened a modal) and opts out of the default expand/collapse so the
      // sub-menu doesn't toggle behind the modal.
      const handled = item.onClick?.(item, meta) === false;
      if (handled) return;
      // Mobile: the body click is navigation-only; the chevron owns expansion.
      if (withExpandControl) return;
      if (!iconOnly && item.children?.length) {
        // Re-clicking the active section must not collapse it - neither when
        // the item itself is active, nor when the selection sits on one of its
        // sub-items (clicking the parent of the selected sub-item would
        // otherwise collapse the section, only for the effect below to expand
        // it again once the navigation lands, which reads as a flicker).
        // Only a different (non-active) expanded item toggles shut.
        const isActiveSection =
          activeItemId === item.id ||
          item.children.some((sub) => sub.id === activeItemId);
        setExpandedIds((prev) =>
          prev.has(item.id) && !isActiveSection
            ? new Set()
            : new Set([item.id]),
        );
      }
    };

    const handleToggleExpand = (item: NavMenuItem) => {
      setExpandedIds((prev) => {
        const next = new Set(prev);
        if (next.has(item.id)) next.delete(item.id);
        else next.add(item.id);
        return next;
      });
    };

    const handleSubItemClick = (
      subItem: NavSubItem,
      meta: NavMenuClickMeta,
    ) => {
      subItem.onClick?.(subItem, meta);
    };

    // When iconOnly, flatten only the active parent's children into the list
    // so the collapsed sidebar shows the active section's sub-items without
    // exposing all other groups' children.
    const flatten = (items: NavMenuItem[]): NavMenuItem[] => {
      if (!iconOnly) return items;
      const flat: NavMenuItem[] = [];
      for (const item of items) {
        const isActiveParent =
          item.id === activeItemId ||
          item.children?.some((sub) => sub.id === activeItemId);
        // Flattening drops `children`, so the collapsed-badge logic in the item
        // wrapper (which keys off `hasChildren`) no longer applies. Resolve the
        // parent's badge here: an inactive parent (children hidden) shows the
        // aggregated collapsed badge; the active parent — whose children are
        // flattened right below it — shows its own per-section badge.
        const hasChildren = !!item.children?.length;
        const collapsedBadge =
          hasChildren && !isActiveParent && item.collapsedBadgeComponent != null
            ? item.collapsedBadgeComponent
            : item.badgeComponent;
        flat.push({
          ...item,
          children: undefined,
          collapsedBadgeComponent: undefined,
          badgeComponent: collapsedBadge,
        });
        if (isActiveParent) {
          const children = item.children ?? [];
          children.forEach((sub, index) => {
            flat.push({
              id: sub.id,
              label: sub.label,
              icon: sub.icon,
              iconNode: sub.iconNode,
              onClick: sub.onClick
                ? (_item, meta) => sub.onClick?.(sub, meta)
                : undefined,
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
        className={classNames(
          styles.root,
          { [styles.iconOnly]: iconOnly },
          className,
        )}
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
                    isExpanded={expandedIds.has(item.id)}
                    hasChildren={!!item.children?.length}
                    activeItemId={activeItemId}
                    withAnimation={withAnimation}
                    iconOnly={iconOnly}
                    withExpandControl={withExpandControl}
                    onItemClick={handleItemClick}
                    onSubItemClick={handleSubItemClick}
                    onToggleExpand={handleToggleExpand}
                    LinkRouter={LinkRouter}
                    RailLink={RailLink}
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
