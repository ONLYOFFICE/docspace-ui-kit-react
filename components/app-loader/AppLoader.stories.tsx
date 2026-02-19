import { Meta, StoryFn } from "@storybook/react-vite";

import AppLoader from "./index";

export default {
  title: "Components/Status components/AppLoader",
  component: AppLoader,
  parameters: {
    docs: {
      description: {
        component:
          "Full-screen loader component used during application loading",
      },
    },
  },
} as Meta;

const Template: StoryFn = () => <AppLoader />;

// Example with custom background color
export const Default = Template.bind({});
Default.decorators = [
  (StoryComponent) => (
    <div style={{ width: "500px", height: "500px", position: "relative" }}>
      {StoryComponent()}
    </div>
  ),
];
