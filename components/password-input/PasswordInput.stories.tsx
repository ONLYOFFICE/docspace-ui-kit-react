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

import type React from "react";
import type { CSSProperties, ComponentProps } from "react";
import { useState, useEffect } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { InputSize } from "../text-input";

import { PasswordInput } from ".";
import type { PasswordInputProps } from "./PasswordInput.types";

const meta = {
	title: "UI/Form controls/PasswordInput",
	component: PasswordInput,
	parameters: {
		docs: {
			description: {
				component: `Password input with built-in validation, strength indicators, visibility toggle, and password generation.

### Features

- **Validation Tooltip**: Shows password requirements (length, uppercase, digits, special characters)
- **Strength Indicator**: Visual progress bar for password strength
- **Visibility Toggle**: Show/hide password content
- **Password Generator**: Built-in password generation button
- **Simple View**: Minimal mode without validation UI for login forms
- **Customizable Rules**: Configurable minimum length and character requirements

### Usage

\`\`\`tsx
import { PasswordInput } from "@docspace/ui-kit/components/password-input";

<PasswordInput
  inputValue={value}
  onChange={handleChange}
  passwordSettings={{
    minLength: 8,
    upperCase: true,
    digits: true,
    specSymbols: true,
  }}
  tooltipPasswordTitle="Password must contain:"
  tooltipPasswordLength="minimum length: "
  tooltipPasswordDigits="digits"
  tooltipPasswordCapital="capital letters"
  tooltipPasswordSpecial="special characters"
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
		simpleView: {
			control: "boolean",
			description: "Simple view without validation indicators",
			table: {
				defaultValue: { summary: "false" },
			},
		},
		isDisabled: {
			control: "boolean",
			description: "Disable the input field",
			table: {
				defaultValue: { summary: "false" },
			},
		},
		isDisableTooltip: {
			control: "boolean",
			description: "Disable the validation tooltip",
			table: {
				defaultValue: { summary: "false" },
			},
		},
		maxLength: {
			control: "number",
			description: "Maximum password length",
		},
		inputWidth: {
			control: "text",
			description: "Custom width of the input field",
		},
		scale: {
			control: "boolean",
			description: "Scale input to 100% width",
			table: {
				defaultValue: { summary: "false" },
			},
		},
	},
} satisfies Meta<typeof PasswordInput>;

type Story = StoryObj<ComponentProps<typeof PasswordInput>>;

export default meta;

const Wrapper = (props: { children: React.ReactNode }) => {
	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
				gridGap: "24px",
				alignItems: "start",
			}}
		>
			{props.children}
		</div>
	);
};

const basePasswordSettings = {
	minLength: 6,
	upperCase: true,
	digits: true,
	specSymbols: true,
	digitsRegexStr: "(?=.*\\d)",
	upperCaseRegexStr: "(?=.*[A-Z])",
	specSymbolsRegexStr: "(?=.*[\\x21-\\x2F\\x3A-\\x40\\x5B-\\x60\\x7B-\\x7E])",
};

const baseTooltipProps = {
	tooltipPasswordTitle: "Password must contain:",
	tooltipPasswordLength: "minimum length: ",
	tooltipPasswordDigits: "digits",
	tooltipPasswordCapital: "capital letters",
	tooltipPasswordSpecial: "special characters (!@#$%^&*)",
	generatorSpecial: "!@#$%^&*",
};

const PasswordInputTemplate = ({
	passwordSettings,
	onChange,
	onValidateInput,
	...args
}: PasswordInputProps) => {
	const [value, setValue] = useState("");
	const [settings, setSettings] = useState(passwordSettings);

	useEffect(() => {
		setSettings(passwordSettings);
		setValue("");
	}, [passwordSettings]);

	return (
		<div style={{ height: "110px", width: "320px" }}>
			<PasswordInput
				size={InputSize.base}
				{...args}
				inputValue={value}
				onChange={(e) => setValue(e.currentTarget?.value)}
				tooltipPasswordLength={`${args.tooltipPasswordLength} ${passwordSettings?.minLength}`}
				passwordSettings={settings}
				onValidateInput={onValidateInput}
				scale
			/>
		</div>
	);
};

export const Default: Story = {
	render: (args) => <PasswordInputTemplate {...args} />,
	args: {
		isDisabled: false,
		passwordSettings: basePasswordSettings,
		simpleView: false,
		inputName: "demoPasswordInput-default",
		emailInputName: "demoEmailInput",
		isDisableTooltip: false,
		...baseTooltipProps,
		placeholder: "password",
		maxLength: 30,
		size: InputSize.base,
	},
};

const SimpleViewTemplate = () => {
	const [value, setValue] = useState("");

	return (
		<div style={{ width: "320px" }}>
			<PasswordInput
				simpleView
				inputValue={value}
				onChange={(e) => setValue(e.currentTarget?.value)}
				inputName="simple-view-demo"
				placeholder="Enter password"
				passwordSettings={basePasswordSettings}
				scale
			/>
		</div>
	);
};

export const SimpleView: Story = {
	render: () => <SimpleViewTemplate />,
	parameters: {
		docs: {
			description: {
				story:
					"Simple view mode hides validation indicators and the strength bar. Ideal for login forms where validation feedback is not needed.",
			},
			source: {
				code: `<PasswordInput
  simpleView
  inputValue={value}
  onChange={handleChange}
  placeholder="Enter password"
/>`,
			},
		},
	},
};

const StatesTemplate = () => {
	return (
		<Wrapper>
			<PasswordInputTemplate
				passwordSettings={basePasswordSettings}
				inputName="state-normal"
				placeholder="Normal"
				{...baseTooltipProps}
			/>
			<PasswordInputTemplate
				passwordSettings={basePasswordSettings}
				inputName="state-disabled"
				isDisabled
				placeholder="Disabled"
				{...baseTooltipProps}
			/>
			<PasswordInputTemplate
				passwordSettings={basePasswordSettings}
				inputName="state-error"
				hasError
				placeholder="With error"
				{...baseTooltipProps}
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
					"PasswordInput supports normal, disabled, and error states. Each state provides appropriate visual feedback.",
			},
			source: {
				code: `<PasswordInput placeholder="Normal" passwordSettings={settings} />
<PasswordInput placeholder="Disabled" isDisabled passwordSettings={settings} />
<PasswordInput placeholder="With error" hasError passwordSettings={settings} />`,
			},
		},
	},
};

const CustomRulesTemplate = () => {
	const [value, setValue] = useState("");

	return (
		<div style={{ height: "110px", width: "320px" }}>
			<PasswordInput
				inputValue={value}
				onChange={(e) => setValue(e.currentTarget?.value)}
				inputName="custom-rules-demo"
				placeholder="Min 8 chars, uppercase & digits"
				passwordSettings={{
					...basePasswordSettings,
					minLength: 8,
					specSymbols: false,
				}}
				tooltipPasswordTitle="Password must contain:"
				tooltipPasswordLength="minimum length: 8"
				tooltipPasswordDigits="digits"
				tooltipPasswordCapital="capital letters"
				scale
			/>
		</div>
	);
};

export const CustomValidation: Story = {
	render: () => <CustomRulesTemplate />,
	parameters: {
		docs: {
			description: {
				story:
					"Customizable validation rules: minimum 8 characters, uppercase and digits required, no special characters needed.",
			},
			source: {
				code: `<PasswordInput
  passwordSettings={{
    minLength: 8,
    upperCase: true,
    digits: true,
    specSymbols: false,
  }}
  tooltipPasswordTitle="Password must contain:"
  tooltipPasswordLength="minimum length: 8"
  tooltipPasswordDigits="digits"
  tooltipPasswordCapital="capital letters"
/>`,
			},
		},
	},
};

const SizesTemplate = () => {
	return (
		<Wrapper>
			<PasswordInputTemplate
				passwordSettings={basePasswordSettings}
				inputName="size-base"
				size={InputSize.base}
				placeholder="Base size"
				simpleView
				{...baseTooltipProps}
			/>
			<PasswordInputTemplate
				passwordSettings={basePasswordSettings}
				inputName="size-middle"
				size={InputSize.middle}
				placeholder="Middle size"
				simpleView
				{...baseTooltipProps}
			/>
			<PasswordInputTemplate
				passwordSettings={basePasswordSettings}
				inputName="size-large"
				size={InputSize.large}
				placeholder="Large size"
				simpleView
				{...baseTooltipProps}
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
					"PasswordInput supports base, middle, and large sizes to match different UI contexts.",
			},
			source: {
				code: `<PasswordInput size={InputSize.base} placeholder="Base size" simpleView />
<PasswordInput size={InputSize.middle} placeholder="Middle size" simpleView />
<PasswordInput size={InputSize.large} placeholder="Large size" simpleView />`,
			},
		},
	},
};

export const CssCustomization: Story = {
	render: () => (
		<div
			style={
				{
					width: "320px",
					"--text-input-bg": "#f5f3ff",
					"--text-input-border-color": "#7c3aed",
					"--text-input-color": "#4c1d95",
					"--text-input-radius": "8px",
					"--password-input-icon-hover": "#7c3aed",
					"--password-input-icon-disabled": "#c4b5fd",
					"--password-input-tooltip-text": "#4c1d95",
					"--password-input-tooltip-width": "280px",
					"--password-input-border-radius": "8px",
				} as CSSProperties
			}
		>
			<PasswordInput
				inputValue="Passw0rd!"
				onChange={() => {}}
				inputName="css-custom-demo"
				placeholder="Custom styled password"
				passwordSettings={basePasswordSettings}
				{...baseTooltipProps}
				scale
				size={InputSize.base}
			/>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--text-input-bg\` | Background color | theme token |
| \`--text-input-border-color\` | Border color | theme token |
| \`--text-input-color\` | Text color | theme token |
| \`--text-input-radius\` | Input border radius | theme token |
| \`--password-input-icon-hover\` | Eye icon hover color | theme token |
| \`--password-input-icon-disabled\` | Eye icon disabled color | theme token |
| \`--password-input-tooltip-text\` | Tooltip text color | theme token |
| \`--password-input-tooltip-width\` | Tooltip width | \`294px\` |
| \`--password-input-border-radius\` | Input container border radius | \`3px\` |`,
			},
		},
	},
};
