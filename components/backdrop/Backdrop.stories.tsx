import type { CSSProperties, ComponentProps } from "react";
import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Backdrop } from ".";
import type { BackdropProps } from "./Backdrop.types";
import { Button, ButtonSize } from "../button";

const meta = {
  title: "UI/Overlays/Backdrop",
  component: Backdrop,
  parameters: {
    docs: {
      description: {
        component: `Backdrop provides a customizable overlay layer behind modals, dialogs, and aside panels.

### Features

- **Background Control**: Dims the page behind it or stays transparent and only catches clicks, the transparent mode winning when both are asked for
- **Responsive Behavior**: Dims the page on screens 600px wide or narrower even when no background is asked for
- **Z-Index Stacking**: Sits at a configurable stacking order, 203 by default, so the covered component can be placed above it
- **Multiple Backdrop Support**: Stays hidden while another backdrop is on screen, unless it belongs to a side panel or is forced to render
- **Touch Events**: Treats a touch move or touch end on the layer as a click and blocks touch scrolling through it
- **Context Modes**: Side-panel backdrops dim the page by default, while modal-dialog backdrops let touch scrolling go on
- **Click Catching**: Reports a click anywhere on the layer, so the host can close what it covers

### Usage

\`\`\`tsx
import { Backdrop } from "@onlyoffice/apps-ui-kit/components/backdrop";

// Dimmed layer behind a dialog
<Backdrop visible={isVisible} onClick={handleClose} withBackground />

// Transparent layer that closes a menu on an outside click
<Backdrop visible={isOpen} onClick={closeMenu} withoutBackground />

// Layer behind a side panel, stacked over another backdrop
<Backdrop visible={isPanelOpen} onClick={closePanel} isAside />
\`\`\``,
      },
    },
  },
  argTypes: {
    visible: {
      control: false,
      description:
        "Whether the layer is rendered at all; a backdrop that is not visible renders nothing. The stories switch it with their button",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    zIndex: {
      control: "number",
      description:
        "Stacking order of the layer; the component it covers needs a higher one",
      table: {
        defaultValue: { summary: "203" },
      },
    },
    withBackground: {
      control: "boolean",
      description:
        "Dims the page. Without it the layer is transparent and only catches clicks, except on a screen 600px wide or narrower, where it dims anyway",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withoutBackground: {
      control: "boolean",
      description:
        "Keeps the layer transparent on every screen size, even when withBackground or isAside is set",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isAside: {
      control: "boolean",
      description:
        "Marks the layer as belonging to a side panel: it dims the page and renders even when other backdrops are already on screen",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isModalDialog: {
      control: "boolean",
      description:
        "Lets touch scrolling over the layer go on; without it a touch move over the layer is blocked",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    shouldShowBackdrop: {
      control: "boolean",
      description:
        "Renders the layer even when another backdrop is already on screen, which would otherwise keep it hidden",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    onClick: {
      control: false,
      description:
        "Called on a click on the layer, and on a touch move or touch end over it. The stories use it to close the backdrop",
    },
    className: {
      control: "text",
      description: "Extra class name, or an array of them, for the layer",
    },
    id: {
      control: "text",
      description: "HTML id of the layer",
    },
    style: {
      control: "object",
      description:
        "Inline styles for the layer, applied over the stacking order set by zIndex",
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

export const Default: Story = {
  render: (args) => <Template {...args} />,
  args: {
    withBackground: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "The common case: a dimmed layer behind a dialog that closes it on a click (`withBackground`). Press the button to open it, then click anywhere to close it; change any other prop live in the Controls panel below.",
      },
      source: {
        code: `<Backdrop visible={isVisible} withBackground onClick={handleClose} />`,
      },
    },
  },
};

export const WithoutBackground: Story = {
  render: (args) => <Template {...args} />,
  args: {
    withoutBackground: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "For a menu or dropdown that must close on an outside click without darkening the page: the layer stays transparent and still catches the click (`withoutBackground`).",
      },
      source: {
        code: `<Backdrop visible={isVisible} withoutBackground onClick={handleClose} />`,
      },
    },
  },
};

export const MultipleBackdrops: Story = {
  render: (args) => <MultipleBackdropsTemplate {...args} />,
  args: {
    withBackground: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "For a side panel opened over another one: each panel's layer renders even though a backdrop is already on screen, and the second darkens the page further (`isAside`). Open the first backdrop, then the second from the button above it; a click closes the top layer first.",
      },
      source: {
        code: `<Backdrop visible={isFirstVisible} isAside withBackground onClick={() => setFirstVisible(false)} />
<Backdrop visible={isSecondVisible} isAside withBackground zIndex={205} onClick={() => setSecondVisible(false)} />`,
      },
    },
  },
};

export const ModalDialogBackdrop: Story = {
  render: (args) => <ModalTemplate {...args} />,
  args: {
    withBackground: true,
    isModalDialog: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "For a modal dialog on a touch screen: the layer keeps catching taps that close the dialog, but no longer blocks touch scrolling (`isModalDialog`).",
      },
      source: {
        code: `<Backdrop visible={isVisible} isModalDialog withBackground onClick={handleClose} />`,
      },
    },
  },
};

export const WithCustomZIndex: Story = {
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
  parameters: {
    docs: {
      description: {
        story:
          "When the covered content has to sit above other high layers of the page, raise the backdrop's stacking order and place the content one step above it — here 500 and 501 instead of the default 203 (`zIndex`).",
      },
      source: {
        code: `<Backdrop visible={isVisible} withBackground zIndex={500} onClick={handleClose} />`,
      },
    },
  },
};

export const CssCustomization: Story = {
  render: () => (
    <div
      style={
        {
          "--backdrop-bg": "rgba(0, 130, 201, 0.4)",
        } as CSSProperties
      }
    >
      <Backdrop visible withBackground onClick={() => {}} />
      <div
        style={{
          position: "relative",
          zIndex: 11,
          color: "#fff",
          padding: "16px",
          fontWeight: 600,
        }}
      >
        Custom blue backdrop
      </div>
    </div>
  ),
  parameters: {
    docs: {
      // The layer is fixed over the whole window, so inline it would cover the Docs page.
      story: { inline: false, height: "200px" },
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--backdrop-bg\` | Color of the dimmed layer, shown with \`withBackground\` or \`isAside\` and on narrow screens | \`rgba(6, 22, 38, 0.2)\`, \`rgba(27, 27, 27, 0.6)\` in the dark theme |

The stacking order is set by the \`zIndex\` prop, not by a variable.`,
      },
      source: {
        code: `<div style={{ "--backdrop-bg": "rgba(0, 130, 201, 0.4)" }}>
  <Backdrop visible withBackground onClick={handleClose} />
</div>`,
      },
    },
  },
};
