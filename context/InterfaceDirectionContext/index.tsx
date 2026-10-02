"use client";

import { createContext, type ReactNode, use } from "react";

export type TInterfaceDirection = "rtl" | "ltr";

type InterfaceDirectionProviderProps = {
  interfaceDirection: TInterfaceDirection;
  children: ReactNode;
};

export const InterfaceDirectionContext =
  createContext<TInterfaceDirection>("ltr");

export const InterfaceDirectionProvider = ({
  interfaceDirection,
  children,
}: InterfaceDirectionProviderProps) => {
  return (
    <InterfaceDirectionContext value={interfaceDirection}>
      {children}
    </InterfaceDirectionContext>
  );
};

export const useInterfaceDirection = () => {
  const interfaceDirection = use(InterfaceDirectionContext);

  const isRTL = interfaceDirection === "rtl";

  return { interfaceDirection, isRTL };
};
