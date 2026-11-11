/**
 * How many items a list query matches in all, across every page.
 *
 * The portal's envelope carries two numbers: `total`, every item the query
 * matches, and `count`, the items in this answer - one page at most. The
 * SDK's wrapper types declare `count` alone, so `total` is read past them.
 * Paging by `count` ends the list at its first page.
 */
export const getListTotal = (data: { count?: number }): number => {
  const { total } = data as { total?: number | null };

  return total ?? data.count ?? 0;
};
