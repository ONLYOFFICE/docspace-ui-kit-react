import type { ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Error401 } from "./Error401";
import { setupErrorI18n } from "./stories.utils";

const meta = {
  title: "Components/Errors/Error401",
  tags: ["!autodocs"],
  component: Error401,
  parameters: {
    docs: {
      description: {
        component: `Unauthorized error page (401). Displayed when the user is not authenticated.

### Features

- **Full-Page Display**: Renders a complete error page with animated SVG decorations
- **Internationalized**: Uses translation keys for localized error messaging
- **Consistent Styling**: Built on the ErrorContainer base component
- **Auto-Redirect Support**: Can redirect unauthenticated users to login

### Usage

\`\`\`tsx
import { Error401 } from "@onlyoffice/apps-ui-kit/errors";

<Error401 />
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
} satisfies Meta<typeof Error401>;

type Story = StoryObj<ComponentProps<typeof Error401>>;

export default meta;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "Default 401 unauthorized error page with standard messaging.",
      },
      source: {
        code: `<Error401 />`,
      },
    },
  },
};
