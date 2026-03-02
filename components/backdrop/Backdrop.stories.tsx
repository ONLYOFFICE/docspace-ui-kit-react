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

- **Background Control**: Toggle background visibility with \`withBackground\` and \`withoutBackground\` props
- **Responsive Behavior**: Adapts to mobile and tablet viewports automatically
- **Z-Index Stacking**: Configurable z-index for proper layer ordering
- **Multiple Backdrop Support**: Supports stacking multiple backdrops for aside components
- **Touch Events**: Built-in touch event handling for mobile devices
- **Context Modes**: Different behavior for modal dialogs vs aside panels

### Usage

\`\`\`tsx
import { Backdrop } from "@docspace/ui-kit/components/backdrop";

<Backdrop visible={isVisible} onClick={handleClose} withBackground />
\`\`\``,
      },
    },
  },
  argTypes: {
    visible: {
      control: "boolean",
      description: "Controls backdrop visibility",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    zIndex: {
      control: "number",
      description: "CSS z-index for stacking context",
      table: {
        defaultValue: { summary: "203" },
      },
    },
    withBackground: {
      control: "boolean",
      description:
        "Enables background overlay. Not displayed if viewport width > 1024px",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withoutBackground: {
      control: "boolean",
      description:
        "Forces no background. Takes precedence over withBackground",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isAside: {
      control: "boolean",
      description:
        "Indicates usage with an Aside component. Affects stacking behavior",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isModalDialog: {
      control: "boolean",
      description:
        "Indicates usage with a modal dialog. Affects touch event handling",
      table: {
        defaultValue: { summary: "false" },
      },
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

  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      <Button
        label="First Backdrop"
        primary
        size={ButtonSize.medium}
        onClick={() => setFirstVisible(!isFirstVisible)}
      />
      <Button
        label="Second Backdrop"
        primary
        size={ButtonSize.medium}
        onClick={() => setSecondVisible(!isSecondVisible)}
      />
      <Backdrop
        {...args}
        visible={isFirstVisible}
        isAside
        onClick={() => setFirstVisible(false)}
      />
      <Backdrop
        {...args}
        visible={isSecondVisible}
        isAside
        onClick={() => setSecondVisible(false)}
      />
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
          "Basic backdrop with a background overlay. Click the button to toggle visibility.",
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
          "Invisible backdrop that captures clicks without showing a background overlay.",
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
          "Multiple stacked backdrops using the isAside prop. Up to two backdrops can be displayed simultaneously.",
      },
      source: {
        code: `<Backdrop visible={isFirstVisible} isAside withBackground onClick={() => setFirstVisible(false)} />
<Backdrop visible={isSecondVisible} isAside withBackground onClick={() => setSecondVisible(false)} />`,
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
          "Backdrop used with a modal dialog. The isModalDialog prop modifies touch event handling for mobile.",
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
          "Backdrop with custom z-index (500) instead of the default 203. Content above uses z-index 501.",
      },
      source: {
        code: `<Backdrop visible={isVisible} withBackground zIndex={500} onClick={handleClose} />`,
      },
    },
  },
};
