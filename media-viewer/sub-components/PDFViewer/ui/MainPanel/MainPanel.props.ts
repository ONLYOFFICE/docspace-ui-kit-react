interface MainPanelProps {
  ref?: React.RefObject<HTMLDivElement | null>;
  src: string;
  isLoading: boolean;

  isLastImage: boolean;
  isFistImage: boolean;

  setZoom: (scale: number) => void;
  onPrev?: VoidFunction;
  onNext?: VoidFunction;
}

export type { MainPanelProps as default };
