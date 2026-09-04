import type { ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { AccessRestricted } from "./AccessRestricted";
import { setupErrorI18n } from "./stories.utils";

const meta = {
  title: "Components/Errors/AccessRestricted",
  tags: ["!autodocs"],
  component: AccessRestricted,
  parameters: {
    docs: {
      description: {
        component: `Access restricted error page. Displayed when the user's account is restricted from accessing the portal.

### Features

- **Full-Page Display**: Renders a complete error page with animated SVG decorations
- **Internationalized**: Uses translation keys for localized error messaging
- **Consistent Styling**: Built on the ErrorContainer base component
- **Access Restriction Notice**: Clearly communicates account restriction to the user

### Usage

\`\`\`tsx
import { AccessRestricted } from "@docspace/ui-kit/errors";

<AccessRestricted />
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
} satisfies Meta<typeof AccessRestricted>;

type Story = StoryObj<ComponentProps<typeof AccessRestricted>>;

export default meta;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Default access restricted error page with standard messaging.",
      },
      source: {
        code: `<AccessRestricted />`,
      },
    },
  },
};
