type PickedDivProps = Pick<
  React.ComponentPropsWithoutRef<"div">,
  "className" | "id" | "style"
>;

type HeaderIcon = {
  key: string;
  url?: string;
  iconNode?: React.ReactNode;
  label?: string;
  onClick: () => void;
};

export type AsideHeaderProps = React.AriaAttributes & {
  /** Applied to the header element. */
  className?: string;
  /** Applied to the header element. */
  id?: string;
  /** Applied to the header element. */
  style?: React.CSSProperties;
  /**
   * Title of the panel. A string is shown as bold 21px text, any other node in
   * a `Heading` that ends in an ellipsis.
   */
  header?: string | React.ReactNode;
  /**
   * Extra icon buttons between the title and the close cross. Each needs a
   * `key`, an `onClick`, and an `iconNode` or a `url` fetched at runtime;
   * its optional `label` is the button's accessible name.
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
   * Height of the header as a CSS length, such as `70px`. Without it the header
   * is 53px tall.
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
   * Accessible name of the close cross.
   * @default the kit's "CloseButton" translation
   */
  closeLabel?: string;
  /**
   * Whether a back arrow is rendered before the title. It is mirrored in RTL.
   * @default false
   */
  isBackButton?: boolean;
  /** Called by the back arrow. */
  onBackClick?: () => void;
  /**
   * Accessible name of the back arrow.
   * @default the kit's "Back" translation
   */
  backLabel?: string;
  /** Value of `data-testid` on the header.
   * @default "aside-header" */
  dataTestId?: string;
} & PickedDivProps;
