import React from "react";

import type { TabsProps as AiChatTabsProps } from "@onlyoffice/ai-chat";

import { Tabs, TabsTypes } from "../../../../components/tabs";
import type { TTabItem } from "../../../../components/tabs/Tabs.types";

import styles from "./Tabs.module.scss";

const TabsOverride: React.FC<AiChatTabsProps> = (props) => {
  const { items, defaultValue, value, onValueChange } = props;

  const isControlled = typeof value === "string";
  const [internalValue, setInternalValue] = React.useState<string | undefined>(
    defaultValue ?? items[0]?.value,
  );
  const selectedValue = isControlled ? value : internalValue;

  const mappedItems = React.useMemo<TTabItem[]>(
    () =>
      items.map((item) => ({
        id: item.value,
        name: item.label,
        content: item.content,
        isDisabled: item.disabled,
      })),
    [items],
  );

  const handleSelect = React.useCallback(
    (element: TTabItem) => {
      const next = String(element.id);
      if (!isControlled) setInternalValue(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  return (
    <Tabs
      items={mappedItems}
      onSelect={handleSelect}
      selectedItemId={selectedValue ?? items[0]?.value ?? ""}
      className={styles.tabs}
      withoutStickyIntend
    />
  );
};

TabsOverride.displayName = "TabsOverride";

export { TabsOverride };
