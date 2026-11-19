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
        "How far along the operation is, 0 to 100. The value is clamped to that range, and a non-number (`NaN`, `Infinity`) counts as 0.",
    },
    label: {
      control: "text",
      description:
        "Line of text above the bar, and the bar's accessible name unless `aria-label` is passed. A truncated label shows in full in the kit's tooltip.",
    },
    "aria-label": {
      control: false,
      description: "Accessible name of the bar, in place of `label`.",
    },
    isInfiniteProgress: {
      control: "boolean",
      description:
        "Replaces the fill with a strip that slides across the track for ever. The bar is then indeterminate: no `aria-valuenow`, and `aria-busy` set.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    status: {
      control: "text",
      description:
        'Line of text under the bar — "3 of 4 files processed". It sits in a polite live region, so a change is announced. It is hidden while `error` is set, which takes the same slot.',
    },
    error: {
      control: "text",
      description:
        'Line of text under the bar in the error colour, rendered with `role="alert"` so it is announced. It replaces `status` whenever both are given; nothing else about the bar changes.',
    },
    className: {
      control: "text",
      description:
        "Added after the component's own class on the bar element, not on the outer container.",
    },
    style: {
      control: "object",
      description:
        "Inline style of the outer container — the label, the bar and the status line together. The bar itself is styled through the `--progress-bar-*` custom properties.",
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
          "A bar for an operation whose progress can be measured: the label names it, and the fill shows how far it has got (`percent`, `label`).",
      },
      source: {
        code: `<ProgressBar percent={50} label="Uploading file..." />`,
      },
    },
  },
};

export const WithStatus: Story = {
  name: "With status",
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
  name: "With error",
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
  name: "Indeterminate",
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
          "A bar for an operation that cannot report how far it has got (`isInfiniteProgress`). A short strip slides across the track, and the bar is announced as busy.",
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
  name: "Out of range",
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
          "Two bars fed values outside 0..100 (`percent`). The negative one is empty and reports 0, and the one over 100 is full and reports 100.",
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
  name: "Preparation portal",
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
          "`PreparationPortalProgress`, for a full-page wait where the number matters: a taller bar with the percentage in its middle and a caption below (`percent`, `text`). The number turns light past 50%.",
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
  name: "Right to left",
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
          "Two right-to-left bars. The label and status line align right, the fill grows from the right edge, and the second bar's strip slides from right to left.",
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
  name: "CSS variables",
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
        story: `Two bars under a wrapper that sets every variable. The second sets \`error\`, the only state that shows \`--progress-bar-error-text\`.`,
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
