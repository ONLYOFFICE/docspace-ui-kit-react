import { Dispatch, SetStateAction } from "react";

interface PageCountProps {
  ref: React.RefObject<PageCountRef | null>;
  visible: boolean;
  isPanelOpen: boolean;
  className?: string;
  setIsOpenMobileDrawer: Dispatch<SetStateAction<boolean>>;
}

export type { PageCountProps as default };

export type PageCountRef = {
  setPageNumber: (pageNumber: number) => void;
  setPagesCount: (pagesCount: number) => void;
};
