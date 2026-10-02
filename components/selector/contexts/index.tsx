import React from "react";

import { ProvidersProps } from "../Selector.types";

import { BreadCrumbsProvider } from "./BreadCrumbs";
import { EmptyScreenProvider } from "./EmptyScreen";
import { InfoBarProvider } from "./InfoBar";
import { SearchProvider } from "./Search";
import { SelectAllProvider } from "./SelectAll";
import { TabsProvider } from "./Tabs";

export const Providers = ({
  children,
  breadCrumbsProps,
  emptyScreenProps,
  infoBarProps,
  searchProps,
  selectAllProps,
  tabsProps,
}: { children: React.ReactNode } & ProvidersProps) => (
  <BreadCrumbsProvider {...breadCrumbsProps}>
    <EmptyScreenProvider {...emptyScreenProps}>
      <InfoBarProvider {...infoBarProps}>
        <SearchProvider {...searchProps}>
          <SelectAllProvider {...selectAllProps}>
            <TabsProvider {...tabsProps}>{children}</TabsProvider>
          </SelectAllProvider>
        </SearchProvider>
      </InfoBarProvider>
    </EmptyScreenProvider>
  </BreadCrumbsProvider>
);
