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

export type ScrollbarProps = PickedScrollbarLibraryProps & {
  /** Ref to access the DOM element or React component instance */
  ref?: React.Ref<ScrollbarType | null>;
  /** Ref to access the DOM element of Scroll content element */
  contentRef?: React.RefObject<HTMLDivElement | null>;
  /** This class will be placed on scroller element */
  scrollClass?: string;
  /** This class will be placed on scroller body element */
  scrollBodyClassName?: string;
  /** Enable tracks auto hiding.  */
  autoHide?: boolean;
  /** Fix scrollbar size. */
  fixedSize?: boolean;
  /** Set focus on scroll content element after first render */
  autoFocus?: boolean;
  /** Set scroll body tabindex */
  tabIndex?: number | null;
  /** Add padding bottom to scroll-body */
  paddingAfterLastItem?: string;
  /** Add custom padding-inline-end to scroll-body. */
  paddingInlineEnd?: string;
  /** Add onScroll handler */
  onScroll?: React.UIEventHandler<HTMLDivElement>;
  /** Add children */
  children?: React.ReactNode;
};
