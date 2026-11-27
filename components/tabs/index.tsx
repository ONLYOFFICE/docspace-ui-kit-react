import { TabsTypes } from "./Tabs.enums";
import { SecondaryTabs } from "./SecondaryTabs";
import { PrimaryTabs } from "./PrimaryTabs";
import { type TTabItem, type TabsProps } from "./Tabs.types";

const Tabs = (props: TabsProps) => {
  // Each bar gets only its own props; the rest would reach the DOM.
  const {
    type,
    layoutId,
    isLoading,
    scaled,
    withoutArrows,
    hotkeysId,
    withAnimation,
    stickyHeader,
    ...common
  } = props;

  if (type === TabsTypes.Secondary)
    return (
      <SecondaryTabs
        {...common}
        layoutId={layoutId}
        isLoading={isLoading}
        scaled={scaled}
        withoutArrows={withoutArrows}
        hotkeysId={hotkeysId}
      />
    );

  return (
    <PrimaryTabs
      {...common}
      withAnimation={withAnimation}
      stickyHeader={stickyHeader}
    />
  );
};

export { Tabs };
export { TabsTypes };
export { TTabItem, TabsProps };
