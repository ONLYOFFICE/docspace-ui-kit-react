import type { TFunction } from "i18next";

import { toastr } from "../../../components/toast";

import { CHAT_ATTACHMENT_LIMIT } from "./limits";

/**
 * A pick that produced no chip must not look like the action did nothing.
 * Both reasons are silent by design in the stores — the duplicate filter
 * drops the input before it is reserved, and the cap truncates the
 * reservation — so every attach entry point (picker, "Ask AI", device
 * upload, drag-and-drop) reports them here, with one wording and one
 * severity for all of them.
 */

/**
 * `count` host files were left out because the composer already holds them.
 *
 * The plural suffix is resolved at the call site rather than by i18next: the
 * locale scanner only finds keys written as literals, which is the same
 * convention the other plural pairs in `Common` follow.
 */
export const notifyAlreadyAttached = (t: TFunction, count: number) => {
  if (count <= 0) return;
  toastr.info(
    count === 1
      ? t("Common:AttachFilesAlreadyAttached_one", {
          count,
          defaultValue: "This file is already attached",
        })
      : t("Common:AttachFilesAlreadyAttached_other", {
          count,
          defaultValue: "{{count}} files are already attached",
        }),
  );
};

/**
 * `count` host files were left out because the composer is full.
 *
 * The copy states the rule rather than the number: what the user cannot see
 * is the cap, while the chips already show how many made it. It also keeps
 * the message free of `{{count}}` — with the locale scanner forcing literal
 * plural keys, any counted wording would read wrong for 2-4 items in the
 * Slavic locales.
 */
export const notifyAttachmentLimit = (t: TFunction, count: number) => {
  if (count <= 0) return;
  toastr.warning(
    t("Common:AttachFilesLimit", {
      limit: CHAT_ATTACHMENT_LIMIT,
      defaultValue: "You can attach up to {{limit}} files",
    }),
  );
};
