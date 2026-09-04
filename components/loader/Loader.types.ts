import type { LoaderTypes } from "./Loader.enums";

export type LoaderProps = {
	/** Ref to access the DOM element or React component instance */
	ref?: React.RefObject<SVGSVGElement>;
	/** Custom color for the loader. Can be any valid CSS color value */
	color?: string;
	/**
	 * Type of loader animation to display. Available types:
	 * - base: Simple circular spinner
	 * - oval: Oval-shaped loading animation
	 * - dual-ring: Two concentric rotating rings
	 * - rombs: Diamond-shaped loading animation
	 * - track: Circular track with rotating segment
	 */
	type?: LoaderTypes;
	/** Size of the loader in valid CSS units (px, rem, em, etc.) */
	size?: string;
	/** Optional text to display below the loader */
	label?: string;
	/** Additional CSS class name for custom styling */
	className?: string;
	/** Unique identifier for the loader component */
	id?: string;
	/** Custom inline CSS styles */
	style?: React.CSSProperties;
	/** If true, uses primary color from theme */
	primary?: boolean;
	/** If true, loader will appear in a disabled state */
	isDisabled?: boolean;
};

export type LoaderThemeProps = LoaderProps & {
	ref: SVGSVGElement;
	viewBox?: string;
	xmlns?: string;
};
