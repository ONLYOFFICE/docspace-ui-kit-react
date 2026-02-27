// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

import type { ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import type { TileContainerProps } from "./TileContainer.types";

import WordSvgUrl from "../../../assets/icons/32/word.svg";
import PdfSvgUrl from "../../../assets/icons/32/pdf.svg";
import SlideSvgUrl from "../../../assets/icons/32/slide.svg";
import ImageReactSvg from "../../../assets/empty.rooms.root.light.svg";

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
