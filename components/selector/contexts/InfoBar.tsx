import React, { PropsWithChildren, createContext } from "react";

import type { TInfoBar } from "../Selector.types";

export const InfoBarContext = createContext<TInfoBar>({});

export const InfoBarProvider = ({
  children,
  ...rest
}: Required<PropsWithChildren> & TInfoBar) => {
  return <InfoBarContext value={rest}>{children}</InfoBarContext>;
};
