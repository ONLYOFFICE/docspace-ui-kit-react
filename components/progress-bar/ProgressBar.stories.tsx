import type { ComponentProps, CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import { ProgressBar, PreparationPortalProgress } from ".";
import type { ProgressBarProps } from "./ProgressBar.types";

const meta = {
  title: "UI/Status components/ProgressBar",
  component: ProgressBar,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    percent: {
      control: { type: "number", min: 0, max: 100 },
      description:
        "How far along the operation is, 0 to 100; anything above 100 fills the whole bar",
    },
    label: {
      control: "text",
      description:
        "Line of text above the bar; it is also the bar's tooltip and its accessible name",
    },
    isInfiniteProgress: {
      control: "boolean",
      description:
        "Display infinite loading animation instead of percentage-based progress",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    status: {
      control: "text",
      description:
        "Line of text under the bar; hidden while `error` is set, which takes the same place",
    },
    error: {
      control: "text",
      description:
        "Line of text under the bar in the error colour; shown instead of `status` when both are given",
    },
    className: {
      control: "text",
      description:
        "Extra class added to the bar element itself, not to the block around the label and status line",
    },
    style: {
      control: "object",
      description:
        "Inline style of the whole block — the label, the bar and the status line together",
    },
  },
} satisfies Meta<typeof ProgressBar>;

type Story = StoryObj<ComponentProps<typeof ProgressBar>>;

export default meta;

export const Default: Story = {
  render: (args) => <ProgressBar {...args} />,
  args: {
    percent: 50,
    label: "Uploading file...",
  },
  play: async ({ canvas }) => {
    // The label names the bar, and percent is its reported value and fill.
    const bar = canvas.getByRole("progressbar", { name: "Uploading file..." });
    await expect(bar).toHaveAttribute("aria-valuenow", "50");
    await expect(
      within(bar).getByTestId("progress-bar-percent").style.width,
    ).toBe("50%");
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use it for an operation whose progress you can measure: the label names the operation and the fill shows how far it has got (`percent`, `label`). Change any other prop live in the Controls panel below.",
      },
      source: {
        code: `<ProgressBar percent={50} label="Uploading file..." />`,
      },
    },
  },
};

export const WithStatus: Story = {
  render: (args) => <ProgressBar {...args} />,
  args: {
    percent: 75,
    label: "Processing document",
    status: "3 of 4 files processed",
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("3 of 4 files processed")).toBeVisible();
    // The status line is announced: it sits in a polite live region.
    await expect(canvas.getByRole("status")).toHaveTextContent(
      "3 of 4 files processed",
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Add a status line when the reader needs more than the fill tells them — how many items are done, what is being processed now (`status`).",
      },
      source: {
        code: `<ProgressBar percent={75} label="Processing document" status="3 of 4 files processed" />`,
      },
    },
  },
};

export const WithError: Story = {
  render: (args) => <ProgressBar {...args} />,
  args: {
    percent: 30,
    label: "Upload failed",
    error: "Network connection error",
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Network connection error")).toBeVisible();
    // The error is an alert, announced as soon as it appears.
    await expect(canvas.getByRole("alert")).toHaveTextContent(
      "Network connection error",
    );
    // The bar stays where the operation stopped.
    await expect(canvas.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "30",
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "When the operation fails, the message takes the place of the status line in the error colour, and the bar stays where it stopped (`error`).",
      },
      source: {
        code: `<ProgressBar percent={30} label="Upload failed" error="Network connection error" />`,
      },
    },
  },
};

export const InfiniteProgress: Story = {
  render: (args) => <ProgressBar {...args} />,
  args: {
    percent: 0,
    label: "Please wait...",
    isInfiniteProgress: true,
  },
  play: async ({ canvas }) => {
    // The sliding strip replaces the fill.
    await expect(canvas.getByTestId("progress-bar-animation")).toBeVisible();
    await expect(canvas.queryByTestId("progress-bar-percent")).toBeNull();
    // The bar is indeterminate: no value is reported, and it is busy.
    const bar = canvas.getByRole("progressbar", { name: "Please wait..." });
    await expect(bar).not.toHaveAttribute("aria-valuenow");
    await expect(bar).toHaveAttribute("aria-busy", "true");
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use it when the operation cannot report how far it has got: a short strip slides across the track until the bar is removed, and the bar is announced as busy with no value (`isInfiniteProgress`).",
      },
      source: {
        code: `<ProgressBar percent={0} label="Please wait..." isInfiniteProgress />`,
      },
    },
  },
};

export const Complete: Story = {
  render: (args) => <ProgressBar {...args} />,
  args: {
    percent: 100,
    label: "Upload complete",
    status: "All files processed successfully",
  },
  play: async ({ canvas }) => {
    const bar = canvas.getByRole("progressbar");
    await expect(bar).toHaveAttribute("aria-valuenow", "100");
    // The fill covers the whole track.
    const fill = canvas.getByTestId("progress-bar-percent");
    await expect(fill.getBoundingClientRect().width).toBeCloseTo(
      bar.getBoundingClientRect().width,
      0,
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "The finished state: the track is filled completely and the status line confirms the result (`percent={100}`).",
      },
      source: {
        code: `<ProgressBar percent={100} label="Upload complete" status="All files processed successfully" />`,
      },
    },
  },
};

export const OutOfRange: Story = {
  render: (args) => (
    <>
      <ProgressBar {...args} percent={-20} label="Below the range" />
      <ProgressBar {...args} percent={140} label="Above the range" />
    </>
  ),
  args: {
    percent: 0,
  },
  play: async ({ canvas }) => {
    // Both ends are clamped: the reported value and the fill agree.
    const below = canvas.getByRole("progressbar", { name: "Below the range" });
    await expect(below).toHaveAttribute("aria-valuenow", "0");
    await expect(
      within(below).getByTestId("progress-bar-percent").style.width,
    ).toBe("0%");
    const above = canvas.getByRole("progressbar", { name: "Above the range" });
    await expect(above).toHaveAttribute("aria-valuenow", "100");
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "`percent` is clamped to 0..100 at both ends: a negative value draws an empty bar and reports 0, a value over 100 fills it and reports 100.",
      },
      source: {
        code: `<ProgressBar percent={-20} label="Below the range" />
<ProgressBar percent={140} label="Above the range" />`,
      },
    },
  },
};

type PreparationStory = StoryObj<
  ComponentProps<typeof PreparationPortalProgress>
>;

export const PreparationPortal: PreparationStory = {
  render: (args) => <PreparationPortalProgress {...args} />,
  args: {
    percent: 75,
    text: "Setting things up...",
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("75 %")).toBeVisible();
    await expect(canvas.getByText("Setting things up...")).toBeVisible();
    // The caption names the bar, and percent is its reported value.
    const bar = canvas.getByRole("progressbar", {
      name: "Setting things up...",
    });
    await expect(bar).toHaveAttribute("aria-valuenow", "75");
  },
  parameters: {
    controls: { include: ["percent", "text", "className"] },
    docs: {
      description: {
        story:
          "Use `PreparationPortalProgress` for a full-page wait where the number itself matters: a taller bar with the percentage printed in its middle and a centred caption below (`percent`, `text`). The percentage turns from dark to light once the fill passes 50%; move `percent` in the Controls panel below to see it.",
      },
      source: {
        code: `<PreparationPortalProgress percent={75} text="Setting things up..." />`,
      },
    },
  },
};

const RightToLeftTemplate = (args: ProgressBarProps) => (
  <div dir="rtl">
    <ProgressBar {...args} />
    <ProgressBar
      {...args}
      label="انتظر من فضلك"
      status={undefined}
      isInfiniteProgress
    />
  </div>
);

// Framed on Docs: the theme provider stamps the direction on the page, which would flip the whole Docs page.
export const RightToLeft: Story = {
  render: (args) => <RightToLeftTemplate {...args} />,
  globals: { direction: "rtl" },
  args: {
    percent: 40,
    label: "جارٍ التحميل",
    status: "٢ من ٥",
  },
  play: async ({ canvas }) => {
    // Under RTL the fill grows from the right edge of the track.
    const [bar] = canvas.getAllByRole("progressbar");
    const fill = within(bar).getByTestId("progress-bar-percent");
    await expect(fill.getBoundingClientRect().right).toBeCloseTo(
      bar.getBoundingClientRect().right,
      0,
    );
  },
  parameters: {
    noPadding: true,
    docs: {
      story: { inline: false, height: "100px" },
      description: {
        story:
          'The bar under a right-to-left interface: the label and status line align to the right, the fill grows from the right edge, and the infinite strip in the second bar slides from right to left. The direction comes from the theme\'s `interfaceDirection` (the Direction toolbar); the wrapper also carries `dir="rtl"` for the rules that read the DOM direction.',
      },
      source: {
        code: `<div dir="rtl">
  <ProgressBar percent={40} label="جارٍ التحميل" status="٢ من ٥" />
  <ProgressBar percent={40} label="انتظر من فضلك" isInfiniteProgress />
</div>`,
      },
    },
  },
};

export const CssCustomization: Story = {
  render: (args) => (
    <div
      style={
        {
          "--progress-bar-size": "8px",
          "--progress-bar-radius": "8px",
          "--progress-bar-fill": "#7c3aed",
          "--progress-bar-track": "#e9d5ff",
          "--progress-bar-bottom-margin": "12px",
          "--progress-bar-text": "#5b21b6",
          "--progress-bar-error-text": "#be123c",
        } as CSSProperties
      }
    >
      <ProgressBar {...args} />
      <ProgressBar {...args} status={undefined} error="Connection lost" />
    </div>
  ),
  args: {
    percent: 65,
    label: "Customized progress bar",
    status: "Violet theme, 8px height",
  },
  play: async ({ canvas }) => {
    const [fill] = canvas.getAllByTestId("progress-bar-percent");
    await expect(getComputedStyle(fill).backgroundColor).toBe(
      "rgb(124, 58, 237)",
    );
    // The second bar's error takes the place of its status line.
    await expect(canvas.getByText("Connection lost")).toBeVisible();
    await expect(canvas.getAllByText("Violet theme, 8px height")).toHaveLength(
      1,
    );
  },
  parameters: {
    docs: {
      description: {
        story: `The variables are listed under CSS variables on this page; the example sets every one of them on one wrapper.

The first bar shows the track, fill, size, radius, margin and status colour; the second sets \`error\` to show \`--progress-bar-error-text\`, since an error takes the place of the status line.`,
      },
      source: {
        code: `<div style={{
  "--progress-bar-size": "8px",
  "--progress-bar-radius": "8px",
  "--progress-bar-fill": "#7c3aed",
  "--progress-bar-track": "#e9d5ff",
  "--progress-bar-bottom-margin": "12px",
  "--progress-bar-text": "#5b21b6",
  "--progress-bar-error-text": "#be123c",
}}>
  <ProgressBar percent={65} label="Customized progress bar" status="Violet theme, 8px height" />
  <ProgressBar percent={65} label="Customized progress bar" error="Connection lost" />
</div>`,
      },
    },
  },
};
