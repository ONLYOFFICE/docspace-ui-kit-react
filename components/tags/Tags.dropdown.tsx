import {
  FC,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import classNames from "classnames";

import { useUnmount } from "../../hooks/useUnmount";
import { consumeKey } from "../../utils/consume-key";

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
  const entryIdPrefix = useId();

  const entryId = (index: number) => `${entryIdPrefix}-tag-entry-${index}`;

  const focusEntry = (index: number) => {
    const count = advancedOptions.length;
    if (!count) return;
    const next = (index + count) % count;
    document.getElementById(entryId(next))?.focus();
  };

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

  const closeAndReturnFocus = () => {
    setOpenDropdown(false);
    tagRef.current?.focus();
  };

  const selectEntry = useCallback(
    (label: string) => {
      const { roomType, providerType, isDisabled, isDeleted } = tagProps;

      if (onClick && !isDisabled && !isDeleted) {
        onClick({ roomType, label, providerType });
        setOpenDropdown(false);
      }
    },
    [onClick, tagProps],
  );

  // DropDownItem takes no key handler, so the open menu listens on the
  // document for keys pressed on one of its own entries. It listens in the
  // capture phase, ahead of the portal's own document hotkeys, so that a key
  // it handles (consumeKey) reaches neither them nor a dialog around it.
  useEffect(() => {
    if (!openDropdown) return;

    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const onTag = !!target && target === tagRef.current;
      const index = advancedOptions.findIndex(
        (_, i) => target?.id === entryId(i),
      );

      if (e.key === "Escape" && (onTag || index !== -1)) {
        e.preventDefault();
        consumeKey(e);
        closeAndReturnFocus();
        return;
      }

      if (index === -1) return;

      switch (e.key) {
        case "Enter":
        case " ":
          e.preventDefault();
          consumeKey(e);
          selectEntry(advancedOptions[index]);
          tagRef.current?.focus();
          break;
        case "ArrowDown":
          e.preventDefault();
          consumeKey(e);
          focusEntry(index + 1);
          break;
        case "ArrowUp":
          e.preventDefault();
          consumeKey(e);
          focusEntry(index - 1);
          break;
        default:
      }
    };

    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [openDropdown, advancedOptions, selectEntry]);

  // The overflow tag opens a list box; say so, and whether it is open.
  useLayoutEffect(() => {
    const tag = tagRef.current;
    if (!tag) return;
    tag.setAttribute("aria-haspopup", "listbox");
    tag.setAttribute("aria-expanded", String(openDropdown));
  }, [openDropdown]);

  // Opened from the keyboard, the focus is on the overflow tag: move it to
  // the first entry so the hidden labels can be reached.
  useEffect(() => {
    if (!openDropdown) return;
    if (document.activeElement !== tagRef.current) return;
    const frame = requestAnimationFrame(() => focusEntry(0));
    return () => cancelAnimationFrame(frame);
  }, [openDropdown]);

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
        {advancedOptions.map((tag, index) => (
          <DropDownItem
            className="tag__dropdown-item tag"
            key={tag}
            id={entryId(index)}
            tabIndex={0}
            onClick={() => selectEntry(tag)}
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
