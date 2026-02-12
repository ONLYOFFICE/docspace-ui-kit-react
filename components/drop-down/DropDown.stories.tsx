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

import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { DropDownItem } from "../drop-down-item";
import { Button } from "../button";

import { DropDown } from ".";
import type { DropDownProps } from "./DropDown.types";

const meta = {
  title: "Components/UI/DropDown",
  component: DropDown,
  parameters: {
    docs: {
      description: {
        component: `A flexible dropdown component for displaying menus, options, and contextual content.

### Features

- **Smart Positioning**: Automatically adjusts position based on viewport space
- **Two Modes**: Portal mode (default) and inline mode
- **Virtual Scrolling**: Efficiently renders large lists with react-window
- **RTL Support**: Full right-to-left layout support
- **Keyboard Navigation**: Navigate items with arrow keys
- **Click Outside**: Configurable click-outside handling

### Usage

\`\`\`tsx
import { DropDown } from "@docspace/ui-kit/components/drop-down";
import { DropDownItem } from "@docspace/ui-kit/components/drop-down-item";

const [isOpen, setIsOpen] = useState(false);
const buttonRef = useRef<HTMLButtonElement>(null);

<Button ref={buttonRef} label="Menu" onClick={() => setIsOpen(true)} />
<DropDown
  open={isOpen}
  forwardedRef={buttonRef}
  clickOutsideAction={() => setIsOpen(false)}
>
  <DropDownItem label="Option 1" onClick={handleClick} />
  <DropDownItem label="Option 2" onClick={handleClick} />
</DropDown>
\`\`\`

**Note:** Parent element must have \`position: relative\` for proper positioning in non-portal mode.`,
      },
    },
    layout: "centered",
  },
  argTypes: {
    open: {
      control: "boolean",
      description: "Controls dropdown visibility",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    directionX: {
      control: "select",
      options: ["left", "right"],
      description: "Horizontal opening direction",
      table: {
        defaultValue: { summary: "right" },
      },
    },
    directionY: {
      control: "select",
      options: ["top", "bottom", "both"],
      description: "Vertical opening direction",
      table: {
        defaultValue: { summary: "bottom" },
      },
    },
    maxHeight: {
      control: "number",
      description: "Maximum height in pixels (enables scrolling)",
    },
    manualWidth: {
      control: "text",
      description: "Custom width for the dropdown",
    },
    offsetX: {
      control: "number",
      description: "Horizontal offset from calculated position",
      table: {
        defaultValue: { summary: "0" },
      },
    },
    zIndex: {
      control: "number",
      description: "Custom z-index value",
    },
    showDisabledItems: {
      control: "boolean",
      description: "Show or hide disabled items",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDefaultMode: {
      control: "boolean",
      description: "Use portal mode (true) or inline mode (false)",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    fixedDirection: {
      control: "boolean",
      description: "Disable automatic position adjustment",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    enableKeyboardEvents: {
      control: "boolean",
      description: "Enable keyboard navigation",
      table: {
        defaultValue: { summary: "false" },
      },
    },
  },
} satisfies Meta<typeof DropDown>;

type Story = StoryObj<typeof DropDown>;

export default meta;

const BasicTemplate = (args: DropDownProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const parentRef = React.useRef<HTMLButtonElement>(null);

  return (
    <div style={{ padding: "20px" }}>
      <Button
        ref={parentRef}
        label="Open Dropdown"
        onClick={() => setIsOpen(true)}
      />
      <DropDown
        {...args}
        open={isOpen}
        forwardedRef={parentRef}
        clickOutsideAction={() => setIsOpen(false)}
      >
        <DropDownItem label="Option 1" onClick={() => setIsOpen(false)} />
        <DropDownItem label="Option 2" onClick={() => setIsOpen(false)} />
        <DropDownItem label="Option 3" onClick={() => setIsOpen(false)} />
      </DropDown>
    </div>
  );
};

export const Default: Story = {
  render: (args) => <BasicTemplate {...args} />,
  args: {
    directionX: "right",
    directionY: "bottom",
  },
};

const WithHeadersTemplate = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const parentRef = React.useRef<HTMLButtonElement>(null);

  return (
    <div style={{ padding: "20px" }}>
      <Button
        ref={parentRef}
        label="File Actions"
        onClick={() => setIsOpen(true)}
      />
      <DropDown
        open={isOpen}
        forwardedRef={parentRef}
        clickOutsideAction={() => setIsOpen(false)}
      >
        <DropDownItem isHeader label="File" />
        <DropDownItem label="Open" onClick={() => setIsOpen(false)} />
        <DropDownItem label="Download" onClick={() => setIsOpen(false)} />
        <DropDownItem isSeparator />
        <DropDownItem isHeader label="Edit" />
        <DropDownItem label="Rename" onClick={() => setIsOpen(false)} />
        <DropDownItem label="Move" onClick={() => setIsOpen(false)} />
        <DropDownItem isSeparator />
        <DropDownItem label="Delete" onClick={() => setIsOpen(false)} />
      </DropDown>
    </div>
  );
};

export const WithHeadersAndSeparators: Story = {
  render: () => <WithHeadersTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Dropdowns can include headers and separators to organize items into logical groups.",
      },
    },
  },
};

const WithDisabledItemsTemplate = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const parentRef = React.useRef<HTMLButtonElement>(null);

  return (
    <div style={{ padding: "20px" }}>
      <Button
        ref={parentRef}
        label="Actions Menu"
        onClick={() => setIsOpen(true)}
      />
      <DropDown
        open={isOpen}
        forwardedRef={parentRef}
        showDisabledItems
        clickOutsideAction={() => setIsOpen(false)}
      >
        <DropDownItem isHeader label="Available Actions" />
        <DropDownItem label="Edit" onClick={() => setIsOpen(false)} />
        <DropDownItem label="Share" onClick={() => setIsOpen(false)} />
        <DropDownItem
          label="Move (no permission)"
          onClick={() => {}}
          disabled
        />
        <DropDownItem isSeparator />
        <DropDownItem
          label="Delete (no permission)"
          onClick={() => {}}
          disabled
        />
      </DropDown>
    </div>
  );
};

export const WithDisabledItems: Story = {
  render: () => <WithDisabledItemsTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Use `showDisabledItems` to display disabled items. By default, disabled items are hidden.",
      },
    },
  },
};

const ScrollableTemplate = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const parentRef = React.useRef<HTMLButtonElement>(null);

  const items = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    label: `Option ${i + 1}`,
  }));

  return (
    <div style={{ padding: "20px" }}>
      <Button
        ref={parentRef}
        label="Long List"
        onClick={() => setIsOpen(true)}
      />
      <DropDown
        open={isOpen}
        forwardedRef={parentRef}
        maxHeight={200}
        clickOutsideAction={() => setIsOpen(false)}
      >
        {items.map((item) => (
          <DropDownItem
            key={item.id}
            label={item.label}
            onClick={() => setIsOpen(false)}
          />
        ))}
      </DropDown>
    </div>
  );
};

export const ScrollableList: Story = {
  render: () => <ScrollableTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Use `maxHeight` to limit the dropdown height and enable scrolling for long lists.",
      },
    },
  },
};

const DirectionsTemplate = () => {
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);
  const bottomRightRef = React.useRef<HTMLButtonElement>(null);
  const bottomLeftRef = React.useRef<HTMLButtonElement>(null);
  const topRightRef = React.useRef<HTMLButtonElement>(null);
  const topLeftRef = React.useRef<HTMLButtonElement>(null);

  const handleOpen = (id: string) => setOpenDropdown(id);
  const handleClose = () => setOpenDropdown(null);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "100px",
        padding: "100px 20px",
      }}
    >
      <div>
        <Button
          ref={bottomRightRef}
          label="Bottom Right"
          onClick={() => handleOpen("bottomRight")}
        />
        <DropDown
          open={openDropdown === "bottomRight"}
          forwardedRef={bottomRightRef}
          directionX="right"
          directionY="bottom"
          clickOutsideAction={handleClose}
        >
          <DropDownItem label="Option 1" onClick={handleClose} />
          <DropDownItem label="Option 2" onClick={handleClose} />
        </DropDown>
      </div>

      <div>
        <Button
          ref={bottomLeftRef}
          label="Bottom Left"
          onClick={() => handleOpen("bottomLeft")}
        />
        <DropDown
          open={openDropdown === "bottomLeft"}
          forwardedRef={bottomLeftRef}
          directionX="left"
          directionY="bottom"
          clickOutsideAction={handleClose}
        >
          <DropDownItem label="Option 1" onClick={handleClose} />
          <DropDownItem label="Option 2" onClick={handleClose} />
        </DropDown>
      </div>

      <div>
        <Button
          ref={topRightRef}
          label="Top Right"
          onClick={() => handleOpen("topRight")}
        />
        <DropDown
          open={openDropdown === "topRight"}
          forwardedRef={topRightRef}
          directionX="right"
          directionY="top"
          clickOutsideAction={handleClose}
        >
          <DropDownItem label="Option 1" onClick={handleClose} />
          <DropDownItem label="Option 2" onClick={handleClose} />
        </DropDown>
      </div>

      <div>
        <Button
          ref={topLeftRef}
          label="Top Left"
          onClick={() => handleOpen("topLeft")}
        />
        <DropDown
          open={openDropdown === "topLeft"}
          forwardedRef={topLeftRef}
          directionX="left"
          directionY="top"
          clickOutsideAction={handleClose}
        >
          <DropDownItem label="Option 1" onClick={handleClose} />
          <DropDownItem label="Option 2" onClick={handleClose} />
        </DropDown>
      </div>
    </div>
  );
};

export const DirectionVariants: Story = {
  render: () => <DirectionsTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Control dropdown position with `directionX` (left/right) and `directionY` (top/bottom) props.",
      },
    },
  },
};

const CustomWidthTemplate = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const parentRef = React.useRef<HTMLButtonElement>(null);

  return (
    <div style={{ padding: "20px" }}>
      <Button
        ref={parentRef}
        label="Wide Dropdown"
        onClick={() => setIsOpen(true)}
      />
      <DropDown
        open={isOpen}
        forwardedRef={parentRef}
        manualWidth="300px"
        clickOutsideAction={() => setIsOpen(false)}
      >
        <DropDownItem
          label="This is a longer option text"
          onClick={() => setIsOpen(false)}
        />
        <DropDownItem
          label="Another long option"
          onClick={() => setIsOpen(false)}
        />
        <DropDownItem label="Short" onClick={() => setIsOpen(false)} />
      </DropDown>
    </div>
  );
};

export const CustomWidth: Story = {
  render: () => <CustomWidthTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Use `manualWidth` to set a custom width for the dropdown.",
      },
    },
  },
};

const ContextMenuTemplate = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const parentRef = React.useRef<HTMLButtonElement>(null);

  return (
    <div style={{ padding: "20px" }}>
      <Button
        ref={parentRef}
        label="Context Menu"
        onClick={() => setIsOpen(true)}
      />
      <DropDown
        open={isOpen}
        forwardedRef={parentRef}
        clickOutsideAction={() => setIsOpen(false)}
      >
        <DropDownItem label="Cut" onClick={() => setIsOpen(false)} />
        <DropDownItem label="Copy" onClick={() => setIsOpen(false)} />
        <DropDownItem label="Paste" onClick={() => setIsOpen(false)} />
        <DropDownItem isSeparator />
        <DropDownItem label="Select All" onClick={() => setIsOpen(false)} />
        <DropDownItem isSeparator />
        <DropDownItem label="Undo" onClick={() => setIsOpen(false)} />
        <DropDownItem label="Redo" onClick={() => setIsOpen(false)} />
      </DropDown>
    </div>
  );
};

export const ContextMenu: Story = {
  render: () => <ContextMenuTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Example of a context menu style dropdown with common editing actions.",
      },
    },
  },
};
