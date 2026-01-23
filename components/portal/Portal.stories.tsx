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

import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { Portal } from "./Portal";

const meta: Meta<typeof Portal> = {
  title: "Components/UI/Portal",
  component: Portal,
  parameters: {
    docs: {
      description: {
        component:
          "Portal component renders children into a DOM node outside the parent component's DOM hierarchy.",
      },
    },
  },
  argTypes: {
    element: {
      description: "The React node to be rendered inside the portal",
      control: false,
    },
    visible: {
      description: "Whether the portal content should be visible",
      control: "boolean",
    },
    appendTo: {
      description: "The DOM element to append the portal to",
      control: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof Portal>;

const popupStyles: React.CSSProperties = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  padding: 20,
  backgroundColor: "#fff",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  borderRadius: 6,
  zIndex: 1000,
};

export const Default: Story = {
  render: (args) => (
    <div>
      <p>Content outside portal</p>
      <Portal {...args} />
    </div>
  ),
  args: {
    element: (
      <div style={popupStyles}>This content is rendered in a portal</div>
    ),
    visible: true,
  },
};

export const Hidden: Story = {
  render: (args) => (
    <div>
      <p>Portal is hidden (visible=false)</p>
      <Portal {...args} />
    </div>
  ),
  args: {
    element: <div style={popupStyles}>You should not see this</div>,
    visible: false,
  },
};

export const CustomContainer: Story = {
  render: () => {
    const [container, setContainer] = useState<HTMLElement | null>(null);

    return (
      <div>
        <p>Main content</p>
        <div
          ref={setContainer}
          style={{
            position: "relative",
            width: 300,
            height: 150,
            border: "2px dashed #ccc",
            margin: 20,
            padding: 10,
          }}
        >
          <p>Custom container (portal target)</p>
          {container && (
            <Portal
              element={
                <div
                  style={{
                    padding: 10,
                    backgroundColor: "#e3f2fd",
                    borderRadius: 4,
                    marginTop: 10,
                  }}
                >
                  Content rendered inside custom container
                </div>
              }
              appendTo={container}
            />
          )}
        </div>
      </div>
    );
  },
};

export const MultiplePortals: Story = {
  render: () => (
    <div>
      <p>Multiple portals example</p>
      <Portal
        element={
          <div
            style={{
              ...popupStyles,
              top: "30%",
              backgroundColor: "#e3f2fd",
            }}
          >
            First Portal
          </div>
        }
      />
      <Portal
        element={
          <div
            style={{
              ...popupStyles,
              top: "50%",
              backgroundColor: "#f3e5f5",
            }}
          >
            Second Portal
          </div>
        }
      />
      <Portal
        element={
          <div
            style={{
              ...popupStyles,
              top: "70%",
              backgroundColor: "#e8f5e9",
            }}
          >
            Third Portal
          </div>
        }
      />
    </div>
  ),
};

export const ToggleVisibility: Story = {
  render: () => {
    const [visible, setVisible] = useState(false);

    return (
      <div>
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          style={{ padding: "8px 16px", cursor: "pointer" }}
        >
          {visible ? "Hide Portal" : "Show Portal"}
        </button>
        <Portal
          element={
            <div style={popupStyles}>
              <p>Portal content</p>
              <button
                type="button"
                onClick={() => setVisible(false)}
                style={{ padding: "4px 8px", cursor: "pointer" }}
              >
                Close
              </button>
            </div>
          }
          visible={visible}
        />
      </div>
    );
  },
};
