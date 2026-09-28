/**
 * Composer attachment cap. Mirrors `ATTACHMENT_LIMIT` in the widget's
 * attachments store. The store's `beginPendingAttachments` is the actual
 * enforcement point (it also counts uploads still in flight); this constant
 * exists for user-facing copy that quotes the number.
 *
 * Its own module so the toast helpers can quote it without pulling the chat
 * widget (and its CSS side effects) into every importer.
 */
export const CHAT_ATTACHMENT_LIMIT = 5;

/** The slice of the store state both cap checks below read. */
type BucketState = {
  attachmentFiles: unknown[];
  pendingAttachments: { kind: "file" | "image" }[];
};

/**
 * What the file bucket holds: the refs standing in it plus the placeholders of
 * the uploads still in flight — the same two things the store's own cap check
 * adds up. Images have their own bucket, but every host attach path reserves
 * `kind: "file"` (images are re-keyed only after the attach), so this is the
 * bucket a cap applies to.
 *
 * Read as the enforced cap right after a truncated reservation, and as the
 * current occupancy at any other time — see the two callers.
 */
const countFileBucket = (state: BucketState): number =>
  state.attachmentFiles.length +
  state.pendingAttachments.filter((p) => p.kind === "file").length;

/** Room left under a cap stricter than the widget's own. */
const freeSlots = (state: BucketState, limit: number): number =>
  Math.max(0, limit - countFileBucket(state));

/**
 * Complain loudly (once per session) when the copy's number and the cap the
 * widget enforces part ways, so the mismatch surfaces here instead of in a
 * support ticket.
 *
 * `ATTACHMENT_LIMIT` is module-private inside `@onlyoffice/ai-chat` — not on
 * the store state, not on the package's exports — so {@link
 * CHAT_ATTACHMENT_LIMIT} can only ever be a copy of it, and it is a copy the
 * user sees (the cap toast quotes it). `beginPendingAttachments` accepts
 * inputs while the bucket is below the cap, so the moment it refuses one the
 * bucket is exactly full and its occupancy *is* the cap — which is why this
 * may only be called right after a reservation the store truncated.
 */
let driftReported = false;
const warnOnAttachmentLimitDrift = (state: BucketState) => {
  if (driftReported) return;
  const enforced = countFileBucket(state);
  if (enforced === CHAT_ATTACHMENT_LIMIT) return;
  driftReported = true;
  console.warn(
    `[ai-chat] attachment cap drift: the widget enforces ${enforced}, ` +
      `CHAT_ATTACHMENT_LIMIT says ${CHAT_ATTACHMENT_LIMIT}. The cap toast ` +
      `is quoting the wrong number — update limits.ts.`,
  );
};

/** What a loading-chip reservation asks for. */
type PendingInput = {
  title: string;
  kind: "file" | "image";
  type?: number;
};

type ReservableStore = {
  getState: () => BucketState & {
    beginPendingAttachments: (inputs: PendingInput[]) => string[];
  };
};

/**
 * Reserve loading chips, and check the cap the store enforced while we are
 * standing on the one moment that reveals it.
 *
 * Every attach path reserves before it uploads, and each of them quotes the
 * cap back to the user when the reservation comes back short. Going through
 * here means the check cannot be forgotten at a new call site — which is the
 * only way this kind of guard stays true.
 *
 * `limit` is the cap in force where the chat is rendered: the Forms section
 * allows a single attachment (see `AttachmentLimitContext`), everywhere else
 * it is the widget's own {@link CHAT_ATTACHMENT_LIMIT}. A stricter cap is
 * applied here, before the store is asked, so the leases handed back are ones
 * the caller can actually settle.
 *
 * Returns the accepted leases, in input order, exactly as
 * `beginPendingAttachments` does: fewer ids than inputs means the tail was
 * refused for lack of room.
 */
export const reserveAttachmentChips = (
  useAttachmentsStore: ReservableStore,
  inputs: PendingInput[],
  limit: number = CHAT_ATTACHMENT_LIMIT,
): string[] => {
  const state = useAttachmentsStore.getState();

  // A host cap below the widget's own has to be applied before the
  // reservation: the store would happily hand out leases up to its 5, and a
  // lease we then dropped would leave a loading chip nobody settles.
  const asked =
    limit < CHAT_ATTACHMENT_LIMIT
      ? inputs.slice(0, freeSlots(state, limit))
      : inputs;

  if (asked.length === 0) return [];

  const pendingIds = state.beginPendingAttachments(asked);
  // Only the widget's own truncation says anything about its cap; ours says
  // what the host asked for.
  if (pendingIds.length < asked.length) {
    warnOnAttachmentLimitDrift(useAttachmentsStore.getState());
  }
  return pendingIds;
};
