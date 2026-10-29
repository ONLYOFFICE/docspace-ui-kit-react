import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";

import McpServers from "./index";

const pageProps = vi.fn();

vi.mock("@onlyoffice/ai-chat", () => ({
  McpServersPage: (props: Record<string, unknown>) => {
    pageProps(props);
    return <div data-testid="mcp-servers-page" />;
  },
}));

describe("McpServers", () => {
  beforeEach(() => {
    pageProps.mockClear();
  });

  // The demo portal keeps one disabled list for both scopes, so no story can
  // tell them apart; this is the only check that the scope reaches the page.
  it("passes the tenant scope through to the page", () => {
    render(<McpServers toolPrefsScope="tenant" />);

    expect(pageProps).toHaveBeenCalledWith(
      expect.objectContaining({ toolPrefsScope: "tenant" }),
    );
  });

  // Omitted, the library falls back to the viewer's own list - never the
  // portal-wide one (Bug 84381).
  it("leaves the scope unset when none is given", () => {
    render(<McpServers />);

    expect(pageProps.mock.lastCall?.[0].toolPrefsScope).toBeUndefined();
  });

  it("renders the page without its own header and padding", () => {
    render(<McpServers />);

    expect(pageProps).toHaveBeenCalledWith(
      expect.objectContaining({ hideHeader: true, noPadding: true }),
    );
  });
});
