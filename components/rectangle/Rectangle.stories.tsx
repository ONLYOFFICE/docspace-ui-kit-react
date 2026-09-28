import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";

import { RectangleSkeleton } from ".";

const meta = {
  title: "UI/Skeletons/Rectangle",
  component: RectangleSkeleton,
  argTypes: {
    width: {
      control: "text",
      description:
        "Width of the SVG element and of the rectangle drawn in it. The default fills the parent's width",
      table: {
        defaultValue: { summary: "100%" },
      },
    },
    height: {
      control: "text",
      description:
        "Height of the SVG element and of the rectangle drawn in it. A percentage needs a parent with a height, or the skeleton collapses",
      table: {
        defaultValue: { summary: "32px" },
      },
    },
    x: {
      control: "text",
      description:
        "Left edge of the rectangle inside the SVG, in pixels. A value above zero cuts off the rectangle's right side, since the rectangle keeps the full width",
      table: {
        defaultValue: { summary: "0" },
      },
    },
    y: {
      control: "text",
      description:
        "Top edge of the rectangle inside the SVG, in pixels. A value above zero cuts off the rectangle's bottom, since the rectangle keeps the full height",
      table: {
        defaultValue: { summary: "0" },
      },
    },
    borderRadius: {
      control: "text",
      description:
        "Corner radius of the rectangle, in pixels or as a percentage of the element's width; 50% on a square gives a circle",
      table: {
        defaultValue: { summary: "3" },
      },
    },
    backgroundColor: {
      control: "color",
      description:
        "Colour of the rectangle at rest. Black by default in every theme",
      table: {
        defaultValue: { summary: "#000" },
      },
    },
    foregroundColor: {
      control: "color",
      description:
        "Colour of the lighter band that sweeps across the rectangle",
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
        "Whether the band sweeps at all. Off, the rectangle is a still shape",
      table: {
        defaultValue: { summary: "true" },
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
    uniqueKey: {
      control: "text",
      description:
        "Fixed id for the SVG's internal gradient and clip path, so server and client render the same markup. Generated per instance when left out",
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
    docs: {
      description: {
        component: `A rectangular loading placeholder that stands in for a line of text, a button, a card or a table cell until the content arrives, so the page does not jump when it does.

### Features

- **Configurable Dimensions**: The width and height size both the element and the rectangle in it, 100% wide and 32px high by default
- **Custom Colors**: Draws in black at low opacity in every theme by default, and takes its own resting and highlight colours with separate opacities
- **Sweeping Highlight**: A lighter band sweeps across the rectangle, once every two seconds by default and at any pace set
- **Still Mode**: Stops the sweep entirely for a page that must not animate
- **SVG Based**: Renders as an SVG rectangle for crisp display at any resolution
- **Border Radius**: Rounds the corners slightly by default, up to pill and circle shapes
- **Accessible Name**: Takes an optional title that names the placeholder for screen readers
- **SSR Safe**: Keeps the SVG's internal ids stable between server and client render

### Accessibility

The SVG is exposed to assistive technology as an image:

- **Role**: The element carries \`role="img"\`, so a screen reader treats the placeholder as one picture
- **Name**: \`title\` renders an SVG \`<title>\` that the element's \`aria-labelledby\` points at; without one the image has no name and nothing is announced
- **Busy State**: The component sets no \`aria-busy\`; mark the loading region with it yourself
- **Motion**: Nothing checks \`prefers-reduced-motion\`; pass \`animate={false}\` where motion should stop

### Usage

\`\`\`tsx
import { RectangleSkeleton } from "@onlyoffice/apps-ui-kit/components/rectangle";

// A line of text
<RectangleSkeleton width="180px" height="22px" title="Loading the title" />

// A still, rounded button placeholder
<RectangleSkeleton width="120px" height="32px" borderRadius="16" animate={false} />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof RectangleSkeleton>;

type Story = StoryObj<ComponentProps<typeof RectangleSkeleton>>;

export default meta;

export const Default: Story = {
  render: (args) => <RectangleSkeleton {...args} />,
  args: {
    width: "200px",
    height: "100px",
  },
  parameters: {
    docs: {
      description: {
        story:
          "A single placeholder with slightly rounded corners and the sweeping band; change any prop live in the Controls panel below.",
      },
      source: {
        code: `<RectangleSkeleton width="200px" height="100px" />`,
      },
    },
  },
};

export const SmallCircle: Story = {
  render: (args) => <RectangleSkeleton {...args} />,
  args: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
  },
  parameters: {
    docs: {
      description: {
        story:
          "A square with half its width as the corner radius turns into a circle (`borderRadius`), for an avatar placeholder that keeps the SSR-safe ids `CircleSkeleton` lacks.",
      },
      source: {
        code: `<RectangleSkeleton width="40px" height="40px" borderRadius="50%" />`,
      },
    },
  },
};

export const CustomColors: Story = {
  render: (args) => <RectangleSkeleton {...args} />,
  args: {
    width: "200px",
    height: "100px",
    backgroundColor: "#e0e0e0",
    foregroundColor: "#f5f5f5",
    backgroundOpacity: 0.8,
    foregroundOpacity: 0.4,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A light grey rectangle with a paler band, for a surface where the default black at low opacity does not read, such as a dark theme (`backgroundColor`, `foregroundColor` and their opacities).",
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
  render: (args) => <RectangleSkeleton {...args} />,
  args: {
    width: "200px",
    height: "100px",
    animate: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "The same rectangle without the sweep, for a page that must not animate, such as one shown to a user who asked for reduced motion (`animate`).",
      },
      source: {
        code: `<RectangleSkeleton width="200px" height="100px" animate={false} />`,
      },
    },
  },
};

export const SlowAnimation: Story = {
  render: (args) => <RectangleSkeleton {...args} />,
  args: {
    width: "200px",
    height: "100px",
    speed: 2.5,
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
  parameters: {
    docs: {
      description: {
        story: `The component reads no CSS custom property: its colours are SVG gradient stops filled from props, so a wrapper variable never reaches them. All three pills here set the same five props, at three widths:

| Prop | Description | Default |
|------|-------------|---------|
| \`backgroundColor\` | Colour of the rectangle at rest | \`#000\` |
| \`foregroundColor\` | Colour of the sweeping band | \`#000\` |
| \`backgroundOpacity\` | Opacity of the resting colour | \`0.1\` |
| \`foregroundOpacity\` | Opacity of the sweeping band | \`0.15\` |
| \`borderRadius\` | Corner radius of the rectangle | \`3\` |`,
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
