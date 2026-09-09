import type { ComponentProps, CSSProperties } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import type { BaseTileProps } from "./BaseTile.types";

import { useState } from "react";

import WordSvgUrl from "../../../assets/icons/32/word.svg";
import PdfSvgUrl from "../../../assets/icons/32/pdf.svg";
import SlideSvgUrl from "../../../assets/icons/32/slide.svg";
import { Link } from "../../link";

import { BaseTile } from ".";
import { TileContent } from "../tile-content";

const wordElement = <WordSvgUrl />;

const contextOptions = [
	{
		id: "option_edit",
		key: "edit",
		label: "Edit",
		onClick: () => {},
		disabled: false,
	},
	{
		id: "option_delete",
		key: "delete",
		label: "Delete",
		onClick: () => {},
		disabled: false,
	},
];

const meta = {
	title: "UI/Tiles/BaseTile",
	component: BaseTile,
	parameters: {
		docs: {
			description: {
				component: `Base tile component that serves as a foundation for file, folder, and room tiles.

### Features

- **Selectable**: Supports checked/selected state with checkbox
- **Active State**: Visual highlight for the currently active tile
- **Progress State**: Built-in loading/progress indicator
- **Hotkey Border**: Visual indicator for keyboard navigation
- **Edit Mode**: Inline editing support
- **Context Menu**: Right-click context menu integration
- **Top & Bottom Content**: Flexible content slots for customization

### Usage

\`\`\`tsx
import { BaseTile } from "@onlyoffice/apps-ui-kit/components/tiles/base-tile";
import { TileContent } from "@onlyoffice/apps-ui-kit/components/tiles/tile-content";

<BaseTile
  item={{ id: "1", title: "Document.docx" }}
  element={<WordIcon />}
  contextOptions={options}
  topContent={<TileContent><Link>Document.docx</Link></TileContent>}
  onSelect={handleSelect}
/>
\`\`\``,
			},
		},
	},
	argTypes: {
		checked: {
			control: "boolean",
			description: "Whether the tile is selected/checked",
			table: {
				defaultValue: { summary: "false" },
			},
		},
		isActive: {
			control: "boolean",
			description: "Whether the tile is in active state",
			table: {
				defaultValue: { summary: "false" },
			},
		},
		inProgress: {
			control: "boolean",
			description: "Whether the tile shows a loading/progress indicator",
			table: {
				defaultValue: { summary: "false" },
			},
		},
		showHotkeyBorder: {
			control: "boolean",
			description: "Whether to display the hotkey navigation border",
			table: {
				defaultValue: { summary: "false" },
			},
		},
		isEdit: {
			control: "boolean",
			description: "Whether the tile is in inline edit mode",
			table: {
				defaultValue: { summary: "false" },
			},
		},
	},
} satisfies Meta<typeof BaseTile>;

type Story = StoryObj<ComponentProps<typeof BaseTile>>;

export default meta;

const Template = ({ checked: initialChecked, ...args }: BaseTileProps) => {
	const [checked, setChecked] = useState(initialChecked);

	const onSelect = (isSelected: boolean) => {
		setChecked(isSelected);
	};

	return (
		<div style={{ maxWidth: "300px", margin: "30px" }}>
			<BaseTile {...args} checked={checked} onSelect={onSelect} />
		</div>
	);
};

export const Default: Story = {
	render: Template,
	args: {
		item: {
			id: "tile-1",
			title: "Document.docx",
			fileExst: ".docx",
		},
		element: wordElement,
		contextOptions,
		topContent: (
			<TileContent>
				<Link>Document.docx</Link>
			</TileContent>
		),
		onSelect: () => {},
		getContextModel: () => contextOptions,
	},
	parameters: {
		docs: {
			description: {
				story: "Basic base tile with default configuration",
			},
			source: {
				code: `<BaseTile
  item={{ id: "tile-1", title: "Document.docx", fileExst: ".docx" }}
  element={<WordSvgUrl />}
  contextOptions={contextOptions}
  topContent={<TileContent><Link>Document.docx</Link></TileContent>}
  onSelect={handleSelect}
  getContextModel={() => contextOptions}
/>`,
			},
		},
	},
};

export const Checked: Story = {
	render: Template,
	args: {
		...Default.args,
		checked: true,
	},
	parameters: {
		docs: {
			description: {
				story: "Base tile in checked/selected state",
			},
			source: {
				code: `<BaseTile
  item={{ id: "tile-1", title: "Document.docx", fileExst: ".docx" }}
  element={<WordSvgUrl />}
  contextOptions={contextOptions}
  topContent={<TileContent><Link>Document.docx</Link></TileContent>}
  checked={true}
  onSelect={handleSelect}
/>`,
			},
		},
	},
};

export const Active: Story = {
	render: Template,
	args: {
		...Default.args,
		isActive: true,
	},
	parameters: {
		docs: {
			description: {
				story: "Base tile in active state",
			},
			source: {
				code: `<BaseTile
  item={{ id: "tile-1", title: "Document.docx", fileExst: ".docx" }}
  element={<WordSvgUrl />}
  contextOptions={contextOptions}
  topContent={<TileContent><Link>Document.docx</Link></TileContent>}
  isActive={true}
/>`,
			},
		},
	},
};

export const InProgress: Story = {
	render: Template,
	args: {
		...Default.args,
		inProgress: true,
	},
	parameters: {
		docs: {
			description: {
				story: "Base tile showing progress/loading state",
			},
			source: {
				code: `<BaseTile
  item={{ id: "tile-1", title: "Document.docx", fileExst: ".docx" }}
  element={<WordSvgUrl />}
  contextOptions={contextOptions}
  topContent={<TileContent><Link>Document.docx</Link></TileContent>}
  inProgress={true}
/>`,
			},
		},
	},
};

export const WithHotkeyBorder: Story = {
	render: Template,
	args: {
		...Default.args,
		showHotkeyBorder: true,
	},
	parameters: {
		docs: {
			description: {
				story: "Base tile with hotkey border visible",
			},
			source: {
				code: `<BaseTile
  item={{ id: "tile-1", title: "Document.docx", fileExst: ".docx" }}
  element={<WordSvgUrl />}
  contextOptions={contextOptions}
  topContent={<TileContent><Link>Document.docx</Link></TileContent>}
  showHotkeyBorder={true}
/>`,
			},
		},
	},
};

export const WithBottomContent: Story = {
	render: Template,
	args: {
		...Default.args,
		topContent: (
			<TileContent>
				<Link>Document.docx</Link>
			</TileContent>
		),
		bottomContent: (
			<div style={{ padding: "8px", fontSize: "12px", color: "#666" }}>
				Additional information
			</div>
		),
	},
	parameters: {
		docs: {
			description: {
				story: "Base tile with both top and bottom content",
			},
			source: {
				code: `<BaseTile
  item={{ id: "tile-1", title: "Document.docx", fileExst: ".docx" }}
  element={<WordSvgUrl />}
  contextOptions={contextOptions}
  topContent={<TileContent><Link>Document.docx</Link></TileContent>}
  bottomContent={<div>Additional information</div>}
/>`,
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
					"--tile-hotkey-color": "#0082c9",
					"--tile-padding": "12px 0",
					"--tile-row-gap": "12px",
				} as CSSProperties
			}
		>
			<div style={{ maxWidth: "300px", margin: "30px" }}>
				<BaseTile
					item={{ id: "tile-1", title: "Document.docx", fileExst: ".docx" }}
					element={wordElement}
					contextOptions={contextOptions}
					topContent={
						<TileContent>
							<Link>Document.docx</Link>
						</TileContent>
					}
					onSelect={() => {}}
					getContextModel={() => contextOptions}
				/>
			</div>
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
| \`--tile-hotkey-color\` | Hotkey navigation border color | theme-based |
| \`--tile-padding\` | Tile vertical padding | \`16px 0\` |
| \`--tile-row-gap\` | Gap between top and bottom content | \`16px\` |`,
			},
		},
	},
};
