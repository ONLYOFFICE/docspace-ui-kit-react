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

export type AsideHeaderProps = PickedDivProps & {
  /** Header content - can be a string or a ReactNode */
  header?: string | React.ReactNode;
  /** Array of icons to display in the header */
  headerIcons?: HeaderIcon[];
  /** Additional component to render in the header */
  headerComponent?: React.ReactNode;
  /** Whether the header is in a loading state */
  isLoading?: boolean;
  /** Whether to hide the bottom border */
  withoutBorder?: boolean;
  /** Custom height for the header */
  headerHeight?: string;
  /** Whether to show the close button */
  isCloseable?: boolean;
  /** Click handler for the close button */
  onCloseClick?: () => void;
  /** Whether to show the back button */
  isBackButton?: boolean;
  /** Click handler for the back button */
  onBackClick?: () => void;
  dataTestId?: string;
};
