export const presentInArray = (
  array: string[],
  search: string,
  caseInsensitive = false,
) => {
  const pattern = caseInsensitive ? search.toLowerCase() : search;
  const result = array?.findIndex((item) => item === pattern);
  return result !== -1;
};
