import { createContext, ReactNode } from "react";
import { TSelectorSelectAll } from "../Selector.types";

type CheckboxProps = { isAllChecked: boolean; isAllIndeterminate: boolean };

export const SelectAllContext = createContext<
  TSelectorSelectAll & CheckboxProps
>({ isAllChecked: false, isAllIndeterminate: false });

export const SelectAllProvider = ({
  children,

  ...rest
}: TSelectorSelectAll &
  CheckboxProps & {
    children: ReactNode;
  }) => {
  return <SelectAllContext value={rest}>{children}</SelectAllContext>;
};
