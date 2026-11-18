import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";
import { expect } from "storybook/test";

import { RectangleSkeleton } from ".";

const meta = {
  title: "UI/Skeletons/Rectangle",
  component: RectangleSkeleton,
  argTypes: {
    width: {
      control: "text",
      description:
        "Width of the `<svg>` element and of the rectangle inside it. Any SVG length, so a percentage of the parent works.",
      table: {
        defaultValue: { summary: "100%" },
      },
    },
    height: {
      control: "text",
      description:
        "How tall the placeholder stands, as an SVG length; it sizes both the `<svg>` and the rectangle inside.",
      table: {
        defaultValue: { summary: "32px" },
      },
    },
    x: {
      control: "text",
      description: "Left edge of the rectangle inside the SVG, in user units.",
      table: {
        defaultValue: { summary: "0" },
      },
    },
    y: {
      control: "text",
      description: "Top edge of the rectangle inside the SVG, in user units.",
      table: {
        defaultValue: { summary: "0" },
      },
    },
    borderRadius: {
      control: "text",
      description: "Corner radius of the rectangle, in user units.",
      table: {
        defaultValue: { summary: "3" },
      },
    },
    backgroundColor: {
      control: "color",
      description:
        "Colour of the skeleton at rest. Fixed black, not a theme colour.",
      table: {
        defaultValue: { summary: "#000" },
      },
    },
    foregroundColor: {
      control: "color",
      description: "Colour of the band that sweeps across the skeleton.",
      table: {
        defaultValue: { summary: "#000" },
      },
    },
    backgroundOpacity: {
      control: { type: "range", min: 0, max: 1, step: 0.1 },
      description: "How strongly the resting colour shows, from 0 to 1.",
      table: {
        defaultValue: { summary: "0.1" },
      },
    },
    foregroundOpacity: {
      control: { type: "range", min: 0, max: 1, step: 0.1 },
      description: "How strongly the sweeping band shows, from 0 to 1.",
      table: {
        defaultValue: { summary: "0.15" },
      },
    },
    speed: {
      control: { type: "range", min: 0.5, max: 3, step: 0.1 },
      description: "Duration of one sweep, in seconds.",
      table: {
        defaultValue: { summary: "2" },
      },
    },
    animate: {
      control: "boolean",
      description:
        "Whether the band sweeps at all. Turn it off for a static placeholder.",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    title: {
      control: "text",
      description:
        'Accessible name of the skeleton, rendered as the SVG\'s `<title>`. It is empty by default, which leaves the `role="img"` element unnamed.',
      table: {
        defaultValue: { summary: '""' },
      },
    },
    uniqueKey: {
      control: "text",
      description:
        "Stable id for the SVG's gradient and clip path. Without it a `useId()` value is used, so server and client render the same ids.",
    },
    className: {
      control: "text",
      description: "Applied to the `<svg>` element.",
    },
    style: {
      control: "object",
      description: "Applied to the `<svg>` element.",
    },
  },
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
} satisfies Meta<typeof RectangleSkeleton>;

type Story = StoryObj<ComponentProps<typeof RectangleSkeleton>>;

export default meta;

const boxOf = (svg: Element) => {
  const { width, height } = svg.getBoundingClientRect();
  return [Math.round(width), Math.round(height)];
};

export const Default: Story = {
  render: (args) => <RectangleSkeleton {...args} />,
  args: {
    width: "200px",
    height: "100px",
  },
  play: async ({ canvas }) => {
    const svg = canvas.getByTestId("rectangle-skeleton");
    await expect(boxOf(svg)).toEqual([200, 100]);
    // Slightly rounded corners, on the shape inside the clip path (the
    // first rect is the loader's own background), and the band sweeps.
    await expect(svg.querySelector("clipPath rect")?.getAttribute("rx")).toBe(
      "3",
    );
    await expect(svg.querySelector("animateTransform")).not.toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A single placeholder with slightly rounded corners and the sweeping band.",
      },
      source: {
        code: `<RectangleSkeleton width="200px" height="100px" />`,
      },
    },
  },
};

export const SmallCircle: Story = {
  name: "Circle from a square",
  render: (args) => <RectangleSkeleton {...args} />,
  args: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
  },
  play: async ({ canvas }) => {
    const svg = canvas.getByTestId("rectangle-skeleton");
    await expect(boxOf(svg)).toEqual([40, 40]);
    await expect(svg.querySelector("clipPath rect")?.getAttribute("rx")).toBe(
      "50%",
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "A square whose corner radius is half its width, so it draws a circle (`borderRadius`). It suits an avatar beside rectangle placeholders.",
      },
      source: {
        code: `<RectangleSkeleton width="40px" height="40px" borderRadius="50%" />`,
      },
    },
  },
};

export const CustomColors: Story = {
  name: "Custom colours",
  render: (args) => <RectangleSkeleton {...args} />,
  args: {
    width: "200px",
    height: "100px",
    backgroundColor: "#e0e0e0",
    foregroundColor: "#f5f5f5",
    backgroundOpacity: 0.8,
    foregroundOpacity: 0.4,
  },
  play: async ({ canvas }) => {
    const colors = Array.from(
      canvas.getByTestId("rectangle-skeleton").querySelectorAll("stop"),
    ).map((stop) => stop.getAttribute("stop-color"));
    await expect(colors).toContain("#e0e0e0");
    await expect(colors).toContain("#f5f5f5");
  },
  parameters: {
    docs: {
      description: {
        story:
          "A light grey rectangle with a paler band, for a dark surface where the default black does not read (`backgroundColor`, `foregroundColor`, their opacities).",
      },
      source: {
        code: `<RectangleSkeleton
  width="200px"
  height="100px"
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
  name: "Still",
  render: (args) => <RectangleSkeleton {...args} />,
  args: {
    width: "200px",
    height: "100px",
    animate: false,
  },
  play: async ({ canvas }) => {
    await expect(
      canvas
        .getByTestId("rectangle-skeleton")
        .querySelector("animateTransform"),
    ).toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "The same rectangle without the sweep (`animate`), for a user who asked for reduced motion.",
      },
      source: {
        code: `<RectangleSkeleton width="200px" height="100px" animate={false} />`,
      },
    },
  },
};

export const SlowAnimation: Story = {
  name: "Slow sweep",
  render: (args) => <RectangleSkeleton {...args} />,
  args: {
    width: "200px",
    height: "100px",
    speed: 2.5,
  },
  play: async ({ canvas }) => {
    await expect(
      canvas
        .getByTestId("rectangle-skeleton")
        .querySelector("animateTransform")
        ?.getAttribute("dur"),
    ).toBe("2.5s");
  },
  parameters: {
    docs: {
      description: {
        story:
          "The band takes two and a half seconds to cross instead of two, a calmer pace for a large area (`speed`).",
      },
      source: {
        code: `<RectangleSkeleton width="200px" height="100px" speed={2.5} />`,
      },
    },
  },
};

export const Grid: Story = {
  name: "Grid",
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "16px",
      }}
    >
      <RectangleSkeleton width="100%" height="100px" />
      <RectangleSkeleton width="100%" height="100px" />
      <RectangleSkeleton width="100%" height="100px" />
      <RectangleSkeleton width="100%" height="100px" />
      <RectangleSkeleton width="100%" height="100px" />
      <RectangleSkeleton width="100%" height="100px" />
    </div>
  ),
  play: async ({ canvas }) => {
    // Six cells in rows of three, each filling its cell.
    const cells = canvas.getAllByTestId("rectangle-skeleton");
    await expect(cells).toHaveLength(6);
    const tops = new Set(cells.map((cell) => cell.getBoundingClientRect().top));
    await expect(tops.size).toBe(2);
    // Each placeholder keeps its own gradient id.
    const ids = new Set(
      cells.map((cell) => cell.querySelector("linearGradient")?.id),
    );
    await expect(ids.size).toBe(6);
  },
  parameters: {
    docs: {
      description: {
        story:
          "Six placeholders filling a three-column grid, each 100% of its cell's width, as a card grid shows while its items load.",
      },
      source: {
        code: `<div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
  <RectangleSkeleton width="100%" height="100px" />
  <RectangleSkeleton width="100%" height="100px" />
  <RectangleSkeleton width="100%" height="100px" />
  <RectangleSkeleton width="100%" height="100px" />
  <RectangleSkeleton width="100%" height="100px" />
  <RectangleSkeleton width="100%" height="100px" />
</div>`,
      },
    },
  },
};

export const CssCustomization: Story = {
  name: "Styled with props",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <RectangleSkeleton
        width="280px"
        height="40px"
        borderRadius="20px"
        backgroundColor="#0082c9"
        foregroundColor="#cce5f6"
        backgroundOpacity={0.15}
        foregroundOpacity={0.3}
      />
      <RectangleSkeleton
        width="200px"
        height="40px"
        borderRadius="20px"
        backgroundColor="#0082c9"
        foregroundColor="#cce5f6"
        backgroundOpacity={0.15}
        foregroundOpacity={0.3}
      />
      <RectangleSkeleton
        width="160px"
        height="40px"
        borderRadius="20px"
        backgroundColor="#0082c9"
        foregroundColor="#cce5f6"
        backgroundOpacity={0.15}
        foregroundOpacity={0.3}
      />
    </div>
  ),
  play: async ({ canvas }) => {
    const widths = canvas
      .getAllByTestId("rectangle-skeleton")
      .map((pill) => boxOf(pill)[0]);
    await expect(widths).toEqual([280, 200, 160]);
  },
  parameters: {
    docs: {
      description: {
        story: `The component reads no CSS variables. These three pills are styled with five props instead: \`backgroundColor\`, \`foregroundColor\`, their opacities and \`borderRadius\`.`,
      },
      source: {
        code: `<RectangleSkeleton
  width="280px"
  height="40px"
  borderRadius="20px"
  backgroundColor="#0082c9"
  foregroundColor="#cce5f6"
  backgroundOpacity={0.15}
  foregroundOpacity={0.3}
/>`,
      },
    },
  },
};
