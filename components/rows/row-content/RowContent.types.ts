export type RowContentProps = {
  /**
   * The row's parts, addressed by position: the first is the title, the second
   * the icons beside it, and everything after that is a side element that is
   * **not displayed** — only its text is, joined into the one line under the
   * title. It has to be an array.
   */
  children: React.ReactElement<{
    containerWidth?: string;
    children?: React.ReactElement;
  }>[];
  /** Applied to the row's content element. */
  className?: string;
  /** Drops the line of joined side text under the title. */
  disableSideInfo?: boolean;
  /** Applied to the row's content element. */
  id?: string;
  /** Called on a click anywhere in the content. */
  onClick?: () => void;
  /** Any CSS colour for the line of side text. */
  sideColor?: string;
  /** Applied to the content element, and again to the title's wrapper. */
  style?: React.CSSProperties;
  /**
   * Read as a flag, not as a width: any non-zero value switches the content to
   * its section layout.
   */
  sectionWidth?: number;
  /**
   * Whether the last side element is flattened into the joined line like the
   * others. Turn it off to render it as the element it is.
   * @default true
   */
  convertSideInfo?: boolean;
};
