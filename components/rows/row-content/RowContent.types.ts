export type RowContentProps = {
  /**
   * The row's parts by position: the title, then the icons beside it. Later
   * children are side elements, hidden, with their text joined into the line
   * under the title. It has to be an array.
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
  /** Changes nothing on screen; nothing reads it. */
  sectionWidth?: number;
  /**
   * Whether the last side element is joined into the line as text like the
   * others. Turn it off to show it at the end of the line as the element it is.
   * @default true
   */
  convertSideInfo?: boolean;
};
