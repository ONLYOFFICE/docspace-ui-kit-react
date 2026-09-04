import { TabsTypes } from "./Tabs.enums";
import { SecondaryTabs } from "./SecondaryTabs";
import { PrimaryTabs } from "./PrimaryTabs";
import { type TTabItem, type TabsProps } from "./Tabs.types";

const Tabs = (props: TabsProps) => {
  if (props?.type === TabsTypes.Secondary) return <SecondaryTabs {...props} />;
  return <PrimaryTabs {...props} />;
};

export { Tabs };
export { TabsTypes };
export { TTabItem, TabsProps };
