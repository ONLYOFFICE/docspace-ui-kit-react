import {
  ReactNode,
  createContext,
  Dispatch,
  SetStateAction,
  useState,
} from "react";

import { TSelectorSearch } from "../Selector.types";

export const SearchContext = createContext<TSelectorSearch>({});

export const SearchValueContext = createContext<boolean>(false);

export const SearchDispatchContext = createContext<
  Dispatch<SetStateAction<boolean>>
>(() => {});

const SearchActionProvider = ({ children }: { children: ReactNode }) => {
  const [isSearch, setIsSearch] = useState(false);

  return (
    <SearchDispatchContext value={setIsSearch}>
      <SearchValueContext value={isSearch}>{children}</SearchValueContext>
    </SearchDispatchContext>
  );
};

export const SearchProvider = ({
  children,
  ...rest
}: TSelectorSearch & { children: ReactNode }) => {
  return (
    <SearchContext value={rest}>
      <SearchActionProvider> {children}</SearchActionProvider>
    </SearchContext>
  );
};
