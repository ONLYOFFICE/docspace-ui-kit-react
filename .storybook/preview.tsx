import type { Preview } from "@storybook/react";
import { useDarkMode } from "storybook-dark-mode";

import { globalColors } from "../themes/globalColors";

import "../styles/custom.scss";

import "./styles.css";

import lightTheme from "./lightTheme";
import darkTheme from "./darkTheme";

const preview: Preview = {
	parameters: {
		backgrounds: { disable: true },
		controls: {
			expanded: true,
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		darkMode: {
			light: lightTheme,
			dark: darkTheme,
		},
	},

	decorators: [
		(Story) => {
			const isDark = useDarkMode();

			return (
				<div
					style={{
						backgroundColor: isDark ? globalColors.black : globalColors.white,
						color: isDark ? globalColors.white : globalColors.black,
						minHeight: "100vh",
						padding: "20px",
					}}
				>
					<Story />
				</div>
			);
		},
	],

	tags: ["autodocs"],
};

export default preview;
