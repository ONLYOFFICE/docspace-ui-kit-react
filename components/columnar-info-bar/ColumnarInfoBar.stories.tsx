import type { ComponentProps, CSSProperties } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, waitFor } from "storybook/test";

import { ColumnarInfoBar } from "./ColumnarInfoBar";

const meta = {
  title: "UI/Feedback/ColumnarInfoBar",
  component: ColumnarInfoBar,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
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
  play: async ({ args, canvas }) => {
    await expect(args.onLoad).toHaveBeenCalledTimes(1);
    await expect(
      canvas.getByRole("heading", { level: 3, name: "Document details" }),
    ).toBeVisible();
    // Each label sits above its value, as a term and its description.
    const owner = canvas.getByText("Owner");
    await expect(owner.tagName).toBe("DT");
    await expect(owner.nextElementSibling).toHaveTextContent("Team member");
    await expect(owner.nextElementSibling?.tagName).toBe("DD");
    await expect(canvas.getAllByRole("term")).toHaveLength(4);
    // The bar is a polite live region.
    await expect(canvas.getByRole("status")).toContainElement(owner);
    // No onAction, no close button.
    await expect(canvas.queryByRole("button")).toBeNull();
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
  play: async ({ args, canvas, userEvent }) => {
    // The close button is named by closeLabel and only calls the handler.
    await userEvent.click(canvas.getByRole("button", { name: "Close" }));
    await expect(args.onAction).toHaveBeenCalledTimes(1);
    await expect(canvas.getByText("New account details")).toBeVisible();
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
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole("heading")).toBeNull();
    await expect(canvas.queryByRole("button")).toBeNull();
    await expect(canvas.getByText("evt_01hx9z3k2m")).toBeVisible();
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
  play: async ({ args, canvas, userEvent }) => {
    // The card slides open over 0.4s after it mounts.
    await waitFor(() =>
      expect(
        canvas.getByRole("heading", { name: "Before you start" }),
      ).toBeVisible(),
    );
    // Once the reveal ends the 150px cap no longer applies.
    const card = canvas.getByRole("status");
    await waitFor(() => expect(getComputedStyle(card).maxHeight).toBe("none"));
    await userEvent.click(canvas.getByRole("button", { name: "Close" }));
    await expect(args.onAction).toHaveBeenCalledTimes(1);
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
  play: async ({ args, canvas, userEvent }) => {
    // The page variant puts the close button beside the heading.
    const heading = canvas.getByRole("heading", { name: "Connection details" });
    const close = canvas.getByRole("button", { name: "Close" });
    await expect(close.parentElement).toBe(heading.parentElement);
    await userEvent.click(close);
    await expect(args.onAction).toHaveBeenCalledTimes(1);
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
      onAction={fn()}
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
  play: async ({ canvas }) => {
    const heading = canvas.getByRole("heading", { name: "Custom colours" });
    await expect(getComputedStyle(heading).color).toBe("rgb(165, 180, 252)");
  },
  parameters: {
    docs: {
      description: {
        story: `The variables are listed under CSS variables on this page. All four are set here through the bar's \`style\` prop, because a wrapper cannot reach them.`,
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
