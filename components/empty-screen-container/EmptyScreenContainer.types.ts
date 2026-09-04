import type { CSSProperties, ReactNode } from "react";

export type EmptyScreenContainerProps = {
  /** URL source for the empty state image */
  imageSrc: string;
  /** Alternative text for the image for accessibility */
  imageAlt: string;
  /** Main header text displayed below the image */
  headerText: string;
  /** Optional subheading text displayed below the header */
  subheadingText?: string;
  /** Optional description text or React node displayed below the subheading */
  descriptionText?: string | ReactNode;
  /** Optional buttons or other interactive elements */
  buttons?: ReactNode;
  /** Additional CSS class name */
  className?: string;
  /** HTML id attribute */
  id?: string;
  /** Custom CSS styles for the container */
  style?: CSSProperties;
  /** Custom CSS styles for the image */
  imageStyle?: CSSProperties;
  /** Custom CSS styles for the buttons container */
  buttonStyle?: CSSProperties;
  /** Whether to display without filter styling */
  withoutFilter?: boolean;
};
