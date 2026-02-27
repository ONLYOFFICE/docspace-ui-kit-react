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
import type { ComponentProps } from "react";
import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { EmailSettings } from "../../utils/email";
import { InputSize } from "../text-input";

import { EmailInput } from ".";
import type { TValidate } from "./EmailInput.types";

const meta = {
	title: "UI/Form controls/EmailInput",
	component: EmailInput,
	parameters: {
		docs: {
			description: {
				component: `Email input field with built-in validation against configurable email format rules.

### Features

- **Email Validation**: Validates against configurable rules (punycode, IP domains, strict local part, etc.)
- **Custom Validation**: Support for custom validation functions
- **Validation Feedback**: Callback with validation result including error details
- **Three Sizes**: base, middle, and large
- **States**: Disabled, read-only, error, and scaled variants

### Usage

\`\`\`tsx
import { EmailInput } from "@docspace/ui-kit/components/email-input";
import { EmailSettings } from "@docspace/ui-kit/utils/email";

const settings = EmailSettings.parse({ allowStrictLocalPart: true });

<EmailInput
  value={value}
  emailSettings={settings}
  onChange={(e) => setValue(e.target.value)}
  onValidateInput={(result) => console.log(result)}
  placeholder="Enter email address"
/>
\`\`\``,
			},
		},
	},
	argTypes: {
		size: {
			control: "select",
			options: Object.values(InputSize),
			description: "Size variant of the input",
			table: {
				defaultValue: { summary: "base" },
			},
		},
		isDisabled: {
			control: "boolean",
			description: "Disable the input field",
			table: {
				defaultValue: { summary: "false" },
			},
		},
		isReadOnly: {
			control: "boolean",
			description: "Make the input read-only",
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
		scale: {
			control: "boolean",
			description: "Scale input to 100% width",
			table: {
				defaultValue: { summary: "false" },
			},
		},
		placeholder: {
			control: "text",
			description: "Placeholder text",
		},
	},
} satisfies Meta<typeof EmailInput>;

type Story = StoryObj<ComponentProps<typeof EmailInput>>;

export default meta;

const Wrapper = (props: { children: React.ReactNode }) => {
	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
				gridGap: "16px",
				alignItems: "start",
			}}
		>
			{props.children}
		</div>
	);
};

const defaultSettings = EmailSettings.parse({
	allowDomainPunycode: false,
	allowLocalPartPunycode: false,
	allowDomainIp: false,
	allowStrictLocalPart: true,
	allowSpaces: false,
	allowName: false,
	allowLocalDomainName: false,
});

const EmailInputWithValidation = (props: {
	initialValue?: string;
	size?: InputSize;
	isDisabled?: boolean;
	isReadOnly?: boolean;
	hasError?: boolean;
	scale?: boolean;
	placeholder?: string;
	customValidate?: (value: string) => TValidate;
}) => {
	const {
		initialValue = "",
		size = InputSize.base,
		placeholder = "Enter email address",
		...rest
	} = props;
	const [value, setValue] = useState(initialValue);
	const [validationState, setValidationState] = useState<TValidate>();

	return (
		<div>
			<EmailInput
				placeholder={placeholder}
				value={value}
				emailSettings={defaultSettings}
				onChange={(e) => setValue(e.target.value)}
				onValidateInput={(data) => setValidationState(data)}
				size={size}
				{...rest}
			/>
			{validationState ? (
				<div style={{ marginTop: "8px", fontSize: "12px" }}>
					<div>Valid: {validationState.isValid ? "Yes" : "No"}</div>
					{(validationState.errors ?? []).length > 0 ? (
						<div>Errors: {validationState.errors?.join(", ")}</div>
					) : null}
				</div>
			) : null}
		</div>
	);
};

export const Default: Story = {
	render: (args) => {
		const [value, setValue] = useState(args.value || "");

		return (
			<div style={{ width: "320px" }}>
				<EmailInput
					{...args}
					value={value}
					emailSettings={defaultSettings}
					onChange={(e) => setValue(e.target.value)}
				/>
			</div>
		);
	},
	args: {
		placeholder: "Enter email address",
		size: InputSize.base,
		isDisabled: false,
		isReadOnly: false,
		hasError: false,
		scale: false,
		value: "",
	},
};

const SizesTemplate = () => {
	return (
		<Wrapper>
			<EmailInputWithValidation size={InputSize.base} placeholder="Base size" />
			<EmailInputWithValidation
				size={InputSize.middle}
				placeholder="Middle size"
			/>
			<EmailInputWithValidation
				size={InputSize.large}
				placeholder="Large size"
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
					"EmailInput supports three sizes: base, middle, and large. Type an email to see validation feedback.",
			},
			source: {
				code: `<EmailInput size={InputSize.base} placeholder="Base size" />
<EmailInput size={InputSize.middle} placeholder="Middle size" />
<EmailInput size={InputSize.large} placeholder="Large size" />`,
			},
		},
	},
};

const StatesTemplate = () => {
	return (
		<Wrapper>
			<EmailInputWithValidation
				initialValue="user@example.com"
				placeholder="Normal"
			/>
			<EmailInputWithValidation
				initialValue="disabled@example.com"
				isDisabled
			/>
			<EmailInputWithValidation
				initialValue="readonly@example.com"
				isReadOnly
			/>
			<EmailInputWithValidation initialValue="invalid-email" hasError />
		</Wrapper>
	);
};

export const States: Story = {
	render: () => <StatesTemplate />,
	parameters: {
		docs: {
			description: {
				story:
					"EmailInput supports normal, disabled, read-only, and error states.",
			},
			source: {
				code: `<EmailInput value="user@example.com" />
<EmailInput value="disabled@example.com" isDisabled />
<EmailInput value="readonly@example.com" isReadOnly />
<EmailInput value="invalid-email" hasError />`,
			},
		},
	},
};

const CustomValidationTemplate = () => {
	return (
		<div style={{ width: "320px" }}>
			<EmailInputWithValidation
				scale
				placeholder="Enter @custom-domain.com email"
				customValidate={(value) => ({
					value,
					isValid: value.endsWith("@custom-domain.com"),
					errors: value ? ["Must be @custom-domain.com email"] : [],
				})}
			/>
		</div>
	);
};

export const WithCustomValidation: Story = {
	render: () => <CustomValidationTemplate />,
	parameters: {
		docs: {
			description: {
				story:
					"Custom validation function to enforce domain-specific email rules. Try typing an email that doesn't end with @custom-domain.com.",
			},
			source: {
				code: `<EmailInput
  scale
  placeholder="Enter @custom-domain.com email"
  customValidate={(value) => ({
    value,
    isValid: value.endsWith("@custom-domain.com"),
    errors: value ? ["Must be @custom-domain.com email"] : [],
  })}
/>`,
			},
		},
	},
};
