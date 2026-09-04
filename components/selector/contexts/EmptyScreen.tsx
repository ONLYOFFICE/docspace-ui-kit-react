import { ReactNode, createContext } from "react";

import { TSelectorEmptyScreen } from "../Selector.types";

export const EmptyScreenContext = createContext<TSelectorEmptyScreen>({
  emptyScreenImage: "",
  emptyScreenHeader: "",
  emptyScreenDescription: "",

  searchEmptyScreenImage: "",
  searchEmptyScreenHeader: "",
  searchEmptyScreenDescription: "",
});

export const EmptyScreenProvider = ({
  children,
  ...rest
}: TSelectorEmptyScreen & { children: ReactNode }) => {
  return <EmptyScreenContext value={rest}>{children}</EmptyScreenContext>;
};
