import { TOption } from "../combobox";

export interface PagingProps {
  /** Label of the previous-page button. Nothing here is translated, so pass the string already localised. */
  previousLabel: string;
  /** Label of the next-page button. Nothing here is translated, so pass the string already localised. */
  nextLabel: string;
  /** Called when the previous button is clicked. A promise it returns is not awaited: the component has no loading state of its own. */
  previousAction: (e?: React.MouseEvent) => Promise<void> | void;
  /** Called when the next button is clicked. A promise it returns is not awaited: the component has no loading state of its own. */
  nextAction: (e?: React.MouseEvent) => Promise<void> | void;
  /** Disables the previous button. The page selector is disabled only when `disableNext` is set as well. */
  disablePrevious?: boolean;
  /** Disables the next button. */
  disableNext?: boolean;
  /** The option the page selector displays. It is read on every render, so hold it in your own state and update it from `onSelectPage`. */
  selectedPageItem: TOption;
  /** The option the per-page selector displays. It is read on every render, so hold it in your own state and update it from `onSelectCount`. */
  selectedCountItem: TOption;
  /** Called with the option that was picked in the page selector. Nothing moves until you update `selectedPageItem` yourself. */
  onSelectPage?: (option: TOption) => Promise<void> | void;
  /** Called with the option that was picked in the per-page selector. Nothing changes until you update `selectedCountItem` yourself. */
  onSelectCount?: (option: TOption) => Promise<void> | void;
  /** One `{ key, label }` per page. Typed as required, but passing nothing simply leaves the page selector out. */
  pageItems: TOption[];
  /** One `{ key, label }` per page size. Typed as required, but passing nothing simply leaves the per-page selector out. */
  countItems: TOption[];
  /** Which way both drop-downs open; `both` lets each one choose by the room under it. */
  openDirection?: "bottom" | "top" | "both";
  /** Added after the component's own class on the outer element. */
  className?: string;
  /** Value of `id` on the outer element. */
  id?: string;
  /** Inline style of the outer element, and where the `--paging-*` custom properties go. */
  style?: React.CSSProperties;
  /** Whether the per-page selector is rendered at all. */
  showCountItem?: boolean;
  /** Value of `data-testid` on the outer element.
   * @default "paging" */
  dataTestId?: string;
}
