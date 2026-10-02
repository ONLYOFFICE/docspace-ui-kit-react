import type { ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Error403 } from "./Error403";
import { setupErrorI18n } from "./stories.utils";

const meta = {
  title: "Components/Errors/Error403",
  tags: ["!autodocs"],
  component: Error403,
  parameters: {
    docs: {
      description: {
        component: `Forbidden error page (403). Displayed when the user lacks permission to access a resource.

### Features

- **Full-Page Display**: Renders a complete error page with animated SVG decorations
- **Internationalized**: Uses translation keys for localized error messaging
- **Consistent Styling**: Built on the ErrorContainer base component
- **Permission Feedback**: Clearly communicates access denial to the user

### Usage

\`\`\`tsx
import { Error403 } from "@onlyoffice/apps-ui-kit/errors";

<Error403 />
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
} satisfies Meta<typeof Error403>;

type Story = StoryObj<ComponentProps<typeof Error403>>;

export default meta;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "Default 403 forbidden error page with standard messaging.",
      },
      source: {
        code: `<Error403 />`,
      },
    },
  },
};
