import type { CSSProperties, ComponentProps } from "react";
import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";

import { Backdrop } from ".";
import type { BackdropProps } from "./Backdrop.types";
import { Button, ButtonSize } from "../button";

const meta = {
  title: "UI/Overlays/Backdrop",
  component: Backdrop,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    visible: {
      control: false,
      description:
        "Whether the layer is rendered at all. It is not a CSS switch: a backdrop that is not visible renders nothing.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    zIndex: {
      control: "number",
      description:
        "Stacking order of the layer. The component it covers needs a higher one.",
      table: {
        defaultValue: { summary: "203" },
      },
    },
    withBackground: {
      control: "boolean",
      description:
        "Dims the page. Without it the layer is transparent and only catches clicks — except on a viewport of 600px or less, where it dims anyway.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withoutBackground: {
      control: "boolean",
      description:
        "Keeps the layer transparent on every screen size, even when `withBackground` or `isAside` is set.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isAside: {
      control: "boolean",
      description:
        "Marks the layer as a side panel's. It dims the page and renders whatever other backdrops are already on screen.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isModalDialog: {
      control: "boolean",
      description:
        "Lets touch scrolling through the backdrop go on as usual. Without it a touch move over the layer has its default action prevented.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    shouldShowBackdrop: {
      control: "boolean",
      description:
        "Renders the layer even when another backdrop is already on screen, which would otherwise suppress it.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    onClick: {
      control: false,
      description:
        "Called on a click, and on a touch move or touch end, which pass a touch event cast to a mouse event.",
    },
    className: {
      control: "text",
      description: "Extra class name, or an array of them, for the layer.",
    },
    id: {
      control: "text",
      description: "HTML id of the layer.",
    },
    style: {
      control: "object",
      description:
        "Inline styles for the layer. A `zIndex` here wins over the prop.",
    },
  },
} satisfies Meta<typeof Backdrop>;

type Story = StoryObj<ComponentProps<typeof Backdrop>>;

export default meta;

const Template = (args: BackdropProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisible = () => setIsVisible(!isVisible);

  const isDarkTheme = document.body.classList.contains("dark");

  return (
    <div style={{ height: "200px" }}>
      <Button
        label="Toggle Backdrop"
        primary
        size={ButtonSize.medium}
        onClick={toggleVisible}
      />
      <Backdrop {...args} visible={isVisible} onClick={toggleVisible} />
      {isVisible ? (
        <button
          type="button"
          onClick={toggleVisible}
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: isDarkTheme ? "#fff" : "#333",
            backgroundColor: isDarkTheme
              ? "rgba(32, 32, 32, 0.8)"
              : "rgba(255, 255, 255, 0.8)",
            padding: "10px 16px",
            borderRadius: "6px",
            border: "none",
            fontSize: "16px",
            cursor: "pointer",
            zIndex: 204,
          }}
        >
          Click anywhere to close
        </button>
      ) : null}
    </div>
  );
};

const MultipleBackdropsTemplate = (args: BackdropProps) => {
  const [isFirstVisible, setFirstVisible] = useState(false);
  const [isSecondVisible, setSecondVisible] = useState(false);

  const isDarkTheme = document.body.classList.contains("dark");

  return (
    <div style={{ height: "200px" }}>
      <Button
        label="First Backdrop"
        primary
        size={ButtonSize.medium}
        onClick={() => setFirstVisible(true)}
      />
      <Backdrop
        {...args}
        visible={isFirstVisible}
        isAside
        onClick={() => setFirstVisible(false)}
      />
      {isFirstVisible && !isSecondVisible ? (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 204,
          }}
        >
          <Button
            label="Second Backdrop"
            primary
            size={ButtonSize.medium}
            onClick={() => setSecondVisible(true)}
          />
        </div>
      ) : null}
      <Backdrop
        {...args}
        visible={isSecondVisible}
        isAside
        zIndex={205}
        onClick={() => setSecondVisible(false)}
      />
      {isSecondVisible ? (
        <button
          type="button"
          onClick={() => setSecondVisible(false)}
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: isDarkTheme ? "#fff" : "#333",
            backgroundColor: isDarkTheme
              ? "rgba(32, 32, 32, 0.8)"
              : "rgba(255, 255, 255, 0.8)",
            padding: "10px 16px",
            borderRadius: "6px",
            border: "none",
            fontSize: "16px",
            cursor: "pointer",
            zIndex: 206,
          }}
        >
          Click anywhere to close the second backdrop
        </button>
      ) : null}
    </div>
  );
};

const ModalTemplate = (args: BackdropProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisible = () => setIsVisible(!isVisible);

  const isDarkTheme = document.body.classList.contains("dark");

  return (
    <div style={{ height: "300px" }}>
      <Button
        label="Show Modal"
        primary
        size={ButtonSize.medium}
        onClick={toggleVisible}
      />
      <Backdrop
        {...args}
        visible={isVisible}
        isModalDialog
        onClick={toggleVisible}
      />
      {isVisible ? (
        <button
          type="button"
          onClick={toggleVisible}
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: isDarkTheme ? "#333" : "white",
            color: isDarkTheme ? "#fff" : "#333",
            padding: "2rem",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
            zIndex: 204,
            boxShadow: isDarkTheme
              ? "0 4px 12px rgba(0, 0, 0, 0.5)"
              : "0 4px 12px rgba(0, 0, 0, 0.15)",
          }}
        >
          <h2 style={{ color: isDarkTheme ? "#fff" : "#333" }}>
            Modal Content
          </h2>
          <p style={{ color: isDarkTheme ? "#ccc" : "#666" }}>
            Click outside to close
          </p>
        </button>
      ) : null}
    </div>
  );
};

const TRANSPARENT = "rgba(0, 0, 0, 0)";

export const Default: Story = {
  render: (args) => <Template {...args} />,
  play: async ({ canvas, userEvent }) => {
    // Not visible means not rendered at all.
    await expect(canvas.queryByTestId("backdrop")).toBeNull();

    await userEvent.click(
      canvas.getByRole("button", { name: "Toggle Backdrop" }),
    );
    const backdrop = canvas.getByTestId("backdrop");
    await expect(backdrop).toBeVisible();
    await expect(getComputedStyle(backdrop).backgroundColor).not.toBe(
      TRANSPARENT,
    );

    await userEvent.click(backdrop);
    await expect(canvas.queryByTestId("backdrop")).toBeNull();
  },
  args: {
    withBackground: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "The common case: a dimmed layer behind a dialog, which a click on the layer closes (`withBackground`). The button opens it.",
      },
      source: {
        code: `<Backdrop visible={isVisible} withBackground onClick={handleClose} />`,
      },
    },
  },
};

export const WithoutBackground: Story = {
  name: "Transparent",
  render: (args) => <Template {...args} />,
  args: {
    withoutBackground: true,
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(
      canvas.getByRole("button", { name: "Toggle Backdrop" }),
    );
    // Transparent, but it still catches the click that closes it.
    const backdrop = canvas.getByTestId("backdrop");
    await expect(getComputedStyle(backdrop).backgroundColor).toBe(TRANSPARENT);
    await userEvent.click(backdrop);
    await expect(canvas.queryByTestId("backdrop")).toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A transparent layer for a menu that closes on an outside click. The page stays as bright, and the layer still catches the click (`withoutBackground`).",
      },
      source: {
        code: `<Backdrop visible={isVisible} withoutBackground onClick={handleClose} />`,
      },
    },
  },
};

export const MultipleBackdrops: Story = {
  name: "Stacked side panels",
  render: (args) => <MultipleBackdropsTemplate {...args} />,
  args: {
    withBackground: true,
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(
      canvas.getByRole("button", { name: "First Backdrop" }),
    );
    await userEvent.click(
      canvas.getByRole("button", { name: "Second Backdrop" }),
    );
    // isAside lets the second layer render over the first.
    const layers = canvas.getAllByTestId("backdrop");
    await expect(layers).toHaveLength(2);

    // A click closes the top layer first.
    await userEvent.click(layers[1]);
    await expect(canvas.getAllByTestId("backdrop")).toHaveLength(1);
    await userEvent.click(canvas.getByTestId("backdrop"));
    await expect(canvas.queryByTestId("backdrop")).toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "Two side-panel layers, one over the other (`isAside`). The second renders although a backdrop is already on screen, and darkens the page further. A click closes the top layer first.",
      },
      source: {
        code: `<Backdrop visible={isFirstVisible} isAside withBackground onClick={() => setFirstVisible(false)} />
<Backdrop visible={isSecondVisible} isAside withBackground zIndex={205} onClick={() => setSecondVisible(false)} />`,
      },
    },
  },
};

export const ModalDialogBackdrop: Story = {
  name: "Behind a modal dialog",
  render: (args) => <ModalTemplate {...args} />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Show Modal" }));
    await expect(canvas.getByText("Modal Content")).toBeVisible();
    const backdrop = canvas.getByTestId("backdrop");
    await expect(backdrop).toBeVisible();
    // A click on the backdrop closes the modal.
    await userEvent.click(backdrop);
    await expect(canvas.queryByText("Modal Content")).toBeNull();
  },
  args: {
    withBackground: true,
    isModalDialog: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A layer behind a modal dialog on a touch screen. It catches the taps that close the dialog, but lets touch scrolling through (`isModalDialog`).",
      },
      source: {
        code: `<Backdrop visible={isVisible} isModalDialog withBackground onClick={handleClose} />`,
      },
    },
  },
};

export const WithCustomZIndex: Story = {
  name: "Custom stacking order",
  render: (args) => {
    const [isVisible, setIsVisible] = useState(false);
    const isDarkTheme = document.body.classList.contains("dark");

    return (
      <div style={{ height: "300px", position: "relative" }}>
        <Button
          label="Show Backdrop (z-index: 500)"
          primary
          size={ButtonSize.medium}
          onClick={() => setIsVisible(!isVisible)}
        />
        <Backdrop
          {...args}
          visible={isVisible}
          onClick={() => setIsVisible(false)}
        />
        {isVisible ? (
          <button
            type="button"
            onClick={() => setIsVisible(false)}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: isDarkTheme
                ? "rgba(32, 32, 32, 0.9)"
                : "rgba(255, 255, 255, 0.9)",
              color: isDarkTheme ? "#fff" : "#333",
              padding: "2rem",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              zIndex: 501,
              textAlign: "center",
            }}
          >
            <h3>Custom z-index: 500</h3>
            <p>Modal is on top (z-index: 501)</p>
            <p>Click to close</p>
          </button>
        ) : null}
      </div>
    );
  },
  args: {
    withBackground: true,
    zIndex: 500,
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(
      canvas.getByRole("button", { name: "Show Backdrop (z-index: 500)" }),
    );
    await expect(getComputedStyle(canvas.getByTestId("backdrop")).zIndex).toBe(
      "500",
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "A backdrop at stacking order 500 with its content at 501, instead of the default 203 (`zIndex`). Raise both when the content must sit above other high layers.",
      },
      source: {
        code: `<Backdrop visible={isVisible} withBackground zIndex={500} onClick={handleClose} />`,
      },
    },
  },
};

export const CssCustomization: Story = {
  name: "CSS variables",
  render: () => (
    <div
      style={
        {
          "--backdrop-bg": "rgba(0, 130, 201, 0.4)",
        } as CSSProperties
      }
    >
      <Backdrop visible withBackground onClick={fn()} />
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 204,
          padding: "24px 32px",
          borderRadius: "8px",
          background: "var(--background-color)",
          color: "var(--text-color)",
          fontWeight: 600,
        }}
      >
        Custom blue backdrop
      </div>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(
      getComputedStyle(canvas.getByTestId("backdrop")).backgroundColor,
    ).toBe("rgba(0, 130, 201, 0.4)");
  },
  parameters: {
    docs: {
      // The layer is fixed over the whole window, so inline it would cover the Docs page.
      story: { inline: false, height: "200px" },
      description: {
        story: `The dimming colour overridden on a wrapper (\`--backdrop-bg\`). The stacking order is the \`zIndex\` prop.`,
      },
      source: {
        code: `<div style={{ "--backdrop-bg": "rgba(0, 130, 201, 0.4)" }}>
  <Backdrop visible withBackground onClick={handleClose} />
</div>`,
      },
    },
  },
};
