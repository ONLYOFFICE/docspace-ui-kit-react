import type { Suggestion } from "@onlyoffice/ai-chat";

import type { SuggestedQuestion } from "./files";

/**
 * Suggestion chips per composer state. The host owns the texts; picking
 * between them belongs here, because only the provider sees the attachments
 * store — files can also arrive by drag-and-drop and be removed chip by chip,
 * neither of which the host observes.
 *
 * Precedence: an analyzable form wins over the plain file lists, and those win
 * over the section default. Files and images both count — an attached image
 * is what the user is asking about just as much as a document.
 */
export type SuggestionSet = {
  /** Nothing attached: chips for the current section (room / folder). */
  default: Suggestion[];
  /** Exactly one file or image attached. */
  singleFile?: Suggestion[];
  /** Two or more files/images attached. */
  multipleFiles?: Suggestion[];
  /**
   * At least one attached file the backend flagged as analyzable. Also what
   * stands in whenever the attach response brought no per-form questions of
   * its own — see {@link SuggestedQuestion}.
   */
  analyzableForm?: Suggestion[];
};

/**
 * The form the composer is analyzing, and the questions generated for it —
 * `null` while the long poll is still waiting, or once it gave up.
 */
export type AnalyzeState = {
  active: boolean;
  questions: SuggestedQuestion[] | null;
};

/**
 * The chips to show right now.
 *
 * `attachedFileIds` are the refs the composer holds (files and images alike)
 * and `analyzableIds` those of them the backend flagged as analyzable forms.
 *
 * A bare array is the host saying "these chips, whatever is attached", so it
 * is returned untouched — the set form is what opts into the switching.
 */
export const resolveSuggestions = (
  suggestions: Suggestion[] | SuggestionSet | undefined,
  attachedFileIds: string[],
  analyzableIds: string[],
  analyze?: AnalyzeState,
): Suggestion[] | undefined => {
  if (!suggestions || Array.isArray(suggestions)) return suggestions;

  // A message about one form's responses gets that form's own questions and
  // nothing else: the static chips ask about the document, which is not what
  // was asked for. Until the generation answers (or gives up) there is simply
  // nothing to show.
  if (analyze?.active) {
    return (analyze.questions ?? []).map(({ question, prompt }) => ({
      name: question,
      prompt,
    }));
  }

  // An analyzable form attached to an ordinary chat gets the host's static
  // form chips. Its generated questions belong to the analyze mode alone:
  // they are asked for per attachment and arrive over the socket, which is a
  // wait that only that mode explains to the user.
  if (attachedFileIds.some((id) => analyzableIds.includes(id))) {
    return suggestions.analyzableForm ?? suggestions.default;
  }
  if (attachedFileIds.length > 1) {
    return suggestions.multipleFiles ?? suggestions.default;
  }
  if (attachedFileIds.length === 1) {
    return suggestions.singleFile ?? suggestions.default;
  }
  return suggestions.default;
};
