import { MouseEvent } from "react";

export type ICategoryItemProps = {
  title: string;
  url: string;
  subtitle: string;
  onClickLink: (e: MouseEvent<Element>) => void;
  isDisabled?: boolean;
  withPaidBadge: boolean;
  badgeLabel: string;
  dataTestId?: string;
};
