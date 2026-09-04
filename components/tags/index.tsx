import isNil from "lodash/isNil";
import classNames from "classnames";
import React, { FC, useCallback } from "react";

import { useUnmount } from "../../hooks/useUnmount";
import { Tag, type TagType } from "../tag";

import styles from "./Tags.module.scss";
import { TagsDropdown } from "./Tags.dropdown";
import { calculateRenderedTags } from "./Tags.utils";
import type { TagsProps } from "./Tags.types";

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
}) => {
  const [renderedTags, setRenderedTags] = React.useState<TagType[]>([]);
  const callBackRef = React.useRef<VoidFunction | undefined | null>(null);

  const tagsRef = React.useRef<HTMLDivElement>(null);

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
  }, [tags, columnCount, showCreateTag]);

  useUnmount(() => callBackRef.current?.());

  const handleOptionTagClick = useCallback(() => {
    onOptionTagClick?.();
  }, [onOptionTagClick]);

  return (
    <div
      id={id}
      style={style}
      ref={tagsRef}
      data-testid="tags"
      aria-label="Tags container"
      className={classNames(styles.tags, className)}
    >
      {renderedTags.map((tag, idx) => {
        if (tag.isOptionTag && tag.advancedOptions?.length) {
          return (
            <TagsDropdown
              key={tag.key}
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
              onClick={onSelectTag}
              removeTagIcon={removeTagIcon}
              withLabel={!tag.isThirdParty}
            />
          );
        }

        const props = tag.isOptionTag
          ? {
              ref: optionTagRef,
              onClick: handleOptionTagClick,
            }
          : {
              onClick: onSelectTag,
            };

        return (
          <Tag
            key={tag.label}
            tag={tag.label}
            icon={tag.icon}
            withLabel={!tag.isThirdParty}
            tagMaxWidth={tag.maxWidth}
            providerType={tag.providerType}
            isLast={idx === renderedTags.length - 1}
            label={tag.label}
            roomType={tag.roomType}
            labelSuffix={tag.labelSuffix}
            labelSuffixColor={tag.labelSuffixColor}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            dataTestId={`tag_item_${tag.label}`}
            {...props}
          />
        );
      })}
    </div>
  );
};

export { Tags };
