import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

import { AnalyzeBanner } from "./index";

const store: { isAnalyzeMode: boolean; analyzeFormTitle: string } = {
  isAnalyzeMode: false,
  analyzeFormTitle: "",
};

vi.mock("../../../providers/ai-chat-store/AiChatStoreProvider", () => ({
  useAiChatStoreOptional: () => store,
}));

vi.mock("../../../../utils/i18n", () => ({
  useCommonTranslation: () => (key: string, options?: { fileName?: string }) =>
    `${key}:${options?.fileName ?? ""}`,
}));

describe("<AnalyzeBanner />", () => {
  beforeEach(() => {
    store.isAnalyzeMode = false;
    store.analyzeFormTitle = "";
  });

  it("Analyzing a form: the bar names the form", () => {
    store.isAnalyzeMode = true;
    store.analyzeFormTitle = "Leave request.pdf";

    render(<AnalyzeBanner />);

    const banner = screen.getByTestId("analyze-banner");
    expect(banner).toHaveTextContent("AnalyzeModeBanner:Leave request.pdf");
    // A long name is cut by the bar; the full one stays on hover.
    expect(screen.getByTitle("Leave request.pdf")).toBeInTheDocument();
  });

  it("An ordinary chat: no bar", () => {
    render(<AnalyzeBanner />);

    expect(screen.queryByTestId("analyze-banner")).not.toBeInTheDocument();
  });
});
