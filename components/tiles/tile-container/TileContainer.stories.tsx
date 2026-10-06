import type { ComponentProps, CSSProperties } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import type { TileContainerProps } from "./TileContainer.types";

import WordSvgUrl from "../../../assets/icons/32/word.svg";
import PdfSvgUrl from "../../../assets/icons/32/pdf.svg";
import SlideSvgUrl from "../../../assets/icons/32/slide.svg";
import ImageReactSvg from "../../../assets/emptyview/empty.rooms.root.light.svg";

import { TileContainer } from ".";
import { TileContent } from "../tile-content";
import { FileType } from "../../../enums";
import { Link } from "../../link";
import { FileTile } from "../file-tile";
import { FolderTile } from "../folder-tile";
import Folder32ReactSvg from "../../../assets/icons/32/folder.svg";

const wordElement = <WordSvgUrl />;
const pdfElement = <PdfSvgUrl />;
const slideElement = <SlideSvgUrl />;

const mockFiles = [
  {
    id: "1",
    title: "Document.docx",
    fileExst: ".docx",
    fileType: FileType.Document,
  },
  {
    id: "2",
    title: "Presentation.pptx",
    fileExst: ".pptx",
    fileType: FileType.Presentation,
  },
  {
    id: "3",
    title: "Spreadsheet.xlsx",
    fileExst: ".xlsx",
    fileType: FileType.Spreadsheet,
  },
];

const mockFolders = [
  { id: "f1", title: "Projects", isFolder: true },
  { id: "f2", title: "Archive", isFolder: true },
];

const mockContextOptions = [
  { key: "edit", label: "Edit" },
  { key: "delete", label: "Delete" },
];

const meta = {
  title: "UI/Tiles/TileContainer",
  component: TileContainer,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    children: {
      control: false,
      description:
        "The tiles; each must carry an `item` prop, which decides its group. A child without one, plain markup included, is not shown",
    },
    headingFolders: {
      control: "text",
      description:
        "Heading above the folders; shown only when there is at least one folder",
    },
    headingFiles: {
      control: "text",
      description:
        "Heading above the files; shown only when there is at least one file",
    },
    useReactWindow: {
      control: "boolean",
      description:
        "Hands the sorted tiles to `infiniteGrid` instead of wrapping each group in a grid of its own; without an `infiniteGrid` the tiles are left with no grid at all",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    infiniteGrid: {
      control: false,
      description:
        "The host's virtualising grid, which receives all the tiles and whether the listing holds rooms or templates",
    },
    noSelect: {
      control: "boolean",
      description: "Stops the reader selecting text anywhere in the grid",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDesc: {
      control: "boolean",
      description:
        "Adds a class to both headings for a descending sort; no style of the kit reads it, so nothing changes on screen",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    id: {
      control: "text",
      description: "Value of `id` on the outer element",
      table: {
        defaultValue: { summary: '"tileContainer"' },
      },
    },
    className: {
      control: "text",
      description: "Class added to the outer element",
    },
    style: {
      control: "object",
      description: "Inline style of the outer element",
    },
  },
} satisfies Meta<typeof TileContainer>;

type Story = StoryObj<ComponentProps<typeof TileContainer>>;

export default meta;

// The container sorts its children into groups, each item in a wrapper.
const items = (root: HTMLElement, kind: "file" | "folder") =>
  Array.from(root.querySelectorAll<HTMLElement>(`.tile-item.${kind}`));

const ContainerTemplate = (args: TileContainerProps) => {
  return (
    <TileContainer {...args}>
      {mockFiles.map((file) => (
        <FileTile
          key={file.id}
          item={file}
          contextOptions={mockContextOptions}
          temporaryIcon={<ImageReactSvg />}
          element={
            file.fileType === FileType.Spreadsheet
              ? slideElement
              : file.fileType === FileType.Presentation
                ? pdfElement
                : wordElement
          }
        >
          <TileContent>
            <Link>{file.title}</Link>
          </TileContent>
        </FileTile>
      ))}
    </TileContainer>
  );
};

export const Default: Story = {
  render: (args) => <ContainerTemplate {...args} />,
  args: {
    useReactWindow: false,
    headingFiles: "Files",
  },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole("heading", { name: "Files" })).toBeVisible();
    await expect(items(canvasElement, "file")).toHaveLength(3);
    await expect(items(canvasElement, "folder")).toHaveLength(0);
  },
  parameters: {
    docs: {
      description: {
        story:
          "Three documents under the files heading, in as many columns as the window has room for; resize the window to see the columns change, and change any other prop live in the Controls panel below.",
      },
      source: {
        code: `<TileContainer useReactWindow={false} headingFiles="Files">
  <FileTile item={file1} element={<WordSvgUrl />} contextOptions={options}>
    <TileContent><Link>Document.docx</Link></TileContent>
  </FileTile>
  <FileTile item={file2} element={<PdfSvgUrl />} contextOptions={options}>
    <TileContent><Link>Presentation.pptx</Link></TileContent>
  </FileTile>
  <FileTile item={file3} element={<SlideSvgUrl />} contextOptions={options}>
    <TileContent><Link>Spreadsheet.xlsx</Link></TileContent>
  </FileTile>
</TileContainer>`,
      },
    },
  },
};

export const FoldersAndFiles: Story = {
  render: (args) => (
    <TileContainer {...args}>
      {mockFiles.slice(0, 2).map((file) => (
        <FileTile
          key={file.id}
          item={file}
          contextOptions={mockContextOptions}
          temporaryIcon={<ImageReactSvg />}
          element={wordElement}
        >
          <TileContent>
            <Link>{file.title}</Link>
          </TileContent>
        </FileTile>
      ))}
      {mockFolders.map((folder) => (
        <FolderTile
          key={folder.id}
          item={folder}
          contextOptions={mockContextOptions}
          element={<Folder32ReactSvg />}
        >
          <TileContent>
            <Link>{folder.title}</Link>
          </TileContent>
        </FolderTile>
      ))}
    </TileContainer>
  ),
  args: {
    headingFolders: "Folders",
    headingFiles: "Files",
  },
  play: async ({ canvas, canvasElement }) => {
    await expect(items(canvasElement, "folder")).toHaveLength(2);
    await expect(items(canvasElement, "file")).toHaveLength(2);
    // Folders come first, whatever the order of the children.
    const folders = canvas.getByRole("heading", { name: "Folders" });
    const files = canvas.getByRole("heading", { name: "Files" });
    await expect(folders.getBoundingClientRect().top).toBeLessThan(
      files.getBoundingClientRect().top,
    );
    await expect(
      within(items(canvasElement, "folder")[0]).getByText("Projects"),
    ).toBeVisible();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A listing that holds both kinds, passed in with the files first: the grid still puts the folders on top, each group under its own heading (`headingFolders`, `headingFiles`), because it sorts by each tile's `item`, not by the order of the children.",
      },
      source: {
        code: `<TileContainer headingFolders="Folders" headingFiles="Files">
  <FileTile item={{ id: "1", title: "Document.docx", fileExst: ".docx" }} element={<WordSvgUrl />} contextOptions={options}>
    <TileContent><Link>Document.docx</Link></TileContent>
  </FileTile>
  <FileTile item={{ id: "2", title: "Presentation.pptx", fileExst: ".pptx" }} element={<WordSvgUrl />} contextOptions={options}>
    <TileContent><Link>Presentation.pptx</Link></TileContent>
  </FileTile>
  <FolderTile item={{ id: "f1", title: "Projects", isFolder: true }} element={<Folder32ReactSvg />} contextOptions={options}>
    <TileContent><Link>Projects</Link></TileContent>
  </FolderTile>
  <FolderTile item={{ id: "f2", title: "Archive", isFolder: true }} element={<Folder32ReactSvg />} contextOptions={options}>
    <TileContent><Link>Archive</Link></TileContent>
  </FolderTile>
</TileContainer>`,
      },
    },
  },
};

export const CssCustomization: Story = {
  play: async ({ canvas, canvasElement }) => {
    const [first] = items(canvasElement, "file");
    const grid = first.parentElement as HTMLElement;
    await expect(getComputedStyle(grid).columnGap).toBe("32px");
    const tile = getComputedStyle(within(first).getByTestId("tile"));
    await expect(tile.backgroundColor).toBe("rgb(244, 249, 253)");
    await expect(tile.borderTopLeftRadius).toBe("16px");
    await expect(canvas.getAllByTestId("tile")).toHaveLength(3);
  },
  render: () => (
    <div
      style={
        {
          "--tile-bg": "#f4f9fd",
          "--tile-border-style": "1px solid #0082c9",
          "--tile-radius": "16px",
          "--tile-hover-bg": "#cce5f6",
          "--tile-container-gap": "32px",
        } as CSSProperties
      }
    >
      <TileContainer useReactWindow={false} headingFiles="Files">
        {mockFiles.map((file) => (
          <FileTile
            key={file.id}
            item={file}
            contextOptions={mockContextOptions}
            temporaryIcon={<ImageReactSvg />}
            element={
              file.fileType === FileType.Spreadsheet
                ? slideElement
                : file.fileType === FileType.Presentation
                  ? pdfElement
                  : wordElement
            }
          >
            <TileContent>
              <Link>{file.title}</Link>
            </TileContent>
          </FileTile>
        ))}
      </TileContainer>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `The variables are listed under CSS variables on this page. One grid of three files sets the gap and four of the tiles' variables; hover a tile for \`--tile-hover-bg\`. The container's own variable is the gap; the others are the tiles' and are set here once for the whole grid.`,
      },
      source: {
        code: `<div style={{
  "--tile-bg": "#f4f9fd",
  "--tile-border-style": "1px solid #0082c9",
  "--tile-radius": "16px",
  "--tile-hover-bg": "#cce5f6",
  "--tile-container-gap": "32px",
}}>
  <TileContainer headingFiles="Files">
    {files.map((file) => (
      <FileTile key={file.id} item={file} element={<WordIcon />} contextOptions={options}>
        <TileContent><Link>{file.title}</Link></TileContent>
      </FileTile>
    ))}
  </TileContainer>
</div>`,
      },
    },
  },
};
