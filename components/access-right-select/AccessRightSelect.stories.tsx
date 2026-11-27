import type { ComponentProps, CSSProperties, ReactNode } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, waitFor, within } from "storybook/test";

import { ShareAccessRights } from "../../enums";
import { ComboBoxSize } from "../combobox";
import { Toast, toastr } from "../toast";

import { AccessRightSelect } from "./AccessRightSelect";

import CatalogFolderReactSvgUrl from "../../assets/icons/16/catalog.folder.react.svg?url";

import { data as options } from "./data";

// The icon is attached here: data.ts ships in the package, and Rollup cannot load `?url`.
const data = options.map((option) =>
  option.isSeparator ? option : { ...option, icon: CatalogFolderReactSvgUrl },
);

const Wrapper = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      height: "420px",
    }}
  >
    {children}
  </div>
);

const Row = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      alignItems: "flex-start",
      gap: "24px",
    }}
  >
    {children}
  </div>
);

const meta = {
  title: "UI/Form controls/AccessRightSelect",
  component: AccessRightSelect,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    accessOptions: {
      // The icon is a data URI too long to edit, and it stretches the table.
      control: false,
      description:
        "The access levels to choose from. Each is rendered as a row with its icon, label, description and quota badge; an entry with `isSeparator` becomes a divider. Ignored when `advancedOptions` is given.",
    },
    selectedOption: {
      // The icon is a data URI too long to edit, and it stretches the table.
      control: false,
      description:
        "The option to show in the button. The component does not choose it: keep it in your own state and set it from `onSelect`.",
    },
    scaledOptions: {
      control: "boolean",
      description:
        "Matches the list's width to the button's instead of `manualWidth`.",
      table: { defaultValue: { summary: "false" } },
    },
    scaled: {
      control: "boolean",
      description:
        "Makes the button take the full width of its parent, which overrides `size`.",
      table: { defaultValue: { summary: "true" } },
    },
    directionX: {
      control: { type: "select" },
      options: ["right", "left"],
      description: "Which side of the button the drop-down opens towards.",
      table: { defaultValue: { summary: "right" } },
    },
    size: {
      control: { type: "select" },
      options: Object.values(ComboBoxSize),
      description:
        "One of the fixed widths — 173, 300, 350 or 500px, or the content's own. It only applies when `scaled` is false.",
      table: { defaultValue: { summary: "base" } },
    },
    manualWidth: {
      control: "text",
      description:
        "Width of the list as a CSS length. It has nothing to do with the button's width — use `scaledOptions` for that.",
      table: { defaultValue: { summary: "200px" } },
    },
    isDisabled: {
      control: "boolean",
      description: "Greys the button out and stops it opening.",
      table: { defaultValue: { summary: "false" } },
    },
    isLoading: {
      control: "boolean",
      description:
        "Replaces the arrow with a spinner and stops the button opening.",
      table: { defaultValue: { summary: "false" } },
    },
    withoutBackground: {
      control: "boolean",
      description: "Makes that backdrop transparent.",
      table: { defaultValue: { summary: "false" } },
    },
    directionY: {
      control: { type: "select" },
      options: ["top", "bottom", "both"],
      description: "Whether the drop-down opens above or below the button.",
      table: { defaultValue: { summary: "bottom" } },
    },
    isAside: {
      control: "boolean",
      description: "Marks the list's backdrop as belonging to a side panel.",
      table: { defaultValue: { summary: "false" } },
    },
    isMobileView: {
      control: "boolean",
      description:
        "Pins the list to the bottom of the screen, full width, in portrait.",
      table: { defaultValue: { summary: "false" } },
    },
    manualY: {
      control: "text",
      description:
        "(Non-portal mode) Exact vertical offset of the list from the button.",
    },
    fixedDirection: {
      control: "boolean",
      description:
        "Keeps `directionX` and `directionY` as given instead of flipping them.",
      table: { defaultValue: { summary: "false" } },
    },
    withBackground: {
      control: "boolean",
      description: "Gives that backdrop its dimming background.",
      table: { defaultValue: { summary: "false" } },
    },
    shouldShowBackdrop: {
      control: "boolean",
      description:
        "Renders the backdrop even when another one is already on screen.",
      table: { defaultValue: { summary: "false" } },
    },
    withBackdrop: {
      control: "boolean",
      description:
        "Whether the list renders a backdrop to catch the next click.",
      table: { defaultValue: { summary: "true" } },
    },
    noBorder: {
      control: "boolean",
      description: "Removes the button's border.",
      table: { defaultValue: { summary: "false" } },
    },
    noSelect: {
      control: "boolean",
      description: "Whether the button's text cannot be selected.",
      table: { defaultValue: { summary: "true" } },
    },
    isSelectionDisabled: {
      control: "boolean",
      description:
        "Whether picking a level other than the current one is refused. What is still allowed is `availableAccess`; everything else raises a toast.",
      table: { defaultValue: { summary: "false" } },
    },
    availableAccess: {
      control: "object",
      description:
        "The `access` values that may still be chosen while `isSelectionDisabled` is set. Without it only the current level is allowed.",
    },
    selectionErrorText: {
      control: "text",
      description: "The toast shown when a refused level is picked.",
    },
    displaySelectedOption: {
      control: "boolean",
      description:
        "Keeps the option that is currently selected usable and highlights it. Without it that option is rendered disabled, so the value cannot be picked again.",
      table: { defaultValue: { summary: "false" } },
    },
    title: {
      control: "text",
      description:
        "Hover tooltip for the whole control. It needs `RootTooltip` mounted.",
    },
    topSpace: {
      control: "number",
      description:
        "Passed straight to `ComboBox`: space above the drop-down, in pixels.",
    },
    modernView: {
      control: "boolean",
      description: "Passed straight to `ComboBox`: its compact presentation.",
      table: { defaultValue: { summary: "false" } },
    },
    fillIcon: {
      control: "boolean",
      description:
        "Passed straight to `ComboBox`: whether the arrow icon is recoloured.",
      table: { defaultValue: { summary: "false" } },
    },
    isDefaultMode: {
      control: "boolean",
      description:
        "Passed straight to `ComboBox`: renders the open list in a portal at the end of the page. `false` renders it in place, where a wrapper's CSS variables reach it.",
      table: { defaultValue: { summary: "true" } },
    },
    comboIcon: {
      control: "text",
      description:
        "Passed straight to `ComboBox`: URL of an icon to show instead of the arrow.",
    },
    usePortalBackdrop: {
      control: "boolean",
      description:
        "Passed straight to `ComboBox`: whether the backdrop is rendered in a portal.",
      table: { defaultValue: { summary: "false" } },
    },
    type: {
      control: { type: "select" },
      options: [undefined, "badge", "onlyIcon", "descriptive"],
      description:
        "Shape of the button: `badge` draws the label as a coloured badge, `onlyIcon` drops the label, `descriptive` adds the option's `description` under it.",
    },
    dataTestId: {
      control: "text",
      description: "`data-testid` of the combo button.",
    },
    onSelect: {
      description:
        "Called with the option that was clicked. Nothing changes on its own — `selectedOption` is yours to update.",
    },
    setIsOpenItemAccess: {
      control: false,
      description:
        "Passed straight to `ComboBox`: told when the drop-down opens and closes.",
    },
    className: {
      control: "text",
      description: "Applied to the element that wraps the button and the list.",
    },
    advancedOptions: {
      control: false,
      description:
        "Element whose children replace the list entirely, for a menu that is not a list of options. `options` is then used only for the button.",
    },
  },
  args: {
    usePortalBackdrop: true,
    fillIcon: true,
    onSelect: fn(),
  },
} satisfies Meta<typeof AccessRightSelect>;

type Story = StoryObj<ComponentProps<typeof AccessRightSelect>>;

export default meta;

// A row of the list, which may be portalled out of the story root.
const accessOption = (key: string) =>
  screen.getByTestId(`access_right_option_${key}`);

const listShown = () =>
  waitFor(() => expect(accessOption("key1")).toBeVisible());

const listHidden = () =>
  waitFor(() => {
    const row = screen.queryByTestId("access_right_option_key1");
    expect(!row || !row.checkVisibility()).toBe(true);
  });

export const Default: Story = {
  args: {
    accessOptions: data,
    selectedOption: data[0],
    scaledOptions: false,
    scaled: false,
    directionX: "right",
    size: ComboBoxSize.content,
    manualWidth: "fit-content",
  },
  render: (args) => (
    <Wrapper>
      <AccessRightSelect {...args} />
    </Wrapper>
  ),
  play: async ({ args, canvas, userEvent }) => {
    const combobox = canvas.getByTestId("combobox");
    await expect(combobox).toHaveTextContent("Full access");

    await userEvent.click(canvas.getByRole("button", { expanded: false }));
    await listShown();
    // Each level with its description; the paid one with its badge.
    await expect(accessOption("key1")).toHaveTextContent("paid");
    await expect(accessOption("key2")).toHaveTextContent(
      "Can edit and share files",
    );
    await expect(accessOption("key1")).toHaveAttribute("aria-selected", "true");

    await userEvent.click(accessOption("key5"));
    await expect(args.onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ key: "key5", label: "Viewer" }),
    );
    await listHidden();
    await expect(combobox).toHaveTextContent("Viewer");

    // The rows are DropDownItems, so the keyboard walks them as ComboBox's own
    // options: an arrow opens the list on the chosen row.
    const button = canvas.getByRole("button", { expanded: false });
    button.focus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(button).toHaveAttribute("aria-expanded", "true");
    await expect(
      document.getElementById(
        button.getAttribute("aria-activedescendant") ?? "",
      ),
    ).toHaveTextContent("Viewer");
    await userEvent.keyboard("{Escape}");
    await expect(button).toHaveAttribute("aria-expanded", "false");
  },
  parameters: {
    docs: {
      description: {
        story:
          "The drop-down as it is placed next to a person or a link. Each level in its list has an icon, a description and, where it is paid, a badge.",
      },
      source: {
        code: `<AccessRightSelect
  accessOptions={options}
  selectedOption={options[0]}
  scaledOptions={false}
  scaled={false}
  directionX="right"
  size="content"
  manualWidth="fit-content"
  onSelect={(option) => setAccess(option)}
/>`,
      },
    },
  },
};

const DisplayTypesTemplate = () => (
  <Wrapper>
    <Row>
      <AccessRightSelect
        accessOptions={data}
        selectedOption={data[1]}
        scaled={false}
        size={ComboBoxSize.content}
        manualWidth="fit-content"
        fillIcon
      />
      <AccessRightSelect
        accessOptions={data}
        selectedOption={data[1]}
        type="descriptive"
        scaled={false}
        size={ComboBoxSize.content}
        manualWidth="fit-content"
        fillIcon
      />
      <AccessRightSelect
        accessOptions={data}
        selectedOption={data[1]}
        type="onlyIcon"
        scaled={false}
        size={ComboBoxSize.content}
        manualWidth="fit-content"
        fillIcon
      />
    </Row>
  </Wrapper>
);

export const DisplayTypes: Story = {
  name: "Display types",
  render: () => <DisplayTypesTemplate />,
  play: async ({ canvas }) => {
    const [plain, descriptive, onlyIcon] = canvas.getAllByTestId("combobox");
    await expect(plain).toHaveTextContent("Editor");
    await expect(plain).not.toHaveTextContent("Can edit and share files");
    await expect(descriptive).toHaveTextContent("Can edit and share files");
    // The icon alone: no label at all.
    await expect(onlyIcon).not.toHaveTextContent("Editor");
    await expect(onlyIcon.querySelector("svg")).not.toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story: `How much of the chosen level the button shows:

- **Editor** — the label alone (no \`type\`)
- **Editor, Can edit and share files** — the label with the description underneath (\`type="descriptive"\`)
- **The folder icon** — the icon alone; the list still shows every label (\`type="onlyIcon"\`)`,
      },
      source: {
        code: `<AccessRightSelect accessOptions={options} selectedOption={access} />
<AccessRightSelect accessOptions={options} selectedOption={access} type="descriptive" />
<AccessRightSelect accessOptions={options} selectedOption={access} type="onlyIcon" />`,
      },
    },
  },
};

const RestrictedChoicesTemplate = () => (
  <Wrapper>
    <AccessRightSelect
      accessOptions={data}
      selectedOption={data[4]}
      isSelectionDisabled
      availableAccess={[ShareAccessRights.Comment, ShareAccessRights.ReadOnly]}
      selectionErrorText="This access level is not available"
      scaled={false}
      size={ComboBoxSize.content}
      manualWidth="fit-content"
      fillIcon
    />
    <Toast />
  </Wrapper>
);

export const RestrictedChoices: Story = {
  name: "Refused levels",
  render: () => <RestrictedChoicesTemplate />,
  beforeEach: () => {
    toastr.clear();
  },
  play: async ({ canvas, userEvent }) => {
    const combobox = canvas.getByTestId("combobox");
    await userEvent.click(canvas.getByRole("button", { expanded: false }));
    await listShown();
    // A level outside availableAccess is refused with a toast.
    await userEvent.click(accessOption("key1"));
    await expect(
      await screen.findByText("This access level is not available"),
    ).toBeVisible();
    await expect(combobox).toHaveTextContent("Viewer");

    // One inside it is picked as usual.
    await userEvent.click(canvas.getByRole("button", { expanded: false }));
    await listShown();
    await userEvent.click(accessOption("key4"));
    await waitFor(() => expect(combobox).toHaveTextContent("Commenter"));
  },
  parameters: {
    docs: {
      description: {
        story:
          "Levels the viewer may see but not grant (`isSelectionDisabled`, `availableAccess`). Picking **Full access** shows a toast and keeps **Viewer**; **Commenter** and **Viewer** can still be picked. The toast needs `Toast` mounted once.",
      },
      source: {
        code: `<AccessRightSelect
  accessOptions={options}
  selectedOption={access}
  isSelectionDisabled
  availableAccess={[ShareAccessRights.Comment, ShareAccessRights.ReadOnly]}
  selectionErrorText="This access level is not available"
  onSelect={(option) => setAccess(option)}
/>
<Toast />`,
      },
    },
  },
};

export const DisabledState: Story = {
  name: "Disabled",
  args: {
    ...Default.args,
    isDisabled: true,
  },
  play: async ({ canvas, userEvent }) => {
    const button = within(canvas.getByTestId("combobox")).getByRole("button");
    await expect(button).toHaveAttribute("aria-disabled", "true");
    await userEvent.click(button);
    await new Promise((resolve) => setTimeout(resolve, 200));
    await listHidden();
  },
  render: (args) => (
    <Wrapper>
      <AccessRightSelect {...args} />
    </Wrapper>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "A disabled drop-down (`isDisabled`), for a level that cannot change right now. The button is greyed out, and a click does not open the list.",
      },
      source: {
        code: `<AccessRightSelect
  accessOptions={options}
  selectedOption={access}
  isDisabled
/>`,
      },
    },
  },
};

export const LoadingState: Story = {
  name: "Loading",
  args: {
    ...Default.args,
    isLoading: true,
  },
  play: async ({ canvas, userEvent }) => {
    // A spinner instead of the label; the list does not open.
    const combobox = canvas.getByTestId("combobox");
    await expect(within(combobox).getByTestId("loader")).toBeVisible();
    await expect(within(combobox).getByText("Full access")).not.toBeVisible();
    await userEvent.click(within(combobox).getByRole("button"));
    await new Promise((resolve) => setTimeout(resolve, 200));
    await listHidden();
  },
  render: (args) => (
    <Wrapper>
      <AccessRightSelect {...args} />
    </Wrapper>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "A drop-down while a new level is saved (`isLoading`). A spinner takes the place of the label and icon, and the list does not open.",
      },
      source: {
        code: `<AccessRightSelect
  accessOptions={options}
  selectedOption={access}
  isLoading={isSaving}
/>`,
      },
    },
  },
};

const CssCustomizationTemplate = () => {
  return (
    <div
      style={
        {
          // === AccessRightSelect — item icon and text ===
          "--access-right-select-text": "#0082c9",
          "--access-right-select-disabled-icon": "#a8cfe6",
          "--access-right-select-icon": "#0082c9",
          "--access-right-select-description": "#5aa9d0",
          "--access-right-select-description-size": "12px",
          "--access-right-select-gap": "12px",
          "--access-right-select-item-padding": "10px 0",
          // === Combobox (trigger button) ===
          "--combobox-radius": "8px",
          // === DropDown (options panel) ===
          "--dropdown-bg": "light-dark(#e6f3fb, #16303e)",
          "--dropdown-border-style": "1px solid #0082c9",
          "--dropdown-shadow": "0 4px 16px rgba(0, 130, 201, 0.25)",
          "--dropdown-radius": "12px",
        } as CSSProperties
      }
    >
      <div style={{ height: "420px" }}>
        <Row>
          <AccessRightSelect
            accessOptions={data}
            selectedOption={data[0]}
            scaledOptions={false}
            scaled={false}
            directionX="right"
            size={ComboBoxSize.content}
            manualWidth="320px"
            isDefaultMode={false}
            fillIcon
          />
          <AccessRightSelect
            accessOptions={data}
            selectedOption={data[0]}
            type="onlyIcon"
            scaled={false}
            size={ComboBoxSize.content}
            manualWidth="320px"
            isDefaultMode={false}
          />
          <AccessRightSelect
            accessOptions={data}
            selectedOption={data[0]}
            type="onlyIcon"
            isDisabled
            scaled={false}
            size={ComboBoxSize.content}
            manualWidth="320px"
            isDefaultMode={false}
          />
        </Row>
      </div>
    </div>
  );
};

export const CssCustomization: Story = {
  name: "CSS variables",
  render: () => <CssCustomizationTemplate />,
  play: async ({ canvas, userEvent }) => {
    // Each instance renders its list in place.
    const [first] = canvas.getAllByTestId("combobox");
    await userEvent.click(
      within(first).getByRole("button", { expanded: false }),
    );
    const editor = within(first).getByTestId("access_right_option_key2");
    await waitFor(() => expect(editor).toBeVisible());
    const description = within(editor).getByText("Can edit and share files");
    await expect(getComputedStyle(description).color).toBe("rgb(90, 169, 208)");
    await expect(getComputedStyle(description).fontSize).toBe("12px");
    const panel = editor.closest('[data-testid="dropdown"]') as HTMLElement;
    await expect(getComputedStyle(panel).backgroundColor).toBe(
      "rgb(230, 243, 251)",
    );
    await expect(getComputedStyle(panel).borderTopLeftRadius).toBe("12px");
  },
  parameters: {
    docs: {
      description: {
        story: `Three drop-downs under a wrapper that sets every overridable variable. Each renders its list in place (\`isDefaultMode={false}\`), where the wrapper's variables reach it.

- **Full access** — the button radius, and everything in the list
- **The first icon** — \`type="onlyIcon"\`, for \`--access-right-select-text\`
- **The second icon** — \`type="onlyIcon"\` and \`isDisabled\`, for \`--access-right-select-disabled-icon\``,
      },
      source: {
        code: `<div
  style={{
    "--access-right-select-text": "#0082c9",
    "--access-right-select-disabled-icon": "#a8cfe6",
    "--access-right-select-icon": "#0082c9",
    "--access-right-select-description": "#5aa9d0",
    "--access-right-select-description-size": "12px",
    "--access-right-select-gap": "12px",
    "--access-right-select-item-padding": "10px 0",
    "--combobox-radius": "8px",
    "--dropdown-bg": "light-dark(#e6f3fb, #16303e)",
    "--dropdown-border-style": "1px solid #0082c9",
    "--dropdown-shadow": "0 4px 16px rgba(0, 130, 201, 0.25)",
    "--dropdown-radius": "12px",
  }}
>
  <AccessRightSelect accessOptions={options} selectedOption={access} isDefaultMode={false} />
  <AccessRightSelect accessOptions={options} selectedOption={access} type="onlyIcon" isDefaultMode={false} />
  <AccessRightSelect accessOptions={options} selectedOption={access} type="onlyIcon" isDisabled isDefaultMode={false} />
</div>`,
      },
    },
  },
};
