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

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Toast } from "../../components/toast";
import { toastr } from "../../components/toast/sub-components/Toastr";

import MCPServersSelector from ".";
import type { TSelectorItem } from "../../components/selector";

type MCPServersSelectorProps = {
  onSubmit: (servers: TSelectorItem[]) => void;
  onClose: VoidFunction;
  onBackClick: VoidFunction;
  initedSelectedServers?: string[];
  useAside?: boolean;
  withoutBackground?: boolean;
  withBlur?: boolean;
};

type StoryArgs = MCPServersSelectorProps;

const meta: Meta<StoryArgs> = {
  title: "Components/Selectors/MCPServersSelector",
  component: MCPServersSelector,
  parameters: {
    docs: {
      description: {
        component: `MCPServersSelector is a multi-select panel for choosing available MCP (Model Context Protocol) servers to connect to an AI agent.

### Features

- **Live API mode**: Fetches available MCP servers from \`/api/2.0/ai/servers/available\` in batches of 100 with infinite scroll
- **Multi-select**: Users can select and deselect multiple servers simultaneously
- **Pre-selection**: Pass \`initedSelectedServers\` with server IDs to restore a previous selection on open
- **Disabled items**: Servers with \`needReset: true\` are rendered as disabled
- **Server types**: Supports Custom, Portal, GitHub, and Box server types with matching icons
- **Back navigation**: Separate \`onBackClick\` and \`onClose\` callbacks for two-level navigation
- **Cancel button**: Built-in cancel button that triggers \`onBackClick\`

### Usage

\`\`\`tsx
import MCPServersSelector from "@docspace/ui-kit/selectors/MCPServers";

<MCPServersSelector
  initedSelectedServers={["server-id-1"]}
  onSubmit={(servers) => saveConnectedServers(servers.map((s) => s.id))}
  onClose={() => setOpen(false)}
  onBackClick={() => navigateBack()}
/>
\`\`\`

### Server Types

\`\`\`tsx
enum ServerType {
  Custom,  // Custom MCP server
  Portal,  // DocSpace portal server (uses portal logo)
  GitHub,  // GitHub integration
  Box,     // Box integration
}
\`\`\``,
      },
    },
  },
  argTypes: {
    // Behaviour
    initedSelectedServers: {
      control: "object",
      description:
        "Array of server IDs that should be pre-selected when the selector opens",
    },

    // Callbacks
    onSubmit: {
      action: "onSubmit",
      description:
        "Called with the array of selected TSelectorItem servers when the user confirms",
    },
    onClose: {
      action: "onClose",
      description: "Called to fully close the selector",
    },
    onBackClick: {
      action: "onBackClick",
      description:
        "Called when the back button or cancel button is clicked — navigate to previous view",
    },

    // Aside
    useAside: {
      control: "boolean",
      description: "Render the selector inside an Aside panel with a backdrop",
      table: { defaultValue: { summary: "false" } },
    },
    withoutBackground: {
      control: "boolean",
      description: "Remove the background overlay in Aside mode",
      table: { defaultValue: { summary: "false" } },
    },
    withBlur: {
      control: "boolean",
      description: "Apply blur effect to the Aside backdrop",
      table: { defaultValue: { summary: "false" } },
    },
  },
};

export default meta;

type Story = StoryObj<StoryArgs>;

const Template = (props: StoryArgs) => (
  <div
    style={{
      width: "700px",
      height: "600px",
      border: "4px dashed #d0d5dd",
      overflow: "hidden",
      transform: "translateZ(0)",
    }}
  >
    <Toast />
    <MCPServersSelector {...props} />
  </div>
);

export const Default: Story = {
  render: (args: StoryArgs) => <Template {...args} />,
  args: {

    initedSelectedServers: [],
    onSubmit: (servers) => {
      const names = servers.map((s) => s.label).join(", ");
      toastr.success(`Selected: ${names || "none"}`);
    },
    onClose: () => {
      toastr.info("Selector closed");
    },
    onBackClick: () => {
      toastr.info("Back clicked");
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default story using a live DocSpace API. Available MCP servers are fetched and displayed for multi-selection.",
      },
      source: {
        code: `<MCPServersSelector
  initedSelectedServers={[]}
  onSubmit={(servers) => saveConnectedServers(servers.map((s) => s.id))}
  onClose={() => setOpen(false)}
  onBackClick={() => navigateBack()}
/>`,
      },
    },
  },
};

export const WithPreselection: Story = {
  render: (args: StoryArgs) => <Template {...args} />,
  args: {

    initedSelectedServers: ["portal"],
    onSubmit: (servers) => {
      const names = servers.map((s) => s.label).join(", ");
      toastr.success(`Selected: ${names || "none"}`);
    },
    onClose: () => {
      toastr.info("Selector closed");
    },
    onBackClick: () => {
      toastr.info("Back clicked");
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Opens with a server pre-selected via `initedSelectedServers`. " +
          "The matching server will appear checked when the list loads.",
      },
      source: {
        code: `<MCPServersSelector
  initedSelectedServers={["portal"]}
  onSubmit={(servers) => saveConnectedServers(servers.map((s) => s.id))}
  onClose={() => setOpen(false)}
  onBackClick={() => navigateBack()}
/>`,
      },
    },
  },
};

export const AsideMode: Story = {
  render: (args: StoryArgs) => <Template {...args} />,
  args: {
    useAside: true,
    withoutBackground: false,
    withBlur: false,
    initedSelectedServers: [],
    onSubmit: (servers) => {
      const names = servers.map((s) => s.label).join(", ");
      toastr.success(`Selected: ${names || "none"}`);
    },
    onClose: () => {
      toastr.info("Selector closed");
    },
    onBackClick: () => {
      toastr.info("Back clicked");
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Renders the selector inside an Aside panel with a backdrop overlay. " +
          "Use `withBlur` to apply a blur effect and `withoutBackground` to remove the overlay.",
      },
      source: {
        code: `<MCPServersSelector
  useAside
  withoutBackground={false}
  withBlur={false}
  initedSelectedServers={[]}
  onSubmit={(servers) => saveConnectedServers(servers.map((s) => s.id))}
  onClose={() => setOpen(false)}
  onBackClick={() => navigateBack()}
/>`,
      },
    },
  },
};
