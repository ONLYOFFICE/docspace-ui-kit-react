import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

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
});
