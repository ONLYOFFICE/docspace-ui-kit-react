import { Dispatch, SetStateAction } from "react";

interface PageCountProps {
  ref: React.RefObject<PageCountRef | null>;
  visible: boolean;
  isPanelOpen: boolean;
  className?: string;
  setIsOpenMobileDrawer: Dispatch<SetStateAction<boolean>>;
}

export default PageCountProps;

export type PageCountRef = {
  setPageNumber: (pageNumber: number) => void;
  setPagesCount: (pagesCount: number) => void;
};
