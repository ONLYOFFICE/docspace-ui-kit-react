import type { ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import Error404 from "./Error404";
import { setupErrorI18n } from "./stories.utils";

const meta = {
  title: "Components/Errors/Error404",
  tags: ["!autodocs"],
  component: Error404,
  parameters: {
    docs: {
      description: {
        component: `Not Found error page (404). Displayed when the requested page does not exist.

### Features

- **Full-Page Display**: Renders a complete error page with animated SVG decorations
- **Internationalized**: Uses translation keys for localized error messaging
- **Consistent Styling**: Built on the ErrorContainer base component
- **Navigation Guidance**: Helps users find their way back to valid pages

### Usage

\`\`\`tsx
import Error404 from "@onlyoffice/apps-ui-kit/errors/Error404";

<Error404 />
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
} satisfies Meta<typeof Error404>;

type Story = StoryObj<ComponentProps<typeof Error404>>;

export default meta;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "Default 404 not found error page with standard messaging.",
      },
      source: {
        code: `<Error404 />`,
      },
    },
  },
};
