import type { ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { ErrorInvalidLink } from "./ErrorInvalidLink";
import { setupErrorI18n } from "./stories.utils";

const meta = {
  title: "Components/Errors/ErrorInvalidLink",
  tags: ["!autodocs"],
  component: ErrorInvalidLink,
  parameters: {
    docs: {
      description: {
        component: `Invalid link error page. Displayed when a shared or invitation link is expired or does not exist.

### Features

- **Full-Page Display**: Renders a complete error page with animated SVG decorations
- **Internationalized**: Uses translation keys for localized error messaging
- **Consistent Styling**: Built on the ErrorContainer base component
- **Link Validation Feedback**: Clearly communicates that the link is invalid or expired

### Usage

\`\`\`tsx
import { ErrorInvalidLink } from "@onlyoffice/apps-ui-kit/errors";

<ErrorInvalidLink />
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
} satisfies Meta<typeof ErrorInvalidLink>;

type Story = StoryObj<ComponentProps<typeof ErrorInvalidLink>>;

export default meta;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Default invalid link error page with standard messaging.",
      },
      source: {
        code: `<ErrorInvalidLink />`,
      },
    },
  },
};
