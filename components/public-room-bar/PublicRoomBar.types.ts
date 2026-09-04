import type React from "react";

export interface PublicRoomBarProps {
  ref?: React.RefObject<HTMLDivElement | null>;
  headerText: string | React.ReactNode;
  bodyText: string | React.ReactNode;
  iconName?: string | React.ReactElement;
  hideHeader?: boolean;
  onClose?: () => void;
  className?: string;
  style?: React.CSSProperties;
  barIsVisible?: boolean;
  dataTestId?: string;
}
