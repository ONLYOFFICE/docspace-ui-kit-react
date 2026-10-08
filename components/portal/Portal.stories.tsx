import type { ComponentProps, CSSProperties } from "react";
import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

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
      description: "React node to render inside the portal",
      control: false,
    },
    visible: {
      control: "boolean",
      description:
        "Whether the content is rendered; turning it off unmounts the content, so anything it held is lost",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    appendTo: {
      description:
        "Element to append the content to; when it is null on a render the content goes to the end of document.body",
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
  parameters: {
    docs: {
      description: {
        story:
          "The content passed in `element` shows inside the dashed container that owns it, not beside the text it was declared next to (`appendTo`). Switch `visible` in the Controls panel below to unmount and mount it again.",
      },
      source: {
        code: `<Portal element={<div>Portal content</div>} visible appendTo={containerElement} />`,
      },
    },
  },
};

export const Hidden: Story = {
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
  render: () => <CustomContainerTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Portal rendering into a specific custom container element instead of document.body.",
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
  render: () => <MultiplePortalsTemplate />,
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
  render: () => <ToggleVisibilityTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Click Show Portal and Close to open and close the content from outside and from inside it. Each close unmounts the content (`visible`), so state held inside it starts over on the next open.",
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
  render: () => <IntoDocumentBodyTemplate />,
  parameters: {
    docs: {
      // The fixed popup would cover the Docs page, so the story gets a frame.
      story: { inline: false, height: "300px" },
      description: {
        story:
          "With no `appendTo`, the content leaves the dashed box it is declared in and lands at the end of the page body, centred on the window by its own fixed position.",
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
  render: () => <CssCustomizationTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Portal has no styles of its own, so the README lists no CSS variables for it: the `--portal-popup-*` variables set here belong to this page's demo popup, and are set on the container the portal appends to so the content picks them up there.",
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
