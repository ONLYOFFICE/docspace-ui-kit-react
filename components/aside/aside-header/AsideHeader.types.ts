type PickedDivProps = Pick<
  React.ComponentPropsWithoutRef<"div">,
  "className" | "id" | "style"
>;

type HeaderIcon = {
  key: string;
  url?: string;
  iconNode?: React.ReactNode;
  onClick: () => void;
};

export type AsideHeaderProps = {
  /** Applied to the header element. */
  className?: string;
  /** Applied to the header element. */
  id?: string;
  /** Applied to the header element. */
  style?: React.CSSProperties;
  /**
   * Title of the panel. A string is rendered as bold 21px text; any other node
   * is rendered inside a `Heading` that truncates with an ellipsis. Nothing is
   * rendered when it is absent, including no placeholder.
   */
  header?: string | React.ReactNode;
  /**
   * Extra icon buttons between the title and the close cross. Each needs a
   * `key`, an `onClick` and either `iconNode` (JSX, preferred) or `url` — a URL
   * fetched at runtime, not an asset name.
   */
  headerIcons?: HeaderIcon[];
  /**
   * Arbitrary node rendered after the icons and before the close cross, for a
   * control that is not an icon.
   */
  headerComponent?: React.ReactNode;
  /**
   * Replaces the whole header — title, icons and close cross alike — with a
   * skeleton bar. There is no way out of a header that is loading.
   */
  isLoading?: boolean;
  /**
   * Hides the bottom border, which otherwise spans the full width of the panel
   * regardless of the header's own side margins.
   */
  withoutBorder?: boolean;
  /**
   * Height of the header as a CSS length, applied through the
   * `--aside-header-custom-height` custom property. Without it the header is
   * 53px.
   */
  headerHeight?: string;
  /**
   * Whether the close cross is rendered. It is the only control that calls
   * `onCloseClick`.
   * @default true
   */
  isCloseable?: boolean;
  /** Called by the close cross. */
  onCloseClick?: () => void;
  /**
   * Whether a back arrow is rendered before the title. It is mirrored in RTL.
   * @default false
   */
  isBackButton?: boolean;
  /** Called by the back arrow. */
  onBackClick?: () => void;
  /** Value of `data-testid` on the header.
   * @default "aside-header" */
  dataTestId?: string;
} & PickedDivProps;
