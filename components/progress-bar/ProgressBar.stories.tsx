import type { ComponentProps, CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

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
  parameters: {
    docs: {
      description: {
        story:
          "Use it when the operation cannot report how far it has got: a short strip slides across the track until the bar is removed (`isInfiniteProgress`).",
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

type PreparationStory = StoryObj<
  ComponentProps<typeof PreparationPortalProgress>
>;

export const PreparationPortal: PreparationStory = {
  render: (args) => <PreparationPortalProgress {...args} />,
  args: {
    percent: 75,
    text: "Setting things up...",
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
