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
  /** Gives the outer element both the content's height and its width. */
  translateContentSizesToHolder?: ScrollbarLibraryProps["translateContentSizesToHolder"];
  /** Which side the vertical track is on. It follows the interface direction unless set. */
  rtl?: ScrollbarLibraryProps["rtl"];
  /** Receives the scrollbar instance, with its scroll methods and elements. */
  ref?: React.Ref<ScrollbarType | null>;
  /** Receives the element that holds the content, once it is mounted. */
  contentRef?: React.RefObject<HTMLDivElement | null>;
  /** Extra class on the inner element that scrolls, the `.scroller`. */
  scrollClass?: string;
  /** Extra class on the element that holds the content, the `.scroll-body`. */
  scrollBodyClassName?: string;
  /**
   * Hides the tracks until a scroll or a pointer move over the content, and
   * fades them out three seconds later. `false` keeps them on screen.
   * @default true
   */
  autoHide?: boolean;
  /**
   * Keeps the thumb 8px thick on desktop. Without it the thumb is 4px and
   * thickens only under the pointer.
   */
  fixedSize?: boolean;
  /** Focuses the content element after mount, so the arrow keys scroll it straight away. */
  autoFocus?: boolean;
  /**
   * Tab order of the content element. The default keeps it out of the tab
   * order, so the keyboard cannot reach the region; `null` drops the attribute.
   * @default -1
   */
  tabIndex?: number | null;
  /** Space below the last item, as a CSS length. */
  paddingAfterLastItem?: string;
  /**
   * Space between the content and the side the vertical track is on, as a CSS
   * length. It replaces the default at every screen width.
   */
  paddingInlineEnd?: string;
  /** Called as the content scrolls, with the native event. */
  onScroll?: React.UIEventHandler<HTMLDivElement>;
  /** The content to scroll. */
  children?: React.ReactNode;
} & PickedScrollbarLibraryProps;
