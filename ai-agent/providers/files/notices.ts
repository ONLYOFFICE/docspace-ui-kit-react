import type { TFunction } from "i18next";

import { toastr } from "../../../components/toast";

import { DEFAULT_ATTACHMENT_CAP, type AttachmentCap } from "./attachment-limit";

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
 *
 * Which rule is in force decides the wording, because "only one file" on its
 * own reads as arbitrary. A one-file cap is either the message being about a
 * form's responses or the section working a file at a time, and each says so
 * and names the way out (send, or remove the chip). The default cap just
 * quotes its number.
 */
export const notifyAttachmentLimit = (
  t: TFunction,
  count: number,
  cap: AttachmentCap = DEFAULT_ATTACHMENT_CAP,
) => {
  if (count <= 0) return;

  // Not a cap at all, but the same refusal from the user's side: the chat is
  // mid-answer about the form it is analyzing, and picking a new subject now
  // would re-point it under the reply still arriving.
  if (cap.reason === "busy") {
    toastr.info(
      t("Common:AttachFilesAnalyzingBusy", {
        defaultValue:
          "Wait for the current answer to finish before analyzing another form.",
      }),
    );
    return;
  }

  if (cap.reason === "analyze") {
    // The name is what makes this explainable, so when the host sent none
    // (an attach that reported no title) the sentence drops the slot rather
    // than printing a hole where the form should be.
    toastr.info(
      cap.fileName
        ? t("Common:AttachFilesAnalyzingForm", {
            fileName: cap.fileName,
            defaultValue:
              "Analyze responses is on: this chat works with {{fileName}} only. Start a new chat to attach other files.",
          })
        : t("Common:AttachFilesAnalyzingFormUnnamed", {
            defaultValue:
              "Analyze responses is on: this chat works with one form only. Start a new chat to attach other files.",
          }),
    );
    return;
  }

  if (cap.limit === 1) {
    toastr.warning(
      t("Common:AttachFilesLimitOne", {
        defaultValue:
          "This chat works with one file at a time. Remove the attached file to add another.",
      }),
    );
    return;
  }

  toastr.warning(
    t("Common:AttachFilesLimit", {
      limit: cap.limit,
      defaultValue: "You can attach up to {{limit}} files",
    }),
  );
};
