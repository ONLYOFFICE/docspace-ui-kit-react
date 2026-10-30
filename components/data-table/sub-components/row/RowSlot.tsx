import type React from "react";
import { memo } from "react";

import type {
  DataTableRenderRowProps,
  DataTableRowState,
} from "../../DataTable.types";

import { DataTableRow } from "./DataTableRow";

const NO_ROW_PROPS: DataTableRowState = {};

type RowSlotProps<T> = {
  row: T;
  index: number;
  getRowProps?: (row: T, index: number) => DataTableRowState;
  renderRow?: (props: DataTableRenderRowProps<T>) => React.ReactNode;
};

const RowSlotPure = <T,>({
  row,
  index,
  getRowProps,
  renderRow,
}: RowSlotProps<T>) => {
  const rowProps = getRowProps?.(row, index) ?? NO_ROW_PROPS;

  if (renderRow) return renderRow({ row, index, rowProps });

  return <DataTableRow row={row} index={index} {...rowProps} />;
};

/**
 * Where the table puts each row. Memoised on the row, its index and the two
 * functions, so `getRowProps` runs again only for a row that changed; the
 * columns reach the row through context, not through here.
 */
export const RowSlot = memo(RowSlotPure) as typeof RowSlotPure;
