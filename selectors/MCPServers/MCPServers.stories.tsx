import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, userEvent, waitFor, within } from "storybook/test";

import { Toast } from "../../components/toast";
import { toastr } from "../../components/toast/sub-components/Toastr";

import MCPServersSelector from ".";
import type { TSelectorItem } from "../../components/selector";

import { withPortalGate } from "../../.storybook/decorators/PortalGate";

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
  decorators: [withPortalGate("MCP servers selector")],
  tags: ["!autodocs"],
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
import MCPServersSelector from "@onlyoffice/apps-ui-kit/selectors/MCPServers";

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
  Portal,  // ONLYOFFICE Apps portal server (uses portal logo)
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

type PlayContext = Parameters<NonNullable<Story["play"]>>[0];

const row = (label: string) => {
  const found = Array.from(
    document.querySelectorAll<HTMLElement>('[data-testid^="selector-item-"]'),
  ).find((item) => item.textContent?.includes(label));
  if (!found) throw new Error(`No row labelled ${label}`);
  return found;
};

const ticked = (label: string) =>
  (
    within(row(label)).getByRole("checkbox", {
      hidden: true,
    }) as HTMLInputElement
  ).checked;

// The demo portal lists the portal's own server and two custom ones.
const listed = () =>
  waitFor(() => expect(row("Demo knowledge base")).toBeVisible());

const submitted = (args: StoryArgs) =>
  (
    (args.onSubmit as ReturnType<typeof fn>).mock.calls[0][0] as TSelectorItem[]
  ).map((server) => server.id);

// Ticking servers and pressing Add hands them over, then goes back.
const addsServers = async (args: StoryArgs) => {
  await userEvent.click(row("Demo CRM"));
  await userEvent.click(row("Demo knowledge base"));
  await userEvent.click(screen.getByTestId("selector_submit_button"));
  await expect(args.onSubmit).toHaveBeenCalledTimes(1);
  await expect(submitted(args)).toEqual(["Demo CRM", "Demo knowledge base"]);
  await expect(args.onBackClick).toHaveBeenCalledTimes(1);
};

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
  play: async ({ args }: PlayContext) => {
    await listed();
    await expect(screen.getByText("Available MCP servers")).toBeVisible();
    // Nothing is ticked, so there is nothing to submit yet.
    await expect(screen.queryByTestId("selector_submit_button")).toBeNull();
    await addsServers(args);

    // The header's back arrow is the other way out.
    await userEvent.click(screen.getByTestId("aside_header_back_icon_button"));
    await expect(args.onBackClick).toHaveBeenCalledTimes(2);
  },
  args: {
    initedSelectedServers: [],
    onSubmit: fn((servers: TSelectorItem[]) => {
      const names = servers.map((s) => s.label).join(", ");
      toastr.success(`Selected: ${names || "none"}`);
    }),
    onClose: fn(() => {
      toastr.info("Selector closed");
    }),
    onBackClick: fn(() => {
      toastr.info("Back clicked");
    }),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default story using a live ONLYOFFICE Apps API. Available MCP servers are fetched and displayed for multi-selection.",
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
  tags: ["!autodocs"],
  render: (args: StoryArgs) => <Template {...args} />,
  play: async ({ args }: PlayContext) => {
    await listed();
    // The portal's own server carries the product's name once -- Storybook's
    // brands make it "ONLYOFFICE", not "ONLYOFFICE ONLYOFFICE".
    await expect(
      within(row("ONLYOFFICE")).getByText("ONLYOFFICE", { exact: true }),
    ).toBeVisible();
    await expect(screen.queryByText(/ONLYOFFICE\s+ONLYOFFICE/)).toBeNull();
    await expect(ticked("ONLYOFFICE")).toBe(true);
    await expect(ticked("Demo CRM")).toBe(false);

    // Adding one more keeps the preselected server.
    await userEvent.click(row("Demo CRM"));
    await userEvent.click(screen.getByTestId("selector_submit_button"));
    await expect(submitted(args)).toEqual(["portal", "Demo CRM"]);
  },
  args: {
    initedSelectedServers: ["portal"],
    onSubmit: fn((servers: TSelectorItem[]) => {
      const names = servers.map((s) => s.label).join(", ");
      toastr.success(`Selected: ${names || "none"}`);
    }),
    onClose: fn(() => {
      toastr.info("Selector closed");
    }),
    onBackClick: fn(() => {
      toastr.info("Back clicked");
    }),
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
  tags: ["!autodocs"],
  render: (args: StoryArgs) => <Template {...args} />,
  play: async ({ args }: PlayContext) => {
    await listed();
    // Cancel goes back without submitting.
    await userEvent.click(row("Demo CRM"));
    await userEvent.click(screen.getByTestId("selector_cancel_button"));
    await expect(args.onBackClick).toHaveBeenCalledTimes(1);
    await expect(args.onSubmit).not.toHaveBeenCalled();
  },
  args: {
    useAside: true,
    withoutBackground: false,
    withBlur: false,
    initedSelectedServers: [],
    onSubmit: fn((servers: TSelectorItem[]) => {
      const names = servers.map((s) => s.label).join(", ");
      toastr.success(`Selected: ${names || "none"}`);
    }),
    onClose: fn(() => {
      toastr.info("Selector closed");
    }),
    onBackClick: fn(() => {
      toastr.info("Back clicked");
    }),
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
