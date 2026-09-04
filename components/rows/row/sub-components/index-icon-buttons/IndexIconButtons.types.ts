export type IndexIconButtonsProps = {
  onUpIndexClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onDownIndexClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  containerClassName?: string;
  upIconClassName?: string;
  downIconClassName?: string;
  commonIconClassName?: string;
  style?: React.CSSProperties;
};
