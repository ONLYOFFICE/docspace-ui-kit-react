import { createContext } from "react";

// What the list's scroll container, rendered by react-window as its outer
// element and so reachable by no prop, needs to be the list's listbox: the
// option the keyboard is on, and the handlers for the keys and the focus.
export type TListboxContext = {
  activeOptionId?: string;
  onKeyDown?: (e: KeyboardEvent) => void;
  onFocus?: () => void;
  onBlur?: (e: FocusEvent) => void;
};

export const ListboxContext = createContext<TListboxContext>({});
