export type TextProps = {
  /** Ref to access the DOM element or React component instance */
  ref?: React.RefObject<HTMLDivElement | null>;
  /** Sets the tag through which the component is rendered */
  as?: React.ElementType;
  /** Accepts the tag id */
  tag?: string;
  /** Sets background color */
  backgroundColor?: string;
  /** Specifies the text color */
  color?: string;
  /** Sets the 'display' property */
  display?: string;
  /** Sets the font size */
  fontSize?: string;
  /** Sets the font weight */
  fontWeight?: number | string;
  /** Sets font weight value to bold */
  isBold?: boolean;
  /** Sets the 'display: inline-block' property */
  isInline?: boolean;
  /** Sets the font style to italic */
  isItalic?: boolean;
  /** Sets the line height */
  lineHeight?: string;
  /** Disables text selection */
  noSelect?: boolean;
  /** Sets the 'text-align' property */
  textAlign?: "left" | "center" | "right" | "justify";
  /** Title attribute for hover tooltip */
  title?: string;
  /** Sets the class name */
  className?: string;
  /** Disables word wrapping */
  truncate?: boolean;
  /** HTML id attribute */
  id?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
  /** Text direction */
  dir?: "ltr" | "rtl" | "auto";
  /** Child elements */
  children?: React.ReactNode;
  /** Click event handler */
  onClick?: (e: React.MouseEvent<Element>) => void;
  /** For label association */
  htmlFor?: string;
  /** Visual style variant */
  view?: string;
  /** Link href */
  href?: string;
  /** Used as HTML `rel` property */
  rel?: string;
  /** Used as HTML `tabindex` property */
  tabIndex?: number;
  /** Used in container component */
  containerWidth?: string;
  /** Used in container component */
  containerMinWidth?: string;
  /** Test id */
  dataTestId?: string;
};
