import type { Meta, StoryObj } from "@storybook/react-vite";

import { Toast } from "../../components/toast";
import { toastr } from "../../components/toast/sub-components/Toastr";

import GroupsSelector from ".";
import type { GroupsSelectorProps } from "./GroupsSelector.types";

type StoryArgs = GroupsSelectorProps;

const meta: Meta<StoryArgs> = {
  title: "Components/Selectors/GroupsSelector",
  component: GroupsSelector,
  tags: ["!autodocs"],
  parameters: {
    docs: {
      description: {
        component: `GroupsSelector is a searchable, paginated selector panel for choosing a user group.

### Features

- **Live API mode**: Fetches groups from the DocSpace Groups API in batches of 100 with infinite scroll
- **Single-select**: The user can pick exactly one group at a time
- **Search**: Filters groups by name; resets and re-fetches the list automatically
- **Header**: Optional configurable header with a close button via \`withHeader\` / \`headerProps\`
- **Aside mode**: Can render inside an Aside panel with backdrop and optional blur via \`useAside\`
- **Callbacks**: \`onSubmit\` and \`onClose\` hooks

### Usage

\`\`\`tsx
import GroupsSelector from "@onlyoffice/apps-ui-kit/selectors/Groups";

// Inline mode
<GroupsSelector
  withHeader
  headerProps={{
    headerLabel: "Select Group",
    onCloseClick: () => setOpen(false),
  }}
  onSubmit={(items) => console.log(items[0])}
/>

// Aside panel mode
<GroupsSelector
  useAside
  onClose={() => setOpen(false)}
  withHeader
  headerProps={{
    headerLabel: "Select Group",
    onCloseClick: () => setOpen(false),
  }}
  onSubmit={(items) => console.log(items[0])}
/>
\`\`\``,
      },
    },
  },
  argTypes: {
    // Layout
    id: {
      control: "text",
      description: "HTML id attribute for the root element",
    },
    className: {
      control: "text",
      description: "Additional CSS class name for the root element",
    },

    // Header (TSelectorHeader)
    withHeader: {
      control: "boolean",
      description: "Show the header bar with a label and close button",
      table: {
        defaultValue: { summary: "false" },
      },
    },

    // Aside (TSelectorWithAside)
    useAside: {
      control: "boolean",
      description: "Render the selector inside an Aside panel with a backdrop",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withoutBackground: {
      control: "boolean",
      description: "Remove the background overlay when rendered in Aside mode",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withBlur: {
      control: "boolean",
      description: "Apply a blur effect to the Aside backdrop",
      table: {
        defaultValue: { summary: "false" },
      },
    },

    // Callbacks
    onSubmit: {
      action: "onSubmit",
      description:
        "Called with the selected TSelectorItem array when the user confirms their choice",
    },
    onClose: {
      action: "onClose",
      description: "Called when the selector panel is dismissed",
    },
  },
};

export default meta;

type Story = StoryObj<StoryArgs>;

const Template = (props: StoryArgs) => (
  <div
    style={{
      width: "700px",
      height: "600px",
      border: "4px dashed #d0d5dd",
      overflow: "hidden",
      transform: "translateZ(0)",
    }}
  >
    <Toast />
    <GroupsSelector {...props} />
  </div>
);

export const Default: Story = {
  render: (args: StoryArgs) => <Template {...args} />,
  args: {

    withHeader: true,
    headerProps: {
      headerLabel: "Select Group",
      onCloseClick: () => {},
    },
    onSubmit: (items) => {
      const label = items[0]?.label;
      toastr.success(`Selected: ${label}`);
    },
    onClose: () => {
      toastr.info("Selector closed");
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default story using a live DocSpace API. Groups are fetched and filtered via the search field.",
      },
      source: {
        code: `<GroupsSelector
  withHeader
  headerProps={{
    headerLabel: "Select Group",
    onCloseClick: () => setOpen(false),
  }}
  onSubmit={(items) => console.log("selected", items[0])}
  onClose={() => setOpen(false)}
/>`,
      },
    },
  },
};

export const AsideMode: Story = {
  tags: ["!autodocs"],
  render: (args: StoryArgs) => <Template {...args} />,
  args: {

    useAside: true,
    withoutBackground: false,
    withBlur: false,
    withHeader: true,
    headerProps: {
      headerLabel: "Select Group",
      onCloseClick: () => {},
    },
    onSubmit: (items) => {
      const label = items[0]?.label;
      toastr.success(`Selected: ${label}`);
    },
    onClose: () => {
      toastr.info("Selector closed");
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Renders the selector inside an Aside panel with a backdrop overlay. " +
          "Use `withBlur` to apply a blur effect and `withoutBackground` to remove the overlay.",
      },
      source: {
        code: `<GroupsSelector
  useAside
  withoutBackground={false}
  withBlur={false}
  withHeader
  headerProps={{
    headerLabel: "Select Group",
    onCloseClick: () => setOpen(false),
  }}
  onSubmit={(items) => console.log("selected", items[0])}
  onClose={() => setOpen(false)}
/>`,
      },
    },
  },
};
