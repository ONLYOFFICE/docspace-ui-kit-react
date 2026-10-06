import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";
import { expect } from "storybook/test";

import { CircleSkeleton } from ".";

const meta = {
  title: "UI/Skeletons/Circle",
  component: CircleSkeleton,
  argTypes: {
    radius: {
      control: "text",
      description:
        "Radius of the circle, in user units. It sizes the circle only, not the element around it",
      table: {
        defaultValue: { summary: "12" },
      },
    },
    x: {
      control: "text",
      description:
        "Horizontal position of the circle's centre, in user units. A value smaller than `radius` cuts off the circle's left side, which the default does",
      table: {
        defaultValue: { summary: "3" },
      },
    },
    y: {
      control: "text",
      description:
        "Vertical position of the circle's centre, in user units. A value smaller than `radius` cuts off the circle's top",
      table: {
        defaultValue: { summary: "12" },
      },
    },
    width: {
      control: "text",
      description:
        "Width of the SVG element. The default fills the parent's width",
      table: {
        defaultValue: { summary: "100%" },
      },
    },
    height: {
      control: "text",
      description:
        "Height of the SVG element. The default fills the parent's height, and shrinks to nothing in a parent without one",
      table: {
        defaultValue: { summary: "100%" },
      },
    },
    title: {
      control: "text",
      description:
        "Accessible name of the placeholder, read by screen readers and shown as the browser's tooltip on hover. Empty by default, which leaves the placeholder unnamed",
      table: {
        defaultValue: { summary: '""' },
      },
    },
    backgroundColor: {
      control: "color",
      description:
        "Colour of the circle at rest. Black by default in every theme",
      table: {
        defaultValue: { summary: "#000" },
      },
    },
    foregroundColor: {
      control: "color",
      description: "Colour of the lighter band that sweeps across the circle",
      table: {
        defaultValue: { summary: "#000" },
      },
    },
    backgroundOpacity: {
      control: { type: "range", min: 0, max: 1, step: 0.1 },
      description: "Opacity of the resting colour",
      table: {
        defaultValue: { summary: "0.1" },
      },
    },
    foregroundOpacity: {
      control: { type: "range", min: 0, max: 1, step: 0.1 },
      description: "Opacity of the sweeping band's colour",
      table: {
        defaultValue: { summary: "0.15" },
      },
    },
    speed: {
      control: { type: "range", min: 0.5, max: 3, step: 0.1 },
      description:
        "Duration of one sweep, in seconds: a larger value moves the band more slowly",
      table: {
        defaultValue: { summary: "2" },
      },
    },
    animate: {
      control: "boolean",
      description:
        "Whether the band sweeps at all. Off, the circle is a still shape",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    className: {
      control: "text",
      description: "Class name added to the SVG element",
    },
    style: {
      control: "object",
      description: "Inline style applied to the SVG element",
    },
  },
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
} satisfies Meta<typeof CircleSkeleton>;

type Story = StoryObj<ComponentProps<typeof CircleSkeleton>>;

export default meta;

type PlayContext = Parameters<NonNullable<Story["play"]>>[0];

// Checks the box, the circle's radius and its centre.
const expectCircle = async (
  { canvas }: PlayContext,
  box: number,
  radius: number,
) => {
  const svg = canvas.getByTestId("circle-skeleton");
  await expect(svg.getBoundingClientRect().width).toBe(box);
  const circle = svg.querySelector("circle") as SVGCircleElement;
  await expect(circle.getAttribute("r")).toBe(String(radius));
  await expect(circle.getAttribute("cx")).toBe(String(box / 2));
  return svg;
};

export const Default: Story = {
  render: (args) => <CircleSkeleton {...args} />,
  args: {
    width: "50",
    height: "50",
    radius: "20",
    x: "25",
    y: "25",
  },
  play: async (context) => {
    const svg = await expectCircle(context, 50, 20);
    // The band sweeps by default.
    await expect(svg.querySelector("animateTransform")).not.toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A circle of radius 20 centred in a 50 by 50 box — the radius, the centre and the box size are set together, because the component's own defaults cut the circle off. Change any prop live in the Controls panel below.",
      },
      source: {
        code: `<CircleSkeleton width="50" height="50" radius="20" x="25" y="25" />`,
      },
    },
  },
};

export const SmallAvatar: Story = {
  render: (args) => <CircleSkeleton {...args} />,
  args: {
    width: "32",
    height: "32",
    radius: "16",
    x: "16",
    y: "16",
  },
  play: async (context) => {
    await expectCircle(context, 32, 16);
  },
  parameters: {
    docs: {
      description: {
        story:
          "Small avatar-sized circle skeleton, suitable for compact user avatars.",
      },
      source: {
        code: `<CircleSkeleton width="32" height="32" radius="16" x="16" y="16" />`,
      },
    },
  },
};

export const LargeAvatar: Story = {
  render: (args) => <CircleSkeleton {...args} />,
  args: {
    width: "80",
    height: "80",
    radius: "40",
    x: "40",
    y: "40",
  },
  play: async (context) => {
    await expectCircle(context, 80, 40);
  },
  parameters: {
    docs: {
      description: {
        story:
          "Large avatar-sized circle skeleton, suitable for profile images.",
      },
      source: {
        code: `<CircleSkeleton width="80" height="80" radius="40" x="40" y="40" />`,
      },
    },
  },
};

export const CustomColors: Story = {
  render: (args) => <CircleSkeleton {...args} />,
  args: {
    width: "50",
    height: "50",
    radius: "20",
    x: "25",
    y: "25",
    backgroundColor: "#e0e0e0",
    foregroundColor: "#f5f5f5",
    backgroundOpacity: 0.8,
    foregroundOpacity: 0.4,
  },
  play: async (context) => {
    const svg = await expectCircle(context, 50, 20);
    const colors = Array.from(svg.querySelectorAll("stop")).map((stop) =>
      stop.getAttribute("stop-color"),
    );
    await expect(colors).toContain("#e0e0e0");
    await expect(colors).toContain("#f5f5f5");
  },
  parameters: {
    docs: {
      description: {
        story:
          "A light grey circle for a surface where the default black at low opacity is too faint or the wrong tone, such as a dark one (`backgroundColor`, `foregroundColor` and their opacities).",
      },
      source: {
        code: `<CircleSkeleton
  width="50"
  height="50"
  radius="20"
  x="25"
  y="25"
  backgroundColor="#e0e0e0"
  foregroundColor="#f5f5f5"
  backgroundOpacity={0.8}
  foregroundOpacity={0.4}
/>`,
      },
    },
  },
};

export const NoAnimation: Story = {
  render: (args) => <CircleSkeleton {...args} />,
  args: {
    width: "50",
    height: "50",
    radius: "20",
    x: "25",
    y: "25",
    animate: false,
  },
  play: async (context) => {
    const svg = await expectCircle(context, 50, 20);
    await expect(svg.querySelector("animateTransform")).toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A still circle with no sweeping band, for a page that must not animate or a reader who asked for reduced motion (`animate`).",
      },
      source: {
        code: `<CircleSkeleton width="50" height="50" radius="20" x="25" y="25" animate={false} />`,
      },
    },
  },
};

export const SlowAnimation: Story = {
  render: (args) => <CircleSkeleton {...args} />,
  args: {
    width: "50",
    height: "50",
    radius: "20",
    x: "25",
    y: "25",
    speed: 2.5,
  },
  play: async (context) => {
    const svg = await expectCircle(context, 50, 20);
    await expect(
      svg.querySelector("animateTransform")?.getAttribute("dur"),
    ).toBe("2.5s");
  },
  parameters: {
    docs: {
      description: {
        story:
          "The band takes 2.5 seconds per sweep instead of 2, for a calmer placeholder on a page that waits longer (`speed`).",
      },
      source: {
        code: `<CircleSkeleton width="50" height="50" radius="20" x="25" y="25" speed={2.5} />`,
      },
    },
  },
};

export const AvatarGroup: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "8px" }}>
      <CircleSkeleton width="40" height="40" radius="20" x="20" y="20" />
      <CircleSkeleton width="40" height="40" radius="20" x="20" y="20" />
      <CircleSkeleton width="40" height="40" radius="20" x="20" y="20" />
      <CircleSkeleton width="40" height="40" radius="20" x="20" y="20" />
    </div>
  ),
  play: async ({ canvas }) => {
    const circles = canvas.getAllByTestId("circle-skeleton");
    await expect(circles).toHaveLength(4);
    // Side by side in one row.
    const tops = new Set(
      circles.map((circle) => circle.getBoundingClientRect().top),
    );
    await expect(tops.size).toBe(1);
  },
  parameters: {
    docs: {
      description: {
        story:
          "Multiple circle skeletons arranged in a row, simulating an avatar group placeholder.",
      },
      source: {
        code: `<div style={{ display: "flex", gap: "8px" }}>
  <CircleSkeleton width="40" height="40" radius="20" x="20" y="20" />
  <CircleSkeleton width="40" height="40" radius="20" x="20" y="20" />
  <CircleSkeleton width="40" height="40" radius="20" x="20" y="20" />
  <CircleSkeleton width="40" height="40" radius="20" x="20" y="20" />
</div>`,
      },
    },
  },
};

export const CssCustomization: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <CircleSkeleton
        width="40"
        height="40"
        radius="20"
        x="20"
        y="20"
        backgroundColor="#0082c9"
        foregroundColor="#cce5f6"
        backgroundOpacity={0.15}
        foregroundOpacity={0.3}
      />
      <CircleSkeleton
        width="56"
        height="56"
        radius="28"
        x="28"
        y="28"
        backgroundColor="#0082c9"
        foregroundColor="#cce5f6"
        backgroundOpacity={0.15}
        foregroundOpacity={0.3}
      />
      <CircleSkeleton
        width="80"
        height="80"
        radius="40"
        x="40"
        y="40"
        backgroundColor="#0082c9"
        foregroundColor="#cce5f6"
        backgroundOpacity={0.15}
        foregroundOpacity={0.3}
      />
    </div>
  ),
  play: async ({ canvas }) => {
    const widths = canvas
      .getAllByTestId("circle-skeleton")
      .map((circle) => circle.getBoundingClientRect().width);
    await expect(widths).toEqual([40, 56, 80]);
  },
  parameters: {
    docs: {
      description: {
        story: `The component reads no CSS custom property -- see the behaviour notes on this page; its colours come from props. All three circles here set the same four props, at three sizes.`,
      },
      source: {
        code: `<CircleSkeleton
  width="40"
  height="40"
  radius="20"
  x="20"
  y="20"
  backgroundColor="#0082c9"
  foregroundColor="#cce5f6"
  backgroundOpacity={0.15}
  foregroundOpacity={0.3}
/>`,
      },
    },
  },
};
