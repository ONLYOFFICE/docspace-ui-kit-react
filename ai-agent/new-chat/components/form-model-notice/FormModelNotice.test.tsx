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

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import {
  FormsRecommendationContext,
  type FormsRecommendation,
} from "../../../providers/forms-recommendation";

const state = { hasForm: false, modelId: "openai/gpt-5" };

vi.mock("../../../providers/files/use-has-form-attached", () => ({
  useHasFormAttached: () => state.hasForm,
}));

vi.mock("@onlyoffice/ai-chat", () => ({
  useStores: () => ({
    useProfilesStore: <T,>(selector: (s: unknown) => T) =>
      selector({
        sessionChatProfile: { modelId: state.modelId },
        chatProfile: null,
        defaultProfile: null,
      }),
  }),
}));

// The notice itself is the shared RecomendedModel; what belongs to this
// component is when it appears and with which props.
vi.mock("../../../recomended-model", () => ({
  default: (props: {
    isAdmin: boolean;
    selectedModel: string;
    recomendedModel: string;
    onClose?: () => void;
  }) => (
    <button
      type="button"
      data-testid="recomended-model"
      data-is-admin={String(props.isAdmin)}
      data-selected-model={props.selectedModel}
      data-recomended-model={props.recomendedModel}
      onClick={props.onClose}
    >
      notice
    </button>
  ),
}));

import { FormModelNotice } from "./index";

const renderNotice = (recommendation: FormsRecommendation) =>
  render(
    <FormsRecommendationContext.Provider value={recommendation}>
      <FormModelNotice />
    </FormsRecommendationContext.Provider>,
  );

const wiring: FormsRecommendation = {
  recommendedModel: "qwen/qwen3.5-122b-a10b",
  canEditAgent: true,
};

describe("<FormModelNotice />", () => {
  beforeEach(() => {
    state.hasForm = true;
    state.modelId = "openai/gpt-5";
  });

  it("renders while the composer carries a form", () => {
    renderNotice(wiring);

    const notice = screen.getByTestId("recomended-model");
    expect(notice.dataset.recomendedModel).toBe("qwen/qwen3.5-122b-a10b");
    expect(notice.dataset.selectedModel).toBe("openai/gpt-5");
    // A user who may edit the agent gets the admin copy.
    expect(notice.dataset.isAdmin).toBe("true");
  });

  it("stays away when no form is attached", () => {
    state.hasForm = false;

    renderNotice(wiring);

    expect(screen.queryByTestId("recomended-model")).toBeNull();
  });

  it("stays away when the host configured no recommended model", () => {
    renderNotice({ canEditAgent: true });

    expect(screen.queryByTestId("recomended-model")).toBeNull();
  });

  it("stays away once the user dismissed it for good", () => {
    renderNotice({ ...wiring, noticeVisible: false });

    expect(screen.queryByTestId("recomended-model")).toBeNull();
  });

  it("hides on close and reports it so the host can persist it", () => {
    const onCloseNotice = vi.fn();

    renderNotice({ ...wiring, onCloseNotice });

    fireEvent.click(screen.getByTestId("recomended-model"));

    expect(onCloseNotice).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId("recomended-model")).toBeNull();
  });
});
