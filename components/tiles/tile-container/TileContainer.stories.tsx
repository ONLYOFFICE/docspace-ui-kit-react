import type { ComponentProps, CSSProperties } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

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
    docs: {
      description: {
        component: `The grid a tile listing sits in: it sorts the tiles it is given into rooms, templates, folders and files, and lays each group out in columns.

### Features

- **Responsive Grid**: Lays the tiles out in as many columns as fit, each at least 216px wide, and rooms and templates at least 275px
- **Virtualised Grid**: Hands the sorted tiles to a virtualising grid of the host's instead of its own grids
- **Section Headings**: Puts a heading above the folders and above the files, each only when that group is not empty
- **Sorting By Kind**: Sorts its children into rooms, templates, folders and files by their \`item\`, in that order, and drops a child without one
- **Adjustable Gap**: Spaces the tiles 16px apart, or by the gap the host sets
- **Text Selection**: Lets the reader select the text on the tiles, unless selection is turned off for the whole grid

### Usage

\`\`\`tsx
import { TileContainer } from "@onlyoffice/apps-ui-kit/components/tiles/tile-container";
import { FileTile } from "@onlyoffice/apps-ui-kit/components/tiles/file-tile";

<TileContainer useReactWindow={false} headingFiles="Files">
  <FileTile item={file} element={<WordIcon />} contextOptions={options}>
    <TileContent><Link>{file.title}</Link></TileContent>
  </FileTile>
</TileContainer>

// Folders and files, each group under its own heading
<TileContainer headingFolders="Folders" headingFiles="Files">
  {folders.map((folder) => <FolderTile key={folder.id} item={folder} element={<FolderIcon />} contextOptions={options}>…</FolderTile>)}
  {files.map((file) => <FileTile key={file.id} item={file} element={<WordIcon />} contextOptions={options}>…</FileTile>)}
</TileContainer>
\`\`\``,
      },
    },
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
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--tile-container-gap\` | Gap between the tiles, across and down | \`16px\` |
| \`--tile-bg\` | Background of each tile inside (read by the tiles) | theme-based |
| \`--tile-border-style\` | Border of each tile inside (read by the tiles) | theme-based |
| \`--tile-radius\` | Corner radius of each tile inside (read by the tiles) | \`12px\` |
| \`--tile-hover-bg\` | Background of a tile on hover (read by the tiles) | theme-based |

One grid of three files sets every row; hover a tile for \`--tile-hover-bg\`. The container's own variable is the gap; the others are the tiles' and are set here once for the whole grid.`,
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
