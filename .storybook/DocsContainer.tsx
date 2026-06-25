import React, { type PropsWithChildren } from "react";
import {
  DocsContainer as BaseContainer,
  type DocsContainerProps,
} from "@storybook/addon-docs/blocks";
import { useDarkMode } from "@vueless/storybook-dark-mode";

import darkTheme from "./darkTheme";
import lightTheme from "./lightTheme";

export const DocsContainer = ({
  children,
  context,
}: PropsWithChildren<DocsContainerProps>) => {
  const isDark = useDarkMode();

  return (
    <BaseContainer context={context} theme={isDark ? darkTheme : lightTheme}>
      {children}
    </BaseContainer>
  );
};
