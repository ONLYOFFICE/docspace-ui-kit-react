import type React from "react";

export type ColumnarInfoBarColumn = {
  label: React.ReactNode;
  value: React.ReactNode;
};

export type ColumnarInfoBarProps = {
  headerText?: string;
  columns: ColumnarInfoBarColumn[];
  onAction?: () => void;
  onLoad?: () => void;
  style?: React.CSSProperties;
  variant?: "default" | "neutral" | "page";
};
