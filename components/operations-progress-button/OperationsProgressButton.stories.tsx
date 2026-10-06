import type { ComponentProps, CSSProperties } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, waitFor, within } from "storybook/test";

import OperationsProgressButton from ".";
import type { Operation } from "./OperationsProgressButton.types";

const meta = {
  title: "UI/Feedback/OperationsProgressButton",
  component: OperationsProgressButton,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    operations: {
      control: "object",
      description:
        "Secondary operations: copy, move, delete and the rest. In the list each row shows a spinner instead of a progress ring",
      table: {
        defaultValue: { summary: "[]" },
      },
    },
    panelOperations: {
      control: "object",
      description:
        "Operations that own a panel, such as an upload. In the list each row shows a progress ring with a cancel cross",
      table: {
        defaultValue: { summary: "[]" },
      },
    },
    operationsAlert: {
      control: "boolean",
      description:
        "Whether any operation failed: the button gets a warning badge and the tooltip names the error",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    operationsCanceled: {
      control: "boolean",
      description:
        "Whether an upload was cancelled: the button gets the stop sign and the tooltip shows the operation's label",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    operationsCompleted: {
      control: "boolean",
      description:
        "Whether everything is finished: the button shows a tick, slides out of view 4 seconds later (8 with a panel operation) and then calls the clear callbacks",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    operationsStopped: {
      control: "boolean",
      description:
        "Whether an operation was aborted: the button gets the stop sign, which wins over alert and completed, and the tooltip says the operation was stopped",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    mainButtonVisible: {
      control: "boolean",
      description:
        "Whether the mobile main button is on screen: on tablet widths the button sits 88px from the bottom (80px on phones) instead of 16px, clear of it",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    needErrorChecking: {
      control: "boolean",
      description:
        "Whether a completed run may still hold errors: the button then stays on screen instead of hiding itself",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    showCancelButton: {
      control: "boolean",
      description:
        "Whether a cancel cross appears beside the button on hover. Only while there is exactly one operation",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isInfoPanelVisible: {
      control: "boolean",
      description:
        "Whether the info panel is open: the button moves 424px in from the trailing edge, clear of it",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDragging: {
      control: "boolean",
      description:
        "Whether files are being dragged: a preview button rises in the middle of the screen while a drop folder is named",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    dropTargetFolderName: {
      control: "text",
      description:
        "Name of the folder under the pointer, shown in the drag preview button's tooltip",
    },
    percent: {
      control: false,
      description:
        "Ignored. Nothing reads this prop; the ring shows the first operation's `percent`",
    },
    clearOperationsData: {
      action: "clearOperationsData",
      description:
        "Called once the hide animation ends, and when a finished row's clear icon is clicked in the list, to drop the secondary operations",
    },
    clearPanelOperationsData: {
      action: "clearPanelOperationsData",
      description:
        "Called once the hide animation ends, and when a finished panel row's clear icon is clicked in the list, to drop the panel operations",
    },
    clearDropPreviewLocation: {
      action: "clearDropPreviewLocation",
      description:
        "Called when the drag preview button goes away, to forget the drop folder",
    },
    cancelUpload: {
      action: "cancelUpload",
      description:
        "Called with the translation function when the cancel cross beside the button, or on a panel row's ring, is clicked",
    },
    cancelSecondaryOperationById: {
      action: "cancelSecondaryOperationById",
      description:
        "Meant to be called with the operation and the id of its first item from a secondary row's cancel; those rows show a spinner with no cancel, so nothing calls it",
    },
    onOpenPanel: {
      control: false,
      description:
        "Ignored. Nothing reads this prop; the panel is opened through `Operation.showPanel`",
    },
    onCancelOperation: {
      control: false,
      description:
        "Ignored. Nothing reads this prop; the cancel cross calls `cancelUpload`",
    },
  },
  args: {
    clearOperationsData: fn(),
    clearPanelOperationsData: fn(),
    clearDropPreviewLocation: fn(),
    cancelUpload: fn(),
  },
  decorators: [
    (Story) => (
      <div
        style={{
          height: "120px",
          position: "relative",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "flex-end",
          padding: "20px",
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof OperationsProgressButton>;

type Story = StoryObj<ComponentProps<typeof OperationsProgressButton>>;

export default meta;

const Template = (args: ComponentProps<typeof OperationsProgressButton>) => (
  <OperationsProgressButton {...args} />
);

type PlayContext = Parameters<NonNullable<Story["play"]>>[0];

// Hovering the button shows what is running, in a portalled tooltip.
const hoverTooltip = async ({ canvasElement, userEvent }: PlayContext) => {
  await userEvent.hover(
    canvasElement.querySelector(".layout-progress-bar") as HTMLElement,
  );
  const tooltip = await screen.findByRole("tooltip");
  await waitFor(() => expect(tooltip).toBeVisible());
  return tooltip;
};

// The list of operations opens in a drop-down above the button.
const openList = async ({ canvas, userEvent }: PlayContext) => {
  await userEvent.click(canvas.getByTestId("floating-button"));
  const list = await waitFor(() => {
    const element = document.querySelector<HTMLElement>(".progress-container");
    expect(element).not.toBeNull();
    return element as HTMLElement;
  });
  return list;
};

const singleUploadOperation: Operation[] = [
  {
    id: "op-1",
    operation: "upload",
    label: "Uploading files",
    alert: false,
    completed: false,
    percent: 45,
  },
];

export const Default: Story = {
  render: Template,
  args: {
    operations: singleUploadOperation,
    operationsAlert: false,
    operationsCompleted: false,
  },
  play: async (context) => {
    const { canvas } = context;
    const button = canvas.getByTestId("floating-button");
    await expect(within(button).getByTestId("icon-upload")).toBeVisible();
    // The ring shows the first operation's percent.
    const loader = within(button)
      .getByTestId("floating-button-progress")
      .querySelector('[class*="loader"]') as HTMLElement;
    await expect(loader.style.getPropertyValue("--percent-percentage")).toBe(
      "45%",
    );
    await expect(canvas.queryByTestId("floating-button-close-icon")).toBeNull();
    await expect(await hoverTooltip(context)).toHaveTextContent(
      "Uploading files",
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "One running operation: the ring shows how far it has got and the tooltip names it. Change any other prop live in the Controls panel below.",
      },
      source: {
        code: `<OperationsProgressButton
  operations={[{ id: "op-1", operation: "upload", label: "Uploading files", alert: false, completed: false, percent: 45 }]}
/>`,
      },
    },
  },
};

export const UploadInProgress: Story = {
  render: Template,
  args: {
    operations: [
      {
        id: "op-1",
        operation: "upload",
        label: "Uploading files",
        alert: false,
        completed: false,
        percent: 65,
      },
    ],
    operationsAlert: false,
    operationsCompleted: false,
    showCancelButton: true,
  },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByTestId("floating-button-close-icon"));
    await expect(args.cancelUpload).toHaveBeenCalledTimes(1);
  },
  parameters: {
    docs: {
      description: {
        story:
          "Lets the user stop a running operation: hover the button to reveal the cancel cross beside it (`showCancelButton`); clicking it calls `cancelUpload`.",
      },
      source: {
        code: `<OperationsProgressButton
  operations={[{ operation: "upload", label: "Uploading files", alert: false, completed: false, percent: 65 }]}
  showCancelButton
  cancelUpload={(t) => cancelAllUploads()}
/>`,
      },
    },
  },
};

export const WithAlert: Story = {
  render: Template,
  args: {
    operations: [
      {
        id: "op-1",
        operation: "upload",
        label: "Uploading files",
        alert: true,
        completed: false,
        percent: 40,
        errorCount: 3,
      },
    ],
    operationsAlert: true,
    operationsCompleted: false,
    needErrorChecking: true,
  },
  play: async (context) => {
    await expect(
      context.canvas.getByTestId("floating-button-alert-icon"),
    ).toBeVisible();
    const tooltip = await hoverTooltip(context);
    await expect(tooltip).toHaveTextContent("Uploading files");
    await expect(tooltip).toHaveTextContent("3");
  },
  parameters: {
    docs: {
      description: {
        story:
          "Tells the user something went wrong without opening anything: the button gets a warning badge (`operationsAlert`); hover it to read the operation's label and how many files failed (`errorCount`).",
      },
      source: {
        code: `<OperationsProgressButton
  operations={[{ operation: "upload", label: "Uploading files", alert: true, completed: false, percent: 40, errorCount: 3 }]}
  operationsAlert
  needErrorChecking
/>`,
      },
    },
  },
};

export const CompletedOperation: Story = {
  render: Template,
  args: {
    operations: [
      {
        id: "op-1",
        operation: "copy",
        label: "Copying files",
        alert: false,
        completed: true,
        percent: 100,
      },
    ],
    operationsAlert: false,
    operationsCompleted: true,
  },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByTestId("floating-button-tick-icon")).toBeVisible();
    // Marked to slide out on its own.
    const container = (
      canvasElement.querySelector(".layout-progress-bar") as HTMLElement
    ).closest('[class*="progressBarContainer"]') as HTMLElement;
    await expect(container.className).toMatch(/autoHide/);
  },
  parameters: {
    docs: {
      description: {
        story:
          "The button clears itself away once the work is done: it shows a tick (`operationsCompleted`) and slides out of view 4 seconds later, then calls `clearOperationsData`. Keep the pointer over it to hold it on screen.",
      },
      source: {
        code: `<OperationsProgressButton
  operations={[{ operation: "copy", label: "Copying files", alert: false, completed: true, percent: 100 }]}
  operationsCompleted
  clearOperationsData={() => setOperations([])}
/>`,
      },
    },
  },
};

export const MultipleOperations: Story = {
  render: Template,
  args: {
    operations: [
      {
        id: "op-1",
        operation: "upload",
        label: "Uploading files",
        alert: false,
        completed: false,
        percent: 60,
      },
      {
        id: "op-2",
        operation: "copy",
        label: "Copying documents",
        alert: false,
        completed: false,
        percent: 30,
      },
    ],
    panelOperations: [
      {
        id: "op-3",
        operation: "move",
        label: "Moving folder",
        alert: false,
        completed: false,
        percent: 80,
        showPanel: fn(),
      },
    ],
    operationsAlert: false,
    operationsCompleted: false,
  },
  play: async (context) => {
    const { args, userEvent } = context;
    const showPanel = (args.panelOperations as Operation[])[0]
      .showPanel as ReturnType<typeof fn>;
    showPanel.mockClear();

    const list = await openList(context);
    await expect(within(list).getByText("Uploading files")).toBeVisible();
    await expect(within(list).getByText("Copying documents")).toBeVisible();
    // The panel operation's row opens its panel and closes the list.
    await userEvent.click(within(list).getByText("Moving folder"));
    await expect(showPanel).toHaveBeenCalledWith(true);
    await waitFor(() =>
      expect(document.querySelector(".progress-container")).toBeNull(),
    );
  },
  parameters: {
    docs: {
      description: {
        story: `Keeps several operations behind one button: it shows three dots and the tooltip counts them. Click it to open the list:

- **Uploading files**, **Copying documents** — secondary operations, each with a spinner (\`operations\`)
- **Moving folder** — an operation with its own panel, with a progress ring and a cancel cross; click the row to open its panel (\`panelOperations\`, \`showPanel\`)`,
      },
      source: {
        code: `<OperationsProgressButton
  operations={[
    { operation: "upload", label: "Uploading files", percent: 60, ... },
    { operation: "copy", label: "Copying documents", percent: 30, ... },
  ]}
  panelOperations={[
    { operation: "move", label: "Moving folder", percent: 80, showPanel, ... },
  ]}
/>`,
      },
    },
  },
};

export const StoppedOperation: Story = {
  render: Template,
  args: {
    operations: [
      {
        id: "op-1",
        operation: "move",
        label: "Moving files",
        alert: true,
        completed: true,
        percent: 50,
      },
    ],
    operationsAlert: true,
    operationsCompleted: false,
    operationsStopped: true,
  },
  play: async (context) => {
    // The stop sign wins over the alert.
    await expect(
      context.canvas.getByTestId("floating-button-stopped-icon"),
    ).toBeVisible();
    await expect(
      context.canvas.queryByTestId("floating-button-alert-icon"),
    ).toBeNull();
    await expect(await hoverTooltip(context)).toHaveTextContent("Moving files");
  },
  parameters: {
    docs: {
      description: {
        story:
          "Shows that the user aborted an operation rather than that it failed: the button gets a stop sign even though the operation is also marked as failed (`operationsStopped`), and the tooltip says it was stopped.",
      },
      source: {
        code: `<OperationsProgressButton
  operations={[{ operation: "move", label: "Moving files", alert: true, completed: true, percent: 50 }]}
  operationsAlert
  operationsStopped
/>`,
      },
    },
  },
};

export const OpensPanelOnClick: Story = {
  render: Template,
  args: {
    panelOperations: [
      {
        id: "op-1",
        operation: "upload",
        label: "Uploading files",
        description: "12 of 30 files",
        alert: false,
        completed: false,
        percent: 40,
        showPanel: fn(),
      },
    ],
    operationsAlert: false,
    operationsCompleted: false,
  },
  play: async (context) => {
    const { args, canvas, userEvent } = context;
    const showPanel = (args.panelOperations as Operation[])[0]
      .showPanel as ReturnType<typeof fn>;
    showPanel.mockClear();
    const tooltip = await hoverTooltip(context);
    await expect(tooltip).toHaveTextContent("Uploading files");
    await expect(tooltip).toHaveTextContent("12 of 30 files");
    await userEvent.click(canvas.getByTestId("floating-button"));
    await expect(showPanel).toHaveBeenCalledWith(true);
  },
  parameters: {
    docs: {
      description: {
        story:
          "Leads the user to the details of a single operation: click the button to open the operation's own panel (`showPanel`), and hover it to read a second line under the label (`description`).",
      },
      source: {
        code: `<OperationsProgressButton
  panelOperations={[{
    operation: "upload",
    label: "Uploading files",
    description: "12 of 30 files",
    alert: false,
    completed: false,
    percent: 40,
    showPanel: (open) => setUploadPanelVisible(open),
  }]}
/>`,
      },
    },
  },
};

export const DragPreview: Story = {
  render: Template,
  args: {
    operations: [],
    isDragging: true,
    dropTargetFolderName: "Reports",
  },
  play: async () => {
    // The preview's tooltip names the folder under the pointer.
    await waitFor(() => expect(screen.getByText(/Reports/)).toBeVisible());
  },
  parameters: {
    docs: {
      // Framed: inline, the always-open tooltip lands elsewhere on the Docs page.
      story: { inline: false, height: "200px" },
      description: {
        story:
          "Tells the user where dragged files will land: while a drag is in progress (`isDragging`) a preview button rises in the middle, and its tooltip names the folder under the pointer (`dropTargetFolderName`).",
      },
      source: {
        code: `<OperationsProgressButton
  isDragging
  dropTargetFolderName="Reports"
  clearDropPreviewLocation={() => setDropTarget(null)}
/>`,
      },
    },
  },
};

export const RightToLeft: Story = {
  render: (args) => (
    <div dir="rtl">
      <OperationsProgressButton {...args} />
    </div>
  ),
  args: {
    operations: [
      {
        id: "op-1",
        operation: "copy",
        label: "\u0646\u0633\u062e \u0627\u0644\u0645\u0644\u0641\u0627\u062a",
        alert: false,
        completed: false,
        percent: 45,
      },
    ],
    operationsAlert: false,
    operationsCompleted: false,
  },
  globals: { direction: "rtl" },
  play: async ({ canvas }) => {
    // In the bottom-left corner.
    const button = canvas
      .getByTestId("floating-button")
      .getBoundingClientRect();
    await expect(button.left).toBeLessThan(window.innerWidth / 2);
  },
  parameters: {
    noPadding: true,
    docs: {
      // Framed: an inline RTL story would flip the whole Docs page.
      story: { inline: false, height: "186px" },
      description: {
        story:
          "In a right-to-left layout the button sits in the bottom-left corner instead of the bottom-right, and its tooltip opens towards the middle of the screen.",
      },
      source: {
        code: `<div dir="rtl">
  <OperationsProgressButton
    operations={[{ operation: "copy", label: "\u0646\u0633\u062e \u0627\u0644\u0645\u0644\u0641\u0627\u062a", alert: false, completed: false, percent: 45 }]}
  />
</div>`,
      },
    },
  },
};

export const CssCustomization: Story = {
  render: () => (
    <div
      style={
        {
          "--ops-progress-dropdown-bg": "#e6f3fb",
          "--ops-progress-dropdown-hover": "#cce5f6",
          "--ops-progress-dropdown-margin": "16px",
          "--ops-progress-list-padding": "0px 12px",
          "--ops-progress-bar-padding": "10px 16px",
          "--ops-progress-wrapper-margin": "0px",
          "--ops-progress-items-gap": "12px",
          "--ops-progress-label-gap": "4px",
          "--ops-progress-icon-color": "#0082c9",
          "--ops-progress-icon-hover": "#006ba6",
          "--ops-progress-error-icon": "#0082c9",
          "--ops-progress-stopped-icon": "#f03032",
          "--floating-circle-button-background": "#0082c9",
          "--floating-button-icon": "#ffffff",
          "--floating-button-shadow": "0 4px 16px rgba(0, 130, 201, 0.4)",
        } as CSSProperties
      }
    >
      <OperationsProgressButton
        operations={[
          {
            id: "op-1",
            operation: "upload",
            label: "Uploading files",
            alert: false,
            completed: false,
            percent: 65,
          },
          {
            id: "op-2",
            operation: "copy",
            label: "Copying documents",
            alert: false,
            completed: false,
            percent: 30,
            showPanel: fn(),
          },
          {
            id: "op-3",
            operation: "move",
            label: "Moving files",
            alert: true,
            completed: true,
            percent: 100,
          },
          {
            id: "op-4",
            operation: "trash",
            label: "Moving to trash",
            alert: false,
            completed: false,
            stopped: true,
            percent: 20,
          },
        ]}
        operationsAlert={false}
        operationsCompleted={false}
      />
    </div>
  ),
  play: async (context) => {
    const button = context.canvas.getByTestId("floating-button");
    await expect(getComputedStyle(button).backgroundColor).toBe(
      "rgb(0, 130, 201)",
    );
    const list = await openList(context);
    await expect(within(list).getByText("Moving to trash")).toBeVisible();
    const dropDown = list.closest('[data-testid="dropdown"]') as HTMLElement;
    await expect(getComputedStyle(dropDown).backgroundColor).toBe(
      "rgb(230, 243, 251)",
    );
  },
  parameters: {
    docs: {
      description: {
        story: `Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. The button shows the three \`--floating-*\` variables; click it to open the list, which shows the rest: **Moving files** is finished and failed, **Moving to trash** was aborted. Hover **Moving files**' clear icon for \`--ops-progress-icon-hover\`.`,
      },
    },
  },
};
