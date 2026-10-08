import isNil from "lodash/isNil";
import classNames from "classnames";
import React, { FC, useCallback } from "react";

import { useUnmount } from "../../hooks/useUnmount";
import { useCommonTranslation } from "../../utils/i18n";
import { Tag, type TagClickEvent, type TagType } from "../tag";

import styles from "./Tags.module.scss";
import { TagsDropdown } from "./Tags.dropdown";
import { createTag } from "./Tags.constants";
import { calculateRenderedTags, isTagType } from "./Tags.utils";
import type { TagsProps } from "./Tags.types";

/**
 * Makes every tag in the row a keyboard-operable button. `Tag` renders a
 * plain `div` and takes no `role` or `tabIndex`, so the row stamps them on
 * its own direct children; the Enter and Space keys are handled by the row.
 */
const makeTagsFocusable = (root: HTMLElement) => {
  Array.from(root.children).forEach((child) => {
    if (!(child instanceof HTMLElement) || !child.classList.contains("tag"))
      return;

    child.setAttribute("role", "button");

    if (child.getAttribute("aria-disabled") === "true") {
      child.removeAttribute("tabindex");
    } else {
      child.tabIndex = 0;
    }
  });
};

const Tags: FC<TagsProps> = ({
  id,
  tags,
  style,
  className,
  columnCount,
  removeTagIcon = false,
  onSelectTag,
  onMouseEnter,
  onMouseLeave,
  showCreateTag,
  onOptionTagClick,
  optionTagRef,
  ariaLabel = "Tags container",
  createTagLabel,
}) => {
  const t = useCommonTranslation();
  const [renderedTags, setRenderedTags] = React.useState<TagType[]>([]);
  const [containerWidth, setContainerWidth] = React.useState(0);
  const callBackRef = React.useRef<VoidFunction | undefined | null>(null);

  const tagsRef = React.useRef<HTMLDivElement>(null);

  const resolvedCreateTagLabel = createTagLabel || t("AddButton") || "Add";

  React.useEffect(() => {
    const element = tagsRef.current;
    if (!element || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => {
      setContainerWidth(element.offsetWidth);
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  React.useLayoutEffect(() => {
    if (isNil(columnCount) || !tags || !tagsRef.current) return;

    const withDropDownTags = !onOptionTagClick;

    const newTags = calculateRenderedTags(
      tags,
      columnCount,
      tagsRef.current.offsetWidth,
      showCreateTag,
      withDropDownTags,
    );

    setRenderedTags(newTags);
  }, [tags, columnCount, showCreateTag, onOptionTagClick, containerWidth]);

  React.useLayoutEffect(() => {
    if (tagsRef.current) makeTagsFocusable(tagsRef.current);
  }, [renderedTags]);

  useUnmount(() => callBackRef.current?.());

  const handleOptionTagClick = useCallback(() => {
    onOptionTagClick?.();
  }, [onOptionTagClick]);

  // A tag that carries its own `onClick` reports through it rather than
  // through `onSelectTag`, in the row and in the overflow drop-down alike.
  // The drop-down only knows labels, so its entries are matched by label.
  const handleDropdownSelect = useCallback(
    (event: TagClickEvent) => {
      const own = tags.find(
        (tag): tag is TagType =>
          isTagType(tag) && tag.label === event.label && !!tag.onClick,
      );

      if (own?.onClick) {
        own.onClick();
        return;
      }

      onSelectTag(event);
    },
    [tags, onSelectTag],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key !== "Enter" && e.key !== " ") return;

      const target = e.target as HTMLElement;
      if (
        target.parentElement !== e.currentTarget ||
        !target.classList.contains("tag")
      )
        return;

      e.preventDefault();
      target.click();
    },
    [],
  );

  const hasOverflowTag = renderedTags.some(
    (tag) => tag.isOptionTag && tag.key !== createTag.key,
  );

  return (
    <div
      id={id}
      style={style}
      ref={tagsRef}
      role="group"
      data-testid="tags"
      aria-label={ariaLabel}
      className={classNames(styles.tags, className)}
      onKeyDown={handleKeyDown}
    >
      {renderedTags.map((tag, idx) => {
        const isCreateTag = tag.key === createTag.key;
        const key = `${tag.key ?? tag.label}_${idx}`;

        if (tag.isOptionTag && tag.advancedOptions?.length) {
          return (
            <TagsDropdown
              key={key}
              tag={tag.label}
              icon={tag.icon}
              tagMaxWidth={tag.maxWidth}
              providerType={tag.providerType}
              isLast={idx === renderedTags.length - 1}
              label={tag.label}
              roomType={tag.roomType}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
              advancedOptions={tag.advancedOptions}
              onClick={handleDropdownSelect}
              removeTagIcon={removeTagIcon}
              withLabel={!tag.isThirdParty}
            />
          );
        }

        // The ref goes to the overflow tag when there is one, and to the
        // create tag otherwise.
        const takesOptionRef = isCreateTag ? !hasOverflowTag : true;

        const props = tag.isOptionTag
          ? {
              ref: takesOptionRef ? optionTagRef : undefined,
              onClick: handleOptionTagClick,
            }
          : {
              onClick: tag.onClick ? () => tag.onClick?.() : onSelectTag,
            };

        const label = isCreateTag ? resolvedCreateTagLabel : tag.label;

        return (
          <Tag
            key={key}
            tag={label}
            icon={tag.icon}
            withLabel={!tag.isThirdParty && !isCreateTag}
            tagMaxWidth={tag.maxWidth}
            providerType={tag.providerType}
            isLast={idx === renderedTags.length - 1}
            label={label}
            roomType={tag.roomType}
            labelSuffix={tag.labelSuffix}
            labelSuffixColor={tag.labelSuffixColor}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            dataTestId={
              isCreateTag ? "tag_item_create" : `tag_item_${tag.label}`
            }
            {...props}
          />
        );
      })}
    </div>
  );
};

export { Tags };
