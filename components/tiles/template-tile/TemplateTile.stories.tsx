import type { ComponentProps, CSSProperties } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

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
    displayName: "Team member",
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
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    checked: {
      control: "boolean",
      description:
        "Ticks the checkbox and keeps it in place of the icon, and tints the tile",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isActive: {
      control: "boolean",
      description: "Keeps the hover background on the tile being acted on",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isBlockingOperation: {
      control: "boolean",
      description:
        "Stops the tile answering hover, clicks and right-clicks; it looks the same as an idle tile",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    indeterminate: {
      control: "boolean",
      description:
        "Draws the checkbox half-filled; it shows while the checkbox does, that is on hover or when the tile is checked",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    inProgress: {
      control: "boolean",
      description: "Replaces the icon and the checkbox with a small loader",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    showHotkeyBorder: {
      control: "boolean",
      description:
        "Turns the tile's border the accent colour, to mark the one the keyboard is on",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isEdit: {
      control: "boolean",
      description:
        "Removes the icon and the checkbox while the template is renamed, and stops hovering from tinting the tile",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    showStorageInfo: {
      control: "boolean",
      description:
        "Adds a storage line under the owner; its figure appears only when `SpaceQuotaComponent` is given too",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    item: {
      control: "object",
      description:
        "The template the tile stands for, passed back through `onSelect`. Its `createdBy` fills the owner line, `security.EditRoom` decides whether the storage figure can be changed, and a `contextOptions` key on it is what draws the three-dot button",
    },
    children: {
      control: false,
      description:
        "The name beside the icon, usually a `TileContent`; only the first element is shown",
    },
    element: {
      control: false,
      description:
        "The template icon beside the name; without it the tile has neither the icon nor the checkbox",
    },
    badges: {
      control: false,
      description: "Action buttons after the name",
    },
    SpaceQuotaComponent: {
      control: false,
      description:
        'Draws the storage figure; it is handed the item, the type `"room"` and whether the figure is read-only',
    },
    contextOptions: {
      control: "object",
      description: "Entries of the menu opened by the three-dot button",
    },
    getContextModel: {
      control: false,
      description:
        "Returns the entries of the menu opened by a right-click; without it a right-click opens nothing",
    },
    onSelect: {
      description:
        "Called with the new checked state and the item from the checkbox, and when the icon is tapped on a phone",
    },
    openUser: {
      description: "Called when the owner's name is clicked",
    },
    tileContextClick: {
      description: "Called just before the menu opens",
    },
    hideContextMenu: {
      description: "Called when the menu closes",
    },
    columnCount: {
      control: false,
      description:
        "Ignored: the type requires it, and nothing in the tile reads it",
    },
    thumbnailClick: {
      control: false,
      description: "Ignored: nothing in the tile calls it",
    },
  },
  args: {
    onSelect: fn(),
    openUser: fn(),
    tileContextClick: fn(),
    hideContextMenu: fn(),
  },
} satisfies Meta<typeof TemplateTile>;

type Story = StoryObj<ComponentProps<typeof TemplateTile>>;

export default meta;

const Template = ({
  checked: initialChecked,
  onSelect: onSelectArg,
  ...args
}: TemplateTileProps) => {
  const [checked, setChecked] = useState(initialChecked);

  const onSelect: TemplateTileProps["onSelect"] = (isSelected, item) => {
    setChecked(isSelected);
    onSelectArg?.(isSelected, item);
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
    getContextModel: () => contextOptions,
    columnCount: 1,
    SpaceQuotaComponent: MockSpaceQuota,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A template with its owner and the storage it uses: the icon, the name with a create-room button, the menu, and the two lines below. Hover the icon and tick the checkbox to select it, click the owner to see `openUser` in the Actions panel, and change any other prop live in the Controls panel below.",
      },
      source: {
        code: `<TemplateTile
  item={{ id: "template-1", title: "Sample Template", createdBy: { id: "user-1", displayName: "Team member" }, contextOptions }}
  element={<PublicRoomTemplateIconReactSvg />}
  contextOptions={contextOptions}
  badges={badges}
  showStorageInfo={true}
  SpaceQuotaComponent={SpaceQuota}
  getContextModel={() => contextOptions}
  columnCount={1}
  openUser={openOwnerProfile}
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
        story:
          "A selected template, as it looks among others the reader has picked: the checkbox stays ticked in place of the icon and the tile is tinted (`checked`).",
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
        story:
          "A template with a storage limit the reader may change: the storage line shows the space used and a drop-down with the limit, both drawn by the host's quota component (`showStorageInfo`, `SpaceQuotaComponent`, `security.EditRoom`).",
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
        story:
          "The same template for a reader who may not edit it: the tile tells the quota component the figure is read-only, so it shows the used space and the limit as plain text (`security.EditRoom: false`).",
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
        story:
          "A template an operation is running over, which must not be picked or opened until it ends: hover it, click it or right-click it and nothing happens (`isBlockingOperation`). It looks the same as an idle template, so show the operation somewhere else.",
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

export const InProgress: Story = {
  render: Template,
  args: {
    ...Default.args,
    inProgress: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A template that is busy, being saved or copied: a small loader stands where the icon and the checkbox were (`inProgress`).",
      },
      source: {
        code: `<TemplateTile
  item={item}
  element={<PublicRoomTemplateIconReactSvg />}
  contextOptions={contextOptions}
  inProgress
>
  <TileContent><Link>Template Content</Link></TileContent>
</TemplateTile>`,
      },
    },
  },
};

export const WithHotkeyBorder: Story = {
  render: Template,
  args: {
    ...Default.args,
    showHotkeyBorder: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "The tile the keyboard is on while the reader moves through the grid with the arrow keys: its border turns the accent colour (`showHotkeyBorder`). The tile does not handle the keys itself.",
      },
      source: {
        code: `<TemplateTile
  item={item}
  element={<PublicRoomTemplateIconReactSvg />}
  contextOptions={contextOptions}
  showHotkeyBorder
>
  <TileContent><Link>Template Content</Link></TileContent>
</TemplateTile>`,
      },
    },
  },
};

export const RenamingState: Story = {
  render: Template,
  args: {
    ...Default.args,
    isEdit: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A template whose name is being edited: the icon and the checkbox go, so the name can become a text field, and hovering no longer tints the tile (`isEdit`).",
      },
      source: {
        code: `<TemplateTile
  item={item}
  element={<PublicRoomTemplateIconReactSvg />}
  contextOptions={contextOptions}
  isEdit
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
          "--tile-bg": "#f4f9fd",
          "--tile-border-style": "1px solid #0082c9",
          "--tile-radius": "16px",
          "--tile-hover-bg": "#cce5f6",
          "--tile-icon-color": "#0082c9",
          "--tile-sub-color": "#006fa6",
          "--tile-hotkey-color": "#e0662e",
        } as CSSProperties
      }
    >
      {[false, true].map((showHotkeyBorder) => (
        <div
          key={String(showHotkeyBorder)}
          style={{ maxWidth: "300px", margin: "30px" }}
        >
          <TemplateTile
            item={defaultItem}
            element={element}
            contextOptions={contextOptions}
            badges={badges}
            showStorageInfo={true}
            showHotkeyBorder={showHotkeyBorder}
            openUser={() => {}}
            getContextModel={() => contextOptions}
            columnCount={1}
            SpaceQuotaComponent={MockSpaceQuota}
          >
            <TileContent>
              <Link>
                {showHotkeyBorder ? "Team Template" : "Sample Template"}
              </Link>
            </TileContent>
          </TemplateTile>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `The variables are listed under CSS variables on this page.

Two instances:
- **Sample Template** — for every variable but the hotkey colour; hover it for \`--tile-hover-bg\`.
- **Team Template** — \`showHotkeyBorder\`, for \`--tile-hotkey-color\`.`,
      },
      source: {
        code: `<div style={{
  "--tile-bg": "#f4f9fd",
  "--tile-border-style": "1px solid #0082c9",
  "--tile-radius": "16px",
  "--tile-hover-bg": "#cce5f6",
  "--tile-icon-color": "#0082c9",
  "--tile-sub-color": "#006fa6",
  "--tile-hotkey-color": "#e0662e",
}}>
  <TemplateTile item={template} element={<TemplateIcon />} contextOptions={options} badges={badges} columnCount={1} openUser={openOwnerProfile} showStorageInfo SpaceQuotaComponent={SpaceQuota}>
    <TileContent><Link>Sample Template</Link></TileContent>
  </TemplateTile>
  <TemplateTile item={template} element={<TemplateIcon />} contextOptions={options} badges={badges} columnCount={1} openUser={openOwnerProfile} showStorageInfo SpaceQuotaComponent={SpaceQuota} showHotkeyBorder>
    <TileContent><Link>Team Template</Link></TileContent>
  </TemplateTile>
</div>`,
      },
    },
  },
};
