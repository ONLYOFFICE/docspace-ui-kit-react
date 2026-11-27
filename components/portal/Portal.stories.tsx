import type { ComponentProps, CSSProperties } from "react";
import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen } from "storybook/test";

import { Button, ButtonSize } from "../button";
import { Portal } from "./Portal";
import styles from "./Portal.module.scss";

const meta = {
  title: "UI/Layout/Portal",
  component: Portal,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    element: {
      description:
        "What to render in the container. It is a node, not children: the component renders nothing of its own around it.",
      control: false,
    },
    visible: {
      control: "boolean",
      description:
        "Whether the content is rendered. Turning it off unmounts the content, so anything it held is lost.",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    appendTo: {
      description:
        "Element to append the content to. While it is null the content goes to `document.body`, so hold the container in state, not in a ref.",
      control: false,
      table: {
        defaultValue: { summary: "null" },
      },
    },
  },
} satisfies Meta<typeof Portal>;

type Story = StoryObj<ComponentProps<typeof Portal>>;

export default meta;

export const Default: Story = {
  render: (args) => {
    const [container, setContainer] = useState<HTMLElement | null>(null);

    return (
      <div ref={setContainer} className={styles.customContainer}>
        <p>Content outside portal</p>
        {container && <Portal {...args} appendTo={container} />}
      </div>
    );
  },
  args: {
    element: (
      <div className={styles.popup}>This content is rendered in a portal</div>
    ),
    visible: true,
  },
  play: async ({ canvas }) => {
    // The content lands in the container named by appendTo.
    const content = await canvas.findByText(
      "This content is rendered in a portal",
    );
    await expect(content.parentElement).toHaveTextContent(
      "Content outside portal",
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "The content passed in `element` shows inside the dashed container named by `appendTo`. Turning `visible` off unmounts it.",
      },
      source: {
        code: `<Portal element={<div>Portal content</div>} visible appendTo={containerElement} />`,
      },
    },
  },
};

export const Hidden: Story = {
  name: "Hidden",
  render: (args) => {
    const [container, setContainer] = useState<HTMLElement | null>(null);

    return (
      <div ref={setContainer} className={styles.customContainer}>
        <p>Portal is hidden (visible=false)</p>
        {container && <Portal {...args} appendTo={container} />}
      </div>
    );
  },
  args: {
    element: <div className={styles.popup}>You should not see this</div>,
    visible: false,
  },
  play: async () => {
    // Not hidden but not mounted: nothing reaches the DOM anywhere.
    await expect(screen.queryByText("You should not see this")).toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "The container stays empty: with `visible` off the content is not hidden but not mounted at all, so nothing of it reaches the DOM.",
      },
      source: {
        code: `<Portal element={<div>Hidden content</div>} visible={false} appendTo={containerElement} />`,
      },
    },
  },
};

const CustomContainerTemplate = () => {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  return (
    <div>
      <p>Main content</p>
      <div ref={setContainer} className={styles.customContainer}>
        <p>Custom container (portal target)</p>
        {container && (
          <Portal
            element={
              <div className={`${styles.popup} ${styles.blue}`}>
                Content rendered inside custom container
              </div>
            }
            appendTo={container}
          />
        )}
      </div>
    </div>
  );
};

export const CustomContainer: Story = {
  name: "Into a container",
  render: () => <CustomContainerTemplate />,
  play: async ({ canvas }) => {
    const content = await canvas.findByText(
      "Content rendered inside custom container",
    );
    await expect(content.parentElement).toHaveTextContent(
      "Custom container (portal target)",
    );
    await expect(content.parentElement).not.toHaveTextContent("Main content");
  },
  parameters: {
    docs: {
      description: {
        story:
          "The content lands inside the dashed container passed as `appendTo`, not in the page body. The text above the container stays outside it.",
      },
      source: {
        code: `<Portal
  element={<div>Custom container content</div>}
  appendTo={customContainerElement}
/>`,
      },
    },
  },
};

const MultiplePortalsTemplate = () => {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  return (
    <div ref={setContainer} className={styles.customContainer}>
      <p>Multiple portals example</p>
      {container && (
        <>
          <Portal
            element={
              <div className={`${styles.popup} ${styles.blue} ${styles.top30}`}>
                First Portal
              </div>
            }
            appendTo={container}
          />
          <Portal
            element={
              <div
                className={`${styles.popup} ${styles.purple} ${styles.top50}`}
              >
                Second Portal
              </div>
            }
            appendTo={container}
          />
          <Portal
            element={
              <div
                className={`${styles.popup} ${styles.green} ${styles.top70}`}
              >
                Third Portal
              </div>
            }
            appendTo={container}
          />
        </>
      )}
    </div>
  );
};

export const MultiplePortals: Story = {
  name: "Several portals",
  render: () => <MultiplePortalsTemplate />,
  play: async ({ canvas }) => {
    // Each portal is appended after the last.
    const first = await canvas.findByText("First Portal");
    const container = first.parentElement as HTMLElement;
    const texts = Array.from(container.children).map((el) => el.textContent);
    await expect(texts).toEqual([
      "Multiple portals example",
      "First Portal",
      "Second Portal",
      "Third Portal",
    ]);
  },
  parameters: {
    docs: {
      description: {
        story:
          "Three portals share one container: each is appended after the last, and the portals do nothing about overlap, so every node carries its own position.",
      },
      source: {
        code: `<Portal element={<div>First Portal</div>} appendTo={container} />
<Portal element={<div>Second Portal</div>} appendTo={container} />
<Portal element={<div>Third Portal</div>} appendTo={container} />`,
      },
    },
  },
};

const ToggleVisibilityTemplate = () => {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  return (
    <div ref={setContainer} className={styles.customContainer}>
      <Button
        label={visible ? "Hide Portal" : "Show Portal"}
        primary
        size={ButtonSize.small}
        onClick={() => setVisible(!visible)}
      />
      {container && (
        <Portal
          element={
            <div className={styles.popup}>
              <p>Portal content</p>
              <Button
                label="Close"
                size={ButtonSize.extraSmall}
                onClick={() => setVisible(false)}
              />
            </div>
          }
          visible={visible}
          appendTo={container}
        />
      )}
    </div>
  );
};

export const ToggleVisibility: Story = {
  name: "Open and close",
  render: () => <ToggleVisibilityTemplate />,
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.queryByText("Portal content")).toBeNull();

    // Opened from outside, closed from inside.
    await userEvent.click(canvas.getByRole("button", { name: "Show Portal" }));
    await expect(await canvas.findByText("Portal content")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Close" }));
    await expect(canvas.queryByText("Portal content")).toBeNull();

    // And closed from outside too.
    await userEvent.click(canvas.getByRole("button", { name: "Show Portal" }));
    await canvas.findByText("Portal content");
    await userEvent.click(canvas.getByRole("button", { name: "Hide Portal" }));
    await expect(canvas.queryByText("Portal content")).toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A Show Portal button outside the content opens it, and a Close button inside closes it. Each close unmounts the content (`visible`), so its state starts over on the next open.",
      },
      source: {
        code: `<Portal
  element={<div>Toggleable content</div>}
  visible={isVisible}
  appendTo={container}
/>`,
      },
    },
  },
};

const IntoDocumentBodyTemplate = () => (
  <div className={styles.customContainer}>
    <p>The portal is declared inside this box</p>
    <Portal
      element={
        <div className={`${styles.popup} ${styles.green}`}>
          Rendered at the end of the page body
        </div>
      }
    />
  </div>
);

export const IntoDocumentBody: Story = {
  name: "Into the page body",
  render: () => <IntoDocumentBodyTemplate />,
  play: async ({ canvasElement }) => {
    // Without appendTo the content leaves the story for document.body.
    const content = await screen.findByText(
      "Rendered at the end of the page body",
    );
    await expect(content.parentElement).toBe(document.body);
    await expect(canvasElement).not.toContainElement(content);
  },
  parameters: {
    docs: {
      // The fixed popup would cover the Docs page, so the story gets a frame.
      story: { inline: false, height: "300px" },
      description: {
        story:
          "With no `appendTo`, the content leaves the dashed box it is declared in for the end of the page body. Its own fixed position centres it on the window.",
      },
      source: {
        code: `<Portal element={<div style={{ position: "fixed" }}>Content</div>} />`,
      },
    },
  },
};

const CssCustomizationTemplate = () => {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  return (
    <div
      ref={setContainer}
      className={styles.customContainer}
      style={
        {
          // === Portal popup element ===
          "--portal-popup-bg": "#e6f3fb",
          "--portal-popup-shadow": "0 4px 16px rgba(0, 130, 201, 0.3)",
          "--portal-popup-radius": "12px",
          "--portal-popup-padding": "24px 32px",
          "--portal-popup-color": "#004f82",
        } as CSSProperties
      }
    >
      <p>Portal target container</p>
      {container && (
        <Portal
          element={
            <div className={styles.popup}>Custom styled portal content</div>
          }
          appendTo={container}
        />
      )}
    </div>
  );
};

export const CssCustomization: Story = {
  name: "CSS variables",
  render: () => <CssCustomizationTemplate />,
  play: async ({ canvas }) => {
    // The content picks up the variables set on the container it lands in.
    const content = await canvas.findByText("Custom styled portal content");
    await expect(getComputedStyle(content).backgroundColor).toBe(
      "rgb(230, 243, 251)",
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "A light blue popup with rounded corners. Portal has no styles of its own; the `--portal-popup-*` variables belong to this demo's popup. They sit on the target container, so the content picks them up there.",
      },
      source: {
        code: `<div
  ref={setContainer}
  style={{
    "--portal-popup-bg": "#e6f3fb",
    "--portal-popup-shadow": "0 4px 16px rgba(0, 130, 201, 0.3)",
    "--portal-popup-radius": "12px",
    "--portal-popup-padding": "24px 32px",
    "--portal-popup-color": "#004f82",
  }}
>
  <Portal element={<div className="popup">Styled content</div>} appendTo={container} />
</div>`,
      },
    },
  },
};
