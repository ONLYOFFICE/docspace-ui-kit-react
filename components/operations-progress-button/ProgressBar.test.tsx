import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { ProgressBar } from "./ProgressBar";
import styles from "./OperationsProgressButton.module.scss";

describe("<ProgressBar /> row of OperationsProgressButton", () => {
  const renderRow = (onOpenPanel?: () => void) =>
    render(
      <ProgressBar
        label="Moving folder"
        percent={40}
        alert={false}
        completed={false}
        open={false}
        operation="move"
        icon={<svg />}
        onOpenPanel={onOpenPanel}
      />,
    );

  it("opens the panel once when its icon is clicked", () => {
    const onOpenPanel = vi.fn();
    renderRow(onOpenPanel);

    fireEvent.click(screen.getByTestId("icon-button"));

    expect(onOpenPanel).toHaveBeenCalledTimes(1);
  });

  it("opens the panel once when its label is clicked", () => {
    const onOpenPanel = vi.fn();
    renderRow(onOpenPanel);

    fireEvent.click(screen.getByText("Moving folder"));

    expect(onOpenPanel).toHaveBeenCalledTimes(1);
  });

  it("gives the label its header class", () => {
    renderRow(vi.fn());

    const label = screen.getByText("Moving folder");
    expect(label).toHaveClass(styles.progressHeader);
    expect(label).toHaveClass(styles.withClick);
  });
});
