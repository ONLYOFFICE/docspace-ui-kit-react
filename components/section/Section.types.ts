import type { Operation } from "../operations-progress-button/OperationsProgressButton.types";
import { DeviceType } from "../../enums";
import { TViewAs } from "../../types";

import { ContextMenuModel } from "../context-menu";

export type SubInfoPanelHeaderProps = {
  children: React.JSX.Element | null;
};

export type SubInfoPanelBodyProps = {
  children: React.JSX.Element | null;
  /** Freezes the info panel's own scroller, for a drag or a menu that must not scroll the panel under it. */
  isInfoPanelScrollLocked?: boolean;
  /** Leaves the body unscrolled. Supplied internally from `infoPanelWithoutScroll`. */
  withoutScroll?: boolean;
};

export type InfoPanelProps = {
  children: React.ReactNode;
  isVisible?: boolean;
  /** Hides the info panel on anything narrower than a desktop, where it would otherwise cover the page. */
  isMobileHidden?: boolean;
  setIsVisible?: (value: boolean) => void;
  /** **The info panel is not rendered without this.** `isInfoPanelVisible` alone is not enough: both must be true. */
  canDisplay?: boolean;
  /** Suppresses the info panel below the desktop breakpoint while a dialog of yours is open, so the two do not stack. */
  anotherDialogOpen?: boolean;
  /** Which listing the body holds. It changes the body's padding, and in `row` view it lets a click beside the info panel close it. */
  viewAs?: TViewAs;
  /** Which layout to render. It places the header and the filter, decides whether the body scrolls, and puts the info panel inline or over the page. Nothing here measures the viewport. */
  currentDeviceType?: DeviceType;
  /** Opens the panel as an aside over a backdrop. The section never sets it. */
  topInfoPanel?: boolean;
  /** Called by that backdrop. */
  onClose?: () => void;
  withoutBodyScroll?: boolean;
  /** Enables the drag resizer on the panel's inline-start edge, from `INFO_PANEL_WIDTH` up to `INFO_PANEL_MAX_WIDTH` while the section keeps its own minimum. Desktop only; a double click on the edge restores the default width. */
  isResizable?: boolean;
  /** Current width in px; applied as `--info-panel-width`. */
  width?: number;
  /** Called with the committed width in px: once per drag, when the pointer is released, and on the double click that restores the default. A width narrowed to fit the window is never committed. */
  onResize?: (value: number) => void;
  /** Called on every frame of a resize drag with the width in px so far, before it is committed. */
  onLiveResize?: (value: number) => void;
  /** Called with the width in px the panel takes on screen, narrower than `width` while the window cannot fit it, and with `undefined` once the panel is hidden or no longer resizable. */
  onShownWidthChange?: (value?: number) => void;
};

/**
 * The AI Chat panel occupies the same right-side area as the Info Panel but,
 * unlike it, never switches into the portal-based "Aside" overlay: it renders
 * inline on every device (so its React subtree — and the live chat state — is
 * never remounted across a resize) and goes full-screen on tablet/mobile purely
 * via CSS. Kept as a separate region so the Info Panel's behavior is untouched.
 */
export type ChatPanelProps = {
  children: React.ReactNode;
  isVisible?: boolean;
  currentDeviceType?: DeviceType;
  setIsVisible?: (value: boolean) => void;
  /**
   * Label of the "drop to attach" overlay. Set only while the host drags items
   * from its own list over the panel; omitting it hides the overlay (see
   * `chatPanelDropTargetLabel` on SectionProps).
   */
  dropTargetLabel?: string;
  /**
   * Enables the drag resizer on the panel's inline-start edge. Honoured on
   * desktop only. It stays enabled in fullscreen — see `isFullscreen`, where
   * the same handle only serves as the way back out.
   */
  isResizable?: boolean;
  /** Current docked width in px; applied as `--chat-panel-width`. */
  width?: number;
  /** Called once per drag, when the pointer is released, with the committed width in px. A width narrowed to fit the window is never committed. */
  onResize?: (value: number) => void;
  /** Called on every frame of a resize drag with the width in px so far, before it is committed. */
  onLiveResize?: (value: number) => void;
  /** Called with the docked width in px the panel takes on screen, narrower than `width` while the window cannot fit it, and with `undefined` once the panel is hidden, fullscreen or no longer resizable. */
  onShownWidthChange?: (value?: number) => void;
  /**
   * Whether the host currently renders the panel fullscreen. The width then
   * belongs to the layout — the resizer sets none, and only listens for the
   * drag back inwards that leaves fullscreen.
   */
  isFullscreen?: boolean;
  /**
   * Called when the resize drag is pushed past the widest docked width, i.e.
   * the user asks for fullscreen with the same gesture that widens the panel.
   * The host is expected to turn fullscreen on (as its header button does);
   * omitting the handler keeps the drag clamped at the limit instead.
   */
  onRequestFullscreen?: () => void;
  /**
   * Called when the drag comes back inwards in fullscreen: the host turns
   * fullscreen off and the same drag carries on resizing the docked panel.
   * Omitting it makes fullscreen a one-way trip for the resizer.
   */
  onExitFullscreen?: () => void;
};

export type SectionBodyContentProps = {
  children: React.ReactNode;
};

export type TOnDrop = (acceptedFiles: File[]) => void;

export type SectionBodyProps = {
  withScroll: boolean;
  autoFocus: boolean;
  /** Called with the files dropped anywhere on the body, which is itself a drop target. Nothing is filtered and nothing is highlighted — see `DragAndDrop`. */
  onDrop?: TOnDrop;
  children: React.ReactNode;
  viewAs?: TViewAs;
  /** Applies the settings pages' narrower body padding. */
  settingsStudio: boolean;

  /** Lets the body take its content's height. The section never sets it. */
  isDesktop?: boolean;
  currentDeviceType?: DeviceType;
  /** Returns the model for the body's own right-click menu. Without it no menu is mounted; it is also suppressed while `isIndexEditingMode` is set. */
  getContextModel?: () => ContextMenuModel[];
  /** The current route. Changing it re-focuses the body on a desktop, which is how the portal restores keyboard scrolling after a navigation. */
  pathname?: string;
  /** Suppresses the body's right-click menu while the listing is being reordered. */
  isIndexEditingMode?: boolean;
  /** Drops both the footer slot and the spacer under the body. */
  withoutFooter?: boolean;
  /** Called when a drag leaves the body. */
  onDragLeaveEmpty?: () => void;
  /** Called on every drag-over of the body, with a drag-active flag that is one render behind. */
  onDragOverEmpty?: (isDragActive: boolean) => void;
  /** Makes the body fill the section's height rather than its content's, for a chat-like page whose inner regions scroll instead. */
  fullHeightBody?: boolean;
};

export type SectionContainerProps = {
  /** The `aria-*` attributes passed to the section, set on the container. */
  aria?: React.AriaAttributes;
  /** The section's container element. */
  ref?: React.Ref<HTMLDivElement>;
  isSectionHeaderAvailable: boolean;
  /** Whether the info panel is open. It narrows the section and is one of the two conditions for the panel being rendered at all — `canDisplay` is the other. */
  isInfoPanelVisible?: boolean;
  viewAs?: TViewAs;
  children: React.ReactNode;
  /** Whether the section scrolls its own body. With `false` the page scrolls instead and the section takes a 20px inline-start padding. On a phone the page always scrolls. */
  withBodyScroll: boolean;
  currentDeviceType?: DeviceType;
  /** Content of the banner above the section. Supplied internally from the `SectionBanner` slot. */
  bannerContent?: React.ReactNode;
  /** Puts the banner at the top of the scrolling body, so it scrolls away under the header. Off, the banner stays pinned above the scroller. */
  scrollableBanner?: boolean;
  /** Moves the desktop filter into the scrolling body, where it sticks under the header. A table header then sticks under the filter instead of being fixed. */
  stickyTableHeader?: boolean;
  /** Makes the whole section unfocusable and unclickable, and hides it from assistive technology. It suits a section kept mounted behind a fullscreen panel. */
  inert?: boolean;
};

export type SectionFilterProps = {
  children: React.ReactNode;
  className?: string;
};

export type SectionFooterProps = {
  children: React.ReactNode;
};

export type SectionHeaderProps = {
  className: string;
  children: React.ReactNode;
};

export type SectionWarningProps = {
  children: React.ReactNode;
};

export type SectionSubmenuProps = {
  children: React.ReactNode;
};

export type SectionProps = React.AriaAttributes &
  Omit<SubInfoPanelHeaderProps, "children"> &
  Omit<SectionSubmenuProps, "children"> &
  Omit<SubInfoPanelBodyProps, "children" | "withoutScroll"> &
  Omit<SectionWarningProps, "children"> &
  Omit<SectionFooterProps, "children"> &
  Omit<SectionFilterProps, "children" | "className"> &
  Omit<
    InfoPanelProps,
    | "children"
    | "setIsVisible"
    | "isVisible"
    | "withoutBodyScroll"
    | "isResizable"
    | "width"
    | "onResize"
    | "onLiveResize"
    | "onShownWidthChange"
    | "topInfoPanel"
    | "onClose"
  > &
  Omit<SectionHeaderProps, "children" | "className"> &
  Omit<
    SectionContainerProps,
    "children" | "isSectionHeaderAvailable" | "bannerContent" | "aria"
  > &
  Omit<
    SectionBodyProps,
    | "children"
    | "isSectionHeaderAvailable"
    | "autoFocus"
    | "withScroll"
    | "isDesktop"
  > & {
    /** The slots: each child is one of the ten `Section.*` markers, whose contents the section renders in its own places. Anything else is dropped. With no header, filter or body slot it renders nothing at all. */
    children: React.ReactNode;
    /** Whether the info panel region exists at all. It defaults to `true`, so the panel's markup is mounted unless you turn it off. */
    isInfoPanelAvailable?: boolean;
    /** Removes the info panel body's scroller and the aside's, for a body that scrolls its own regions. */
    infoPanelWithoutScroll?: boolean;
    /** Opt-in edge resizer for the info panel (desktop only), from `INFO_PANEL_WIDTH` to `INFO_PANEL_MAX_WIDTH`. Pass the width the host stores plus a setter; leave unset for a fixed-width panel. */
    isInfoPanelResizable?: boolean;
    /** Width of the info panel in px while `isInfoPanelResizable` is on. Without the resizer it is ignored and the panel keeps its stylesheet width. */
    infoPanelWidth?: number;
    /** Called with the committed width: once per drag, on release, and on the double click that restores the default. A width narrowed to fit the window is never committed. */
    setInfoPanelWidth?: (value: number) => void;
    /** Called with the width in px an open info or chat panel takes, or `0`, so corner buttons can move clear of it. Below a desktop the info panel counts as `INFO_PANEL_WIDTH` and the chat as `0`. */
    onShownInfoPanelWidthChange?: (value: number) => void;
    /** Whether the AI chat region exists at all. It defaults to `false`. */
    isChatPanelAvailable?: boolean;
    /** Opens the AI chat panel, docked on a desktop and covering the page below it. It needs `isChatPanelAvailable`. */
    isChatPanelVisible?: boolean;
    /** Called with `false` when the browser goes back while the chat panel is open below the desktop breakpoint. */
    setIsChatPanelVisible?: (value: boolean) => void;
    /** Text of a dashed "drop here" frame over the chat panel. Set it while the host drags its own items over the panel, and clear it afterwards. */
    chatPanelDropTargetLabel?: string;
    /**
     * Opt-in edge resizer for the docked chat panel (desktop only). Pass the
     * width the host stores plus a setter; leave unset for a fixed-width panel.
     */
    isChatPanelResizable?: boolean;
    /** Current width of the docked chat panel in pixels. */
    chatPanelWidth?: number;
    /** Called once per resize drag, when the pointer is released, with the committed width. */
    setChatPanelWidth?: (value: number) => void;
    /**
     * Turns the chat panel fullscreen on. Called when the edge resizer is
     * dragged past the widest docked width; leave unset to keep that drag
     * clamped at the limit.
     */
    setChatPanelFullscreen?: () => void;
    /**
     * Turns the chat panel fullscreen off. Called when the resizer is dragged
     * back inwards in fullscreen, which then continues as a normal resize.
     */
    unsetChatPanelFullscreen?: () => void;
    /** Whether the host renders the chat panel fullscreen right now. */
    isChatPanelFullscreen?: boolean;
    /** Called with `false` when the info panel closes itself — a click beside it, or the browser going back below the desktop breakpoint. */
    setIsInfoPanelVisible?: (value: boolean) => void;
    /** Whether the background operations have finished, for the progress button's completed state. */
    secondaryOperationsCompleted?: boolean;
    /** Whether the panel operations — uploads — have finished. */
    primaryOperationsCompleted?: boolean;
    /** Background operations shown in the progress button. Its length is one of the three that decide whether the button appears. */
    secondaryActiveOperations?: Operation[];
    /** Upload operations shown in the progress button's own panel. */
    primaryOperationsArray?: Operation[];
    /** Clears a finished background operation. */
    clearSecondaryProgressData?: (
      operationId?: string | null,
      operation?: string | null,
      operationItem?: Operation,
    ) => void;
    /** Clears a finished upload operation. */
    clearPrimaryProgressData?: (operation?: string | null) => void;
    /** Called by the progress button's cancel control while an upload is running. */
    cancelUpload?: () => void;
    /** Cancels one background operation by id. */
    cancelSecondaryOperationById?: (
      operation: string,
      operationId: string,
    ) => void;
    /** Whether the background operations were stopped rather than finished. */
    secondaryOperationsStopped?: boolean;
    /** Puts the progress button in its alert state for a failed background operation. */
    secondaryOperationsAlert?: boolean;
    /** Whether the main button is on screen, which moves the progress button clear of it. */
    mainButtonVisible?: boolean;
    /** Puts the progress button in its alert state for a failed upload. */
    primaryOperationsAlert?: boolean;
    /** Whether the uploads were cancelled. */
    primaryOperationsCanceled?: boolean;
    /** Makes the progress button check its operations for errors before reporting them complete. */
    needErrorChecking?: boolean;

    /** Drops both the footer slot and the spacer under the body. */
    withoutFooter?: boolean;
    /** Whether a drag of the host's own items is in progress, which the progress button uses for its drop-preview state. */
    dragging?: boolean;
    /** Name of the folder a dragged item would land in, shown by the progress button. */
    dropTargetPreview?: string;
    /** Called by the progress button when its drop preview ends, so the host can forget the target folder. */
    clearDropPreviewLocation?: () => void;
    /** Its mere presence makes the progress button appear, even with no operations, so that a drag can show its drop preview. */
    startDropPreview?: () => void;
    // Plugin operations props
    /** Operations contributed by plugins, merged into the background operations of the progress button. */
    pluginOperations?: Operation[];
    /** Whether the plugin operations have finished, for the progress button's completed state. */
    pluginOperationsCompleted?: boolean;
    /** Puts the progress button in its alert state for a failed plugin operation. */
    pluginOperationsAlert?: boolean;
    /** Forces the progress button's cancel control on, whatever the operations say. */
    pluginShowCancelButton?: boolean;
  };

export type SectionContextMenuProps = {
  getContextModel?: () => ContextMenuModel[];
};
