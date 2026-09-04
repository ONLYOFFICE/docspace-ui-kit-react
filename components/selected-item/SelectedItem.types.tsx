type TLabel = string | React.ReactNode;

export interface SelectedItemProps {
  /** Selected item text */
  label: TLabel;
  /** Sets the 'width: fit-content' property */
  isInline?: boolean;
  /** Sets a callback function that is triggered when the cross icon is clicked */
  onClose: (
    propKey: string | number,
    label: TLabel,
    group?: string,
    e?: React.MouseEvent,
  ) => void;
  /** Sets a callback function that is triggered when the selected item is clicked */
  onClick?: (
    propKey: string | number,
    label: TLabel,
    group?: string,
    e?: React.MouseEvent<HTMLElement>,
  ) => void;
  /** Sets the button to present a disabled state */
  isDisabled?: boolean;
  /** Accepts class  */
  className?: string;
  /** Accepts id */
  id?: string;
  /** Accepts css style */
  style?: React.CSSProperties;
  /** Accepts key to remove item */
  propKey: string | number;
  /** Accepts group key to remove item */
  group?: string;
  /** Passes ref to component */
  forwardedRef?: React.RefObject<HTMLDivElement | null>;
  classNameCloseButton?: string;
  hideCross?: boolean;
  title?: string;
  dataTestId?: string;
  /** Icon as SVG URL string or React SVG component */
  icon?: string | React.FC<React.SVGProps<SVGSVGElement>>;
  clickable?: boolean;
  /** Sets the item as active/selected state */
  isActive?: boolean;
}
