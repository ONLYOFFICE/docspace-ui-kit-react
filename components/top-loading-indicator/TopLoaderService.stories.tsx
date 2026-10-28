import { useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, waitFor } from "storybook/test";

import { TopLoaderService } from "./index";

const meta = {
  title: "UI/Feedback/TopLoader",
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
} satisfies Meta;

type Story = StoryObj;

export default meta;

const DefaultTemplate = () => {
  useEffect(() => {
    const progressBar = document.createElement("div");
    progressBar.id = "ipl-progress-indicator";
    progressBar.style.position = "fixed";
    progressBar.style.top = "0";
    progressBar.style.left = "0";
    progressBar.style.height = "2px";
    progressBar.style.backgroundColor = "#2DA7DB";
    progressBar.style.transition = "width 0.2s ease-in-out";
    document.body.appendChild(progressBar);

    return () => {
      TopLoaderService.cancel();
      if (document.body.contains(progressBar)) {
        document.body.removeChild(progressBar);
      }
    };
  }, []);

  return (
    <div style={{ display: "flex", gap: "10px", padding: "20px" }}>
      <button type="button" onClick={() => TopLoaderService.start()}>
        Start Loading
      </button>
      <button type="button" onClick={() => TopLoaderService.end()}>
        End Loading
      </button>
      <button type="button" onClick={() => TopLoaderService.cancel()}>
        Cancel
      </button>
    </div>
  );
};

// The bar lives on the page body, outside the story root.
const valueNow = (bar: HTMLElement) =>
  Number(bar.getAttribute("aria-valuenow"));

export const Default: Story = {
  render: () => <DefaultTemplate />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(
      canvas.getByRole("button", { name: "Start Loading" }),
    );
    // The first start makes the element a progress bar.
    const bar = screen.getByRole("progressbar");
    await expect(bar).toHaveAttribute("data-test-id", "top-loader");
    await waitFor(() => expect(valueNow(bar)).toBeGreaterThan(10));

    // Cancel clears it at once.
    await userEvent.click(canvas.getByRole("button", { name: "Cancel" }));
    await expect(bar.style.width).toBe("0px");
    await expect(valueNow(bar)).toBe(0);

    // End runs it to the full width, then clears it.
    await userEvent.click(
      canvas.getByRole("button", { name: "Start Loading" }),
    );
    await waitFor(() => expect(valueNow(bar)).toBeGreaterThan(10));
    await userEvent.click(canvas.getByRole("button", { name: "End Loading" }));
    await waitFor(() => expect(valueNow(bar)).toBeGreaterThan(90));
    await waitFor(() => expect(bar.style.width).toBe("0px"), { timeout: 2000 });
  },
  parameters: {
    docs: {
      description: {
        story:
          "Press **Start Loading** and a thin bar grows along the top of the viewport and stops at 90%; **End Loading** runs it to the full width and clears it, **Cancel** clears it at once (\`start\`, \`end\`, \`cancel\`). Use it to see how long a wait looks before the work finishes.",
      },
      source: {
        code: `// Add to HTML: <div id="ipl-progress-indicator" />

// Start loading
TopLoaderService.start();

// Complete loading
TopLoaderService.end();

// Cancel loading
TopLoaderService.cancel();`,
      },
    },
  },
};

// A different id from the service's, so the Docs page does not drive this bar from Default.
const useProgressBar = (styles: Partial<CSSStyleDeclaration>) => {
  useEffect(() => {
    const bar = document.createElement("div");
    bar.id = "top-loader-css-customization-demo";
    Object.assign(bar.style, styles);
    document.body.appendChild(bar);
    return () => {
      if (document.body.contains(bar)) document.body.removeChild(bar);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

const CssCustomizationTemplate = () => {
  useProgressBar({
    position: "fixed",
    top: "0",
    left: "0",
    width: "65%",
    height: "4px",
    backgroundColor: "#0082c9",
    borderRadius: "0 2px 2px 0",
    boxShadow: "0 0 8px rgba(0, 130, 201, 0.5)",
    zIndex: "9999",
    transition: "width 0.2s ease-in-out",
  });

  return (
    <div style={{ padding: "40px 20px" }}>
      <p style={{ margin: 0, fontSize: "13px", color: "#555" }}>
        Progress bar at 65% — a static visual demo of the styles you would apply
        to <code>#ipl-progress-indicator</code> (rendered here under a different
        id so it doesn't collide with the live bar in the Default story)
      </p>
      <p style={{ marginTop: "8px", fontSize: "12px", color: "#888" }}>
        Customizable properties: <strong>height</strong>,{" "}
        <strong>backgroundColor</strong>, <strong>borderRadius</strong>,{" "}
        <strong>boxShadow</strong>, <strong>transition</strong>,{" "}
        <strong>zIndex</strong>
      </p>
    </div>
  );
};

export const CssCustomization: Story = {
  render: () => <CssCustomizationTemplate />,
  play: async () => {
    const bar = document.getElementById(
      "top-loader-css-customization-demo",
    ) as HTMLElement;
    await expect(bar.style.width).toBe("65%");
    await expect(getComputedStyle(bar).height).toBe("4px");
    await expect(getComputedStyle(bar).backgroundColor).toBe(
      "rgb(0, 130, 201)",
    );
    // Not driven by the service.
    await expect(bar).not.toHaveAttribute("role");
  },
  parameters: {
    docs: {
      description: {
        story: `\`TopLoaderService\` defines no CSS custom properties -- the element's own style does all of it, as the recipe "The element, and its style" on this page describes.
This story renders a static demo bar under a different id, purely for visual reference -- it is not driven by \`TopLoaderService\`.`,
      },
      source: {
        code: `<div
  id="ipl-progress-indicator"
  style={{
    position: "fixed",
    top: 0,
    insetInlineStart: 0,
    width: 0,
    height: 4,
    backgroundColor: "#0082c9",
    borderRadius: "0 2px 2px 0",
    boxShadow: "0 0 8px rgba(0, 130, 201, 0.5)",
    transition: "width 0.2s ease-in-out",
    zIndex: 9999,
  }}
/>`,
      },
    },
  },
};
