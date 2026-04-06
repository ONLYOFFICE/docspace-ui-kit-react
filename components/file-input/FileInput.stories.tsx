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

import type React from "react";
import type { ComponentProps, CSSProperties } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { InputSize } from "../text-input";

import { FileInput } from ".";

const meta = {
	title: "UI/Form controls/FileInput",
	component: FileInput,
	parameters: {
		docs: {
			description: {
				component: `File input component for handling file uploads with a button trigger, various states, and multiple size options.

### Features

- **File Selection**: Native file picker with customizable accept filters
- **Multiple Files**: Support for single or multiple file selection
- **Three Sizes**: base, middle, and large
- **Loading State**: Show spinner during upload operations
- **Validation States**: Error and warning visual indicators
- **Custom Button Label**: Configurable upload button text
- **Icon Variants**: Document or folder icon styles

### Accessibility

- \`aria-label\`: Describes the file input button action
- \`aria-description\`: Provides additional context for the input

### Usage

\`\`\`tsx
import { FileInput } from "@docspace/ui-kit/components/file-input";

<FileInput
  placeholder="Choose file"
  size={InputSize.base}
  onInput={(file) => console.log(file)}
  accept={[".pdf", ".docx"]}
/>

// Multiple files
<FileInput
  placeholder="Choose files"
  isMultiple
  onInput={(files) => console.log(files)}
/>
\`\`\``,
			},
		},
	},
	argTypes: {
		size: {
			control: "select",
			options: Object.values(InputSize),
			description: "Size of the input field",
			table: {
				defaultValue: { summary: "base" },
			},
		},
		placeholder: {
			control: "text",
			description: "Placeholder text",
		},
		buttonLabel: {
			control: "text",
			description: "Label for the upload button",
		},
		isDisabled: {
			control: "boolean",
			description: "Disable the input field",
			table: {
				defaultValue: { summary: "false" },
			},
		},
		isLoading: {
			control: "boolean",
			description: "Show loading spinner",
			table: {
				defaultValue: { summary: "false" },
			},
		},
		hasError: {
			control: "boolean",
			description: "Show error state",
			table: {
				defaultValue: { summary: "false" },
			},
		},
		hasWarning: {
			control: "boolean",
			description: "Show warning state",
			table: {
				defaultValue: { summary: "false" },
			},
		},
		scale: {
			control: "boolean",
			description: "Scale input to 100% width",
			table: {
				defaultValue: { summary: "false" },
			},
		},
		isMultiple: {
			control: "boolean",
			description: "Allow multiple file selection",
			table: {
				defaultValue: { summary: "false" },
			},
		},
		isDocumentIcon: {
			control: "boolean",
			description: "Use document icon instead of folder icon",
			table: {
				defaultValue: { summary: "false" },
			},
		},
	},
} satisfies Meta<typeof FileInput>;

type Story = StoryObj<ComponentProps<typeof FileInput>>;

export default meta;

const Wrapper = (props: { children: React.ReactNode }) => {
	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
				gridGap: "16px",
				alignItems: "center",
			}}
		>
			{props.children}
		</div>
	);
};

const CssCustomizationTemplate = () => {
	return (
		<div style={{ display: "grid", gridGap: "16px", width: "320px" }}>
			<div
				style={
					{
						// === FileInput — border and radius ===
						"--file-input-border": "#0082c9",
						"--file-input-hover-border": "#006ba6",
						"--file-input-focus-border": "#004f82",
						"--file-input-radius": "8px",
						// === FileInput — validation states ===
						"--file-input-warning-border": "#e67e00",
						"--file-input-error-border": "#c0392b",
						"--file-input-disabled-border": "#b0cce3",
						"--file-input-placeholder-color": "#7aa8c7",
						// === TextInput (inner text field) ===
						"--text-input-bg": "#f0f8ff",
						"--text-input-color": "#004f82",
						"--text-input-radius": "8px 0 0 8px",
						// === IconButton (trigger icon) ===
						"--icon-button-color": "#0082c9",
						"--icon-button-hover-color": "#006ba6",
					} as CSSProperties
				}
			>
				<FileInput
					placeholder="Choose file"
					size="base"
					scale
					aria-label="Custom styled file input"
				/>
				<FileInput
					placeholder="Warning state"
					size="base"
					scale
					hasWarning
					aria-label="Warning file input"
				/>
				<FileInput
					placeholder="Error state"
					size="base"
					scale
					hasError
					aria-label="Error file input"
				/>
				<FileInput
					placeholder="Disabled"
					size="base"
					scale
					isDisabled
					aria-label="Disabled file input"
				/>
			</div>
		</div>
	);
};

export const CssCustomization: Story = {
	render: () => <CssCustomizationTemplate />,
	parameters: {
		docs: {
			description: {
				story: `CSS Custom Properties for external customization:

**FileInput — border**

| Variable | Description | Default |
|----------|-------------|---------|
| \`--file-input-border\` | Default border color | theme-based |
| \`--file-input-hover-border\` | Hover border color | theme-based |
| \`--file-input-focus-border\` | Focus/active border color | theme-based |
| \`--file-input-disabled-border\` | Disabled border color | theme-based |
| \`--file-input-warning-border\` | Warning state border color | theme-based |
| \`--file-input-error-border\` | Error state border color | theme-based |
| \`--file-input-placeholder-color\` | Disabled placeholder text color | theme-based |
| \`--file-input-radius\` | Icon button border radius | \`3px\` |

**TextInput (inner text field)**

| Variable | Description | Default |
|----------|-------------|---------|
| \`--text-input-bg\` | Input background color | theme-based |
| \`--text-input-color\` | Input text color | theme-based |
| \`--text-input-radius\` | Input border radius | theme-based |

**IconButton (file picker trigger)**

| Variable | Description | Default |
|----------|-------------|---------|
| \`--icon-button-color\` | Icon fill/stroke color | theme-based |
| \`--icon-button-hover-color\` | Icon hover color | theme-based |`,
			},
		},
	},
};

export const Default: Story = {
	render: (args) => <FileInput {...args} />,
	args: {
		placeholder: "Choose file",
		size: InputSize.base,
		scale: false,
		isDisabled: false,
		isLoading: false,
		hasError: false,
		hasWarning: false,
		"aria-label": "Choose file",
	},
};

const SizesTemplate = () => {
	return (
		<Wrapper>
			<FileInput
				size={InputSize.base}
				placeholder="Base size"
				aria-label="Base size file input"
			/>
			<FileInput
				size={InputSize.middle}
				placeholder="Middle size"
				aria-label="Middle size file input"
			/>
			<FileInput
				size={InputSize.large}
				placeholder="Large size"
				aria-label="Large size file input"
			/>
		</Wrapper>
	);
};

export const Sizes: Story = {
	render: () => <SizesTemplate />,
	parameters: {
		docs: {
			description: {
				story:
					"FileInput supports three sizes: base, middle, and large for different UI contexts.",
			},
			source: {
				code: `<FileInput size={InputSize.base} placeholder="Base size" />
<FileInput size={InputSize.middle} placeholder="Middle size" />
<FileInput size={InputSize.large} placeholder="Large size" />`,
			},
		},
	},
};

const StatesTemplate = () => {
	return (
		<Wrapper>
			<FileInput
				size={InputSize.base}
				placeholder="Normal"
				aria-label="Normal file input"
			/>
			<FileInput
				size={InputSize.base}
				placeholder="Error state"
				hasError
				aria-label="Error file input"
			/>
			<FileInput
				size={InputSize.base}
				placeholder="Warning state"
				hasWarning
				aria-label="Warning file input"
			/>
			<FileInput
				size={InputSize.base}
				placeholder="Disabled"
				isDisabled
				aria-label="Disabled file input"
			/>
			<FileInput
				size={InputSize.base}
				placeholder="Loading"
				isLoading
				aria-label="Loading file input"
			/>
		</Wrapper>
	);
};

export const States: Story = {
	render: () => <StatesTemplate />,
	parameters: {
		docs: {
			description: {
				story:
					"FileInput supports normal, error, warning, disabled, and loading states.",
			},
			source: {
				code: `<FileInput placeholder="Normal" />
<FileInput placeholder="Error state" hasError />
<FileInput placeholder="Warning state" hasWarning />
<FileInput placeholder="Disabled" isDisabled />
<FileInput placeholder="Loading" isLoading />`,
			},
		},
	},
};

const WithAcceptFilterTemplate = () => {
	return (
		<Wrapper>
			<FileInput
				size={InputSize.base}
				placeholder="Images only"
				accept={[".png", ".jpg", ".jpeg", ".gif"]}
				aria-label="Image file input"
			/>
			<FileInput
				size={InputSize.base}
				placeholder="Documents only"
				accept={[".pdf", ".docx", ".xlsx"]}
				aria-label="Document file input"
			/>
		</Wrapper>
	);
};

export const WithAcceptFilter: Story = {
	render: () => <WithAcceptFilterTemplate />,
	parameters: {
		docs: {
			description: {
				story:
					"The accept prop filters which file types are visible in the file picker dialog.",
			},
			source: {
				code: `<FileInput placeholder="Images only" accept={[".png", ".jpg", ".jpeg", ".gif"]} />
<FileInput placeholder="Documents only" accept={[".pdf", ".docx", ".xlsx"]} />`,
			},
		},
	},
};

const ScaledTemplate = () => {
	return (
		<div style={{ display: "grid", gridGap: "16px" }}>
			<FileInput
				size={InputSize.base}
				placeholder="Scaled file input"
				scale
				aria-label="Scaled file input"
			/>
		</div>
	);
};

export const ScaledInput: Story = {
	render: () => <ScaledTemplate />,
	parameters: {
		docs: {
			description: {
				story:
					"Scale prop makes the file input expand to 100% of its container width.",
			},
			source: {
				code: `<FileInput placeholder="Scaled file input" scale />`,
			},
		},
	},
};
