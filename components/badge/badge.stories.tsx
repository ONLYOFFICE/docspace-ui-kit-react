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

import { globalColors } from "../../providers/theme";

import { Badge } from ".";

const meta = {
	title: "components/Data Display/Badge",
	component: Badge,
	parameters: {
		docs: {
			description: {
				component:
					"A versatile badge component used for displaying notifications, status markers, or interactive elements. Supports accessibility features and various display modes.",
			},
		},
		design: {
			type: "figma",
			url: "https://www.figma.com/file/ZiW5KSwb4t7Tj6Nz5TducC/UI-Kit-DocSpace-1.0.0?type=design&node-id=6057-171831&mode=design&t=TBNCKMQKQMxr44IZ-0",
		},
	},
	argTypes: {
		label: {
			control: "text",
			description: "Content to display in the badge. Can be a number or text.",
		},
		type: {
			control: "radio",
			options: [undefined, "high"],
			description: "Badge type. Use 'high' for high priority styling.",
		},
		backgroundColor: {
			control: "color",
			description: "Custom background color.",
		},
		color: {
			control: "color",
			description: "Custom text color.",
		},
		fontSize: {
			control: "text",
			description: "Custom font size.",
		},
		fontWeight: {
			control: "number",
			description: "Custom font weight.",
		},
		borderRadius: {
			control: "text",
			description: "Custom border radius.",
		},
		padding: {
			control: "text",
			description: "Custom padding.",
		},
		maxWidth: {
			control: "text",
			description: "Maximum width of the badge.",
		},
		height: {
			control: "text",
			description: "Custom height.",
		},
		border: {
			control: "text",
			description: "Custom border style.",
		},
		noHover: {
			control: "boolean",
			description: "Disables hover effects.",
		},
		isHovered: {
			control: "boolean",
			description: "Applies custom hover styles.",
		},
		isVersionBadge: {
			control: "boolean",
			description: "Applies version badge specific styling.",
		},
		isPaidBadge: {
			control: "boolean",
			description: "Applies styling for paid/premium features.",
		},
		isMutedBadge: {
			control: "boolean",
			description: "Applies muted styling for less prominent display.",
		},
		onClick: {
			action: "clicked",
			description: "Click event handler.",
		},
		onMouseOver: {
			action: "mouseOver",
			description: "Mouse over event handler.",
		},
		onMouseLeave: {
			action: "mouseLeave",
			description: "Mouse leave event handler.",
		},
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Badge>;

type Story = StoryObj<typeof Badge>;

export default meta;

export const Default: Story = {
	args: {
		label: 24,
	},
};

export const NumberBadge: Story = {
	args: {
		label: 3,
	},
	parameters: {
		docs: {
			description: {
				story:
					"Simple numeric badge, commonly used for notifications or counts.",
			},
		},
	},
};

export const TextBadge: Story = {
	args: {
		label: "New",
	},
	parameters: {
		docs: {
			description: {
				story: "Text badge for status or informational display.",
			},
		},
	},
};

export const InteractiveBadge: Story = {
	args: {
		label: "Click me",
		onClick: () => alert("click"),
	},
	parameters: {
		docs: {
			description: {
				story: "Interactive badge that responds to clicks.",
			},
		},
	},
};

export const HighPriority: Story = {
	args: {
		type: "high",
		label: "High",
		backgroundColor: globalColors.mainRed,
	},
	parameters: {
		docs: {
			description: {
				story: "High priority badge with emphasis styling.",
			},
		},
	},
};

export const CustomStyled: Story = {
	args: {
		label: "Custom",
		backgroundColor: "#335EA3",
		color: "#FFFFFF",
		fontSize: "14px",
		fontWeight: 600,
		borderRadius: "8px",
		padding: "4px 12px",
	},
	parameters: {
		docs: {
			description: {
				story: "Badge with custom styling applied through style props.",
			},
		},
	},
};

export const Muted: Story = {
	args: {
		label: "Muted",
		isMutedBadge: true,
	},
	parameters: {
		docs: {
			description: {
				story: "Badge with muted styling for less prominent notifications.",
			},
		},
	},
};

export const NoHover: Story = {
	args: {
		label: "Static",
		noHover: true,
	},
	parameters: {
		docs: {
			description: {
				story: "Badge without hover effects, useful for static display.",
			},
		},
	},
};

export const Hovered: Story = {
	args: {
		label: "Hovered",
		isHovered: true,
	},
	parameters: {
		docs: {
			description: {
				story: "Badge with forced hover state styling.",
			},
		},
	},
};

export const VersionBadge: Story = {
	args: {
		label: "v1.2.3",
		isVersionBadge: true,
	},
	parameters: {
		docs: {
			description: {
				story: "Badge styled for displaying version numbers.",
			},
		},
	},
};

export const PaidFeature: Story = {
	args: {
		label: "PRO",
		isPaidBadge: true,
		backgroundColor: "#EDC409",
	},
	parameters: {
		docs: {
			description: {
				story: "Badge styled for indicating paid/premium features.",
			},
		},
	},
};

export const WithBorder: Story = {
	args: {
		label: "Bordered",
		border: "2px solid #333",
		backgroundColor: "transparent",
		color: "#333",
	},
	parameters: {
		docs: {
			description: {
				story: "Badge with custom border styling.",
			},
		},
	},
};

export const LargeCount: Story = {
	args: {
		label: "99+",
		maxWidth: "40px",
	},
	parameters: {
		docs: {
			description: {
				story:
					"Badge displaying a large notification count with constrained width.",
			},
		},
	},
};
