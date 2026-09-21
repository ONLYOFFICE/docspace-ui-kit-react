import {
  ScrollbarProps as ScrollbarLibraryProps,
  Scrollbar as ScrollbarType,
} from "./custom-scrollbar";

type PickedScrollbarLibraryProps = Pick<
  ScrollbarLibraryProps,
  | "id"
  | "className"
  | "style"
  | "noScrollY"
  | "noScrollX"
  | "createContext"
  | "translateContentSizeYToHolder"
  | "translateContentSizeXToHolder"
  | "translateContentSizesToHolder"
  | "rtl"
>;

export type ScrollbarProps = {
  /** Applied to the outermost element. */
  id?: ScrollbarLibraryProps["id"];
  /** Applied to the outermost element. */
  className?: ScrollbarLibraryProps["className"];
  /** Applied to the outermost element. */
  style?: ScrollbarLibraryProps["style"];
  /** Stops the content scrolling vertically. */
  noScrollY?: ScrollbarLibraryProps["noScrollY"];
  /** Stops the content scrolling horizontally. */
  noScrollX?: ScrollbarLibraryProps["noScrollX"];
  /** Publishes the scrollbar on a React context for the components inside it. */
  createContext?: ScrollbarLibraryProps["createContext"];
  /**
   * Gives the outer element the content's own height, so the scrollbar grows
   * with its content instead of filling its parent.
   */
  translateContentSizeYToHolder?: ScrollbarLibraryProps["translateContentSizeYToHolder"];
  /** The same on the horizontal axis. */
  translateContentSizeXToHolder?: ScrollbarLibraryProps["translateContentSizeXToHolder"];
  /** Both at once. */
  translateContentSizesToHolder?: ScrollbarLibraryProps["translateContentSizesToHolder"];
  /** Which side the vertical track is on. It follows the interface direction unless set. */
  rtl?: ScrollbarLibraryProps["rtl"];
  /** Ref to access the DOM element or React component instance */
  ref?: React.Ref<ScrollbarType | null>;
  /** Ref to access the DOM element of Scroll content element */
  contentRef?: React.RefObject<HTMLDivElement | null>;
  /** This class will be placed on scroller element */
  scrollClass?: string;
  /** This class will be placed on scroller body element */
  scrollBodyClassName?: string;
  /**
   * Whether the tracks fade out again three seconds after the last scroll or
   * pointer move.
   * @default true
   */
  autoHide?: boolean;
  /** Fix scrollbar size. */
  fixedSize?: boolean;
  /** Set focus on scroll content element after first render */
  autoFocus?: boolean;
  /**
   * Position of the scrolling element in the tab order. The default of -1 keeps
   * it off the tab order, so the region cannot be scrolled with the arrow keys;
   * `null` removes the attribute entirely.
   * @default -1
   */
  tabIndex?: number | null;
  /** Add padding bottom to scroll-body */
  paddingAfterLastItem?: string;
  /** Add custom padding-inline-end to scroll-body. */
  paddingInlineEnd?: string;
  /** Called as the content scrolls, with the native event. */
  onScroll?: React.UIEventHandler<HTMLDivElement>;
  /** The content to scroll. */
  children?: React.ReactNode;
} & PickedScrollbarLibraryProps;
