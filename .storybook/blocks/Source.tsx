import type { ComponentProps } from "react";
import { Source as BaseSource } from "@storybook/addon-docs/blocks";
import { useDarkMode } from "@vueless/storybook-dark-mode";

/**
 * Storybook's `Source` block, following the dark-mode toggle. The block
 * takes its colours from its own `dark` prop rather than from the docs
 * theme, so on its own a code listing stays light on a dark page.
 */
export const Source = (props: ComponentProps<typeof BaseSource>) => {
  const isDark = useDarkMode();
  return <BaseSource dark={isDark} {...props} />;
};
