import type { FolderDtoInteger } from "@onlyoffice/docspace-api-sdk";
import type { TInfoBarData, TSelectorItem } from "../../components/selector";
import type { WithFlag } from "../../types";

export type TInitValue = WithFlag<
  "withInit",
  {
    withInit: true;
    initItems: FolderDtoInteger[];
    initTotal: number;
    initHasNextPage: boolean;
    initSearchValue?: string;
  }
>;

export type AIAgentSelectorProps = {
  id?: string;
  className?: string;
  style?: React.CSSProperties;

  onSubmit: (items: TSelectorItem[]) => void | Promise<void>;
  excludeItems?: (number | string | undefined)[];
  setIsDataReady?: (value: boolean) => void;

  withPadding?: boolean;

  onClose: () => void;

  disableBySecurity?: string;
  externalInfoBarData?: TInfoBarData;
} & TInitValue;
