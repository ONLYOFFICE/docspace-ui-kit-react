/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

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
        component: `Container component for displaying tiles in a grid layout.

### Features

- **Grid Layout**: Arranges tiles in a responsive grid
- **React Window Support**: Optional virtualized scrolling for large lists
- **Section Headings**: Configurable headings for files, rooms, and folders sections
- **Flexible Children**: Accepts any tile component as children

### Usage

\`\`\`tsx
import { TileContainer } from "@docspace/ui-kit/components/tiles/tile-container";
import { FileTile } from "@docspace/ui-kit/components/tiles/file-tile";

<TileContainer useReactWindow={false} headingFiles="Files">
  <FileTile item={file} element={<WordIcon />} contextOptions={options}>
    <TileContent><Link>{file.title}</Link></TileContent>
  </FileTile>
</TileContainer>
\`\`\``,
      },
    },
  },
  argTypes: {
    useReactWindow: {
      control: "boolean",
      description: "Whether to use virtualized scrolling via react-window",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    headingFiles: {
      control: "text",
      description: "Heading text displayed above the files section",
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
        story: "Default tile container displaying files in a grid layout",
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

export const CssCustomization: Story = {
  render: () => (
    <div
      style={
        {
          "--tile-bg": "#e6f3fb",
          "--tile-border-style": "1px solid #0082c9",
          "--tile-radius": "16px",
          "--tile-hover-bg": "#cce5f6",
          "--tile-icon-color": "#0082c9",
          "--tile-container-gap": "20px",
          "--tile-container-sort-label": "#0082c9",
          "--tile-container-sort-icon": "#0082c9",
          "--tile-container-sort-font-size": "13px",
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
| \`--tile-bg\` | Tile background color | theme-based |
| \`--tile-border-style\` | Tile border | theme-based |
| \`--tile-radius\` | Tile border radius | \`12px\` |
| \`--tile-hover-bg\` | Hover/checked background | theme-based |
| \`--tile-icon-color\` | Icon button color | theme-based |
| \`--tile-container-gap\` | Grid gap between tiles | \`16px\` |
| \`--tile-container-sort-label\` | Sort label text color | theme-based |
| \`--tile-container-sort-icon\` | Sort icon fill color | theme-based |
| \`--tile-container-sort-option-fill\` | Option item icon fill color | theme-based |
| \`--tile-container-selected-bg\` | Selected option background | theme-based |
| \`--tile-container-sort-font-size\` | Sort label font size | \`12px\` |
| \`--tile-container-sort-font-weight\` | Sort label font weight | \`600\` |`,
      },
    },
  },
};
