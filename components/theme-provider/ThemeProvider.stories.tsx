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

import type { Meta, StoryObj } from "@storybook/react-vite";

import { globalColors } from "../../providers/theme";
import type { TColorScheme } from "../../context/ThemeContext";
import { Button, ButtonSize } from "../button";
import { Text } from "../text";

import { ThemeProviderComponent } from ".";

const meta: Meta<typeof ThemeProviderComponent> = {
	title: "Components/Providers/ThemeProvider",
	component: ThemeProviderComponent,
	parameters: {
		docs: {
			description: {
				component: `ThemeProvider is a wrapper component that applies theming to all child components.

### Features

- **Theme Management**: Applies light/dark theme globally
- **Color Scheme**: Custom color schemes for branding
- **Interface Direction**: Supports LTR and RTL layouts
- **Font Family**: Custom font family configuration
- **CSS Variables**: Sets CSS custom properties for theme colors
- **Styled Components Integration**: Provides theme context to styled-components

### Usage

\`\`\`tsx
import { ThemeProvider } from "@docspace/ui-kit/components/theme-provider";

const theme = {
  isBase: true,
  interfaceDirection: "ltr",
  fontFamily: "Open Sans, sans-serif",
};

const colorScheme = {
  id: 1,
  name: "Blue",
  main: {
    accent: "#4781D1",
    buttons: "#5299E0",
  },
  text: {
    accent: "#ffffff",
    buttons: "#ffffff",
  },
};

<ThemeProviderComponent theme={theme} currentColorScheme={colorScheme}>
  <App />
</ThemeProviderComponent>
\`\`\``,
			},
		},
	},
	argTypes: {
		theme: {
			control: "object",
			description: "Theme configuration object",
		},
		currentColorScheme: {
			control: "object",
			description: "Optional color scheme for custom branding",
		},
	},
};

export default meta;

type Story = StoryObj<typeof ThemeProviderComponent>;

// Mock theme objects
const lightTheme = {
	isBase: true,
	interfaceDirection: "ltr",
	fontFamily: "Open Sans, sans-serif, Arial",
};

const darkTheme = {
	isBase: false,
	interfaceDirection: "ltr",
	fontFamily: "Open Sans, sans-serif, Arial",
};

const rtlTheme = {
	isBase: true,
	interfaceDirection: "rtl",
	fontFamily: "Open Sans, sans-serif, Arial",
};

const customFontTheme = {
	isBase: true,
	interfaceDirection: "ltr",
	fontFamily: "Georgia, serif",
};

// Mock color schemes
const blueColorScheme: TColorScheme = {
	id: 1,
	name: "Blue",
	main: {
		accent: globalColors.lightBlueMain,
		buttons: globalColors.lightSecondMain,
	},
	text: {
		accent: globalColors.white,
		buttons: globalColors.white,
	},
};

const greenColorScheme: TColorScheme = {
	id: 2,
	name: "Green",
	main: {
		accent: globalColors.mainGreen,
		buttons: globalColors.secondGreen,
	},
	text: {
		accent: globalColors.white,
		buttons: globalColors.white,
	},
};

const orangeColorScheme: TColorScheme = {
	id: 3,
	name: "Orange",
	main: {
		accent: globalColors.mainOrange,
		buttons: globalColors.secondOrange,
	},
	text: {
		accent: globalColors.white,
		buttons: globalColors.white,
	},
};

const purpleColorScheme: TColorScheme = {
	id: 4,
	name: "Purple",
	main: {
		accent: globalColors.mainPurple,
		buttons: globalColors.purple,
	},
	text: {
		accent: globalColors.white,
		buttons: globalColors.white,
	},
};

// Demo component to show theming effects
const ThemedContent = () => (
	<div style={{ padding: "20px" }}>
		<div style={{ marginBottom: "20px" }}>
			<Text as="h2" fontSize="24px" fontWeight="700">
				Theme Demo
			</Text>
			<Text fontSize="14px" style={{ marginTop: "8px" }}>
				This content is wrapped in a ThemeProvider and receives theme styling.
			</Text>
		</div>

		<div
			style={{
				display: "flex",
				gap: "12px",
				flexWrap: "wrap",
				marginBottom: "20px",
			}}
		>
			<Button primary size={ButtonSize.normal} label="Primary Button" />
			<Button size={ButtonSize.normal} label="Secondary Button" />
			<Button primary size={ButtonSize.small} label="Small Primary" />
		</div>

		<div style={{ marginTop: "20px" }}>
			<Text fontSize="16px" fontWeight="600" style={{ marginBottom: "12px" }}>
				Color Variables
			</Text>
			<div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
				<div
					style={{
						width: "120px",
						height: "80px",
						backgroundColor: "var(--color-scheme-main-accent)",
						borderRadius: "8px",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Text
						fontSize="12px"
						fontWeight="600"
						style={{ color: "var(--color-scheme-text-accent)" }}
					>
						Accent
					</Text>
				</div>
				<div
					style={{
						width: "120px",
						height: "80px",
						backgroundColor: "var(--color-scheme-main-buttons)",
						borderRadius: "8px",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Text
						fontSize="12px"
						fontWeight="600"
						style={{ color: "var(--color-scheme-text-buttons)" }}
					>
						Buttons
					</Text>
				</div>
			</div>
		</div>
	</div>
);

export const Default: Story = {
	args: {
		theme: lightTheme,
		currentColorScheme: blueColorScheme,
		children: <ThemedContent />,
	},
};

export const LightTheme: Story = {
	args: {
		theme: lightTheme,
		currentColorScheme: blueColorScheme,
		children: <ThemedContent />,
	},
	parameters: {
		docs: {
			description: {
				story:
					'Light theme with blue color scheme. The theme sets `data-theme="light"` attribute on the document root.',
			},
		},
	},
};

export const DarkTheme: Story = {
	args: {
		theme: darkTheme,
		currentColorScheme: blueColorScheme,
		children: <ThemedContent />,
	},
	parameters: {
		docs: {
			description: {
				story:
					'Dark theme variant. The theme sets `data-theme="dark"` attribute on the document root.',
			},
		},
	},
};

export const RTLDirection: Story = {
	args: {
		theme: rtlTheme,
		currentColorScheme: blueColorScheme,
		children: (
			<div style={{ padding: "20px" }}>
				<Text as="h2" fontSize="24px" fontWeight="700">
					واجهة من اليمين إلى اليسار
				</Text>
				<Text fontSize="14px" style={{ marginTop: "8px" }}>
					هذا المحتوى يستخدم اتجاه RTL (من اليمين إلى اليسار)
				</Text>
				<div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
					<Button primary size={ButtonSize.normal} label="زر أساسي" />
					<Button size={ButtonSize.normal} label="زر ثانوي" />
				</div>
			</div>
		),
	},
	parameters: {
		docs: {
			description: {
				story:
					'Right-to-left interface direction for languages like Arabic and Hebrew. Sets `data-dir="rtl"` attribute.',
			},
		},
	},
};

export const CustomFont: Story = {
	args: {
		theme: customFontTheme,
		currentColorScheme: blueColorScheme,
		children: (
			<div style={{ padding: "20px" }}>
				<Text as="h2" fontSize="24px" fontWeight="700">
					Custom Font Family
				</Text>
				<Text fontSize="14px" style={{ marginTop: "8px" }}>
					This content uses Georgia serif font instead of the default Open Sans.
				</Text>
				<div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
					<Button primary size={ButtonSize.normal} label="Primary Button" />
					<Button size={ButtonSize.normal} label="Secondary Button" />
				</div>
			</div>
		),
	},
	parameters: {
		docs: {
			description: {
				story:
					"Theme with custom font family. The font family is applied via CSS variable `--font-family`.",
			},
		},
	},
};

export const GreenColorScheme: Story = {
	args: {
		theme: lightTheme,
		currentColorScheme: greenColorScheme,
		children: <ThemedContent />,
	},
	parameters: {
		docs: {
			description: {
				story: "Theme with green color scheme for custom branding.",
			},
		},
	},
};

export const OrangeColorScheme: Story = {
	args: {
		theme: lightTheme,
		currentColorScheme: orangeColorScheme,
		children: <ThemedContent />,
	},
	parameters: {
		docs: {
			description: {
				story: "Theme with orange color scheme for custom branding.",
			},
		},
	},
};

export const PurpleColorScheme: Story = {
	args: {
		theme: lightTheme,
		currentColorScheme: purpleColorScheme,
		children: <ThemedContent />,
	},
	parameters: {
		docs: {
			description: {
				story: "Theme with purple color scheme for custom branding.",
			},
		},
	},
};

export const WithoutColorScheme: Story = {
	args: {
		theme: lightTheme,
		children: (
			<div style={{ padding: "20px" }}>
				<Text as="h2" fontSize="24px" fontWeight="700">
					No Custom Color Scheme
				</Text>
				<Text fontSize="14px" style={{ marginTop: "8px" }}>
					When no color scheme is provided, only the base theme is applied.
				</Text>
				<div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
					<Button primary size={ButtonSize.normal} label="Primary Button" />
					<Button size={ButtonSize.normal} label="Secondary Button" />
				</div>
			</div>
		),
	},
	parameters: {
		docs: {
			description: {
				story:
					"ThemeProvider without a custom color scheme. Only base theme styling is applied.",
			},
		},
	},
};

export const AllColorSchemes: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
			<ThemeProviderComponent theme={lightTheme} currentColorScheme={blueColorScheme}>
				<div
					style={{
						padding: "16px",
						border: "1px solid #ddd",
						borderRadius: "8px",
					}}
				>
					<Text as="h3" fontSize="18px" fontWeight="600">
						Blue Color Scheme
					</Text>
					<div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
						<Button primary size={ButtonSize.normal} label="Primary" />
						<Button size={ButtonSize.normal} label="Secondary" />
					</div>
				</div>
			</ThemeProviderComponent>

			<ThemeProviderComponent theme={lightTheme} currentColorScheme={greenColorScheme}>
				<div
					style={{
						padding: "16px",
						border: "1px solid #ddd",
						borderRadius: "8px",
					}}
				>
					<Text as="h3" fontSize="18px" fontWeight="600">
						Green Color Scheme
					</Text>
					<div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
						<Button primary size={ButtonSize.normal} label="Primary" />
						<Button size={ButtonSize.normal} label="Secondary" />
					</div>
				</div>
			</ThemeProviderComponent>

			<ThemeProviderComponent theme={lightTheme} currentColorScheme={orangeColorScheme}>
				<div
					style={{
						padding: "16px",
						border: "1px solid #ddd",
						borderRadius: "8px",
					}}
				>
					<Text as="h3" fontSize="18px" fontWeight="600">
						Orange Color Scheme
					</Text>
					<div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
						<Button primary size={ButtonSize.normal} label="Primary" />
						<Button size={ButtonSize.normal} label="Secondary" />
					</div>
				</div>
			</ThemeProviderComponent>

			<ThemeProviderComponent theme={lightTheme} currentColorScheme={purpleColorScheme}>
				<div
					style={{
						padding: "16px",
						border: "1px solid #ddd",
						borderRadius: "8px",
					}}
				>
					<Text as="h3" fontSize="18px" fontWeight="600">
						Purple Color Scheme
					</Text>
					<div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
						<Button primary size={ButtonSize.normal} label="Primary" />
						<Button size={ButtonSize.normal} label="Secondary" />
					</div>
				</div>
			</ThemeProviderComponent>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Comparison of all available color schemes side by side. Each section has its own ThemeProvider instance.",
			},
		},
	},
};
