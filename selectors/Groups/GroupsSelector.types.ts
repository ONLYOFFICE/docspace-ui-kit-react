import type {
  TAccessRight,
  TSelectorHeader,
  TSelectorWithAside,
  TSelectorItem,
} from "../../components/selector";

export type GroupsSelectorProps = TSelectorHeader &
  TSelectorWithAside & {
    id?: string;
    className?: string;
    onSubmit: (
      selectedItems: TSelectorItem[],
      access?: TAccessRight | null,
      fileName?: string,
      isFooterCheckboxChecked?: boolean,
    ) => void | Promise<void>;
  };

export type GroupsSelectorItem = Pick<TSelectorItem, "id" | "label">;
