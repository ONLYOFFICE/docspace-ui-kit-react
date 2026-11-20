import type { IconButtonProps } from "../icon-button";
import type {
  TTooltipPlace,
  TooltipProps,
  TGetTooltipContent,
} from "../tooltip";

// `role` and `ariaLabel` stay out: the info icon is rendered with props of its
// own choosing, so they would never reach it. A passed `aria-*` lands on the
// anchor. `className`, `size` and `isClickable` are declared again for
// HelpButton's own defaults.
export type HelpButtonProps = Omit<
  IconButtonProps,
  "tooltipContent" | "role" | "ariaLabel" | "className" | "size" | "isClickable"
> &
  React.AriaAttributes & {
    /** Class of the info icon, or of the element around `children`.
     * @default "icon-button" */
    className?: string;
    /** Width and height of the info icon; same forms as `IconButton`'s `size`.
     * @default 12 */
    size?: IconButtonProps["size"];
    /** Shows the pointer cursor over the info icon.
     * @default true */
    isClickable?: boolean;
    /**
     * Anchor to use instead of the info icon. The whole element becomes the
     * thing the tooltip opens from.
     */
    children?: React.ReactNode;
    /**
     * Id of the anchor element, which the tooltip is matched against by a CSS
     * selector. Without it a fresh id is generated on **every** render, so pass
     * one for a button that re-renders.
     */
    id?: string;
    /** Value of the legacy `data-tip` attribute on the info icon. */
    dataTip?: string;
    /**
     * Builds the tooltip's content. Returning a string routes the text through
     * the shared tooltip; returning a node makes the component render one of its
     * own.
     */
    getContent?: (params: TGetTooltipContent) => React.ReactNode;
    /** Side of the anchor the tooltip prefers.
     * @default "top" */
    place?: TTooltipPlace;
    /** Distance between the anchor and the tooltip, in pixels. */
    offset?: number;
    /** Applied to the wrapper around the anchor. */
    style?: React.CSSProperties;
    /** Called after the tooltip has been shown. Not called for a string tooltip. */
    afterShow?: () => void;
    /** Called after the tooltip has been hidden. Not called for a string tooltip. */
    afterHide?: () => void;
    /** Ignored. Nothing reads this prop. */
    tooltipId?: string;
    /** Maximum width of the tooltip as a CSS length. */
    tooltipMaxWidth?: string;
    /**
     * Content of the tooltip. A string is shown by the shared tooltip, which
     * needs `RootTooltip` mounted; any other node makes the component render its
     * own `Tooltip` instead.
     */
    tooltipContent?: React.ReactNode;
    /** Ignored. Nothing reads this prop. */
    tooltipProps?: TooltipProps;
    /** Whether the tooltip opens on click rather than on hover.
     * @default true */
    openOnClick?: boolean;
    /** Ignored. Nothing reads this prop. */
    offsetTop?: number;
    /** Ignored. Nothing reads this prop. */
    offsetRight?: number;
    /** Ignored. Nothing reads this prop. */
    offsetBottom?: number;
    /** Ignored. Nothing reads this prop. */
    offsetLeft?: number;
    /** Forces the tooltip open or closed. Only for a tooltip rendered by this component. */
    isOpen?: boolean;
    /** Stops the tooltip's text being selected. */
    noUserSelect?: boolean;
    /** Value of `data-testid` on the wrapper.
     * @default "help-button" */
    dataTestId?: string;
    /** Applied to the tooltip itself. */
    tooltipStyle?: React.CSSProperties;
    /** Icon to draw instead of the kit's info glyph. */
    iconNode?: React.ReactNode;
  };
