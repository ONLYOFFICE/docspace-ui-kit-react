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

import type { Meta, StoryObj } from "@storybook/react";

import { globalColors } from "../../themes/globalColors";

import { Text } from ".";

const meta: Meta<typeof Text> = {
	title: "Components/Text",
	component: Text,
	parameters: {
		docs: {
			description: {
				component:
					"Component that displays plain text with various styling options.",
			},
		},
	},
	argTypes: {
		as: {
			control: "select",
			options: ["p", "span", "div", "h1", "h2", "h3", "h4", "h5", "h6"],
			description: "HTML element to render",
		},
		textAlign: {
			control: "select",
			options: ["left", "center", "right", "justify"],
			description: "Text alignment",
		},
		dir: {
			control: "select",
			options: ["ltr", "rtl", "auto"],
			description: "Text direction",
		},
		color: { control: "color" },
		backgroundColor: { control: "color" },
		fontSize: { control: "text" },
		fontWeight: { control: "text" },
		lineHeight: { control: "text" },
		isBold: { control: "boolean" },
		isItalic: { control: "boolean" },
		isInline: { control: "boolean" },
		truncate: { control: "boolean" },
		noSelect: { control: "boolean" },
	},
	args: {
		as: "p",
		fontSize: "13px",
		fontWeight: "400",
	},
};

export default meta;

type Story = StoryObj<typeof Text>;

export const Default: Story = {
	args: {
		children: "Sample text content",
	},
};

export const Heading: Story = {
	args: {
		children: "Heading Text",
		as: "h1",
		fontSize: "24px",
		fontWeight: "700",
	},
};

export const Inline: Story = {
	render: (args) => (
		<>
			<Text {...args}>First inline text</Text>{" "}
			<Text {...args}>Second inline text</Text>
		</>
	),
	args: {
		isInline: true,
	},
};

export const Styled: Story = {
	args: {
		children: "Styled text with custom properties",
		fontSize: "16px",
		fontWeight: "600",
		color: globalColors.white,
		backgroundColor: globalColors.black,
		textAlign: "center",
		isBold: true,
		isItalic: true,
		lineHeight: "1.5",
	},
};

export const Interactive: Story = {
	args: {
		children: "Click me!",
		isInline: true,
		color: globalColors.lightBlueMain,
		onClick: () => alert("Text clicked!"),
		style: { cursor: "pointer" },
	},
};

export const NoSelect: Story = {
	args: {
		children: "This text cannot be selected",
		noSelect: true,
		color: globalColors.gray,
	},
};

export const Truncated: Story = {
	render: (args) => (
		<div style={{ width: 200 }}>
			<Text {...args} />
		</div>
	),
	args: {
		children:
			"This is a very long text that will be truncated when it exceeds the container width",
		truncate: true,
	},
};

export const Bold: Story = {
	args: {
		children: "Bold text example",
		isBold: true,
	},
};

export const Italic: Story = {
	args: {
		children: "Italic text example",
		isItalic: true,
	},
};

export const BoldItalic: Story = {
	args: {
		children: "Bold and italic text",
		isBold: true,
		isItalic: true,
	},
};

export const AllHeadings: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
			<Text as="h1" fontSize="32px" fontWeight="700">
				Heading 1
			</Text>
			<Text as="h2" fontSize="28px" fontWeight="700">
				Heading 2
			</Text>
			<Text as="h3" fontSize="24px" fontWeight="600">
				Heading 3
			</Text>
			<Text as="h4" fontSize="20px" fontWeight="600">
				Heading 4
			</Text>
			<Text as="h5" fontSize="16px" fontWeight="600">
				Heading 5
			</Text>
			<Text as="h6" fontSize="14px" fontWeight="600">
				Heading 6
			</Text>
		</div>
	),
};

export const TextAlignment: Story = {
	render: (args) => (
		<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
			<Text {...args} textAlign="left">
				Left aligned text
			</Text>
			<Text {...args} textAlign="center">
				Center aligned text
			</Text>
			<Text {...args} textAlign="right">
				Right aligned text
			</Text>
			<Text {...args} textAlign="justify">
				Justified text that spans multiple lines to demonstrate the justify
				alignment behavior in longer paragraphs of content.
			</Text>
		</div>
	),
};

export const RTLDirection: Story = {
	args: {
		children: "مرحبا بالعالم - Hello World",
		dir: "rtl",
		textAlign: "right",
	},
};

export const AutoDirection: Story = {
	render: (args) => (
		<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
			<Text {...args} dir="auto">
				English text with auto direction
			</Text>
			<Text {...args} dir="auto">
				نص عربي مع اتجاه تلقائي
			</Text>
		</div>
	),
};

export const FontSizes: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
			<Text fontSize="10px">10px - Extra small text</Text>
			<Text fontSize="12px">12px - Small text</Text>
			<Text fontSize="13px">13px - Default text</Text>
			<Text fontSize="14px">14px - Medium text</Text>
			<Text fontSize="16px">16px - Large text</Text>
			<Text fontSize="18px">18px - Extra large text</Text>
			<Text fontSize="24px">24px - Display text</Text>
		</div>
	),
};

export const FontWeights: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
			<Text fontWeight="300">Light (300)</Text>
			<Text fontWeight="400">Regular (400)</Text>
			<Text fontWeight="500">Medium (500)</Text>
			<Text fontWeight="600">Semibold (600)</Text>
			<Text fontWeight="700">Bold (700)</Text>
		</div>
	),
};

export const WithTitle: Story = {
	args: {
		children: "Hover over this text to see the tooltip",
		title: "This is a tooltip that appears on hover",
	},
};
