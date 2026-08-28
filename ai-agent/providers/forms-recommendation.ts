/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

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
