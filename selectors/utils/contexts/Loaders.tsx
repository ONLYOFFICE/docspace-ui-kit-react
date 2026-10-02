import { createContext, type ReactNode } from "react";

import useLoadersHelper from "../hooks/useLoadersHelper";

type TLoaderContext = ReturnType<typeof useLoadersHelper>;

export const LoadersContext = createContext<TLoaderContext>({
  isFullLoadActive: true,
  isNextPageLoading: false,
  isContentLoading: false,
  showBreadCrumbsLoader: true,
  showSearchLoader: true,
  showBodyLoader: true,

  startFullLoad: () => {},
  finishFullLoad: () => {},
  startContentLoading: () => {},
  finishContentLoading: () => {},
  hideSectionLoader: () => {},
  setIsNextPageLoading: () => {},
});

export const LoadersContextProvider = ({
  children,
  withInit,
}: {
  children: ReactNode;
  withInit?: boolean;
}) => {
  const value = useLoadersHelper({ withInit });

  return <LoadersContext value={value}>{children}</LoadersContext>;
};
