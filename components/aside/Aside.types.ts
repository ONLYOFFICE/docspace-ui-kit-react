import type { AriaAttributes } from "react";

import type { AsideHeaderProps } from "./aside-header";

/**
 * Props for the Aside component.
 */
export type AsideProps = AsideHeaderProps &
  AriaAttributes & {
    /** Controls the visibility of the aside panel */
    visible: boolean;
    /** Enables scaling animation */
    scale?: boolean;
    /** Additional CSS class names */
    className?: string;
    /** Sets the z-index of the aside panel */
    zIndex?: number;
    /** Content to be rendered inside the aside panel */
    children: React.ReactNode;
    /** Disables body scroll when aside is open */
    withoutBodyScroll?: boolean;
    /** Callback function when the aside is closed */
    onClose?: () => void;
    /** Removes the header section if true */
    withoutHeader?: boolean;
  };
