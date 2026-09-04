import type { Operation } from "../operations-progress-button/OperationsProgressButton.types";
import { DeviceType } from "../../enums";
import { TViewAs, TUser, TFile, TFolder } from "../../types";

import { ContextMenuModel } from "../context-menu";

export type SubInfoPanelHeaderProps = {
  children: React.JSX.Element | null;
};

export type SubInfoPanelBodyProps = {
  children: React.JSX.Element | null;
  isInfoPanelScrollLocked?: boolean;
  withoutScroll?: boolean;
};

export type InfoPanelProps = {
  children: React.ReactNode;
  isVisible?: boolean;
  isMobileHidden?: boolean;
  setIsVisible?: (value: boolean) => void;
  canDisplay?: boolean;
  anotherDialogOpen?: boolean;
  viewAs?: TViewAs;
  currentDeviceType?: DeviceType;
  asideInfoPanel?: boolean;
  topInfoPanel?: boolean;
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
  onDrop?: TOnDrop;
  uploadFiles?: boolean;
  children: React.ReactNode;
  viewAs?: TViewAs;
  settingsStudio: boolean;

  isDesktop?: boolean;
  currentDeviceType?: DeviceType;
  getContextModel?: () => ContextMenuModel[];
  pathname?: string;
  isIndexEditingMode?: boolean;
  withoutFooter?: boolean;
  onDragLeaveEmpty?: () => void;
  onDragOverEmpty?: (isDragActive: boolean) => void;
  fullHeightBody?: boolean;
};

export type SectionContainerProps = {
  ref?: React.RefObject<HTMLDivElement | null>;
  isSectionHeaderAvailable: boolean;
  isInfoPanelVisible?: boolean;
  viewAs?: TViewAs;
  children: React.ReactNode;
  withBodyScroll: boolean;
  currentDeviceType?: DeviceType;
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
    children: React.ReactNode;
    progressBarDropDownContent?: React.ReactNode;
    onOpenUploadPanel?: () => void;
    isTabletView?: boolean;
    isHeaderVisible?: boolean;
    isInfoPanelAvailable?: boolean;
    infoPanelWithoutScroll?: boolean;
    isChatPanelAvailable?: boolean;
    isChatPanelVisible?: boolean;
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
    chatPanelWidth?: number;
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
    isEmptyPage?: boolean;
    maintenanceExist?: boolean;
    snackbarExist?: boolean;
    showText?: boolean;
    isTrashFolder?: boolean;
    setIsInfoPanelVisible?: (value: boolean) => void;
    secondaryOperationsCompleted?: boolean;
    primaryOperationsCompleted?: boolean;
    secondaryActiveOperations?: Operation[];
    primaryOperationsArray?: Operation[];
    clearSecondaryProgressData?: (
      operationId?: string | null,
      operation?: string | null,
      operationItem?: Operation,
    ) => void;
    clearPrimaryProgressData?: (operation?: string | null) => void;
    cancelUpload?: () => void;
    cancelSecondaryOperationById?: (
      operation: string,
      operationId: string,
    ) => void;
    secondaryOperationsStopped?: boolean;
    secondaryOperationsAlert?: boolean;
    mainButtonVisible?: boolean;
    primaryOperationsAlert?: boolean;
    primaryOperationsCanceled?: boolean;
    needErrorChecking?: boolean;
    onCancelOperation?: (callback: () => void) => void;
    chatFiles?: (TFile | TFolder)[];
    aiChatIsVisible?: boolean;
    setAiChatIsVisible?: () => void;
    mainBarVisible?: boolean;

    getIcon?: (size: number, fileExst: string) => string;
    displayFileExtension?: boolean;
    aiChatID?: string;
    aiSelectedFolder?: string | number;
    aiUserId?: string;
    vectorizedFiles?: TFile[];
    user?: TUser;
    withTabs?: boolean;
    withoutFooter?: boolean;
    dragging?: boolean;
    dropTargetPreview?: string;
    clearDropPreviewLocation?: () => void;
    startDropPreview?: () => void;
    asideInfoPanel?: boolean;
    // Plugin operations props
    pluginOperations?: Operation[];
    pluginOperationsCompleted?: boolean;
    pluginOperationsAlert?: boolean;
    pluginShowCancelButton?: boolean;
  };

export type SectionContextMenuProps = {
  getContextModel?: () => ContextMenuModel[];
};
