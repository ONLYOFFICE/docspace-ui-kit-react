import { ReactNode, createContext } from "react";

import { TSelectorTabs } from "../Selector.types";

export const TabsContext = createContext<TSelectorTabs>({});

export const TabsProvider = ({
  children,
  ...rest
}: TSelectorTabs & { children: ReactNode }) => {
  return <TabsContext value={rest}>{children}</TabsContext>;
};
