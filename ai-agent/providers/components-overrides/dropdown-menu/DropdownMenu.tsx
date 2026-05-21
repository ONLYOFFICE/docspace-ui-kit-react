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

import React from "react";

import type {
  DropdownMenuProps as AiChatDropdownMenuProps,
  DropDownItemProps as AiChatDropDownItemProps,
} from "@onlyoffice/ai-chat";
import { useImages, useTheme } from "@onlyoffice/ai-chat";

import { DropDown } from "../../../../components/drop-down";
import { DropDownItem } from "../../../../components/drop-down-item";
import type { TDirectionX, TDirectionY } from "../../../../types";

// Map Radix-style `side` to DocSpace `directionY`. Radix `left`/`right` are
// horizontal-axis placements that DocSpace DropDown does not model directly,
// so we coalesce to vertical "both" (auto-flip), which matches the dominant
// pattern across the six DropdownMenu callsites in `@onlyoffice/ai-chat`.
const sideToDirectionY = (
  side: AiChatDropdownMenuProps["side"],
): TDirectionY => {
  if (side === "top") return "top";
  if (side === "bottom") return "bottom";
  return "both";
};

const alignToDirectionX = (
  align: AiChatDropdownMenuProps["align"],
): TDirectionX => (align === "end" ? "right" : "left");

type ItemAdapterOpts = {
  closeMenu: () => void;
  resolveIcon: (
    icon: string | React.ReactNode,
  ) => string | React.ElementType | undefined;
};

const mapItemToDocSpace = (
  item: AiChatDropDownItemProps,
  { closeMenu, resolveIcon }: ItemAdapterOpts,
) => {
  // ai-chat onClick: (e: Event) => void
  // DocSpace onClick: (e: React.MouseEvent<HTMLElement> | React.ChangeEvent<HTMLInputElement>) => void
  // Forward the underlying native event so consumers that read e.target etc still work.
  const handleClick = (
    e: React.MouseEvent<HTMLElement> | React.ChangeEvent<HTMLInputElement>,
  ) => {
    item.onClick(e.nativeEvent);
    closeMenu();
  };

  // trailingIcon → additionalElement (rendered at the end of the row).
  // Materialize as JSX here so DropDownItem can render it inline.
  const trailing = resolveIcon(item.trailingIcon);
  let trailingNode: React.ReactNode;
  if (typeof trailing === "string") {
    trailingNode = (
      <img
        src={trailing}
        width={item.trailingIconSize ?? 16}
        height={item.trailingIconSize ?? 16}
        alt=""
      />
    );
  } else if (trailing) {
    const TrailingIcon = trailing;
    trailingNode = <TrailingIcon size={item.trailingIconSize ?? 16} />;
  }

  return {
    id: item.id,
    label: item.text,
    icon: resolveIcon(item.icon),
    isActive: item.isActive,
    isSeparator: item.isSeparator,
    withToggle: item.withToggle,
    checked: item.toggleChecked,
    additionalElement: trailingNode,
    onClick: handleClick,
  };
};

const DropdownMenuOverride: React.FC<AiChatDropdownMenuProps> = (props) => {
  const {
    trigger,
    items,
    side,
    align,
    sideOffset,
    alignOffset,
    contentClassName,
    maxWidth,
    matchTriggerWidth,
    open,
    containerRef,
    onOpenChange,
  } = props;

  const { getIconComponent, getImageSrc } = useImages();
  const { themeType, scale } = useTheme();

  // DocSpace DropDownItem's IconComponent only handles `string` (image src
  // / data URL) or `React.ElementType` (component reference) — not rendered
  // JSX elements. Return shapes accordingly: never JSX.
  const resolveIcon = React.useCallback(
    (icon: string | React.ReactNode): string | React.ElementType | undefined => {
      if (icon == null) return undefined;
      if (typeof icon !== "string") {
        // ai-chat callsites in practice pass icon names (strings); JSX as
        // an item icon is unused today. If we ever see one, wrap it once.
        if (React.isValidElement(icon)) {
          const Wrapped: React.FC = () => icon;
          return Wrapped;
        }
        return undefined;
      }

      const IconComponent = getIconComponent(icon);
      if (IconComponent) return IconComponent;

      const result = getImageSrc(icon, themeType, scale);
      if (result) return result.src;

      return undefined;
    },
    [getIconComponent, getImageSrc, themeType, scale],
  );

  const triggerRef = React.useRef<HTMLDivElement>(null);

  const isControlled = typeof open === "boolean";
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isOpen = isControlled ? open : internalOpen;

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const closeMenu = React.useCallback(() => setOpen(false), [setOpen]);

  // matchTriggerWidth: measure trigger and pass as manualWidth.
  const [triggerWidth, setTriggerWidth] = React.useState<number | null>(null);
  React.useLayoutEffect(() => {
    if (!matchTriggerWidth) return;
    const el = triggerRef.current;
    if (!el) return;
    setTriggerWidth(el.getBoundingClientRect().width);
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setTriggerWidth(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [matchTriggerWidth]);

  const directionY = sideToDirectionY(side);
  const directionX = alignToDirectionX(align);

  const handleTriggerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setOpen(!isOpen);
  };

  return (
    <>
      <div
        ref={triggerRef}
        onClick={handleTriggerClick}
        style={{ display: "inline-flex" }}
      >
        {trigger}
      </div>
      <DropDown
        forwardedRef={triggerRef}
        open={isOpen}
        // Skip closing when the click originates from our own trigger
        // wrapper — our onClick already toggles, and double-firing would
        // immediately reopen via click-then-listener ordering.
        clickOutsideAction={(e) => {
          const target = e.target;
          if (
            target instanceof Node &&
            triggerRef.current?.contains(target)
          )
            return;
          setOpen(false);
        }}
        // `withBackdrop=false` removes the dimming layer; we still need
        // window-level outside-click detection, which DropDown only wires
        // up when `eventTypes` is set.
        eventTypes={["click"]}
        withBackdrop={false}
        directionX={directionX}
        directionY={directionY}
        offsetX={alignOffset}
        topSpace={directionY === "top" ? sideOffset : undefined}
        bottomSpace={directionY === "bottom" ? sideOffset : undefined}
        manualWidth={
          matchTriggerWidth && triggerWidth != null
            ? `${triggerWidth}px`
            : undefined
        }
        appendTo={containerRef ?? undefined}
        className={contentClassName}
        style={maxWidth != null ? { maxWidth } : undefined}
      >
        {items.map((item, idx) => {
          const mapped = mapItemToDocSpace(item, { closeMenu, resolveIcon });
          // subMenu / tooltipText not yet supported — none of the six real
          // ai-chat callsites use them today.
          return (
            <DropDownItem key={mapped.id ?? `item-${idx}`} {...mapped} />
          );
        })}
      </DropDown>
    </>
  );
};

DropdownMenuOverride.displayName = "DropdownMenuOverride";

export { DropdownMenuOverride };
