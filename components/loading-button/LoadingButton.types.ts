export interface LoadingButtonProps {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  percent?: number;
  onClick?: VoidFunction;
  inConversion?: boolean;
  loaderColor?: React.CSSProperties["color"];
  backgroundColor?: React.CSSProperties["color"];
  isDefaultMode?: boolean;
}
