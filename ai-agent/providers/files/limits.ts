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

/**
 * The cap the widget actually enforced, read back from the store.
 *
 * `ATTACHMENT_LIMIT` is module-private inside `@onlyoffice/ai-chat` — not on
 * the store state, not on the package's exports — so {@link
 * CHAT_ATTACHMENT_LIMIT} can only ever be a copy of it. It is a copy the user
 * sees (the cap toast quotes it), so a silent drift would put a wrong number
 * on screen while the store keeps enforcing the real one.
 *
 * `beginPendingAttachments` accepts inputs while the bucket is below the cap,
 * so the moment it refuses one, the bucket is exactly full: the refs plus the
 * placeholders standing in that bucket *are* the cap. Valid only right after
 * a truncated reservation — at any other time this is just the current count.
 */
const readEnforcedFileLimit = (state: {
  attachmentFiles: unknown[];
  pendingAttachments: { kind: "file" | "image" }[];
}): number =>
  state.attachmentFiles.length +
  state.pendingAttachments.filter((p) => p.kind === "file").length;

/**
 * Complain loudly (once per session) when the copy's number and the enforced
 * one part ways, so the mismatch surfaces here instead of in a support
 * ticket. Call it only after a reservation that was truncated.
 */
let driftReported = false;
const warnOnAttachmentLimitDrift = (state: {
  attachmentFiles: unknown[];
  pendingAttachments: { kind: "file" | "image" }[];
}) => {
  if (driftReported) return;
  const enforced = readEnforcedFileLimit(state);
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
  getState: () => {
    attachmentFiles: unknown[];
    pendingAttachments: { kind: "file" | "image" }[];
    beginPendingAttachments: (inputs: PendingInput[]) => string[];
  };
};

/**
 * Reserve loading chips, and check the cap the store enforced while we are
 * standing on the one moment that reveals it.
 *
 * Every attach path reserves before it uploads, and each of them quotes
 * {@link CHAT_ATTACHMENT_LIMIT} back to the user when the reservation comes
 * back short. Going through here means the check cannot be forgotten at a new
 * call site — which is the only way this kind of guard stays true.
 *
 * Returns the accepted leases, in input order, exactly as
 * `beginPendingAttachments` does: fewer ids than inputs means the tail was
 * refused for lack of room.
 */
export const reserveAttachmentChips = (
  useAttachmentsStore: ReservableStore,
  inputs: PendingInput[],
): string[] => {
  const pendingIds = useAttachmentsStore
    .getState()
    .beginPendingAttachments(inputs);
  if (pendingIds.length < inputs.length) {
    warnOnAttachmentLimitDrift(useAttachmentsStore.getState());
  }
  return pendingIds;
};
