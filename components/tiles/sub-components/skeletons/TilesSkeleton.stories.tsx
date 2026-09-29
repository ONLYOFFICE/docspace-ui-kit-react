import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import React from "react";

import { TileSkeleton } from "./Tile";
import { TilesSkeleton } from "./Tiles";

const meta = {
  title: "UI/Tiles/TilesSkeleton",
  component: TilesSkeleton,
  parameters: {
    docs: {
      description: {
        component: `Placeholder in the shape of a tile listing, shown while the tiles themselves are loading.

### Features

- **Tile Placeholders**: Draws the number of folder and file placeholders it is given, two folders and eight files unless told otherwise
- **Grouped Like The Listing**: Puts the folder placeholders above the file placeholders, each group under a bar standing for its heading
- **Tile Shapes**: Gives a folder a 64px bar and a file a 220px card, both with rounded corners
- **Optional Files Heading**: Leaves out the bar above the files when the listing has no heading there
- **Room Placeholder**: Lets a single \`TileSkeleton\` draw a room card, with a logo, a title bar and two tag bars
- **Sweeping Band**: Moves a light band across every shape at the speed and in the colours given
- **Fewer Tiles On Smaller Screens**: Hides the placeholders of each group past the seventh on a tablet and past the second on a phone

### Accessibility

Each shape is an SVG exposed to assistive technology as an image:

- **Role**: Every shape carries \`role="img"\`, so a screen reader meets one image per tile and per heading bar
- **Name**: \`title\` names every shape through an SVG \`<title>\`; without one the images have no name and nothing is announced
- **Busy State**: The grid sets no \`aria-busy\`; mark the loading region with it yourself

### Usage

\`\`\`tsx
import { TilesSkeleton } from "@onlyoffice/apps-ui-kit/components/tiles/sub-components/skeletons";

// While the first page of tiles is loading
{isLoading ? <TilesSkeleton /> : <TileContainer>{tiles}</TileContainer>}

// A folder with files only, and no heading above them
<TilesSkeleton foldersCount={0} filesCount={6} withTitle={false} />
\`\`\``,
      },
    },
  },
  argTypes: {
    foldersCount: {
      control: "number",
      description:
        "How many folder placeholders to draw; with none, the bar above them goes too",
      table: {
        defaultValue: { summary: "2" },
      },
    },
    filesCount: {
      control: "number",
      description:
        "How many file placeholders to draw; with none, the bar above them goes too",
      table: {
        defaultValue: { summary: "8" },
      },
    },
    withTitle: {
      control: "boolean",
      description: "Whether a bar stands for the heading above the files",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    isRooms: {
      control: false,
      description:
        "Meant to widen the columns for room tiles; it currently changes nothing",
      table: {
        defaultValue: { summary: "false" },
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
      description:
        "Corner radius of every shape; the tiles fall back to 12px and the heading bars to 3px",
    },
    animate: {
      control: false,
      description:
        "Stops the band on the two heading bars only; the tile placeholders keep sweeping",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    className: {
      control: "text",
      description:
        "Class added to every tile placeholder, and in place of the heading bars' own",
    },
    style: {
      control: "object",
      description: "Inline style of every tile placeholder and heading bar",
    },
    width: {
      control: false,
      description: "Resizes the two heading bars only",
    },
    height: {
      control: false,
      description: "Resizes the two heading bars only",
    },
    x: {
      control: false,
      description: "Ignored: the grid places its shapes itself",
    },
    y: {
      control: false,
      description: "Ignored: the grid places its shapes itself",
    },
    uniqueKey: {
      control: false,
      description: "Ignored: every shape takes an id of its own",
    },
  },
} satisfies Meta<typeof TilesSkeleton>;

type Story = StoryObj<ComponentProps<typeof TilesSkeleton>>;

export default meta;

export const Default: Story = {
  render: (args) => <TilesSkeleton {...args} />,
  args: {
    foldersCount: 2,
    filesCount: 4,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Two folder and four file placeholders under their heading bars (`foldersCount`, `filesCount`), as a tile listing shows them while its first page loads. Change any other prop live in the Controls panel below.",
      },
      source: {
        code: `<TilesSkeleton foldersCount={2} filesCount={4} />`,
      },
    },
  },
};

export const FilesWithoutHeading: Story = {
  render: (args) => <TilesSkeleton {...args} />,
  args: {
    foldersCount: 0,
    filesCount: 3,
    withTitle: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A folder that holds files only and shows no heading above them: no folder placeholders, so their bar goes as well, and no bar above the files (`foldersCount={0}`, `withTitle={false}`).",
      },
      source: {
        code: `<TilesSkeleton foldersCount={0} filesCount={3} withTitle={false} />`,
      },
    },
  },
};

const TileShapesTemplate = () => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 240px)",
      gap: "16px",
      alignItems: "start",
    }}
  >
    <TileSkeleton isFolder />
    <TileSkeleton isRoom />
    <TileSkeleton />
  </div>
);

export const TileShapes: Story = {
  render: () => <TileShapesTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "The three shapes one `TileSkeleton` can take, for a listing that builds its own placeholder grid: a folder bar (`isFolder`), a room card with a logo, a title bar, a small square for the menu and two tag bars (`isRoom`), and a file card. `TilesSkeleton` never draws the room card, so a grid of rooms is built from `TileSkeleton` directly.",
      },
      source: {
        code: `<TileSkeleton isFolder />
<TileSkeleton isRoom />
<TileSkeleton />`,
      },
    },
  },
};
