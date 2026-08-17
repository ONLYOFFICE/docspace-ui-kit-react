import { describe, it, expect, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";

import { CommonTrans } from "./CommonTrans";

type MutableWindow = Omit<typeof window, "i18n"> & { i18n?: unknown };

const identityT = (key: string) => key;

const setTranslations = (data: Record<string, string>) => {
  (window as MutableWindow).i18n = {
    t: identityT,
    instance: { language: "en" },
    loaded: {
      "/locales/en/Common.json": { data },
    },
  };
};

describe("CommonTrans", () => {
  afterEach(() => {
    delete (window as MutableWindow).i18n;
  });

  it("interpolates values inside a numbered tag when a component is provided", () => {
    setTranslations({
      MessageExported: "Message exported to file: <1>{{fileName}}</1>",
    });

    render(
      <CommonTrans
        i18nKey="MessageExported"
        values={{ fileName: "report.docx" }}
        components={{ 1: <strong /> }}
      />,
    );

    expect(screen.getByText("report.docx")).toBeInTheDocument();
  });

  it("interpolates values inside a numbered tag when no component is provided", () => {
    setTranslations({
      MessageExported: "Message exported to file: <1>{{fileName}}</1>",
    });

    const { container } = render(
      <CommonTrans
        i18nKey="MessageExported"
        values={{ fileName: "report.docx" }}
      />,
    );

    expect(container.textContent).toBe(
      "Message exported to file: report.docx",
    );
  });

  it("keeps the raw placeholder only when the value is truly missing", () => {
    setTranslations({
      MessageExported: "Message exported to file: <1>{{fileName}}</1>",
    });

    const { container } = render(<CommonTrans i18nKey="MessageExported" />);

    expect(container.textContent).toBe(
      "Message exported to file: {{fileName}}",
    );
  });
});
