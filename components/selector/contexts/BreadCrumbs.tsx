import { createContext, ReactNode } from "react";

import { TSelectorBreadCrumbs } from "../Selector.types";

type TBreadCrumbsContext = TSelectorBreadCrumbs & { bodyIsLoading?: boolean };

export const BreadCrumbsContext = createContext<TBreadCrumbsContext>({});

export const BreadCrumbsProvider = ({
  children,
  ...rest
}: TBreadCrumbsContext & { children: ReactNode }) => {
  return <BreadCrumbsContext value={rest}>{children}</BreadCrumbsContext>;
};
