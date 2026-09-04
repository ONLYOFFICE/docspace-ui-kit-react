import type { ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import ErrorUnavailable from "./ErrorUnavailable";
import { setupErrorI18n } from "./stories.utils";

const meta = {
  title: "Components/Errors/ErrorUnavailable",
  tags: ["!autodocs"],
  component: ErrorUnavailable,
  parameters: {
    docs: {
      description: {
        component: `Unavailable error page. Displayed when the portal has been deactivated.

### Features

- **Full-Page Display**: Renders a complete error page with animated SVG decorations
- **Internationalized**: Uses translation keys for localized error messaging
- **Consistent Styling**: Built on the ErrorContainer base component
- **Deactivation Notice**: Clearly communicates that the portal is unavailable

### Usage

\`\`\`tsx
import ErrorUnavailable from "@docspace/ui-kit/errors/ErrorUnavailable";

<ErrorUnavailable />
\`\`\``,
      },
    },
  },
  decorators: [
    (Story) => {
      setupErrorI18n();
      return <Story />;
    },
  ],
} satisfies Meta<typeof ErrorUnavailable>;

type Story = StoryObj<ComponentProps<typeof ErrorUnavailable>>;

export default meta;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Default unavailable error page with standard messaging.",
      },
      source: {
        code: `<ErrorUnavailable />`,
      },
    },
  },
};
