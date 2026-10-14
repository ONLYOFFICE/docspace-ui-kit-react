import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";

import { ColumnarInfoBar } from "./ColumnarInfoBar";

const columns = [
  { label: "Name", value: "John Smith" },
  { label: "Email", value: "john@example.com" },
  { label: "Status", value: "Active" },
];

describe("ColumnarInfoBar", () => {
  it("renders all column labels and values", () => {
    render(<ColumnarInfoBar columns={columns} />);

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("John Smith")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it.each(["default", "neutral", "page"] as const)(
    "renders the pairs as a description list (%s variant)",
    (variant) => {
      const { container } = render(
        <ColumnarInfoBar columns={columns} variant={variant} />,
      );

      expect(container.querySelector("dl")).not.toBeNull();
      const terms = screen.getAllByRole("term");
      expect(terms.map((t) => t.textContent)).toEqual([
        "Name",
        "Email",
        "Status",
      ]);
      expect(terms[0].nextElementSibling?.tagName).toBe("DD");
      expect(terms[0].nextElementSibling).toHaveTextContent("John Smith");
    },
  );

  it.each(["default", "neutral"] as const)(
    "announces its content through a status region (%s variant)",
    async (variant) => {
      render(<ColumnarInfoBar columns={columns} variant={variant} />);
      await waitFor(() =>
        expect(screen.getByRole("status")).toHaveTextContent(
          "Name John Smith Email john@example.com Status Active",
        ),
      );
    },
  );

  // The server renders the first render only, and the client's first render
  // matches it: the region is in it, empty, and the text arrives a moment
  // later as a change to a region already on the page. The content itself is
  // drawn at once.
  it("mounts the live region empty and fills it a moment later", async () => {
    const host = document.createElement("div");
    host.innerHTML = renderToStaticMarkup(
      <ColumnarInfoBar headerText="Details" columns={columns} />,
    );
    const region = host.querySelector('[role="status"]');
    expect(region).not.toBeNull();
    expect(region).toBeEmptyDOMElement();

    render(<ColumnarInfoBar headerText="Details" columns={columns} />);
    expect(screen.getByRole("heading", { name: "Details" })).toBeVisible();
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent("Details"),
    );
  });

  it("announces a change of its content", async () => {
    const { rerender } = render(
      <ColumnarInfoBar headerText="Details" columns={columns} />,
    );
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent("Details"),
    );

    rerender(<ColumnarInfoBar headerText="Updated" columns={columns} />);
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent("Updated"),
    );
  });

  it("is not a live region in the page variant", () => {
    render(<ColumnarInfoBar columns={columns} variant="page" />);
    expect(screen.queryByRole("status")).toBeNull();
  });

  it.each(["default", "neutral", "page"] as const)(
    "renders headerText as a level-3 heading (%s variant)",
    (variant) => {
      render(
        <ColumnarInfoBar
          columns={columns}
          headerText="Your profile details"
          variant={variant}
        />,
      );
      expect(
        screen.getByRole("heading", { level: 3, name: "Your profile details" }),
      ).toBeInTheDocument();
    },
  );

  it.each(["default", "neutral", "page"] as const)(
    "does not render a header when headerText is omitted (%s variant)",
    (variant) => {
      render(<ColumnarInfoBar columns={columns} variant={variant} />);
      expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    },
  );

  it("renders close button when onAction is provided", () => {
    render(<ColumnarInfoBar columns={columns} onAction={vi.fn()} />);
    expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
  });

  it.each(["default", "page"] as const)(
    "labels the close button with closeLabel (%s variant)",
    (variant) => {
      render(
        <ColumnarInfoBar
          columns={columns}
          onAction={vi.fn()}
          closeLabel="Fermer"
          variant={variant}
        />,
      );
      expect(
        screen.getByRole("button", { name: "Fermer" }),
      ).toBeInTheDocument();
    },
  );

  it("defaults the close button label to Close", () => {
    render(<ColumnarInfoBar columns={columns} onAction={vi.fn()} />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-label", "Close");
  });

  it("does not render close button when onAction is omitted", () => {
    render(<ColumnarInfoBar columns={columns} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("calls onAction when close button is clicked", () => {
    const onAction = vi.fn();
    render(<ColumnarInfoBar columns={columns} onAction={onAction} />);

    fireEvent.click(screen.getByRole("button", { name: /close/i }));

    expect(onAction).toHaveBeenCalledOnce();
  });

  it("calls onLoad on mount", () => {
    const onLoad = vi.fn();
    render(<ColumnarInfoBar columns={columns} onLoad={onLoad} />);
    expect(onLoad).toHaveBeenCalledOnce();
  });

  it("renders ReactNode values inside columns", () => {
    const columnsWithNode = [
      {
        label: "Status",
        value: <span data-testid="status-badge">200 OK</span>,
      },
    ];
    render(<ColumnarInfoBar columns={columnsWithNode} />);
    expect(screen.getByTestId("status-badge")).toBeInTheDocument();
  });

  it.each(["default", "neutral"] as const)(
    "keeps the close button out of the status live region (%s variant)",
    (variant) => {
      render(
        <ColumnarInfoBar
          columns={columns}
          onAction={vi.fn()}
          variant={variant}
        />,
      );
      const button = screen.getByRole("button", { name: /close/i });

      expect(screen.getByRole("status")).not.toContainElement(button);
    },
  );

  it("defaults the close button label to the translated Common:CloseButton", () => {
    const win = window as unknown as { i18n?: unknown };
    const saved = win.i18n;
    win.i18n = {
      loaded: { "en/Common.json": { data: { CloseButton: "Schliessen" } } },
    };
    try {
      render(<ColumnarInfoBar columns={columns} onAction={vi.fn()} />);
      expect(
        screen.getByRole("button", { name: "Schliessen" }),
      ).toBeInTheDocument();
    } finally {
      win.i18n = saved;
    }
  });
});
