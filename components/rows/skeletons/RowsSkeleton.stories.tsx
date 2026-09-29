import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import React from "react";

import { RowSkeleton } from "./RowSkeleton";
import { RowsSkeleton } from "./RowsSkeleton";

const meta = {
  title: "UI/Rows/RowsSkeleton",
  component: RowsSkeleton,
  parameters: {
    docs: {
      description: {
        component: `Placeholder in the shape of a list of rows, shown while the rows themselves are loading.

### Features

- **Row Placeholders**: Draws the number of placeholder rows it is given, twenty-five unless told otherwise
- **Row Shape**: Gives every row a square for the start element, a bar for the title and a small square for the three-dot button
- **Second Line On Smaller Screens**: Adds a shorter bar under the title below the desktop breakpoint, where a row shows its details line
- **Round Start Element**: Lets a single \`RowSkeleton\` draw a circle in place of the square, for a list of avatars
- **Sweeping Band**: Moves a light band across every shape at the speed and in the colours given, or keeps the shapes still
- **Shared Row Styling**: Hands the same class and inline style to every row it draws

### Accessibility

Each shape is an SVG exposed to assistive technology as an image:

- **Role**: Every shape carries \`role="img"\`, so a screen reader meets three images per row
- **Name**: \`title\` names every shape through an SVG \`<title>\`; without one the images have no name and nothing is announced
- **Busy State**: The list sets no \`aria-busy\`; mark the loading region with it yourself

### Usage

\`\`\`tsx
import { RowsSkeleton } from "@onlyoffice/apps-ui-kit/components/rows";

// While the first page of rows is loading
{isLoading ? <RowsSkeleton count={10} /> : <RowContainer>{rows}</RowContainer>}

// A still placeholder, for a reader who asked for less motion
<RowsSkeleton count={5} animate={false} />
\`\`\``,
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
      description: "Opacity of `backgroundColor`, from 0 to 1",
      table: {
        defaultValue: { summary: "0.1" },
      },
    },
    foregroundOpacity: {
      control: "number",
      description: "Opacity of `foregroundColor`, from 0 to 1",
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

export const Default: Story = {
  render: (args) => <RowsSkeleton {...args} />,
  args: {
    count: 5,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Five placeholder rows (`count`) with the band sweeping across them, as a list shows them while its first page loads. Change any other prop live in the Controls panel below.",
      },
      source: {
        code: `<RowsSkeleton count={5} />`,
      },
    },
  },
};

export const StaticPlaceholder: Story = {
  render: (args) => <RowsSkeleton {...args} />,
  args: {
    count: 3,
    animate: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A placeholder that does not move, for a reader who asked for less motion: the band no longer sweeps across the shapes (`animate`). The component does not check the system's reduced-motion setting itself.",
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
  render: () => <RoundStartElementTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Rows for a list of people, whose start element is a round avatar: each `RowSkeleton` draws a circle in place of the square (`isRectangle={false}`). `RowsSkeleton` has no such prop, so a list of round rows is built from `RowSkeleton` directly.",
      },
      source: {
        code: `<RowSkeleton isRectangle={false} />
<RowSkeleton isRectangle={false} />
<RowSkeleton isRectangle={false} />`,
      },
    },
  },
};
