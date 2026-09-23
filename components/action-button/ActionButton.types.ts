import type { ElementType, ReactNode, ComponentPropsWithRef } from "react";

type AsProp<C extends ElementType> = {
  /** Renders as the given element or component. Defaults to `button`. */
  as?: C;
};

type ActionButtonOwnProps = {
  /** Icon node rendered before the label text. */
  icon?: ReactNode;
  /** Content rendered after the icon, usually the button text. */
  label?: ReactNode;
  /** Additional class name merged with the component's own. */
  className?: string;
};

export type ActionButtonProps<C extends ElementType = "button"> =
  ActionButtonOwnProps &
    AsProp<C> &
    Omit<ComponentPropsWithRef<C>, keyof ActionButtonOwnProps | "as">;
