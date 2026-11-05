// ComboBox walks a list of DropDownItems with the arrow keys, and tells a row
// from other custom content by its component. A component that renders a
// DropDownItem with its props passed through - a wrapper adding labels, say -
// is marked so that its rows are walked too.
const DROP_DOWN_ITEM_MARK = Symbol.for("onlyoffice.apps-ui-kit.dropDownItem");

/** Marks a component that renders a `DropDownItem` from the props it takes. */
export const markAsDropDownItem = <T extends object>(component: T): T =>
  Object.assign(component, { [DROP_DOWN_ITEM_MARK]: true });

/** Whether an element type was marked with `markAsDropDownItem`. */
export const hasDropDownItemMark = (type: unknown) =>
  (typeof type === "function" || (typeof type === "object" && type !== null)) &&
  DROP_DOWN_ITEM_MARK in type;
