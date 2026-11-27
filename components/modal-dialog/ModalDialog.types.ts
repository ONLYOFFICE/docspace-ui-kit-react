import type { RefObject } from "react";
import { AsideHeaderProps } from "../aside";

import { ModalDialogType } from "./ModalDialog.enums";

export type ModalDialogTypeDetailed = {
  mobile: ModalDialogType;
  tablet: ModalDialogType;
  desktop: ModalDialogType;
};

export type ModalSubComponentsProps = AsideHeaderProps &
  Omit<
    React.AriaAttributes,
    "aria-label" | "aria-labelledby" | "aria-describedby"
  > & {
    /** Reference to the modal element */
    ref?: RefObject<HTMLDivElement | null>;
    /** Reference to the inner sheet/content element (`<div id="modal-dialog">`) */
    sheetRef?: RefObject<HTMLDivElement | null>;
    /** Applied to the dialog's outer element. */
    id?: string;
    /** Applied to the click-to-close layer around the dialog surface. */
    style?: React.CSSProperties;
    /** Added to the click-to-close layer around the dialog surface. */
    className?: string;
    /** Current display type of the modal (modal or aside) */
    currentDisplayType: ModalDialogType;
    /** **`ASIDE-ONLY`** Wraps the side panel's body in the kit's scrollbar. */
    withBodyScroll?: boolean;
    /** **`ASIDE-ONLY`** Locks the scroll in body section */
    isScrollLocked?: boolean;
    /** **`MODAL-ONLY`** Sets width: 520px and max-height: 400px */
    isLarge: boolean;
    /** **`MODAL-ONLY`** Sets predefined huge size */
    isHuge: boolean;
    /** Stacking order of the backdrop, which holds the dialog. */
    zIndex?: number;
    /** **`MODAL-ONLY`** Lifts the height cap, so the modal grows with its
     * content. */
    autoMaxHeight?: boolean;
    /** **`MODAL-ONLY`** Lets the width follow the content instead of the fixed
     * 400px. */
    autoMaxWidth?: boolean;
    /** Called by the cross, Escape, a backdrop click or a swipe down. */
    onClose: (e?: React.MouseEvent) => void;
    /** Replaces the header, body and footer with a skeleton of the current
     * display type. */
    isLoading?: boolean;
    /** Content for the modal header */
    header?: React.ReactNode;
    /** Content for the modal body */
    body?: React.ReactNode;
    /** Content for the modal footer */
    footer?: React.ReactNode;
    /** Container content for aside mode */
    container?: React.ReactNode;
    /** Shows the dialog. It stays mounted either way, so render it
     * conditionally to remove it. */
    visible?: boolean;
    /** **`MODAL-ONLY`** Displays border between body and footer */
    withFooterBorder: boolean;
    /** How far the sheet has been dragged down, in pixels. The dialog tracks it
     * itself; a value passed here overrides it. */
    modalSwipeOffset?: number;
    /** **`ASIDE-ONLY`** Allows embedding modal as aside dialog inside parent container */
    containerVisible?: boolean;
    /** Stacks the footer in a column, so each `<div>` in it becomes a row of
     * buttons. */
    isDoubleFooterLine?: boolean;
    /** Whether the user may close the dialog at all. The cross, Escape and a
     * backdrop click share one guard, so `false` stops all three.
     * @default true */
    isCloseable?: boolean;
    /** Whether a click on the backdrop closes the dialog. Unlike `isCloseable`,
     * this stops only that one route; the cross and Escape keep working.
     * @default true */
    closeOnBackdropClick?: boolean;
    /** Turns closing off: no cross, and neither Escape nor the backdrop calls
     * `onClose`. */
    embedded?: boolean;
    /** Wraps content in form element */
    withForm?: boolean;
    /** Form submit handler */
    onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
    /** Removes default padding from body */
    withoutPadding?: boolean;
    /** Removes default margin from header */
    withoutHeaderMargin?: boolean;
    /** Renders the backdrop without the dialog surface, so none of the content
     * mounts. */
    hideContent?: boolean;
    /** Draws the invite panel's skeleton while the side panel is loading. */
    isInvitePanelLoader?: boolean;
    /** Forces body scroll regardless of display type */
    withBodyScrollForcibly?: boolean;

    /** Draws a one-pixel border on the dialog's inline-start edge, where an aside
     * meets the page. Set `--modal-dialog-aside-border` to recolour it.
     * @default false */
    withBorder?: boolean;
    /** Test id */
    dataTestId?: string;

    /** Makes the body's scrollbar publish itself through `ScrollbarContext`, so a
     * descendant can scroll it. Off unless something inside needs that. */
    scrollbarCreateContext?: boolean;
    /** Controls the visibility of the backdrop overlay */
    backdropVisible?: boolean;

    /** Accessible name of the dialog, landing on the element that carries
     * `role="dialog"`. Prefer `aria-labelledby` when the heading is already on
     * screen; a dialog with neither is announced as an unnamed dialog. */
    "aria-label"?: string;
    /** `id` of the element naming the dialog — usually the heading passed to
     * `ModalDialog.Header`, given an `id` of its own. */
    "aria-labelledby"?: string;
    /** `id` of the element describing the dialog, announced after the name. */
    "aria-describedby"?: string;
  };

export type ModalDialogProps = Partial<
  Omit<
    ModalSubComponentsProps,
    "currentDisplayType" | "header" | "body" | "footer" | "container"
  >
> & {
  /** Displays the child elements */
  children: (React.ReactElement | null)[] | React.ReactElement;
  /** Shows the dialog as a centred modal or a side panel at every width.
   * `displayTypeDetailed` wins over it. */
  displayType?: ModalDialogType;
  /** Detailed display type for each dimension */
  displayTypeDetailed?: ModalDialogTypeDetailed;
  /** Test id */
  dataTestId?: string;
};

export type ModalDialogFormWrapperProps = {
  withForm: boolean;
  className?: string;
  children?: React.ReactNode;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
};

export type ModalDialogBackdropProps = {
  className?: string;
  children: React.ReactNode | React.ReactElement[] | React.ReactElement;
  zIndex?: number;
};
