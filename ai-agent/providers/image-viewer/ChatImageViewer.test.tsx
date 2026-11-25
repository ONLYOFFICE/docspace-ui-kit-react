import { beforeAll, describe, expect, it, vi } from "vitest";
import { render, waitFor } from "@testing-library/react";

import ChatImageViewer from ".";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const PNG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";

describe("ChatImageViewer", () => {
  beforeAll(() => {
    // jsdom has no matchMedia; the viewer asks it for the pointer's kind.
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
      })),
    );
  });

  it("draws the chat's picture in the media viewer", async () => {
    render(
      <ChatImageViewer
        request={{ src: PNG, title: "chart.png" }}
        onClose={() => {}}
      />,
    );

    await waitFor(() => {
      const image = document.querySelector(`img[src="${PNG}"]`);
      expect(image).not.toBeNull();
    });
  });
});
