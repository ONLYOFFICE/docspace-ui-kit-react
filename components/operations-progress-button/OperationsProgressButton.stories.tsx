import type { ComponentProps, CSSProperties } from "react";
import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, waitFor, within } from "storybook/test";

import { ModalDialog, ModalDialogType } from "../modal-dialog";
import { ProgressBar } from "../progress-bar";
import { Text } from "../text";
import { globalColors } from "../../providers/theme";

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
        "Secondary operations: copy, move, delete and the rest. Listed without a ring.",
      table: {
        defaultValue: { summary: "[]" },
      },
    },
    panelOperations: {
      control: "object",
      description:
        "Operations that own a panel — the upload. Their progress is the one the ring shows.",
      table: {
        defaultValue: { summary: "[]" },
      },
    },
    operationsAlert: {
      control: "boolean",
      description:
        "Whether any operation failed: the badge becomes a warning triangle.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    operationsCanceled: {
      control: "boolean",
      description: "Whether an upload was cancelled. Treated as stopped.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    operationsCompleted: {
      control: "boolean",
      description:
        "Whether everything is finished: the button plays its hide animation and then clears.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    operationsStopped: {
      control: "boolean",
      description:
        "Whether an operation was aborted. Treated as stopped, which wins over alert and completed.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    mainButtonVisible: {
      control: "boolean",
      description:
        "Whether the mobile main button is on screen, which lifts this one clear of it.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    needErrorChecking: {
      control: "boolean",
      description:
        "Whether a completed run may still hold errors, which stops the button from auto-hiding.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    showCancelButton: {
      control: "boolean",
      description:
        "Whether the cancel cross is offered. Only while there is exactly one operation.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isInfoPanelVisible: {
      control: "boolean",
      description:
        "Whether the info panel, or the AI chat in its place, is open. The button then moves 24px clear of its edge.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    infoPanelWidth: {
      control: "number",
      description:
        "Width in px of that open panel, for a resizable one, so the button stays clear of the width chosen. Without it the button assumes 400px.",
    },
    isDragging: {
      control: "boolean",
      description:
        "Whether a drag is in progress, which raises the drag preview button.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    dropTargetFolderName: {
      control: "text",
      description:
        "Name of the folder under the pointer, shown by the drag preview button.",
    },
    clearOperationsData: {
      action: "clearOperationsData",
      description:
        "Called once the hide animation ends, to drop the secondary operations.",
    },
    clearPanelOperationsData: {
      action: "clearPanelOperationsData",
      description:
        "Called once the hide animation ends, to drop the panel operations.",
    },
    clearDropPreviewLocation: {
      action: "clearDropPreviewLocation",
      description:
        "Called when the drag preview button is done with, to forget the drop target.",
    },
    cancelUpload: {
      action: "cancelUpload",
      description:
        "Called with the translation function when the cancel cross is clicked.",
    },
    cancelSecondaryOperationById: {
      action: "cancelSecondaryOperationById",
      description:
        "Called with the operation and the id of its first item, from a row's own cancel.",
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

const uploadNames = [
  "Annual Report 2025.docx",
  "Q4 Budget.xlsx",
  "Team Presentation.pptx",
  "Contract Draft.pdf",
  "Meeting Notes.docx",
  "Sales Forecast.xlsx",
];

const uploads = Array.from({ length: 30 }, (_, index) => {
  const base = uploadNames[index % uploadNames.length];
  const copy = Math.floor(index / uploadNames.length);
  const name = copy ? base.replace(/(\.\w+)$/, ` (${copy})$1`) : base;
  const percent = index < 12 ? 100 : index === 12 ? 40 : 0;
  return { name, percent };
});

const uploadStatus = (percent: number) => {
  if (percent === 100) return "Done";
  if (percent === 0) return "Waiting";
  return `${percent}%`;
};

const HostPanelTemplate = (
  args: ComponentProps<typeof OperationsProgressButton>,
) => {
  const [open, setOpen] = useState(false);
  const [operation] = args.panelOperations ?? [];

  const panelOperations = (args.panelOperations ?? []).map((item) => ({
    ...item,
    showPanel: (visible: boolean) => {
      item.showPanel?.(visible);
      setOpen(visible);
    },
  }));

  return (
    <>
      <OperationsProgressButton {...args} panelOperations={panelOperations} />
      <ModalDialog
        visible={open && !!operation}
        displayType={ModalDialogType.aside}
        onClose={() => setOpen(false)}
      >
        <ModalDialog.Header>{operation?.label}</ModalDialog.Header>
        <ModalDialog.Body>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              paddingBlock: "8px",
            }}
          >
            {uploads.map((file) => (
              <div
                key={file.name}
                style={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Text fontWeight={600}>{file.name}</Text>
                  <Text color={globalColors.gray}>
                    {uploadStatus(file.percent)}
                  </Text>
                </div>
                <ProgressBar percent={file.percent} />
              </div>
            ))}
          </div>
        </ModalDialog.Body>
      </ModalDialog>
    </>
  );
};

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
          "One running operation: the ring shows how far it has got and the tooltip names it.",
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
  name: "With cancel cross",
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
    // The cross is a named button. It takes the pointer only once a real
    // hover reveals it, which a play function cannot produce, so it is
    // pressed from the keyboard here: Tab past the circle, then Enter.
    const cancel = canvas.getByRole("button", { name: "Cancel" });
    canvas.getByRole("button", { name: "Uploading files" }).focus();
    await userEvent.tab();
    await expect(cancel).toHaveFocus();
    await expect(getComputedStyle(cancel).pointerEvents).toBe("auto");
    await userEvent.keyboard("{Enter}");
    await expect(args.cancelUpload).toHaveBeenCalledTimes(1);
  },
  parameters: {
    docs: {
      description: {
        story:
          "A cancel cross beside the button, revealed on hover or keyboard focus (`showCancelButton`). Clicking or pressing it calls `cancelUpload`.",
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
  name: "Failed",
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
          "A warning badge that says something went wrong without opening anything (`operationsAlert`). The tooltip gives the operation's label and how many files failed (`errorCount`).",
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
  name: "Completed",
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
      story: { inline: false, height: "200px" },
      description: {
        story:
          "A tick once the work is done (`operationsCompleted`). The button slides out of view 4 seconds later and calls `clearOperationsData`; the pointer over it holds it on screen.",
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
  name: "Several operations",
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
    // The panel operation's row opens its panel and closes the list. A click
    // on the row's icon opens it once, not once for the icon and again for
    // the row it bubbles to.
    const row = within(list)
      .getByText("Moving folder")
      .closest("[class*='progressMainContainer']") as HTMLElement;
    await userEvent.click(within(row).getByTestId("icon-button"));
    await expect(showPanel).toHaveBeenCalledTimes(1);
    await expect(showPanel).toHaveBeenCalledWith(true);
    // The label carries its header class, with the pointer of a clickable row.
    await expect(within(row).getByText("Moving folder").className).toMatch(
      /progressHeader/,
    );
    await waitFor(() =>
      expect(document.querySelector(".progress-container")).toBeNull(),
    );
  },
  parameters: {
    docs: {
      description: {
        story: `Several operations behind one button with three dots; the tooltip counts them. A click opens the list:

- **Uploading files**, **Copying documents** — secondary operations, each with a spinner (\`operations\`)
- **Moving folder** — a progress ring and a cancel cross; the row opens its panel (\`panelOperations\`, \`showPanel\`)`,
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
  name: "Stopped",
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
          "A stop sign for an operation the user aborted (`operationsStopped`). It wins even though the operation is also marked as failed, and the tooltip says it was stopped.",
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
  name: "Opens a panel",
  render: HostPanelTemplate,
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
    await waitFor(() =>
      expect(screen.getByText("Team Presentation.pptx")).toBeVisible(),
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "A button that opens the operation's own panel on click (`showPanel`), with a second tooltip line under the label (`description`). The panel is the page's; the story draws a stand-in on the right.",
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
  name: "Drag preview",
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
          "A preview button that rises in the middle during a drag (`isDragging`). Its tooltip names the folder under the pointer, where the files will land (`dropTargetFolderName`).",
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
  name: "Right to left",
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
  name: "CSS customization",
  render: () => (
    <div
      style={
        {
          "--ops-progress-dropdown-bg": "#0d3a52",
          "--ops-progress-dropdown-hover": "#16506f",
          "--ops-progress-dropdown-margin": "16px",
          "--ops-progress-list-padding": "0px 12px",
          "--ops-progress-bar-padding": "10px 16px",
          "--ops-progress-wrapper-margin": "0px",
          "--ops-progress-items-gap": "12px",
          "--ops-progress-label-gap": "4px",
          "--ops-progress-icon-color": "#0082c9",
          "--ops-progress-icon-hover": "#4fb0e6",
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
      "rgb(13, 58, 82)",
    );
  },
  parameters: {
    docs: {
      description: {
        story: `Every overridable variable, set on one wrapper. The button shows the three \`--floating-*\` variables, and its list shows the rest. **Moving files** is finished and failed; **Moving to trash** was aborted.`,
      },
    },
  },
};
