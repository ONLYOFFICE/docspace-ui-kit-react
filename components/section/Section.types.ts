import type { Operation } from "../operations-progress-button/OperationsProgressButton.types";
import { DeviceType } from "../../enums";
import { TViewAs, TUser, TFile, TFolder } from "../../types";

import { ContextMenuModel } from "../context-menu";

export type SubInfoPanelHeaderProps = {
  children: React.JSX.Element | null;
};

export type SubInfoPanelBodyProps = {
  children: React.JSX.Element | null;
  /** Freezes the info panel's own scroller, for a drag or a menu that must not scroll the panel under it. */
  isInfoPanelScrollLocked?: boolean;
  /** Not read at this level. The component passes `infoPanelWithoutScroll` here instead. */
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
  /** Which layout to render. It decides where the header and the filter go, whether the body scrolls itself, and whether the info panel is inline or a portal over the page. Nothing here measures the viewport. */
  currentDeviceType?: DeviceType;
  /** Not read. The info panel reads `topInfoPanel`, which the section never passes on. */
  asideInfoPanel?: boolean;
  /** Not read by the section: it is never forwarded to the info panel. */
  topInfoPanel?: boolean;
  /** Not read by the section: it is never forwarded to the info panel. */
  onClose?: () => void;
  withoutBodyScroll?: boolean;
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
  /** Called once per drag, on mouse up, with the committed width in px. */
  onResize?: (value: number) => void;
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
  /** Not read. Nothing in the body destructures it. */
  uploadFiles?: boolean;
  children: React.ReactNode;
  viewAs?: TViewAs;
  /** Applies the settings pages' narrower body padding. */
  settingsStudio: boolean;

  /** Not read by the section: it is never forwarded to the body. */
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
  /** Not read by the section: it keeps its own ref on the container. */
  ref?: React.RefObject<HTMLDivElement | null>;
  isSectionHeaderAvailable: boolean;
  /** Whether the info panel is open. It narrows the section and is one of the two conditions for the panel being rendered at all — `canDisplay` is the other. */
  isInfoPanelVisible?: boolean;
  viewAs?: TViewAs;
  children: React.ReactNode;
  /** Whether the section scrolls its own body. With `false` the page scrolls instead and the section takes a 20px inline-start padding. */
  withBodyScroll: boolean;
  currentDeviceType?: DeviceType;
  /** Not read by the section: the banner comes from the `SectionBanner` slot instead. */
  bannerContent?: React.ReactNode;
  /**
   * When true, the banner is rendered inside the scrollable body (as its first
   * element) instead of being pinned above the scroll container. Lets the
   * banner scroll away under the sticky section header. Defaults to false to
   * preserve the legacy pinned-banner behaviour.
   */
  scrollableBanner?: boolean;
  /**
   * When true, the desktop SectionFilter slot is rendered INSIDE the scroll
   * body as a sticky element (below the optional scrollable banner) instead of
   * the always-pinned `.section-sticky-container`, and the table header is
   * switched from `position: fixed` to `position: sticky` so it pins below the
   * in-body filter natively (no host JS to measure the header `top`). The host
   * supplies the pin offset via the `--section-filter-bottom` CSS variable.
   * Defaults to false (legacy fixed-header + sticky-container-filter).
   */
  stickyTableHeader?: boolean;
  /**
   * Marks the section root (`#section`) and its whole subtree as inert —
   * non-focusable and non-interactive. Used when the section is visually
   * collapsed but kept mounted (e.g. behind the fullscreen AI chat panel).
   */
  inert?: boolean;
};

export type SectionFilterProps = {
  children: React.ReactNode;
  className?: string;
  /** Tells the filter row that tabs sit above it, which removes its top margin. Honoured below the desktop breakpoint, where the filter lives inside the body. */
  withTabs?: boolean;
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

export type SectionProps = Omit<SubInfoPanelHeaderProps, "children"> &
  Omit<SectionSubmenuProps, "children"> &
  Omit<SubInfoPanelBodyProps, "children"> &
  Omit<SectionWarningProps, "children"> &
  Omit<SectionFooterProps, "children"> &
  Omit<SectionFilterProps, "children" | "className"> &
  Omit<
    InfoPanelProps,
    "children" | "setIsVisible" | "isVisible" | "withoutBodyScroll"
  > &
  Omit<SectionHeaderProps, "children" | "className"> &
  Omit<SectionContainerProps, "children" | "isSectionHeaderAvailable"> &
  Omit<
    SectionBodyProps,
    "children" | "isSectionHeaderAvailable" | "autoFocus" | "withScroll"
  > & {
    /** The slots. Each child must be one of the ten `Section.*` markers; the section reads their contents and renders them in its own places, and drops everything else. With no header, filter or body slot it renders nothing at all. */
    children: React.ReactNode;
    /** Not read. Nothing in the component destructures it. */
    progressBarDropDownContent?: React.ReactNode;
    /** Called when the operations button asks to open the upload panel. */
    onOpenUploadPanel?: () => void;
    /** Not read. Nothing in the component destructures it. */
    isTabletView?: boolean;
    /** Not read. Nothing in the component destructures it. */
    isHeaderVisible?: boolean;
    /** Whether the info panel region exists at all. It defaults to `true`, so the panel's markup is mounted unless you turn it off. */
    isInfoPanelAvailable?: boolean;
    /** Removes the info panel body's scroller and the aside's, for a body that scrolls its own regions. */
    infoPanelWithoutScroll?: boolean;
    /** Whether the AI chat region exists at all. It defaults to `false`. */
    isChatPanelAvailable?: boolean;
    /** Whether the AI chat panel is open. */
    isChatPanelVisible?: boolean;
    /** Called by the chat panel's own close control. */
    setIsChatPanelVisible?: (value: boolean) => void;
    /**
     * Overlay label shown while a drag started in the section body hovers the
     * chat panel; leave unset the rest of the time. The host owns both the
     * hit-testing (its list drag is mouse-based, not HTML5 DnD) and the
     * wording — the panel only renders the affordance.
     */
    chatPanelDropTargetLabel?: string;
    /**
     * Opt-in edge resizer for the docked chat panel (desktop only). Pass the
     * width the host stores plus a setter; leave unset for a fixed-width panel.
     */
    isChatPanelResizable?: boolean;
    /** Current width of the docked chat panel in pixels. */
    chatPanelWidth?: number;
    /** Called once per resize drag, on mouse up, with the committed width. */
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
    /** Not read. Nothing in the component destructures it. */
    isEmptyPage?: boolean;
    /** Not read. Nothing in the component destructures it. */
    maintenanceExist?: boolean;
    /** Not read. Nothing in the component destructures it. */
    snackbarExist?: boolean;
    /** Not read. Nothing in the component destructures it. */
    showText?: boolean;
    /** Not read. Nothing in the component destructures it. */
    isTrashFolder?: boolean;
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
    /** Not read. Nothing in the component destructures it. */
    onCancelOperation?: (callback: () => void) => void;
    /** Not read. Nothing in the component destructures it. */
    chatFiles?: (TFile | TFolder)[];
    /** Not read. Nothing in the component destructures it. */
    aiChatIsVisible?: boolean;
    /** Not read. Nothing in the component destructures it. */
    setAiChatIsVisible?: () => void;
    /** Not read. Nothing in the component destructures it. */
    mainBarVisible?: boolean;

    /** Not read. Nothing in the component destructures it. */
    getIcon?: (size: number, fileExst: string) => string;
    /** Not read. Nothing in the component destructures it. */
    displayFileExtension?: boolean;
    /** Not read. Nothing in the component destructures it. */
    aiChatID?: string;
    /** Not read. Nothing in the component destructures it. */
    aiSelectedFolder?: string | number;
    /** Not read. Nothing in the component destructures it. */
    aiUserId?: string;
    /** Not read. Nothing in the component destructures it. */
    vectorizedFiles?: TFile[];
    /** Not read. Nothing in the component destructures it. */
    user?: TUser;
    /** Tells the filter row that tabs sit above it. It only reaches the filter below the desktop breakpoint. */
    withTabs?: boolean;
    /** Drops the footer slot and the spacer under the body. */
    withoutFooter?: boolean;
    /** Whether a drag of the host's own items is in progress, which the progress button uses for its drop-preview state. */
    dragging?: boolean;
    /** Name of the folder a dragged item would land in, shown by the progress button. */
    dropTargetPreview?: string;
    /** Clears that drop preview. */
    clearDropPreviewLocation?: () => void;
    /** Its mere presence makes the progress button appear, even with no operations, so that a drag can show its drop preview. */
    startDropPreview?: () => void;
    /** Not read. The info panel reads `topInfoPanel`, which is never forwarded. */
    asideInfoPanel?: boolean;
    // Plugin operations props
    /** Operations contributed by plugins, merged into the background operations of the progress button. */
    pluginOperations?: Operation[];
    /** Whether those plugin operations have finished. */
    pluginOperationsCompleted?: boolean;
    /** Puts the progress button in its alert state for a failed plugin operation. */
    pluginOperationsAlert?: boolean;
    /** Forces the progress button's cancel control on, whatever the operations say. */
    pluginShowCancelButton?: boolean;
  };

export type SectionContextMenuProps = {
  getContextModel?: () => ContextMenuModel[];
};
