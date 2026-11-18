import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import React from "react";

import { RowSkeleton } from "./RowSkeleton";
import { RowsSkeleton } from "./RowsSkeleton";

const meta = {
  title: "UI/Rows/RowsSkeleton",
  component: RowsSkeleton,
  parameters: {
    docs: {
      description: {
        component:
          "Placeholder in the shape of a list of rows, shown while the rows themselves are loading. The Rows page describes it in full.",
      },
    },
  },
  argTypes: {
    count: {
      control: "number",
      description: "How many placeholder rows to draw",
      table: {
        defaultValue: { summary: "25" },
      },
    },
    title: {
      control: "text",
      description:
        "Accessible name given to every shape; empty by default, which leaves them unnamed",
      table: {
        defaultValue: { summary: '""' },
      },
    },
    animate: {
      control: "boolean",
      description:
        "Whether the light band sweeps across the shapes; turn it off for a still placeholder",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    speed: {
      control: "number",
      description: "Duration of one sweep of the band, in seconds",
      table: {
        defaultValue: { summary: "2" },
      },
    },
    backgroundColor: {
      control: "color",
      description:
        "Colour of the shapes at rest, drawn at `backgroundOpacity`; black in every theme",
      table: {
        defaultValue: { summary: "#000" },
      },
    },
    foregroundColor: {
      control: "color",
      description:
        "Colour of the band that sweeps across the shapes, drawn at `foregroundOpacity`",
      table: {
        defaultValue: { summary: "#000" },
      },
    },
    backgroundOpacity: {
      control: "number",
      description:
        "How strongly the shapes' resting colour shows, from 0 (invisible) to 1",
      table: {
        defaultValue: { summary: "0.1" },
      },
    },
    foregroundOpacity: {
      control: "number",
      description:
        "How strongly the sweeping band's colour shows, from 0 (invisible) to 1",
      table: {
        defaultValue: { summary: "0.15" },
      },
    },
    borderRadius: {
      control: "text",
      description: "Corner radius of the square and bar shapes, in pixels",
      table: {
        defaultValue: { summary: "3" },
      },
    },
    className: {
      control: "text",
      description: "Class added to every placeholder row",
    },
    style: {
      control: "object",
      description: "Inline style applied to every placeholder row",
    },
    x: {
      control: false,
      description: "Ignored: the rows place their shapes themselves",
    },
    y: {
      control: false,
      description: "Ignored: the rows place their shapes themselves",
    },
    width: {
      control: false,
      description: "Ignored: the rows size their shapes themselves",
    },
    height: {
      control: false,
      description: "Ignored: the rows size their shapes themselves",
    },
    uniqueKey: {
      control: false,
      description: "Ignored: every shape takes an id of its own",
    },
  },
} satisfies Meta<typeof RowsSkeleton>;

type Story = StoryObj<ComponentProps<typeof RowsSkeleton>>;

export default meta;

// The sweeping band of react-content-loader is an <animateTransform>.
const isAnimated = (root: Element) =>
  root.querySelector("animateTransform") !== null;

export const Default: Story = {
  name: "Five rows",
  render: (args) => <RowsSkeleton {...args} />,
  args: {
    count: 5,
  },
  play: async ({ canvas }) => {
    const list = canvas.getByTestId("rows-skeleton");
    const rows = canvas.getAllByTestId("row-skeleton");
    await expect(rows).toHaveLength(5);
    await expect(isAnimated(list)).toBe(true);
    // A square start element, not a round one.
    await expect(rows[0].querySelector("clipPath circle")).toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "Five placeholder rows (`count`) with a light band sweeping across them, as a list shows them while its first page loads.",
      },
      source: {
        code: `<RowsSkeleton count={5} />`,
      },
    },
  },
};

export const StaticPlaceholder: Story = {
  name: "Still",
  render: (args) => <RowsSkeleton {...args} />,
  args: {
    count: 3,
    animate: false,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByTestId("row-skeleton")).toHaveLength(3);
    await expect(isAnimated(canvas.getByTestId("rows-skeleton"))).toBe(false);
  },
  parameters: {
    docs: {
      description: {
        story:
          "Three still placeholder rows, for a reader who asked for less motion: no band sweeps across the shapes (`animate`). The component does not check the system's reduced-motion setting itself.",
      },
      source: {
        code: `<RowsSkeleton count={3} animate={false} />`,
      },
    },
  },
};

const RoundStartElementTemplate = () => (
  <div>
    <RowSkeleton isRectangle={false} />
    <RowSkeleton isRectangle={false} />
    <RowSkeleton isRectangle={false} />
  </div>
);

export const RoundStartElement: Story = {
  name: "Round avatars",
  render: () => <RoundStartElementTemplate />,
  play: async ({ canvas }) => {
    const rows = canvas.getAllByTestId("row-skeleton");
    await expect(rows).toHaveLength(3);
    for (const row of rows) {
      await expect(row.querySelector("clipPath circle")).not.toBeNull();
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          "Three rows for a list of people: each `RowSkeleton` draws a round avatar in place of the square (`isRectangle={false}`). `RowsSkeleton` has no such prop, so these rows are built from `RowSkeleton` directly.",
      },
      source: {
        code: `<RowSkeleton isRectangle={false} />
<RowSkeleton isRectangle={false} />
<RowSkeleton isRectangle={false} />`,
      },
    },
  },
};
