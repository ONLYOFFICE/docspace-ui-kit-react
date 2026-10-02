import { SETTINGS_SIZE } from "./Table.constants";

export const getSubstring = (str: string) =>
  str ? +str.substring(0, str.length - 2) : 0;

export const checkingForUnfixedSize = (
  item: string,
  defaultColumnSize: number,
) => {
  return (
    item !== `${SETTINGS_SIZE}px` &&
    item !== `${defaultColumnSize}px` &&
    item !== "0px"
  );
};
