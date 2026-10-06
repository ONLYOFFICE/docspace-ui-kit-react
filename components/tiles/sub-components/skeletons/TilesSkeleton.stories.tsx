import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import React from "react";

import { TileSkeleton } from "./Tile";
import { TilesSkeleton } from "./Tiles";

const meta = {
  title: "UI/Tiles/TilesSkeleton",
  component: TilesSkeleton,
  parameters: {
    docs: {
      description: {
        component: `Placeholder in the shape of a tile listing, shown while the tiles themselves are loading. The Tiles page describes it in full.`,
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

// The heading bars above the folder and file placeholders.
const headingBar = (root: HTMLElement, kind: "folders" | "files") =>
  root.querySelector(`.${kind}`);

export const Default: Story = {
  render: (args) => <TilesSkeleton {...args} />,
  args: {
    foldersCount: 2,
    filesCount: 4,
  },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getAllByTestId("tile-skeleton-folder")).toHaveLength(2);
    await expect(canvas.getAllByTestId("tile-skeleton-file")).toHaveLength(4);
    await expect(headingBar(canvasElement, "folders")).not.toBeNull();
    await expect(headingBar(canvasElement, "files")).not.toBeNull();
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
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.queryByTestId("tile-skeleton-folder")).toBeNull();
    await expect(canvas.getAllByTestId("tile-skeleton-file")).toHaveLength(3);
    // Neither heading bar is drawn.
    await expect(headingBar(canvasElement, "folders")).toBeNull();
    await expect(headingBar(canvasElement, "files")).toBeNull();
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
  play: async ({ canvas }) => {
    const folder = canvas.getByTestId("tile-skeleton-folder");
    const room = canvas.getByTestId("tile-skeleton-room");
    const file = canvas.getByTestId("tile-skeleton-file");
    // A folder is a bar; a file is a card, taller than it.
    await expect(file.getBoundingClientRect().height).toBeGreaterThan(
      folder.getBoundingClientRect().height,
    );
    await expect(room).toBeVisible();
    await expect(canvas.getByTestId("room-tile-content")).toBeVisible();
  },
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
