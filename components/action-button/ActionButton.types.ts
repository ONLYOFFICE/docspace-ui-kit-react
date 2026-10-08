import type { ElementType, ReactNode, ComponentPropsWithRef } from "react";

type AsProp<C extends ElementType> = {
  /** Renders as the given element or component. Defaults to `button`. */
  as?: C;
};

type ActionButtonOwnProps = {
  /** Icon node rendered before the label text. It is drawn at 12px and filled with the text colour. */
  icon?: ReactNode;
  /** Text of the button. Anything else you pass as `children` is dropped. */
  label?: ReactNode;
  /** Applied to the rendered element, after the component's own class. */
  className?: string;
};

export type ActionButtonProps<C extends ElementType = "button"> =
  ActionButtonOwnProps &
    AsProp<C> &
    Omit<ComponentPropsWithRef<C>, keyof ActionButtonOwnProps | "as">;
