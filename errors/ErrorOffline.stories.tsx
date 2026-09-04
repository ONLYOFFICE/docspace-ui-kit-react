import type { ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { ErrorOfflineContainer } from "./ErrorOffline";
import { setupErrorI18n } from "./stories.utils";

const meta = {
  title: "Components/Errors/ErrorOffline",
  tags: ["!autodocs"],
  component: ErrorOfflineContainer,
  parameters: {
    docs: {
      description: {
        component: `Offline error page. Displayed when the user has no internet connection.

### Features

- **Full-Page Display**: Renders a complete error page with animated SVG decorations
- **Internationalized**: Uses translation keys for localized error messaging
- **Consistent Styling**: Built on the ErrorContainer base component
- **Connection Feedback**: Clearly communicates the offline state to the user

### Usage

\`\`\`tsx
import { ErrorOfflineContainer } from "@docspace/ui-kit/errors";

<ErrorOfflineContainer />
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
} satisfies Meta<typeof ErrorOfflineContainer>;

type Story = StoryObj<ComponentProps<typeof ErrorOfflineContainer>>;

export default meta;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Default offline error page with standard messaging.",
      },
      source: {
        code: `<ErrorOfflineContainer />`,
      },
    },
  },
};
