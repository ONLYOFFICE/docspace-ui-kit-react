"use client";

import { createContext, useContext } from "react";

/**
 * Host-supplied wiring for the in-chat "use the tested model for form
 * results" notice. Everything here is optional: without a recommended model
 * the notice never shows, and without the dismissal pair it lasts for the
 * session only.
 */
export type FormsRecommendation = {
  /**
   * Model id the portal recommends for form-related tasks
   * (`TAIConfig.recommendedModelForForms`). Empty/undefined switches the
   * notice off.
   */
  recommendedModel?: string;
  /** The current user may change the agent's model — picks the admin copy. */
  canEditAgent?: boolean;
  /** Opens the agent's settings, where the model is chosen. */
  onOpenAgentEdit?: () => void;
  /**
   * Host-persisted dismissal (`chatRecommendedModelVisible` on the AI user
   * config). `false` hides the notice for good; omitted means the host does
   * not persist it and the close button only lasts the session.
   */
  noticeVisible?: boolean;
  /** Called when the user closes the notice, so the host can persist it. */
  onCloseNotice?: () => void;
};

export const FormsRecommendationContext = createContext<FormsRecommendation>(
  {},
);

/** Read the host wiring for the form model notice. */
export const useFormsRecommendation = (): FormsRecommendation =>
  useContext(FormsRecommendationContext);
