import type { AriaAttributes } from "react";

import type { AsideHeaderProps } from "./aside-header";

/**
 * Props for the Aside component.
 */
export type AsideProps = AsideHeaderProps &
  AriaAttributes & {
    /** Whether the panel is slid in. It only switches a CSS transform — the
     * panel and its children stay mounted and in the tab order either way, so
     * render the component conditionally to close it properly. */
    visible: boolean;
    /** Makes the panel take the full width of the viewport instead of its
     * 480px.
     * @default false */
    scale?: boolean;
    /** Applied to the `<aside>` element. */
    className?: string;
    /** Stacking order of the panel. It sits above the page but below nothing
     * in particular — a `Backdrop` of your own needs a lower value.
     * @default 400 */
    zIndex?: number;
    /** Content of the panel, below the header. */
    children: React.ReactNode;
    /** Renders the children directly instead of inside the kit's `Scrollbar`.
     * It does **not** lock the page's scroll, despite the name.
     * @default false */
    withoutBodyScroll?: boolean;
    /** Called by the header's close cross. Nothing else closes the panel: there
     * is no backdrop, no Escape handling and no click-outside. */
    onClose?: () => void;
    /** Renders no header at all — which also removes the only control that
     * calls `onClose`.
     * @default false */
    withoutHeader?: boolean;
  };
