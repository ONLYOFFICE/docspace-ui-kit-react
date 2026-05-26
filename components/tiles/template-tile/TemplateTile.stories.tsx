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

import type { ComponentProps, CSSProperties } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import type { TemplateTileProps, TemplateItem } from "./TemplateTile.types";

import React, { useState } from "react";
import PublicRoomTemplateIconReactSvg from "../../../assets/icons/32/template/public.svg";
import CreateRoomReactSvg from "../../../assets/create.room.react.svg";
import { ContextMenuModel } from "../../context-menu";
import { Link } from "../../link";
import { IconSizeType } from "../../../utils";
import { ComboBox, ComboBoxSize } from "../../combobox";
import { Text } from "../../text";

import { TemplateTile } from ".";
import { TileContent } from "../tile-content";
import { IconButton } from "../../icon-button";

const contextOptions: ContextMenuModel[] = [
  {
    id: "option_edit",
    key: "edit",
    label: "Edit",
    onClick: () => {},
    disabled: false,
  },
  {
    id: "option_delete",
    key: "delete",
    label: "Delete",
    onClick: () => {},
    disabled: false,
  },
];

interface StoryTemplateItem extends TemplateItem {
  usedSpace: number;
  quotaLimit?: number;
  isCustomQuota: boolean;
  contextOptions: ContextMenuModel[];
}

type QuotaOption = {
  id: string;
  key: string;
  label: string;
  action: string;
};

type MockSpaceQuotaProps = {
  item: TemplateItem;
  isReadOnly?: boolean;
  className?: string;
  withoutLimitQuota?: boolean;
};

const MockSpaceQuota: React.FC<MockSpaceQuotaProps> = ({
  item,
  className,
  isReadOnly,
  withoutLimitQuota,
}) => {
  const extendedItem = item as unknown as StoryTemplateItem;

  const usedSpace = `${Math.round(extendedItem.usedSpace / (1024 * 1024))} MB`;
  const quotaLimit = !extendedItem.quotaLimit
    ? "Unlimited"
    : `${Math.round(extendedItem.quotaLimit / (1024 * 1024))} MB`;

  const options: QuotaOption[] = [
    {
      id: "info-account-quota_edit",
      key: "change-quota",
      label: "Change Quota",
      action: "change",
    },
    {
      id: "info-account-quota_current-size",
      key: "current-size",
      label: quotaLimit,
      action: "current-size",
    },
    {
      id: "info-account-quota_no-quota",
      key: "no-quota",
      label: extendedItem.quotaLimit === -1 ? "Unlimited" : "Disable Quota",
      action: "no-quota",
    },
  ];

  if (withoutLimitQuota || extendedItem?.quotaLimit === undefined) {
    return <Text fontWeight={600}>{usedSpace}</Text>;
  }

  if (isReadOnly) {
    return (
      <Text fontWeight={600} style={{ display: "contents" }}>
        {usedSpace} / {quotaLimit}
      </Text>
    );
  }

  const selectedOption =
    options.find(
      (elem) =>
        elem.action ===
        (extendedItem.quotaLimit === -1 ? "no-quota" : "current-size"),
    ) || options[1];

  return (
    <div
      style={{ display: "flex", alignItems: "center" }}
      className={className}
    >
      <Text fontWeight={600}>{usedSpace} / </Text>
      <ComboBox
        style={{ flex: 1, minWidth: 0, padding: 0 }}
        selectedOption={selectedOption}
        size={ComboBoxSize.content}
        options={options}
        onSelect={() => {}}
        scaled={false}
        modernView
        manualWidth="auto"
        directionY="both"
      />
    </div>
  );
};

const element = <PublicRoomTemplateIconReactSvg />;

const badges = (
  <div className="badges">
    <IconButton
      iconNode={<CreateRoomReactSvg />}
      onClick={() => {}}
      className="badge icons-group"
      size={IconSizeType.medium}
      hoverColor="accent"
      clickColor="accent"
    />
  </div>
);

const defaultItem: StoryTemplateItem = {
  id: "template-1",
  title: "Sample Template",
  createdBy: {
    id: "user-1",
    displayName: "John Doe",
  },
  security: {
    EditRoom: true,
  },
  usedSpace: 1024 * 1024 * 45, // 45 MB
  isCustomQuota: true,
  contextOptions,
};

const meta = {
  title: "UI/Tiles/TemplateTile",
  component: TemplateTile,
  parameters: {
    docs: {
      description: {
        component: `Template tile component for displaying template information in a tile format.

### Features

- **Template Icon**: Displays template type icon
- **Selectable**: Supports checked/selected state with checkbox
- **Active State**: Visual highlight for the currently active template
- **Blocking Operation**: Indicates when a template operation is in progress
- **Indeterminate State**: Partial selection indicator
- **Space Quota**: Displays storage usage and quota information
- **Badges**: Action badges like "Create Room" button
- **Context Menu**: Right-click context menu for template actions

### Usage

\`\`\`tsx
import { TemplateTile } from "@docspace/ui-kit/components/tiles/template-tile";
import { TileContent } from "@docspace/ui-kit/components/tiles/tile-content";

<TemplateTile
  item={{ id: "1", title: "Sample Template", createdBy: { id: "u1", displayName: "John" } }}
  element={<TemplateIcon />}
  contextOptions={options}
  onSelect={handleSelect}
>
  <TileContent><Link>Template Content</Link></TileContent>
</TemplateTile>
\`\`\``,
      },
    },
  },
  argTypes: {
    checked: {
      control: "boolean",
      description: "Whether the tile is selected/checked",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isActive: {
      control: "boolean",
      description: "Whether the tile is in active state",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isBlockingOperation: {
      control: "boolean",
      description:
        "Whether a blocking operation is in progress on the template",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    indeterminate: {
      control: "boolean",
      description:
        "Whether the checkbox shows an indeterminate state for partial selection",
      table: {
        defaultValue: { summary: "false" },
      },
    },
  },
} satisfies Meta<typeof TemplateTile>;

type Story = StoryObj<ComponentProps<typeof TemplateTile>>;

export default meta;

const Template = ({ checked: initialChecked, ...args }: TemplateTileProps) => {
  const [checked, setChecked] = useState(initialChecked);

  const onSelect = (isSelected: boolean) => {
    setChecked(isSelected);
  };

  return (
    <div style={{ maxWidth: "300px", margin: "30px" }}>
      <TemplateTile {...args} checked={checked} onSelect={onSelect}>
        <TileContent>
          <Link>Template Content</Link>
        </TileContent>
      </TemplateTile>
    </div>
  );
};

export const Default: Story = {
  render: Template,
  args: {
    item: defaultItem,
    element,
    contextOptions,
    badges,
    showStorageInfo: true,
    openUser: () => {},
    getContextModel: () => contextOptions,
    columnCount: 1,
    SpaceQuotaComponent: MockSpaceQuota,
  },
  parameters: {
    docs: {
      description: {
        story: "Basic template tile with selection functionality",
      },
      source: {
        code: `<TemplateTile
  item={{ id: "template-1", title: "Sample Template", createdBy: { id: "user-1", displayName: "John Doe" } }}
  element={<PublicRoomTemplateIconReactSvg />}
  contextOptions={contextOptions}
  badges={badges}
  showStorageInfo={true}
  getContextModel={() => contextOptions}
  columnCount={1}
>
  <TileContent><Link>Template Content</Link></TileContent>
</TemplateTile>`,
      },
    },
  },
};

export const Checked: Story = {
  render: Template,
  args: {
    ...Default.args,
    checked: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Template tile in checked state",
      },
      source: {
        code: `<TemplateTile
  item={item}
  element={<PublicRoomTemplateIconReactSvg />}
  contextOptions={contextOptions}
  checked={true}
  onSelect={handleSelect}
>
  <TileContent><Link>Template Content</Link></TileContent>
</TemplateTile>`,
      },
    },
  },
};

export const WithSpaceQuota: Story = {
  render: Template,
  args: {
    ...Default.args,
    showStorageInfo: true,
    SpaceQuotaComponent: MockSpaceQuota,
    item: {
      ...defaultItem,
      quotaLimit: 1024 * 1024 * 100, // 100 MB
      isCustomQuota: true,
    } as StoryTemplateItem,
  },
  parameters: {
    docs: {
      description: {
        story: "Template tile with space quota information and controls",
      },
      source: {
        code: `<TemplateTile
  item={{ ...item, quotaLimit: 104857600 }}
  element={<PublicRoomTemplateIconReactSvg />}
  contextOptions={contextOptions}
  showStorageInfo={true}
  SpaceQuotaComponent={SpaceQuota}
>
  <TileContent><Link>Template Content</Link></TileContent>
</TemplateTile>`,
      },
    },
  },
};

export const WithReadOnlyQuota: Story = {
  render: Template,
  args: {
    ...Default.args,
    showStorageInfo: true,
    SpaceQuotaComponent: MockSpaceQuota,
    item: {
      ...defaultItem,
      quotaLimit: 1024 * 1024 * 100, // 100 MB
      security: {
        EditRoom: false,
      },
    } as StoryTemplateItem,
  },
  parameters: {
    docs: {
      description: {
        story: "Template tile with read-only quota display",
      },
      source: {
        code: `<TemplateTile
  item={{ ...item, quotaLimit: 104857600, security: { EditRoom: false } }}
  element={<PublicRoomTemplateIconReactSvg />}
  contextOptions={contextOptions}
  showStorageInfo={true}
  SpaceQuotaComponent={SpaceQuota}
>
  <TileContent><Link>Template Content</Link></TileContent>
</TemplateTile>`,
      },
    },
  },
};

export const BlockingOperation: Story = {
  render: Template,
  args: {
    ...Default.args,
    isBlockingOperation: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Template tile showing blocking operation state",
      },
      source: {
        code: `<TemplateTile
  item={item}
  element={<PublicRoomTemplateIconReactSvg />}
  contextOptions={contextOptions}
  isBlockingOperation={true}
>
  <TileContent><Link>Template Content</Link></TileContent>
</TemplateTile>`,
      },
    },
  },
};

export const CssCustomization: Story = {
  render: () => (
    <div
      style={
        {
          "--tile-bg": "#e6f3fb",
          "--tile-border-style": "1px solid #0082c9",
          "--tile-radius": "16px",
          "--tile-hover-bg": "#cce5f6",
          "--tile-icon-color": "#0082c9",
          "--tile-sub-color": "#006fa6",
        } as CSSProperties
      }
    >
      <div style={{ maxWidth: "300px", margin: "30px" }}>
        <TemplateTile
          item={defaultItem}
          element={element}
          contextOptions={contextOptions}
          badges={badges}
          showStorageInfo={true}
          openUser={() => {}}
          getContextModel={() => contextOptions}
          columnCount={1}
          SpaceQuotaComponent={MockSpaceQuota}
        >
          <TileContent>
            <Link>Sample Template</Link>
          </TileContent>
        </TemplateTile>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--tile-bg\` | Tile background color | theme-based |
| \`--tile-border-style\` | Tile border | theme-based |
| \`--tile-radius\` | Tile border radius | \`12px\` |
| \`--tile-hover-bg\` | Hover/checked background | theme-based |
| \`--tile-icon-color\` | Icon button color | theme-based |
| \`--tile-sub-color\` | Sub-text/metadata color | theme-based |`,
      },
    },
  },
};
