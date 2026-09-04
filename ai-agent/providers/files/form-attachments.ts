import type { useStores } from "@onlyoffice/ai-chat";

type AttachmentsStore = ReturnType<typeof useStores>["useAttachmentsStore"];

/**
 * Whether a host file is a form the chat can actually talk about: a DocSpace
 * PDF form (`isForm`) whose responses are collected in a table
 * (`externalDbTableName`, the form's table in the external database).
 *
 * A form without that table has no answers to discuss — the recommendation
 * about the model tested on form results would be noise on it.
 */
export const hasFormResults = (item: {
  isForm?: boolean | null;
  externalDbTableName?: string | null;
}) => !!item.isForm && !!item.externalDbTableName;

type FormRegistry = {
  /** Ids of the attachment refs that came from a DocSpace PDF form. */
  ids: Set<string>;
  /** Bumped on every change so `useSyncExternalStore` re-reads. */
  version: number;
  listeners: Set<() => void>;
};

/**
 * Which of the current draft's attachments are forms, per attachments store.
 *
 * Form-ness is a property of the host file (`isForm` plus the results table,
 * see {@link hasFormResults}), and the attachments store keeps only
 * `{id, title, kind, path, type}` per ref — so, like `canAnalyze`, it has
 * nowhere to live but here. Kept out of React state because every attach
 * entry point (context menu, picker, drag-and-drop) writes it from a plain
 * async function.
 */
const registries = new WeakMap<object, FormRegistry>();

export const getFormRegistry = (
  useAttachmentsStore: AttachmentsStore,
): FormRegistry => getRegistry(useAttachmentsStore);

const getRegistry = (useAttachmentsStore: AttachmentsStore): FormRegistry => {
  let registry = registries.get(useAttachmentsStore);
  if (!registry) {
    registry = { ids: new Set<string>(), version: 0, listeners: new Set() };
    registries.set(useAttachmentsStore, registry);
  }
  return registry;
};

/** Records the freshly attached refs that are DocSpace forms. */
export const rememberFormAttachments = (
  useAttachmentsStore: AttachmentsStore,
  ids: string[],
) => {
  if (ids.length === 0) return;

  const registry = getRegistry(useAttachmentsStore);
  const added = ids.filter((id) => !registry.ids.has(id));
  if (added.length === 0) return;

  added.forEach((id) => registry.ids.add(id));
  registry.version += 1;
  registry.listeners.forEach((listener) => listener());
};
