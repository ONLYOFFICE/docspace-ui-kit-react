import { describe, it, expect, vi } from "vitest";
import { screen, render, waitFor } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";

import { LoaderTypes } from "./Loader.enums";

import { Loader } from ".";

const baseProps = {
  type: LoaderTypes.base,
  color: "black",
  size: "18px",
  label: "Loading",
};

describe("<Loader />", () => {
  it("renders without error", () => {
    render(<Loader {...baseProps} />);
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("renders base type with text", () => {
    render(<Loader {...baseProps} />);
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("renders oval type", () => {
    render(<Loader {...baseProps} type={LoaderTypes.oval} />);
    expect(screen.getByTestId("loader")).toBeInTheDocument();
    expect(screen.getByTestId("oval-loader")).toBeInTheDocument();
  });

  it("renders dual-ring type", () => {
    render(<Loader {...baseProps} type={LoaderTypes.dualRing} />);
    expect(screen.getByTestId("loader")).toBeInTheDocument();
    expect(screen.getByTestId("dual-ring-loader")).toBeInTheDocument();
  });

  it("renders rombs type", () => {
    render(<Loader {...baseProps} type={LoaderTypes.rombs} />);
    expect(screen.getByTestId("loader")).toBeInTheDocument();
    expect(screen.getByTestId("rombs-loader")).toBeInTheDocument();
  });

  it("renders track type", () => {
    render(<Loader {...baseProps} type={LoaderTypes.track} />);
    expect(screen.getByTestId("loader")).toBeInTheDocument();
    expect(screen.getByTestId("track-loader")).toBeInTheDocument();
  });

  it("accepts custom className", () => {
    render(<Loader {...baseProps} className="custom-loader" />);
    expect(screen.getByTestId("loader")).toHaveClass("custom-loader");
  });

  it("accepts custom style", () => {
    const customStyle = { marginTop: "20px" };
    render(<Loader {...baseProps} style={customStyle} />);
    expect(screen.getByTestId("loader")).toHaveStyle(customStyle);
  });

  it("accepts custom id", () => {
    render(<Loader {...baseProps} id="custom-loader" />);
    expect(screen.getByTestId("loader")).toHaveAttribute("id", "custom-loader");
  });

  it("is a status region whose text is the label", async () => {
    render(<Loader type={LoaderTypes.oval} label="Fetching files" />);
    const status = screen.getByRole("status");
    await waitFor(() =>
      expect(screen.getByTestId("loader-label")).toHaveTextContent(
        "Fetching files",
      ),
    );
    expect(status).toContainElement(screen.getByTestId("loader-label"));
    expect(status).not.toHaveAttribute("aria-busy");
    expect(screen.getByTestId("oval-loader")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  // The server renders the first render only, and the client's first render
  // matches it: the region's hidden label is in it, empty, and the label
  // arrives a moment later as a change to a region already on the page.
  it.each([LoaderTypes.oval, LoaderTypes.base])(
    "mounts the %s status label empty and fills it a moment later",
    async (type) => {
      const host = document.createElement("div");
      host.innerHTML = renderToStaticMarkup(
        <Loader type={type} label="Fetching files" />,
      );
      expect(
        host.querySelector('[data-testid="loader-label"]'),
      ).toBeEmptyDOMElement();

      render(<Loader type={type} label="Fetching files" />);
      expect(screen.getByTestId("loader-label")).toBeEmptyDOMElement();
      await waitFor(() =>
        expect(screen.getByTestId("loader-label")).toHaveTextContent(
          "Fetching files",
        ),
      );
    },
  );

  it("draws the base type's text at once, hidden from assistive technology", () => {
    render(<Loader type={LoaderTypes.base} label="Fetching files" />);
    const drawn = screen.getByText("Fetching files");
    expect(drawn.closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it("reads the label for rombs too", async () => {
    render(<Loader type={LoaderTypes.rombs} label="Starting" />);
    await waitFor(() =>
      expect(screen.getByTestId("loader-label")).toHaveTextContent("Starting"),
    );
  });

  it("has no built-in English title and a default label", async () => {
    render(<Loader type={LoaderTypes.dualRing} />);
    expect(document.querySelector("title")).toBeNull();
    await waitFor(() =>
      expect(screen.getByTestId("loader-label")).toHaveTextContent(
        "Loading...",
      ),
    );
  });

  it("draws the oval when no type is given", () => {
    render(<Loader />);
    expect(screen.getByTestId("oval-loader")).toBeInTheDocument();
  });

  // Inside a button the status text would join the button's name, and a
  // button's children are presentational anyway: the host says it is busy.
  it("adds nothing to the accessibility tree when decorative", () => {
    render(
      <button type="button">
        Save
        <Loader type={LoaderTypes.track} isDecorative />
      </button>,
    );

    expect(screen.queryByRole("status")).toBeNull();
    expect(screen.queryByTestId("loader-label")).toBeNull();
    expect(screen.getByTestId("loader")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("button")).toHaveAccessibleName("Save");
  });

  // A list of busy rows renders one decorative loader each.
  it("schedules no live-region timer when it is decorative", () => {
    vi.useFakeTimers();
    try {
      render(<Loader type={LoaderTypes.track} isDecorative />);
      expect(vi.getTimerCount()).toBe(0);
    } finally {
      vi.useRealTimers();
    }
  });

  // A standalone npm consumer mounts no TranslationProvider.
  it("logs no error and falls back to English without translations", async () => {
    const win = window as unknown as { i18n?: unknown };
    const saved = win.i18n;
    delete win.i18n;
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      expect(win.i18n).toBeUndefined();
      render(<Loader />);
      await waitFor(() =>
        expect(screen.getByRole("status")).toHaveTextContent("Loading..."),
      );
      expect(error).not.toHaveBeenCalled();
    } finally {
      error.mockRestore();
      win.i18n = saved;
    }
  });
});
