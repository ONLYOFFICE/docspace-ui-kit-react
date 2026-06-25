/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type React from "react";
import type { ComponentProps, CSSProperties } from "react";
import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { DragAndDrop } from ".";

const meta = {
  title: "UI/Interactive elements/DragAndDrop",
  component: DragAndDrop,
  parameters: {
    docs: {
      description: {
        component: `DragAndDrop component for handling file drag and drop operations.

### Features

- **Drop Zone**: Designate areas as file drop targets
- **Drag State Tracking**: Visual feedback when items are being dragged over
- **Drag Disable**: Optionally disable drag functionality
- **Custom Styling**: Support for custom styles and class names
- **Event Callbacks**: Handlers for drop, dragOver, dragLeave, and mouseDown events
- **Ref Forwarding**: Forward refs for direct DOM access

### Usage

\`\`\`tsx
import { DragAndDrop } from "@docspace/ui-kit/components/drag-and-drop";

// Basic drop zone
<DragAndDrop
  isDropZone
  onDrop={(files) => handleFiles(files)}
  onDragOver={(isDragActive, e) => setDragging(isDragActive)}
  onDragLeave={(e) => setDragging(false)}
>
  <div>Drop files here</div>
</DragAndDrop>

// Disabled drag zone
<DragAndDrop isDragDisabled>
  <div>Drag disabled</div>
</DragAndDrop>
\`\`\``,
      },
    },
  },
  argTypes: {
    isDropZone: {
      control: "boolean",
      description: "Sets the component as a dropzone",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    dragging: {
      control: "boolean",
      description: "Shows that the item is being dragged now",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDragDisabled: {
      control: "boolean",
      description:
        "Indicates that dragging files to this element is not allowed",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    onDrop: {
      action: "dropped",
      description: "Callback when files are dropped",
    },
    onDragOver: {
      action: "dragOver",
      description: "Callback when dragging over the zone",
    },
    onDragLeave: {
      action: "dragLeave",
      description: "Callback when dragging leaves the zone",
    },
    onMouseDown: {
      action: "mouseDown",
      description: "Callback when the mouse button is pressed",
    },
    children: {
      description: "Children elements rendered inside the drop zone",
    },
    className: {
      control: "text",
      description: "Additional CSS class name",
    },
    style: {
      description: "Inline styles applied to the component",
    },
  },
} satisfies Meta<typeof DragAndDrop>;

type Story = StoryObj<ComponentProps<typeof DragAndDrop>>;

export default meta;

const InteractiveDropZone = (args: ComponentProps<typeof DragAndDrop>) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (
    isDragActive: boolean,
    e: React.DragEvent<HTMLElement>,
  ) => {
    setIsDragging(isDragActive);
    args.onDragOver?.(isDragActive, e);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLElement>) => {
    setIsDragging(false);
    args.onDragLeave?.(e);
  };

  const handleDrop = (files: File[]) => {
    setIsDragging(false);
    args.onDrop?.(files);
  };

  const dropZoneStyle: React.CSSProperties = {
    width: "100%",
    height: "200px",
    border: `2px dashed ${isDragging ? "#2DA7DB" : "#D0D5DA"}`,
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    backgroundColor: isDragging ? "#F8F9F9" : "transparent",
  };

  const textStyle: React.CSSProperties = {
    margin: 0,
    color: "var(--text-color)",
    textAlign: "center",
  };

  return (
    <DragAndDrop
      {...args}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div style={dropZoneStyle}>
        <p style={textStyle}>
          {isDragging
            ? "Drop files here"
            : "Drag and drop files here or click to select"}
        </p>
      </div>
    </DragAndDrop>
  );
};

export const CssCustomization: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "400px" }}>
      {/* Dragging state — shows --dnd-dragging-bg */}
      <div
        style={
          {
            "--dnd-dragging-bg": "#e6f3fb",
            "--dnd-accept-bg": "#cce5f6",
            "--dnd-disabled-opacity": "0.3",
          } as CSSProperties
        }
      >
        <DragAndDrop isDropZone dragging style={{ height: "120px", borderRadius: "8px" }}>
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "13px",
            }}
          >
            Dragging — custom bg via --dnd-dragging-bg
          </div>
        </DragAndDrop>
      </div>

      {/* Disabled state — shows --dnd-disabled-opacity */}
      <div
        style={
          {
            "--dnd-disabled-opacity": "0.25",
          } as CSSProperties
        }
      >
        <DragAndDrop isDropZone isDragDisabled style={{ height: "80px", borderRadius: "8px", border: "2px dashed #0082c9" }}>
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "13px",
            }}
          >
            Disabled — reduced via --dnd-disabled-opacity: 0.25
          </div>
        </DragAndDrop>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--dnd-dragging-bg\` | Background during active drag | theme-based |
| \`--dnd-accept-bg\` | Background when accepting a drop | theme-based |
| \`--dnd-disabled-opacity\` | Opacity when drag is disabled | \`0.4\` |`,
      },
    },
  },
};

export const Default: Story = {
  render: (args) => <InteractiveDropZone {...args} />,
  args: {
    isDropZone: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default drop zone that accepts file drops. Drag files over the area to see visual feedback.",
      },
      source: {
        code: `<DragAndDrop
  isDropZone
  onDrop={(files) => console.log("Dropped:", files)}
  onDragOver={(isDragActive, e) => setDragging(isDragActive)}
  onDragLeave={(e) => setDragging(false)}
>
  <div>Drag and drop files here or click to select</div>
</DragAndDrop>`,
      },
    },
  },
};

export const WithDraggingState: Story = {
  render: (args) => <InteractiveDropZone {...args} />,
  args: {
    isDropZone: true,
    dragging: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Drop zone with the dragging state forced to true, showing the visual appearance during an active drag operation.",
      },
      source: {
        code: `<DragAndDrop
  isDropZone
  dragging
  onDrop={(files) => console.log("Dropped:", files)}
>
  <div>Drop files here</div>
</DragAndDrop>`,
      },
    },
  },
};

export const Disabled: Story = {
  render: (args) => <InteractiveDropZone {...args} />,
  args: {
    isDropZone: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Drop zone with isDropZone set to false, disabling the drop target functionality.",
      },
      source: {
        code: `<DragAndDrop isDropZone={false}>
  <div>Drop zone disabled</div>
</DragAndDrop>`,
      },
    },
  },
};
