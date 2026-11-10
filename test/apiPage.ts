/**
 * One page of a portal list answer, as an SDK client hands it over in
 * `res.data`. The portal sets `count` to the number of items on THIS page and
 * `total` to all the matches (ApiContext.SetCount / SetTotalCount, written by
 * CommonApiResponse): GET people/room/{id}?count=100 on a portal of 327 people
 * answers { count: 100, total: 327 }.
 *
 * Build list mocks with this, never by hand. The selectors' mocks used to put
 * the total into `count`, which made a selector that read `count` as the
 * total look correct - and it stopped after the first page of 100.
 */
export const apiPage = <T>(items: T[], total = items.length) => ({
  data: { response: items, count: items.length, total },
});

/** `length` distinct names, `${prefix} 001` and on, sorted as a portal would. */
export const names = (length: number, prefix = "Member", from = 1) =>
  Array.from(
    { length },
    (_, index) => `${prefix} ${String(from + index).padStart(3, "0")}`,
  );
