import { FC, useCallback, useRef, useState } from "react";
import classNames from "classnames";

import { useUnmount } from "../../hooks/useUnmount";

import { DropDown } from "../drop-down";
import { DropDownItem } from "../drop-down-item";
import { Text } from "../text";
import { Tag } from "../tag";

import styles from "./Tags.module.scss";
import type { DropDownTagsProps } from "./Tags.types";

export const TagsDropdown: FC<DropDownTagsProps> = ({
  removeTagIcon = false,
  onClick,
  advancedOptions,
  ...tagProps
}) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const tagRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(true);

  const onClickOutside = useCallback((e: Event) => {
    const target = e.target as HTMLElement;
    if (
      (!!target &&
        typeof target.className !== "object" &&
        target.className?.includes("advanced-tag")) ||
      !isMountedRef.current
    )
      return;

    setOpenDropdown(false);
  }, []);

  const openDropdownAction = () => {
    setOpenDropdown(true);
  };

  const onClickAction = useCallback(
    (e: React.MouseEvent | React.ChangeEvent) => {
      const { roomType, providerType, isDisabled, isDeleted } = tagProps;

      if (onClick && !isDisabled && !isDeleted) {
        const target = e.target as HTMLDivElement;
        const label = target.dataset.tag;

        if (!label) return;

        onClick({ roomType, label, providerType });
        setOpenDropdown(false);
      }
    },
    [onClick, tagProps],
  );

  useUnmount(() => {
    isMountedRef.current = false;
  });

  return (
    <>
      <Tag ref={tagRef} onClick={openDropdownAction} {...tagProps} />
      <DropDown
        open={openDropdown}
        forwardedRef={tagRef}
        clickOutsideAction={onClickOutside}
        isDefaultMode
        directionY="both"
      >
        {advancedOptions.map((tag) => (
          <DropDownItem
            className="tag__dropdown-item tag"
            key={tag}
            onClick={onClickAction}
            data-tag={tag}
            testId={"tag_dropdown_item"}
          >
            <Text
              className={classNames(styles.dropdownText, {
                [styles.removeTagIcon]: removeTagIcon,
              })}
              fontWeight={600}
              fontSize="12px"
              truncate
            >
              {tag}
            </Text>
          </DropDownItem>
        ))}
      </DropDown>
    </>
  );
};
