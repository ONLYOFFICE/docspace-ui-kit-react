import React from "react";

import { DROPDOWN_CLASS_NAME } from "../sub-components/NewItemDropDown";

const useCreateDropDown = () => {
  const [isOpenDropDown, setIsOpenDropDown] = React.useState(false);

  const onCloseDropDown = React.useCallback((e?: MouseEvent) => {
    if (e) {
      const target = e.target as HTMLElement;

      if (
        target &&
        target.className &&
        typeof target.className === "string" &&
        target.className.includes(DROPDOWN_CLASS_NAME)
      )
        return;
    }

    setTimeout(() => {
      setIsOpenDropDown(false);
    }, 0);
  }, []);

  return { isOpenDropDown, onCloseDropDown, setIsOpenDropDown };
};

export default useCreateDropDown;
