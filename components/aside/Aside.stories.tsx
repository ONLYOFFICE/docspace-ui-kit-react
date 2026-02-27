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

import { useEffect, useState } from "react";
import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Aside } from ".";
import type { AsideProps } from "./Aside.types";
import { Button, ButtonSize } from "../button";
import { TextInput, InputSize, InputType } from "../text-input";
import { ToggleButton } from "../toggle-button";
import { Avatar, AvatarSize, AvatarRole } from "../avatar";
import { Badge } from "../badge";
import { Text } from "../text";
import { Label } from "../label";
import { Backdrop } from "../backdrop";

const meta = {
  title: "UI/Overlays/Aside",
  component: Aside,
  parameters: {
    docs: {
      description: {
        component: `Aside is a sliding panel that appears from the right side of the screen for displaying contextual content.

### Features

- **Slide-in Animation**: Smooth transition from the right edge
- **Optional Header**: Built-in header with title, close button, and back navigation
- **Scrollable Body**: Content area with automatic scrollbar support
- **Scale Mode**: Full-width scaling option for responsive layouts
- **Body Scroll Control**: Option to disable page scrolling when the panel is open

### Usage

\`\`\`tsx
import { Aside } from "@docspace/ui-kit/components/aside";

<Aside visible={isVisible} header="Panel Title" onClose={handleClose}>
  <div>Panel content here</div>
</Aside>
\`\`\``,
      },
    },
    layout: "fullscreen",
  },
  argTypes: {
    visible: {
      control: "boolean",
      description: "Controls panel visibility",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    scale: {
      control: "boolean",
      description: "Full-width scaling mode",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    zIndex: {
      control: "number",
      description: "CSS z-index value",
    },
    withoutHeader: {
      control: "boolean",
      description: "Hides the header section",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withoutBodyScroll: {
      control: "boolean",
      description: "Disables body scroll when panel is open",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    header: {
      control: "text",
      description: "Header title content",
    },
    isBackButton: {
      control: "boolean",
      description: "Shows back button in header",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isCloseable: {
      control: "boolean",
      description: "Shows close button in header",
      table: {
        defaultValue: { summary: "true" },
      },
    },
  },
} satisfies Meta<typeof Aside>;

type Story = StoryObj<ComponentProps<typeof Aside>>;

export default meta;

const pageStyles: React.CSSProperties = {
  height: "100vh",
  padding: "32px",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  fontFamily: "'Open Sans', sans-serif",
  backgroundColor: "#f8f9f9",
};

const cardStyles: React.CSSProperties = {
  backgroundColor: "#fff",
  borderRadius: "6px",
  padding: "20px",
  border: "1px solid #eceef1",
};

const Template = (args: AsideProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(!!args.visible);
  }, [args.visible]);

  const open = () => setIsVisible(true);
  const close = () => {
    setIsVisible(false);
    args.onClose?.();
  };

  return (
    <div style={pageStyles}>
      <div style={cardStyles}>
        <Text fontSize="22px" fontWeight={600}>
          Documents
        </Text>
        <Text
          fontSize="13px"
          style={{ marginTop: "8px", color: "#a3a9ae" }}
        >
          Click the button below to open the side panel.
        </Text>
        <Button
          label="Open Panel"
          primary
          size={ButtonSize.medium}
          onClick={open}
          style={{ marginTop: "16px" }}
        />
      </div>

      <div
        style={{
          ...cardStyles,
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#d0d5da",
          fontSize: "14px",
        }}
      >
        Main content area
      </div>

      <Backdrop visible={isVisible} onClick={close} zIndex={399} isAside />
      <Aside {...args} visible={isVisible} onClose={close}>
        {args.children}
      </Aside>
    </div>
  );
};

const SettingsContent = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoSave, setAutoSave] = useState(true);

  const sectionStyle: React.CSSProperties = {
    padding: "16px 20px",
    borderBottom: "1px solid #eceef1",
  };

  const rowStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 0",
  };

  return (
    <div>
      <div style={sectionStyle}>
        <Text fontWeight={600} fontSize="14px">
          Notifications
        </Text>
        <div style={rowStyle}>
          <Text fontSize="13px">Email notifications</Text>
          <ToggleButton
            isChecked={emailNotifications}
            onChange={() => setEmailNotifications((v) => !v)}
          />
        </div>
      </div>

      <div style={sectionStyle}>
        <Text fontWeight={600} fontSize="14px">
          Appearance
        </Text>
        <div style={rowStyle}>
          <Text fontSize="13px">Dark mode</Text>
          <ToggleButton
            isChecked={darkMode}
            onChange={() => setDarkMode((v) => !v)}
          />
        </div>
      </div>

      <div style={sectionStyle}>
        <Text fontWeight={600} fontSize="14px">
          Editor
        </Text>
        <div style={rowStyle}>
          <Text fontSize="13px">Auto-save</Text>
          <ToggleButton
            isChecked={autoSave}
            onChange={() => setAutoSave((v) => !v)}
          />
        </div>
      </div>

      <div style={{ padding: "20px" }}>
        <Button label="Save Changes" primary size={ButtonSize.normal} scale />
      </div>
    </div>
  );
};

const UserProfileContent = () => (
  <div>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "24px 20px",
        borderBottom: "1px solid #eceef1",
        gap: "12px",
      }}
    >
      <Avatar size={AvatarSize.big} userName="John Smith" role={AvatarRole.owner} />
      <div style={{ textAlign: "center" }}>
        <Text fontSize="16px" fontWeight={700}>
          John Smith
        </Text>
        <Text
          fontSize="13px"
          style={{ marginTop: "4px", color: "#a3a9ae" }}
        >
          john.smith@company.com
        </Text>
        <div style={{ marginTop: "8px" }}>
          <Badge label="Admin" backgroundColor="#265A8F" />
        </div>
      </div>
    </div>

    <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <Label text="First Name" />
        <TextInput
          value="John"
          type={InputType.text}
          size={InputSize.base}
          scale
          onChange={() => {}}
        />
      </div>
      <div>
        <Label text="Last Name" />
        <TextInput
          value="Smith"
          type={InputType.text}
          size={InputSize.base}
          scale
          onChange={() => {}}
        />
      </div>
      <div>
        <Label text="Email" />
        <TextInput
          value="john.smith@company.com"
          type={InputType.email}
          size={InputSize.base}
          scale
          onChange={() => {}}
        />
      </div>
    </div>

    <div style={{ padding: "16px 20px", display: "flex", gap: "8px" }}>
      <Button label="Save" primary size={ButtonSize.normal} scale />
      <Button label="Cancel" size={ButtonSize.normal} scale />
    </div>
  </div>
);

const FileDetailsContent = () => (
  <div>
    <div
      style={{
        padding: "20px",
        borderBottom: "1px solid #eceef1",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
      }}
    >
      <Text fontSize="15px" fontWeight={600}>
        Quarterly Report.docx
      </Text>
      <Text fontSize="12px" style={{ color: "#a3a9ae" }}>
        Last modified: Feb 10, 2026
      </Text>
    </div>

    <div style={{ padding: "16px 20px" }}>
      <Text fontWeight={600} fontSize="14px" style={{ marginBottom: "12px" }}>
        Details
      </Text>
      {[
        { label: "Type", value: "Document" },
        { label: "Size", value: "2.4 MB" },
        { label: "Owner", value: "John Smith" },
        { label: "Created", value: "Jan 15, 2026" },
        { label: "Location", value: "My Documents" },
      ].map((item) => (
        <div
          key={item.label}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "8px 0",
            borderBottom: "1px solid #f3f4f4",
          }}
        >
          <Text fontSize="13px" style={{ color: "#a3a9ae" }}>
            {item.label}
          </Text>
          <Text fontSize="13px">{item.value}</Text>
        </div>
      ))}
    </div>

    <div style={{ padding: "16px 20px" }}>
      <Text fontWeight={600} fontSize="14px" style={{ marginBottom: "12px" }}>
        Shared with
      </Text>
      {["Alice Johnson", "Bob Wilson", "Carol Davis"].map((name) => (
        <div
          key={name}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 0",
          }}
        >
          <Avatar size={AvatarSize.min} userName={name} role={AvatarRole.user} />
          <Text fontSize="13px">{name}</Text>
        </div>
      ))}
    </div>
  </div>
);

export const Default: Story = {
  render: (args) => <Template {...args} />,
  args: {
    visible: false,
    header: "Panel Title",
    children: (
      <div style={{ padding: "20px" }}>
        <Text fontSize="14px">
          This is example content inside the Aside panel.
        </Text>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default aside panel with a header and simple text content. Click the button to open.",
      },
      source: {
        code: `<Aside visible={isVisible} header="Panel Title" onClose={handleClose}>
  <div style={{ padding: "20px" }}>
    <Text>Content here</Text>
  </div>
</Aside>`,
      },
    },
  },
};

export const Settings: Story = {
  render: (args) => <Template {...args} />,
  args: {
    visible: false,
    header: "Settings",
    children: <SettingsContent />,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Aside panel displaying a settings form with toggle switches and save button.",
      },
      source: {
        code: `<Aside visible={isVisible} header="Settings" onClose={handleClose}>
  <SettingsContent />
</Aside>`,
      },
    },
  },
};

export const UserProfile: Story = {
  render: (args) => <Template {...args} />,
  args: {
    visible: false,
    header: "Profile",
    children: <UserProfileContent />,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Aside panel showing a user profile with avatar, badge, and editable form fields.",
      },
      source: {
        code: `<Aside visible={isVisible} header="Profile" onClose={handleClose}>
  <UserProfileContent />
</Aside>`,
      },
    },
  },
};

export const FileDetails: Story = {
  render: (args) => <Template {...args} />,
  args: {
    visible: false,
    header: "File Info",
    children: <FileDetailsContent />,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Aside panel displaying file metadata, details, and sharing information.",
      },
      source: {
        code: `<Aside visible={isVisible} header="File Info" onClose={handleClose}>
  <FileDetailsContent />
</Aside>`,
      },
    },
  },
};

export const WithBackButton: Story = {
  render: (args) => <Template {...args} />,
  args: {
    visible: false,
    header: "Details",
    isBackButton: true,
    children: <FileDetailsContent />,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Aside panel with a back button in the header for multi-level navigation.",
      },
      source: {
        code: `<Aside visible={isVisible} header="Details" isBackButton onBackClick={handleBack} onClose={handleClose}>
  <FileDetailsContent />
</Aside>`,
      },
    },
  },
};

export const WithoutHeader: Story = {
  render: (args) => <Template {...args} />,
  args: {
    visible: false,
    withoutHeader: true,
    children: <UserProfileContent />,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Aside panel without a header section. Useful when custom header content is needed.",
      },
      source: {
        code: `<Aside visible={isVisible} withoutHeader onClose={handleClose}>
  <UserProfileContent />
</Aside>`,
      },
    },
  },
};

export const Scaled: Story = {
  render: (args) => <Template {...args} />,
  args: {
    visible: false,
    scale: true,
    header: "Full Width Panel",
    children: <SettingsContent />,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Aside panel scaled to full width of the viewport. Useful for mobile layouts.",
      },
      source: {
        code: `<Aside visible={isVisible} scale header="Full Width Panel" onClose={handleClose}>
  <SettingsContent />
</Aside>`,
      },
    },
  },
};
