import type { ComponentProps, CSSProperties } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { ColumnarInfoBar } from "./ColumnarInfoBar";

const meta = {
  title: "UI/Feedback/ColumnarInfoBar",
  component: ColumnarInfoBar,
  parameters: {
    docs: {
      description: {
        component: `A bar that sets read-only details side by side as labelled columns under an optional heading, for information shown in context that needs no action, such as a summary of what was just created or the metadata of an event.

### Features

- **Labelled Columns**: Shows each label above its value and wraps the columns onto a new line when the row runs out of width
- **Optional Header**: Shows a bold heading above the columns when \`headerText\` is set and leaves it out otherwise
- **Close Button**: Renders a close button in the trailing corner only when \`onAction\` is set; the bar does not hide itself, so the host removes it on click
- **Warning Bar**: Draws the default look on a pale warning background with an orange edge on the inline-start side and the heading in the same orange
- **Neutral Card**: Turns the bar into a rounded card with a light blue border and a blue heading that slides open when it mounts
- **Page Block**: Renders a padded rounded block with the close button beside the heading and the columns in a two-column grid
- **Mobile Stacking**: Stretches every column of the default and neutral looks to the full width on mobile screens, so the pairs stack one under another
- **Theme Colours**: Takes its background, text and accent colours from the light or dark theme, each of which can be overridden through the \`style\` prop

### Accessibility

The bar adds no roles of its own; what assistive-technology and keyboard users get comes from its native elements:

- **Heading**: \`headerText\` is rendered as an \`<h3>\`, so screen reader users can jump to the bar with heading navigation
- **Close button**: a native \`<button>\`, reached with Tab and pressed with Enter or Space
- **Button name**: the close button is announced by \`closeLabel\` through \`aria-label\`; the default is the English "Close", so pass a translated string

### Usage

\`\`\`tsx
import { ColumnarInfoBar } from "@onlyoffice/apps-ui-kit/components/columnar-info-bar";

// Heading, columns and a close button
<ColumnarInfoBar
  headerText="New account details"
  columns={[
    { label: "Name", value: "Team member" },
    { label: "Email", value: "member@example.com" },
  ]}
  onAction={handleClose}
  closeLabel={t("Common:CloseButton")}
/>

// Columns only
<ColumnarInfoBar
  columns={[
    { label: "Status", value: "200 OK" },
    { label: "Event Type", value: "file.created" },
  ]}
/>

// Padded block with a two-column grid
<ColumnarInfoBar variant="page" headerText="Connection details" columns={columns} />
\`\`\``,
      },
    },
  },
  argTypes: {
    headerText: {
      control: "text",
      description:
        "Bold heading above the columns, rendered as an `<h3>`; nothing is rendered in its place when it is empty",
    },
    columns: {
      control: "object",
      description:
        "The label and value pairs, in order; each label is a small caption above its value, and both accept any node, so an icon or a link fits too",
    },
    onAction: {
      description:
        "Called when the close button is clicked. The button is rendered only while this is set, and the bar stays on screen until the host removes it",
    },
    onLoad: {
      description:
        "Called once after the bar mounts; a different function passed on a later render is never called",
    },
    style: {
      control: "object",
      description:
        "Inline style of the bar; there is no `className` prop, so colour overrides go here too",
    },
    variant: {
      control: "select",
      options: ["default", "neutral", "page"],
      description:
        "Which look to render: the warning bar with an orange edge, the bordered `neutral` card that slides open, or the padded `page` block with a two-column grid",
      table: {
        defaultValue: { summary: "default" },
      },
    },
    closeLabel: {
      control: "text",
      description:
        "Name screen readers announce for the close button; ignored when `onAction` is not set",
      table: {
        defaultValue: { summary: "Close" },
      },
    },
  },
} satisfies Meta<typeof ColumnarInfoBar>;

type Story = StoryObj<ComponentProps<typeof ColumnarInfoBar>>;

export default meta;

export const Default: Story = {
  args: {
    headerText: "Document details",
    columns: [
      { label: "Owner", value: "Team member" },
      { label: "Size", value: "2.4 MB" },
      { label: "Modified", value: "May 26, 2026" },
      { label: "Format", value: "DOCX" },
    ],
    variant: "default",
    onLoad: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "The warning bar with a heading and four columns and no close button: the starting point for a details strip. Change any prop live in the Controls panel below.",
      },
      source: {
        code: `<ColumnarInfoBar
  headerText="Document details"
  columns={[
    { label: "Owner", value: "Team member" },
    { label: "Size", value: "2.4 MB" },
    { label: "Modified", value: "May 26, 2026" },
    { label: "Format", value: "DOCX" },
  ]}
/>`,
      },
    },
  },
};

export const ProfileDetails: Story = {
  name: "With Close Button",
  args: {
    headerText: "New account details",
    columns: [
      { label: "Workspace address", value: "workspace.example.com" },
      { label: "Name", value: "Team member" },
      { label: "Email", value: "member@example.com" },
      { label: "Password", value: "••••••••" },
    ],
    onAction: fn(),
    onLoad: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "A close button in the top trailing corner lets the reader dismiss details they have read once (`onAction`); clicking it only calls the handler, so the host takes the bar out of the tree. Its spoken name comes from `closeLabel`.",
      },
      source: {
        code: `<ColumnarInfoBar
  headerText="New account details"
  columns={[
    { label: "Workspace address", value: "workspace.example.com" },
    { label: "Name", value: "Team member" },
    { label: "Email", value: "member@example.com" },
    { label: "Password", value: "••••••••" },
  ]}
  onAction={() => setVisible(false)}
/>`,
      },
    },
  },
};

export const EventDetails: Story = {
  name: "Columns Only",
  args: {
    columns: [
      { label: "Status", value: "200 OK" },
      { label: "Event ID", value: "evt_01hx9z3k2m" },
      { label: "Event Type", value: "file.created" },
      { label: "Event Time", value: "May 26, 2026, 14:32" },
      { label: "Delivery Time", value: "May 26, 2026, 14:32:01" },
    ],
    onLoad: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Without `headerText` and `onAction` the bar is a plain strip of columns that stays on screen, for metadata the surrounding page already names. Narrow the window to see the columns wrap.",
      },
      source: {
        code: `<ColumnarInfoBar
  columns={[
    { label: "Status", value: "200 OK" },
    { label: "Event ID", value: "evt_01hx9z3k2m" },
    { label: "Event Type", value: "file.created" },
    { label: "Event Time", value: "May 26, 2026, 14:32" },
    { label: "Delivery Time", value: "May 26, 2026, 14:32:01" },
  ]}
/>`,
      },
    },
  },
};

export const NeutralVariant: Story = {
  args: {
    variant: "neutral",
    headerText: "Before you start",
    columns: [
      { label: "Storage", value: "10 GB" },
      { label: "Members", value: "25" },
      { label: "Retention", value: "30 days" },
    ],
    onAction: fn(),
    onLoad: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          'A rounded card with a light blue border and a blue heading, for information that is not a warning (`variant="neutral"`); it slides open when it mounts.',
      },
      source: {
        code: `<ColumnarInfoBar
  variant="neutral"
  headerText="Before you start"
  columns={[
    { label: "Storage", value: "10 GB" },
    { label: "Members", value: "25" },
    { label: "Retention", value: "30 days" },
  ]}
  onAction={handleClose}
/>`,
      },
    },
  },
};

export const PageVariant: Story = {
  args: {
    variant: "page",
    headerText: "Connection details",
    columns: [
      { label: "Server", value: "server.example.com" },
      { label: "Port", value: "443" },
      { label: "Protocol", value: "HTTPS" },
      { label: "Status", value: "Connected" },
    ],
    onAction: fn(),
    onLoad: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          'A padded block with the close button beside the heading and the columns in a two-column grid, for a details section inside a page rather than a notice above it (`variant="page"`).',
      },
      source: {
        code: `<ColumnarInfoBar
  variant="page"
  headerText="Connection details"
  columns={[
    { label: "Server", value: "server.example.com" },
    { label: "Port", value: "443" },
    { label: "Protocol", value: "HTTPS" },
    { label: "Status", value: "Connected" },
  ]}
  onAction={handleClose}
/>`,
      },
    },
  },
};

export const CssCustomization: Story = {
  render: () => (
    <ColumnarInfoBar
      headerText="Custom colours"
      columns={[
        { label: "Owner", value: "Team member" },
        { label: "Version", value: "2.6.0" },
        { label: "Region", value: "EU West" },
      ]}
      onAction={() => {}}
      style={
        {
          "--cib-bg": "#1e1b4b",
          "--cib-color": "#e0e7ff",
          "--cib-accent": "#6366f1",
          "--cib-header-color": "#a5b4fc",
        } as CSSProperties
      }
    />
  ),
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--cib-bg\` | Background of the bar | theme-based |
| \`--cib-color\` | Text colour of the values and the labels; the labels show it at 60% opacity, and in the \`page\` look they keep their own gray | theme-based |
| \`--cib-accent\` | Colour of the edge on the inline-start side, and of the heading when \`--cib-header-color\` is not set; default look only | theme-based |
| \`--cib-header-color\` | Colour of the heading | \`--cib-accent\` in the default look, theme-based in \`neutral\` and \`page\` |

The bar's own stylesheet declares these on the bar element for the light and dark theme, so a value set on a wrapper never reaches it; set them through the bar's \`style\` prop, as here.`,
      },
      source: {
        code: `<ColumnarInfoBar
  headerText="Custom colours"
  columns={columns}
  onAction={handleClose}
  style={{
    "--cib-bg": "#1e1b4b",
    "--cib-color": "#e0e7ff",
    "--cib-accent": "#6366f1",
    "--cib-header-color": "#a5b4fc",
  }}
/>`,
      },
    },
  },
};
