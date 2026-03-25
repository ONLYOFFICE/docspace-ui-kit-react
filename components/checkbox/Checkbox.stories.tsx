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

import { Checkbox } from ".";

const meta = {
	title: "UI/Form controls/Checkbox",
	component: Checkbox,
	parameters: {
		docs: {
			description: {
				component: `Checkbox is a form control that allows users to select one or more options.

### Features

- **Three States**: Checked, unchecked, and indeterminate (partial selection)
- **Error State**: Visual indication of validation errors
- **Disabled State**: Prevents user interaction
- **Label Support**: Text label with optional truncation
- **Tooltip**: Title text shown on hover
- **Help Button**: Optional help button element alongside the checkbox

### Accessibility

The Checkbox component includes the following for improved accessibility:

- Hidden native \`<input type="checkbox">\` for screen reader support
- \`tabIndex\` for keyboard navigation ordering
- Visual states clearly distinguish checked, unchecked, indeterminate, disabled, and error

### Usage

\`\`\`tsx
import { Checkbox } from "@docspace/ui-kit/components/checkbox";

// Basic checkbox
<Checkbox label="Accept terms" onChange={handleChange} />

// Checked checkbox
<Checkbox isChecked label="Notifications enabled" />

// Indeterminate (partial selection)
<Checkbox isIndeterminate label="Select all" />

// With error state
<Checkbox hasError label="Required field" />
\`\`\``,
			},
		},
	},
	argTypes: {
		isChecked: {
			control: "boolean",
			description: "Controls the checked state of the checkbox",
			table: {
				defaultValue: { summary: "false" },
			},
		},
		isIndeterminate: {
			control: "boolean",
			description:
				"Shows a rectangle instead of a checkmark (partial selection)",
			table: {
				defaultValue: { summary: "false" },
			},
		},
		isDisabled: {
			control: "boolean",
			description: "Disables the checkbox input",
			table: {
				defaultValue: { summary: "false" },
			},
		},
		hasError: {
			control: "boolean",
			description: "Displays the checkbox in an error state",
			table: {
				defaultValue: { summary: "false" },
			},
		},
		label: {
			control: "text",
			description: "Text label displayed next to the checkbox",
		},
		title: {
			control: "text",
			description: "Tooltip text shown on hover",
		},
		truncate: {
			control: "boolean",
			description: "Whether to truncate the label text if it overflows",
			table: {
				defaultValue: { summary: "false" },
			},
		},
		tabIndex: {
			control: "number",
			description: "Tab order of the checkbox",
			table: {
				defaultValue: { summary: "-1" },
			},
		},
	},
} satisfies Meta<typeof Checkbox>;

type Story = StoryObj<ComponentProps<typeof Checkbox>>;

export default meta;

const Wrapper = (props: { children: React.ReactNode }) => {
	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
				gridGap: "16px",
				alignItems: "center",
			}}
		>
			{props.children}
		</div>
	);
};

export const Default: Story = {
	render: (args) => <Checkbox {...args} />,
	args: {
		label: "Checkbox",
	},
};

const CheckedTemplate = () => {
	return (
		<Wrapper>
			<Checkbox isChecked label="Checked" />
			<Checkbox label="Unchecked" />
		</Wrapper>
	);
};

export const CheckedStates: Story = {
	render: () => <CheckedTemplate />,
	parameters: {
		docs: {
			description: {
				story: "Comparison of checked and unchecked checkbox states.",
			},
			source: {
				code: `<Checkbox isChecked label="Checked" />
<Checkbox label="Unchecked" />`,
			},
		},
	},
};

const IndeterminateTemplate = () => {
	return (
		<Wrapper>
			<Checkbox isIndeterminate label="Indeterminate" />
			<Checkbox isIndeterminate isDisabled label="Disabled Indeterminate" />
		</Wrapper>
	);
};

export const IndeterminateStates: Story = {
	render: () => <IndeterminateTemplate />,
	parameters: {
		docs: {
			description: {
				story:
					"Indeterminate state shows a rectangle instead of a checkmark. Used for partial selection (e.g., when some but not all child items are selected).",
			},
			source: {
				code: `<Checkbox isIndeterminate label="Indeterminate" />
<Checkbox isIndeterminate isDisabled label="Disabled Indeterminate" />`,
			},
		},
	},
};

const DisabledTemplate = () => {
	return (
		<Wrapper>
			<Checkbox isDisabled label="Disabled Unchecked" />
			<Checkbox isDisabled isChecked label="Disabled Checked" />
			<Checkbox isDisabled isIndeterminate label="Disabled Indeterminate" />
		</Wrapper>
	);
};

export const DisabledStates: Story = {
	render: () => <DisabledTemplate />,
	parameters: {
		docs: {
			description: {
				story:
					"Disabled checkboxes cannot be interacted with and have reduced opacity.",
			},
			source: {
				code: `<Checkbox isDisabled label="Disabled Unchecked" />
<Checkbox isDisabled isChecked label="Disabled Checked" />
<Checkbox isDisabled isIndeterminate label="Disabled Indeterminate" />`,
			},
		},
	},
};

const ErrorTemplate = () => {
	return (
		<Wrapper>
			<Checkbox hasError label="Unchecked with Error" />
			<Checkbox hasError isChecked label="Checked with Error" />
		</Wrapper>
	);
};

export const ErrorStates: Story = {
	render: () => <ErrorTemplate />,
	parameters: {
		docs: {
			description: {
				story:
					"Error state provides visual indication of validation errors on the checkbox.",
			},
			source: {
				code: `<Checkbox hasError label="Unchecked with Error" />
<Checkbox hasError isChecked label="Checked with Error" />`,
			},
		},
	},
};

const TruncatedTemplate = () => {
	return (
		<div style={{ width: "200px" }}>
			<Checkbox
				truncate
				label="This is a very long label that might need to be truncated if the container is too small"
			/>
		</div>
	);
};

export const WithTruncation: Story = {
	render: () => <TruncatedTemplate />,
	parameters: {
		docs: {
			description: {
				story:
					"Long labels can be truncated when the container width is limited.",
			},
			source: {
				code: `<Checkbox truncate label="This is a very long label that might need to be truncated" />`,
			},
		},
	},
};

export const WithTitle: Story = {
	render: (args) => <Checkbox {...args} />,
	args: {
		label: "Hover me",
		title: "This is a tooltip that appears on hover",
	},
	parameters: {
		docs: {
			description: {
				story: "Checkbox with a title attribute that shows a tooltip on hover.",
			},
			source: {
				code: `<Checkbox label="Hover me" title="This is a tooltip that appears on hover" />`,
			},
		},
	},
};
