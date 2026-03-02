// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

import type { ComponentProps } from "react";
import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button, ButtonSize } from "../button";
import { Portal } from "./Portal";
import styles from "./Portal.module.scss";

const meta = {
  title: "UI/Layout/Portal",
  component: Portal,
  parameters: {
    docs: {
      description: {
        component: `Portal renders children into a DOM node outside the parent component's DOM hierarchy using React portals.

### Features

- **DOM Escape Hatch**: Renders content outside the parent DOM tree
- **Custom Target**: Append to any DOM element via \`appendTo\` prop
- **Visibility Control**: Toggle portal content visibility without unmounting
- **Default to Body**: Renders to \`document.body\` when no target is specified

### Usage

\`\`\`tsx
import { Portal } from "@docspace/ui-kit/components/portal";

// Render into document.body
<Portal element={<div>Portal content</div>} />

// Render into a specific container
<Portal element={<div>Portal content</div>} appendTo={containerRef} />

// Control visibility
<Portal element={<div>Toggleable content</div>} visible={isVisible} />
\`\`\``,
      },
    },
  },
  argTypes: {
    element: {
      description: "React node to render inside the portal",
      control: false,
    },
    visible: {
      control: "boolean",
      description: "Controls portal content visibility",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    appendTo: {
      description: "Target DOM element to append the portal to",
      control: false,
      table: {
        defaultValue: { summary: "document.body" },
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
    element: <div className={styles.popup}>This content is rendered in a portal</div>,
    visible: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default portal rendering content into a custom container element.",
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
          "Portal with visible set to false. The content is not rendered.",
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
              <div className={`${styles.popup} ${styles.blue}`}>
                First Portal
              </div>
            }
            appendTo={container}
          />
          <Portal
            element={
              <div className={`${styles.popup} ${styles.purple}`}>
                Second Portal
              </div>
            }
            appendTo={container}
          />
          <Portal
            element={
              <div className={`${styles.popup} ${styles.green}`}>
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
          "Multiple portals rendered into the same container, demonstrating portal stacking.",
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
          "Portal with togglable visibility. The visible prop controls whether the content is rendered.",
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
