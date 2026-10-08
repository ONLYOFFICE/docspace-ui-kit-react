import type { useStores } from "@onlyoffice/ai-chat";

type AttachmentsStore = ReturnType<typeof useStores>["useAttachmentsStore"];

/**
 * Host paths whose attach round trip is still in flight, per attachments
 * store, with the number of holders on each.
 *
 * The loading chip a reservation produces (`TPendingAttachment`) carries only
 * a title, so the store alone cannot tell that the file being uploaded right
 * now is the one the user just picked again. This registry closes that window:
 * a path is "taken" from the moment a caller starts attaching it until its ref
 * lands in the store (where `path` makes it visible again).
 */
const inFlightPaths = new WeakMap<object, Map<string, number>>();

/**
 * `attachment id -> host path` for the refs this session attached, per store.
 *
 * `TAttachmentRef.path` is whatever the attachments backend echoed back, and
 * it is optional in the API model — a record that comes back without it would
 * make an attached file invisible to the duplicate check and let a second chip
 * through. This map remembers what the host actually sent, so identity never
 * depends on the round trip preserving the field. Entries for refs that are no
 * longer attached (chip removed, thread switched) are pruned on read.
 */
const attachedPathsById = new WeakMap<object, Map<string, string>>();

const getInFlight = (useAttachmentsStore: AttachmentsStore) => {
  let paths = inFlightPaths.get(useAttachmentsStore);
  if (!paths) {
    paths = new Map<string, number>();
    inFlightPaths.set(useAttachmentsStore, paths);
  }
  return paths;
};

const getPathsById = (useAttachmentsStore: AttachmentsStore) => {
  let paths = attachedPathsById.get(useAttachmentsStore);
  if (!paths) {
    paths = new Map<string, string>();
    attachedPathsById.set(useAttachmentsStore, paths);
  }
  return paths;
};

/**
 * Records which host path each freshly attached ref came from. Call it with
 * the attach response once the refs are in the store.
 */
export const rememberAttachedPaths = (
  useAttachmentsStore: AttachmentsStore,
  entries: { id: string; path: string }[],
) => {
  const byId = getPathsById(useAttachmentsStore);
  entries.forEach(({ id, path }) => byId.set(id, path));
};

/**
 * Reduces an attachment path to the host entry id that identifies the file.
 *
 * What comes back on a ref is not what the host sent: the DocSpace
 * attachments backend composes `path` as `${entryId}/${title}` so the widget's
 * `basename(path)` renders the file name (it splits on "/" for its own entry
 * lookups too). The host sends the bare entry id. Both forms have to reduce to
 * the same key, or the same file attaches again.
 *
 * That composition is the backend's convention, not a contract this repo can
 * enforce, so be forgiving about the shapes around it — a leading slash must
 * not turn into an empty key that matches nothing.
 */
const entryIdOf = (path: string) => {
  const trimmed = path.replace(/^\/+/, "");
  return trimmed.split("/", 1)[0] || trimmed;
};

/**
 * Host entry ids already spoken for in the current draft: the refs standing in
 * both attachment buckets plus the attaches still in flight.
 */
export const collectAttachedPaths = (
  useAttachmentsStore: AttachmentsStore,
): Set<string> => {
  const state = useAttachmentsStore.getState();
  const taken = new Set<string>();

  const byId = getPathsById(useAttachmentsStore);
  const liveIds = new Set<string>();

  [...state.attachmentFiles, ...state.attachmentImages].forEach((ref) => {
    liveIds.add(ref.id);
    const path = ref.path ?? byId.get(ref.id);
    if (path) taken.add(entryIdOf(path));
  });

  byId.forEach((_path, id) => {
    if (!liveIds.has(id)) byId.delete(id);
  });

  getInFlight(useAttachmentsStore).forEach((_count, path) =>
    taken.add(entryIdOf(path)),
  );

  return taken;
};

/**
 * Splits `paths` into the ones that may be attached and the ones that are
 * already on the message — a file can be attached to a message only once, and
 * identity is the host entryId, not the title (two folders can hold files with
 * the same name, and the same file can be reached under different titles).
 *
 * Both results are positions into `paths`, in input order, so callers can
 * carry their parallel arrays (inputs, leases, image flags) along.
 */
export const splitDuplicateAttachments = (
  useAttachmentsStore: AttachmentsStore,
  paths: string[],
): { keep: number[]; duplicates: number[] } => {
  const taken = collectAttachedPaths(useAttachmentsStore);
  const keep: number[] = [];
  const duplicates: number[] = [];

  paths.forEach((path, index) => {
    const entryId = entryIdOf(path);
    // Also de-duplicates within the batch itself: the first occurrence claims
    // the entry id, the rest are duplicates like any already attached file.
    if (taken.has(entryId)) {
      duplicates.push(index);
      return;
    }
    taken.add(entryId);
    keep.push(index);
  });

  return { keep, duplicates };
};

/**
 * Marks `paths` as being attached right now and returns the release. Hold them
 * for the whole round trip — releasing before the ref lands would reopen the
 * window a second attach of the same file could slip through.
 */
export const holdAttachPaths = (
  useAttachmentsStore: AttachmentsStore,
  paths: string[],
): (() => void) => {
  const inFlight = getInFlight(useAttachmentsStore);
  paths.forEach((path) => inFlight.set(path, (inFlight.get(path) ?? 0) + 1));

  let released = false;
  return () => {
    if (released) return;
    released = true;
    paths.forEach((path) => {
      const count = (inFlight.get(path) ?? 0) - 1;
      if (count > 0) inFlight.set(path, count);
      else inFlight.delete(path);
    });
  };
};
