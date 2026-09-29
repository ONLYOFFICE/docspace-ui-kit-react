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
      {/* The theme above reaches Storybook's own blocks only. A graphic an
          MDX page draws itself -- the access matrices, the agent-skills
          infographics -- is styled like the kit, under `:global(.dark)`,
          and gets that class from here: nothing else wraps a docs page. */}
      <div className={isDark ? "dark" : "light"}>{children}</div>
    </BaseContainer>
  );
};
