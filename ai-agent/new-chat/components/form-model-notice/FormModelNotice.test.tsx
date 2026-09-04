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
