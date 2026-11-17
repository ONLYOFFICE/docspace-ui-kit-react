import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";

vi.mock("@onlyoffice/ai-chat", () => ({
  useStores: () => ({ useAttachmentsStore: { getState: () => ({}) } }),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: { defaultValue?: string }) =>
      options?.defaultValue ?? key,
  }),
}));

vi.mock("../../hooks/useGetIcon", () => ({
  default: () => ({ getIcon: () => "" }),
}));

vi.mock("../../../providers/api", () => ({
  useApi: () => ({ filesApi: {}, aiApi: {} }),
}));

type HeaderProps = {
  headerLabel: string;
  onCloseClick: () => void;
  isCloseable?: boolean;
};
let selectorProps:
  (Record<string, unknown> & { headerProps?: HeaderProps }) | null = null;

vi.mock("../../../selectors/Files", () => ({
  default: (props: Record<string, unknown>) => {
    selectorProps = props;
    return <div data-testid="files-selector" />;
  },
}));

import AttachDialog from "./attach-dialog";
import SaveDialog from "./save-dialog";

const selector = () => {
  if (!selectorProps) throw new Error("selector not rendered");
  return selectorProps;
};

// Without a header of their own the root crumb stood in the title's place
// and the panel had no close button, unlike the product's other selectors.
describe("the chat's file selectors", () => {
  beforeEach(() => {
    selectorProps = null;
  });

  it("titles the storage picker and closes it from its header", () => {
    const onClose = vi.fn();
    render(<AttachDialog onClose={onClose} />);
    expect(selector().withHeader).toBe(true);
    expect(selector().headerProps).toEqual({
      headerLabel: "Select files",
      onCloseClick: onClose,
      isCloseable: true,
    });
  });

  it("titles the folder picker of a saved message and closes it from its header", () => {
    const onFinish = vi.fn();
    render(
      <SaveDialog
        content="text"
        defaultName="Reply.docx"
        onFinish={onFinish}
      />,
    );
    expect(selector().withHeader).toBe(true);
    expect(selector().headerProps).toEqual({
      headerLabel: "Select folder",
      onCloseClick: onFinish,
      isCloseable: true,
    });
  });
});
